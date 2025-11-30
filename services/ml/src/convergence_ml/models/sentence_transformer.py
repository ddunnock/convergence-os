"""
Sentence transformer model wrapper for embedding generation.
"""

from functools import lru_cache
from pathlib import Path

import numpy as np
import structlog
from sentence_transformers import SentenceTransformer

from convergence_ml.core.config import get_settings

logger = structlog.get_logger()


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """Get or create the sentence transformer model (singleton)."""
    settings = get_settings()

    cache_dir = Path(settings.model_cache_dir)
    cache_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Loading sentence transformer", model=settings.embedding_model)

    model = SentenceTransformer(
        settings.embedding_model,
        cache_folder=str(cache_dir),
    )

    return model


def download_models() -> None:
    """Pre-download required models."""
    settings = get_settings()
    logger.info("Downloading models...")

    # This triggers download if not cached
    get_embedding_model()

    logger.info("Models downloaded", model=settings.embedding_model)


def list_models() -> None:
    """List available/downloaded models."""
    settings = get_settings()
    cache_dir = Path(settings.model_cache_dir)

    print(f"Configured model: {settings.embedding_model}")
    print(f"Cache directory: {cache_dir}")

    if cache_dir.exists():
        print("\nCached models:")
        for item in cache_dir.iterdir():
            if item.is_dir():
                print(f"  - {item.name}")


class EmbeddingGenerator:
    """
    Generate embeddings with context-aware weighting.
    """

    def __init__(self, model: SentenceTransformer | None = None):
        self.model = model or get_embedding_model()
        self.settings = get_settings()

    def embed(self, texts: str | list[str]) -> np.ndarray:
        """Generate embeddings for text(s)."""
        if isinstance(texts, str):
            texts = [texts]

        embeddings = self.model.encode(
            texts,
            batch_size=self.settings.embedding_batch_size,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

        return embeddings

    def embed_with_context(
        self,
        focal_text: str,
        context: str,
        focal_weight: float = 0.7,
    ) -> list[float]:
        """
        Generate embedding with weighted context.

        The focal text (e.g., highlighted text) is weighted more heavily
        than the surrounding context.
        """
        # Generate separate embeddings
        focal_embedding = self.embed(focal_text)[0]
        context_embedding = self.embed(context)[0]

        # Weighted combination
        combined = (focal_weight * focal_embedding) + ((1 - focal_weight) * context_embedding)

        # Re-normalize
        combined = combined / np.linalg.norm(combined)

        return list(combined.tolist())

    def embed_chunked(
        self,
        text: str,
        chunk_size: int = 256,
        overlap: int = 50,
    ) -> list[np.ndarray]:
        """
        Generate embeddings for overlapping chunks of long text.

        Useful for documents longer than the model's context window.
        """
        words = text.split()
        chunks = []

        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i : i + chunk_size])
            if chunk:
                chunks.append(chunk)

        if not chunks:
            chunks = [text]

        return list(self.embed(chunks))

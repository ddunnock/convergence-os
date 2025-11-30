ML Service API Reference
========================

The ML Service provides machine learning capabilities for ConvergenceOS,
including text embeddings, spam detection, content categorization, and
highlight-based content discovery.

.. contents:: Table of Contents
   :local:
   :depth: 2

Core Modules
------------

Configuration
~~~~~~~~~~~~~

.. automodule:: convergence_ml.core.config
   :members:
   :undoc-members:
   :show-inheritance:

Logging
~~~~~~~

.. automodule:: convergence_ml.core.logging
   :members:
   :undoc-members:
   :show-inheritance:

Models
------

Sentence Transformer
~~~~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.models.sentence_transformer
   :members:
   :undoc-members:
   :show-inheritance:

SpaCy Pipeline
~~~~~~~~~~~~~~

.. automodule:: convergence_ml.models.spacy_pipeline
   :members:
   :undoc-members:
   :show-inheritance:

Classifiers
~~~~~~~~~~~

Base Classifier
^^^^^^^^^^^^^^^

.. automodule:: convergence_ml.models.classifiers.base
   :members:
   :undoc-members:
   :show-inheritance:

Spam Classifier
^^^^^^^^^^^^^^^

.. automodule:: convergence_ml.models.classifiers.spam
   :members:
   :undoc-members:
   :show-inheritance:

Content Type Classifier
^^^^^^^^^^^^^^^^^^^^^^^

.. automodule:: convergence_ml.models.classifiers.content_type
   :members:
   :undoc-members:
   :show-inheritance:

Services
--------

Embedding Service
~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.services.embedding_service
   :members:
   :undoc-members:
   :show-inheritance:

Classification Service
~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.services.classification_service
   :members:
   :undoc-members:
   :show-inheritance:

Similarity Service
~~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.services.similarity_service
   :members:
   :undoc-members:
   :show-inheritance:

Highlight Service
~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.services.highlight_service
   :members:
   :undoc-members:
   :show-inheritance:

Database
--------

Vector Store
~~~~~~~~~~~~

.. automodule:: convergence_ml.db.vector_store
   :members:
   :undoc-members:
   :show-inheritance:

Models
~~~~~~

.. automodule:: convergence_ml.db.models
   :members:
   :undoc-members:
   :show-inheritance:

Utilities
---------

Text Preprocessing
~~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.utils.text_preprocessing
   :members:
   :undoc-members:
   :show-inheritance:

Email Parser
~~~~~~~~~~~~

.. automodule:: convergence_ml.utils.email_parser
   :members:
   :undoc-members:
   :show-inheritance:

API Schemas
-----------

Common Schemas
~~~~~~~~~~~~~~

.. automodule:: convergence_ml.schemas.common
   :members:
   :undoc-members:
   :show-inheritance:

Embedding Schemas
~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.schemas.embeddings
   :members:
   :undoc-members:
   :show-inheritance:

Classification Schemas
~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.schemas.classification
   :members:
   :undoc-members:
   :show-inheritance:

Highlight Schemas
~~~~~~~~~~~~~~~~~

.. automodule:: convergence_ml.schemas.highlights
   :members:
   :undoc-members:
   :show-inheritance:

REST API Endpoints
------------------

Health Endpoints
~~~~~~~~~~~~~~~~

.. http:get:: /api/ml/health

   Get the health status of the ML service.

   **Response:**

   .. code-block:: json

      {
        "status": "healthy",
        "version": "0.1.0",
        "embedding_model": "all-MiniLM-L6-v2",
        "spacy_model": "en_core_web_sm",
        "vector_store_type": "memory",
        "models_loaded": {
          "spam_classifier": false,
          "content_classifier": false
        },
        "uptime_seconds": 123.45
      }

Embedding Endpoints
~~~~~~~~~~~~~~~~~~~

.. http:post:: /api/ml/embeddings

   Generate an embedding for a single document.

   **Request:**

   .. code-block:: json

      {
        "document_id": "note-123",
        "content": "Hello, world!",
        "metadata": {"title": "Test Note"}
      }

   **Response:**

   .. code-block:: json

      {
        "success": true,
        "document_id": "note-123",
        "dimension": 384,
        "content_hash": "abc123..."
      }

.. http:post:: /api/ml/search/semantic

   Perform semantic search for similar documents.

   **Request:**

   .. code-block:: json

      {
        "query": "machine learning",
        "top_k": 10,
        "threshold": 0.5
      }

Classification Endpoints
~~~~~~~~~~~~~~~~~~~~~~~~

.. http:post:: /api/ml/classify/spam

   Check if content is spam.

   **Request:**

   .. code-block:: json

      {
        "text": "Buy now! Limited offer!",
        "include_indicators": true
      }

   **Response:**

   .. code-block:: json

      {
        "success": true,
        "is_spam": true,
        "spam_score": 0.95,
        "confidence": 0.95,
        "indicators": ["buy now", "limited offer"]
      }

Highlight Endpoints
~~~~~~~~~~~~~~~~~~~

.. http:post:: /api/ml/highlights/similar

   Find content related to highlighted text.

   **Request:**

   .. code-block:: json

      {
        "highlighted_text": "machine learning",
        "context": "This paper discusses machine learning for NLP.",
        "top_k": 5
      }

   **Response:**

   .. code-block:: json

      {
        "success": true,
        "highlighted_text": "machine learning",
        "related_documents": [
          {
            "document_id": "note-456",
            "score": 0.87,
            "title": "ML Notes"
          }
        ],
        "total_searched": 1000
      }


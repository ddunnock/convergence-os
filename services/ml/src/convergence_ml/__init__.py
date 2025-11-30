"""
ConvergenceOS Machine Learning Services

Machine learning capabilities for the unified knowledge workspace.
"""

__version__ = "0.1.0"
__all__ = [
    "create_app",
    "Settings",
]

from convergence_ml.api.app import create_app
from convergence_ml.core.config import Settings

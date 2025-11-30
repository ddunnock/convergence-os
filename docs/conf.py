# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
import sys

# -- Path setup --------------------------------------------------------------
# Add the ML service source to the path for autodoc
sys.path.insert(0, os.path.abspath("../services/ml/src"))

# -- Project information -----------------------------------------------------

project = "ConvergenceOS"
copyright = "2024, ConvergenceOS Team"
author = "ConvergenceOS Team"
version = "0.1.0"
release = "0.1.0"

# -- General configuration ---------------------------------------------------

extensions = [
    # TypeScript/JavaScript documentation
    "sphinx_js",
    # Python documentation
    "sphinx.ext.autodoc",
    "sphinx.ext.autodoc.typehints",
    "sphinx.ext.viewcode",
    "sphinx.ext.intersphinx",
    "sphinx.ext.napoleon",  # Google/NumPy style docstrings
    "sphinx_autodoc_typehints",  # Better type hint rendering
    # UI components
    "sphinx_design",
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

# -- sphinx-js configuration -------------------------------------------------

js_language = "typescript"
js_source_path = "../"
jsdoc_config_path = "../typedoc.json"
primary_domain = "js"

# -- Python autodoc configuration --------------------------------------------

# Autodoc settings
autodoc_default_options = {
    "members": True,
    "member-order": "bysource",
    "special-members": "__init__",
    "undoc-members": True,
    "exclude-members": "__weakref__",
    "show-inheritance": True,
}

# Type hints settings
autodoc_typehints = "description"
autodoc_typehints_description_target = "documented"

# Napoleon settings for Google-style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = False
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = True
napoleon_use_admonition_for_notes = True
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_use_keyword = True
napoleon_preprocess_types = True
napoleon_attr_annotations = True

# sphinx-autodoc-typehints settings
typehints_defaults = "braces"
simplify_optional_unions = True

# -- Options for HTML output -------------------------------------------------

html_theme = "furo"  # Modern, clean theme with good navigation
html_static_path = ["_static"]
html_title = "ConvergenceOS Documentation"

# Theme options for furo
html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
    "light_css_variables": {
        "color-brand-primary": "#4f46e5",
        "color-brand-content": "#4f46e5",
    },
    "dark_css_variables": {
        "color-brand-primary": "#818cf8",
        "color-brand-content": "#818cf8",
    },
}

# -- Intersphinx configuration -----------------------------------------------

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
    "sklearn": ("https://scikit-learn.org/stable/", None),
    "fastapi": ("https://fastapi.tiangolo.com/", None),
}

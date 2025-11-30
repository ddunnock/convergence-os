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
    # NOTE: sphinx_js disabled due to parsing issues with JSDoc @description tags
    # Use TypeDoc directly for TS docs: `npx typedoc`
    # "sphinx_js",
    # Python documentation
    "sphinx.ext.autodoc",
    "sphinx.ext.autodoc.typehints",
    "sphinx.ext.viewcode",
    "sphinx.ext.intersphinx",
    "sphinx.ext.napoleon",  # Google/NumPy style docstrings
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

# -- Options for HTML output -------------------------------------------------

html_theme = "furo"  # Modern, clean theme with good navigation
html_static_path = ["_static"]
html_title = "ConvergenceOS Documentation"

# Theme options for furo
html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
    "light_css_variables": {
        "color-brand-primary": "hsl(262, 83%, 58%)",  # Convergence purple
        "color-brand-content": "hsl(262, 83%, 58%)",
    },
    "dark_css_variables": {
        "color-brand-primary": "hsl(262, 83%, 65%)",  # Brighter purple for dark
        "color-brand-content": "hsl(262, 83%, 65%)",
    },
}

# Custom CSS files
html_css_files = [
    "custom.css",
]

# -- Intersphinx configuration -----------------------------------------------

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
    "sklearn": ("https://scikit-learn.org/stable/", None),
    "fastapi": ("https://fastapi.tiangolo.com/", None),
}

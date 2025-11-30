# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------

project = 'ConvergenceOS'
copyright = '2024, ConvergenceOS Team'
author = 'ConvergenceOS Team'

# -- General configuration ---------------------------------------------------

extensions = [
    'sphinx_js',
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.intersphinx',
    'sphinx_design',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- sphinx-js configuration -------------------------------------------------

js_language = 'typescript'
js_source_path = '../'
jsdoc_config_path = '../typedoc.json'
primary_domain = 'js'

# -- Options for HTML output -------------------------------------------------

html_theme = 'furo'  # Modern, clean theme with good navigation
html_static_path = ['_static']
html_title = 'ConvergenceOS Documentation'

# Theme options for furo
html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
}

# -- Intersphinx configuration -----------------------------------------------

intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
}
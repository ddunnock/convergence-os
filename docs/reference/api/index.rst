API Reference
=============

This section contains auto-generated documentation from the source code.

.. note::

   Documentation is generated from JSDoc comments in the TypeScript source files
   and docstrings in the Python source files.
   Keep your code comments up to date to maintain accurate documentation.

Contents
--------

.. toctree::
   :maxdepth: 2

   ml-service

TypeScript Packages
-------------------

.. Add your packages here as they are created, e.g.:
.. .. toctree::
..    :maxdepth: 2
..
..    packages/utils
..    packages/core
..    packages/ui

*TypeScript API documentation will be generated from source code.*

Python Services
---------------

The ML Service provides machine learning capabilities:

- **Embeddings** - Text embedding generation with sentence transformers
- **Classification** - Spam detection and content categorization
- **Similarity** - Document similarity and recommendations
- **Highlights** - Context-aware content discovery

See :doc:`ml-service` for full documentation.

----

Example Usage
-------------

TypeScript/JavaScript Documentation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To document a module, add an RST file and use the ``automodule`` directive:

.. code-block:: rst

   .. js:automodule:: @convergence/utils
      :members:

To document a specific function:

.. code-block:: rst

   .. js:autofunction:: calculateTotal

To document a class with all its members:

.. code-block:: rst

   .. js:autoclass:: UserService
      :members:

Python Documentation
~~~~~~~~~~~~~~~~~~~~

To document a Python module:

.. code-block:: rst

   .. automodule:: convergence_ml.services.embedding_service
      :members:
      :undoc-members:
      :show-inheritance:

To document a specific class:

.. code-block:: rst

   .. autoclass:: convergence_ml.models.EmbeddingGenerator
      :members:

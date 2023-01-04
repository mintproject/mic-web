# Using a Jupyter Notebook to create a model component

## What is a model component?

A specific invocation function for model software that ensures the inclusion of certain model processes and variables while excluding others. For example, the MODFLOW groundwater model may be configured in many different ways: activating the infiltration package, having snowmelt and wells, exposing a parameter to indicate the recharge rate of an area, etc.

## How to perform this step?

For software written in Python, the MIC process can be simplified by using a Jupyter Notebook prepared to run using Binder.

## Requirements

- [IPython](https://ipython.org/) Jupyter Notebooks:
    - Code your software in the Notebook
    - Use the notebook as a wrapper to call your software (Your model must be Linux compatible). Example of such a notebook can be found in [this GitHub repository](https://github.com/khider/datatransformation_regrid). 

!!! warning
    The entire notebook should be executable without user input.

- Git repository: The notebook should be available in a public GitHub repository.

## Next steps

[In the next step](prepare_binder), you will learn how to create a Binder-ready repository. This is a excellent way to test your notebook and make sure it is ready to be used by the MIC.

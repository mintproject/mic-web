We use IPython2CWL for a tool to convert [IPython](https://ipython.org/) Jupyter Notebooks to
[CWL (Common Workflow Language)](https://www.commonwl.org/) Command Line Tools by simply providing typing annotation.

## Supported Types

The basic date types are:

- Inputs:
    - CWLFilePathInput
    - CWLBooleanInput
    - CWLStringInput
    - CWLIntInput
    - CWLFloatInput

- Outputs:
    - CWLFilePathOutput
    - CWLDumpableFile
    - CWLDumpableBinaryFile

In our example, we have 3 parameters `a`, `b` and `c`, an input file (which represents `x`) and a output file (which represents `y`)

```python
a = 5
b = 4
c = 6
input_file = "./x.csv"
output_file = "./y.csv"
```

## How to perform this step?

Annotate the parameters, input and outputs using CWL typing annotation.

```python
a : 'CWLIntInput' = 5
b : 'CWLIntInput' = 4
c : 'CWLIntInput' = 6
input_file : 'CWLFilePathInput' = "./x.csv"
output_file : 'CWLFilePathOutput' = "./y.csv"
```

You can check the final notebook at

```
https://github.com/mosoriob/simpleModel-1/blob/master/simpleModelAnnotated.ipynb
```

!!! note
    You will still be able to execute your notebook outside of MINT with the annotation.

## Check your work

Run your notebook through [https://mybinder.org](https://mybinder.org) and make sure it executes without error or human input at any step.

## Next steps

[In the next step](../convert_repository), you will learn how to use MIC-web.
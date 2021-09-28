# Mat

Mat is an application to assist scientists in encapsulating their softwares (e.g., models, pre-processing and post-processing codes, visualizations).

This is the frontend.

## How to run?

### Pre-requirements

You must deploy the backend services.

- [IPython2MINT](https://github.com/mosoriob/ipython2cwl-api): Convert your Binder Repository into MINT component.
- Mat-backend: Provides a web terminal to capture the installation and execution of your model.

### Docker

```bash
$ docker-compose up -d
```

Go to [localhost:3000](localhost:3000)
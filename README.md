# MIC Web

You can see a demo of the project at [micweb.netlify.app](micweb.netlify.app/)

This project is not production-ready.

## Features

### General 
- [x] Align the styles to the MINT web.
- [x] Save the model, model versions, model configurations into the MINT Model Catalog.

### IPython transformation
- [x] Transform a IPython notebook according the [ipython2cwl](https://github.com/common-workflow-lab/ipython2cwl).
- [x] The user can be describe parameters and inputs.
- [x] The system must to push the image onto the DockerHub.
- [ ] The user can select the output using glob expression. Following the [CWL spec](https://www.commonwl.org/user_guide/10-array-outputs/index.html)

### Terminal

- [x] The user can schedule a Docker Container using a base Docker Images.
- [x] The system must to expose the terminal.
- [x] The system must to store history of commands written by the user.
- [ ] The user can select which commands are directives (these run the model).
- [ ] The user can select a file or multiple files as Inputs.
- [ ] The user can select a file a config file.
- [ ] The user can select the output using glob expression. Following the [CWL spec](https://www.commonwl.org/user_guide/10-array-outputs/index.html)
- [ ] The system must to push the image onto the DockerHub.

## How to run?

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

WARNING: Tests are not currently supported

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

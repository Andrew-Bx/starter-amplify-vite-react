# Simple TODO app

This repository is an app for managing **TODO** lists. It has been created using [AWS Amplify](https://docs.amplify.aws/).

It can be viewed online at https://main.d2x7gtpu2bf7ie.amplifyapp.com/

## Overview

- **Data storage**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **API**: GrpahQL with AWS AppSync
- **Frontend**: React + Vite

## Running locally

Install the project dependencies using your preferred package manager, eg `npm install`.

### Backend

The backend resources will be hosted in AWS. You need to credentials for an AWS identity (eg account/role) with the permissions from the `AmplifyBackendDeployFullAccess` managed policy.

- Ensure you have configured you AWS credentials as per the [documentation](https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-configure.html).
- Run the command `npx ampx sandbox`.  
  This will use your local AWS credentials to create an Amplify sandbox in your account, and populate it with the resources specified in the `./amplify` directory. Details of the created resources will be saved in `./amplify_outputs.json`.

### Frontend

Run `npm run dev`. This will start a vite development server, and will print the localhost address at which you can view the app.

## Deploying

To deploy the application using AWS Amplify, you need credentials for an AWS identity with the `AdministratorAccess-Amplify` managed policy attached. You can then create a new Amplify app from the repository, and setup automatic deployment when you push to the repository (hosted in your preferred git repo host).

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of the AWS documentation.

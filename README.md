# solo-cmp

Library that wraps IAB modules for CMP projects.

## Development Flow

All development work occurs on the `develop` branch.
The `main` branch is used to create new releases by merging current head of the `develop` branch.
You should create a feature-branch, branching from `develop`, whenever you need to add some changes to the `main` branch.
If those changes are accepted they will be merged by the repository maintainer.

## Dependencies

This application is based on:
- Node.js:14.15.4
- IAB TCF Modules
- BottleJs

## Development environment

To ease local development you have to install these tools:

* [Node.js](https://nodejs.org/)

### Install dependencies

To install dependencies, execute these commands:
```sh
npm install
```

When the process is complete, a Browser tab is automatically opened.

### Compile and minify for production

To create a production version, execute this command:
```sh
npm run build
```

### Test project

To run tests, execute this command:
```sh
npm run test
```

### Lint project

To lint the project files, execute this command:
```sh
npm run lint
```

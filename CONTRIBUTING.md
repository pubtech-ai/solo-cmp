# Contribution

In order to contribute to the improvement of the project, below you will find the project development flow.
Before being able to open a PR with changes to be applied or bug fixes to be solved, it is necessary to open an issue 
and explain the reason and a possible solution. You can open each PR by forking the project and creating the PR directly from 
your project to the project of our library.

Main rules:
- Open issue
- Create PR from forked project
- Link your PR to the issue

## Development Flow

All development work occurs on the `develop` branch.
The `main` branch is used to create new releases by merging current head of the `develop` branch.
You should create a feature-branch, branching from `develop`, whenever you need to add some changes to the `main` branch.
If those changes are accepted they will be merged by the repository maintainer.

## Dependencies

- [IAB TCF Modules](https://github.com/InteractiveAdvertisingBureau/iabtcf-es)
- [BottleJS](https://github.com/young-steveo/bottlejs)

## Development environment

To ease local development you have to install these tools:

* [Node.js](https://nodejs.org/)

Currently used version: [v14.15.4](https://nodejs.org/dist/v14.15.4/docs/api/)

### Install dependencies

To install dependencies, execute these commands:
```sh
npm install
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

### Compile and minify for production

To create a production version, execute this command:
```sh
npm run build
```

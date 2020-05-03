# Discover Bank

The Discover Bank monorepo. Each project has its own folder under `/packages`:

- config: Shared config files
- reusable: Reusable React components shared across projects
- zelle: Project Zelle
- taylor: Project Taylor

[Lerna](https://github.com/lerna/lerna) manages the monorepo.

## Why Lerna?

1. Install dependencies for all projects via a single command in the root
1. Creates symlinks between packages for easy local code sharing
1. Supports running the same command on all packages via a single command in root
1. Test all projects with a single command at the monorepo root: `npm t`
1. Cleaner import paths for reusable components (`reusable` instead of a relative import like `../../resuable/lib` - Lerna overrides the "node module" style import to call the local code via a symlink. Note that since the reusable package isn't published to npm, it is referenced as a [Git hosted dependency](https://github.com/lerna/lerna#git-hosted-dependencies).
1. The reusable component import path doesn't need changed if we publish the components to npm in the future

## Quick Start

Run the following in the project root:

```
npm install
npm run bootstrap

```

See the "npm Scripts" table below for details on what the bootstrap script does.

Then `cd` into the relevant `packages` folder for the project you'd like to work with and run `npm start`.

## npm Scripts

The `package.json` file in this repo's root contains the following scripts:

| Script    | Description                                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clean     | Remove all node_modules folders, then reinstall everything using the bootstrap command below. Running this before the ci script fully simulates what CircleCI is doing since it starts out clean everytime. |
| bootstrap | Installs dependencies for all projects and declares symlinks to tie the projects together.                                                                                                                  |
| build:lib | Build the reusable component library                                                                                                                                                                        |
| build     | Run `npm run build` in each project. Each project runs automated tests before the build.                                                                                                                    |
| cy:ci     | Run Cypress in CI mode so that it reports a result and stops.                                                                                                                                               |
| ci        | Runs the scripts above locally. Mimics what CircleCI runs, so useful to run locally before commit.                                                                                                          |

CircleCI runs the scripts above, as configured in config.yml.

## Automated Testing

Tests run automatically on CircleCI for each PR.

### Unit tests

We use [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). Both are built into create-react-app. To run unit tests on any project: `npm t`. Unit tests are placed alongside the component. Filenames end in `.test.js`.

### Integration Tests

We use [Cypress](https://www.cypress.io/). We extend Cypress with [cypress-testing-library](https://testing-library.com/docs/cypress-testing-library/intro), which enhances Cypress with a query syntax like react-testing-library. Cypress calls a [json-server](https://github.com/typicode/json-server) mock API. Cypress tests are in `/cypress/integration` for each project. Test files end in `.spec.js`. To run integration tests on any project: `npm run cy`.

To run a single Cypress test, change this:

`it('test name here')`

to this:

`it.only('test name here')`.

Remove the `.only` before pushing or the CI build will fail.

## Mock API

Each app uses a mock API built in [json-server](https://github.com/typicode/json-server).

- json-server uses Express behind the scenes.
- Each project configures the mock API in `/tools`.
- There is a dedicated routes file for each endpoint in `tools/routes`.
- Mock API wrappers in `/api` are utilized in development for each endpoint. By convention, each mock API ends in `.mock.js`. These files are loaded in development. The production build loads the corresponding file with the same name, but lacking the `.mock.js` suffix.
- Mock API data is stored in the project root in `mockData.js`. See "Mock Data" below for more info

## Mock Data

Each project uses a single, static mock dataset, stored in the project root in `mockData.js`. **Note:** Be careful about changing this data. It's used in 3 places:

1. **Mock API** - The mock API copies the data in mockData.js when the app starts to populate the mock DB (db.json, under tools)
2. **Storybook** - Storybook documents our reusable components.
3. **Automated tests** - This data is also referenced in our unit tests.

## Scenario Testing

Scenario testing is an in-house solution for running the app against different scenarios. A small selector sits in the top-left corner of the screen. This selector is also used by Cypress to select the relevant scenario for each test. The mock API sends selected scenarios via HTTP headers.

Examples of the moving pieces:

- **Sending scenario header**: `billpay/api/paymentApi.mockjs`
- **Scenario Selector**: See any file ending in `ScenarioSelector.js` in `billpay`
- **Reading scenario in mock API**: See any route file in billpay under `tools/routes`.

## Recommended Extensions

This project uses [Prettier](https://prettier.io) to autoformat code via a pre-commit hook. It's recommended to also run the Prettier extension in VS Code and enable format on save:

1. Install the Prettier extension
1. Open VS Code settings
1. Search for "Format on save" and enable

It's recommended to install the extensions listed in the .vscode directory. VS Code will automatically prompt you to install the extensions the first time you open the project.

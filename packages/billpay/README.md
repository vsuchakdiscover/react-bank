# BillPay

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docs

[Payment reminder - Zeplin](https://app.zeplin.io/project/5d854a1fa9393d8a839c5df2)
[Make a payment - Zeplin](https://app.zeplin.io/project/5da0b4e223952c23373194db)

## Scripts

| Script     | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| start      | Run app and mock API                                                                         |
| storybook  | Run storybook to developer and view components in isolation                                  |
| start:prod | Run the production build pointed at the local mock API (use for debugging prod build issues) |

## Build Configuration

Use these environment variables to configure the build. Specify these settings in npm scripts via [cross-env](https://www.npmjs.com/package/cross-env).

| Setting name                    | Default                                                        | Description                                                                                                           |
| ------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| REACT_APP_USE_SCENARIO_SELECTOR | `N`                                                            | Set to `Y` to enable the scenario selector                                                                            |
| REACT_APP_API_BASE_URL          | `null`                                                         | Specify per environment                                                                                               |
| REACT_APP_USE_MOCK_API          | `Y` when `process.env.NODE_ENV==='development'`, `N` otherwise | Set to `Y` to call the mock API                                                                                       |
| WEBPACK_BUNDLE_ANALYZER         | `N`                                                            | Set to `Y` to run [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) on prod build      |
| API_CALL_DELAY                  | `0`                                                            | Specify mock API call delay in milliseconds                                                                           |
| PORT                            | `3000`                                                         | The app starts on this port. We run Zelle on `3002/3003` to avoid conflicting with Billpay which runs on `3000/3001`) |
| PUBLIC_URL                      | http://localhost:3000                                          | Specify the full path to assets (hostname included). See create-react-app docs for more info.                         |
| ENABLE_MOCK_API_LOGGER          | `N`                                                            | Set to `Y` to output to the command line when any mock API call occurs                                                |

[Other environment settings built into create-react-app are also supported](https://create-react-app.dev/docs/advanced-configuration), but unused.

## Automated Integration Testing via Cypress

[Cypress](https://www.cypress.io/) runs the app in prod mode. Why?

1. It makes sense to test the app in prod mode on the CI server since it better mimics prod (though admittedly still against a mock API.
2. It's faster. With 49 tests on Circle CI:

- **Dev build**: 1 min, 46 seconds
- **Prod build**: 59 seconds

To get this speed, note the `npm run cy:ci` script runs the prod build with some special settings above.

1. Run the production build without the header (since not needed for Cy tests)
2. Run against the mock API for reliability, safety, and speed
3. Enable the scenario selector to support Cypress tests

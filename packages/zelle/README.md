# Zelle

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docs

- [UI Design](https://app.zeplin.io/project/5d1642b4dff09673c42d72d6) - in Zeplin
- [Full Banking API](https://extranet.mcdpartners.com/projects/BK-086/bundles/22130) - Zelle only uses GET/PUT profile.
- [New Zelle API](./docs/zelleApi.html) - New calls specifically for Zelle. HTML file, so open in your browser.
- [OOB Contract](./docs/OOBContract.docx) - Contact for out-of-band call
- [Profiles.zip](./docs/profiles.json) - Example JSON for the profiles API.

## Build Configuration

Use these environment variables to configure the build. Specify these settings in npm scripts via [cross-env](https://www.npmjs.com/package/cross-env).

| Setting name                    | Default                                                        | Description                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REACT_APP_INCLUDE_HEADER        | `N`                                                            | Include Discover header/footer in index.html when set to `Y`                                                                                                                                                                                                                                                |
| REACT_APP_USE_SCENARIO_SELECTOR | `N`                                                            | Set to `Y` to enable the scenario selector                                                                                                                                                                                                                                                                  |
| REACT_APP_API_BASE_URL          | `null`                                                         | Specify per environment                                                                                                                                                                                                                                                                                     |
| REACT_APP_USE_MOCK_API          | `Y` when `process.env.NODE_ENV==='development'`, `N` otherwise | Set to `Y` to call the mock API                                                                                                                                                                                                                                                                             |
| WEBPACK_BUNDLE_ANALYZER         | `N`                                                            | Set to `Y` to run [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) on prod build                                                                                                                                                                                            |
| API_CALL_DELAY                  | `0`                                                            | Specify mock API call delay in milliseconds                                                                                                                                                                                                                                                                 |
| PORT                            | `3002`                                                         | The app starts on this port. We run Zelle on `3002` to avoid conflicting with Billpay (it runs on `3000`)                                                                                                                                                                                                   |
| PUBLIC_URL                      | http://localhost:3002                                          | Create React App assumes your application is hosted at the serving web server's root or a subpath as specified in package.json (homepage). Normally, Create React App ignores the hostname. You may use this variable to force assets to be referenced verbatim to the url you provide (hostname included). |

[Other environment settings built into create-react-app are also supported](https://create-react-app.dev/docs/advanced-configuration), but unused.

## Automated Integration Testing via Cypress

[Cypress](https://www.cypress.io/) runs the app in prod mode because it's over twice as fast. With 4 tests:

- **Dev build**: 14 seconds
- **Prod build**: 6 seconds

To get this speed, note the `npm run cy:ci` script runs the prod build with some special settings above.

1. Run the production build without the header (since not needed for Cy tests)
2. Run against the mock API for reliability, safety, and speed
3. Enable the scenario selector to support Cypress tests

## Scenario Testing

Zelle includes a built-in scenario selector for running the app against a variety of potential scenarios. When `npm start` runs, scenario settings display in the top-left corner of the screen. Changed settings apply immediately. Some settings automatically reload the page to re-initialize the app. The scenario selector displays by default in dev mode.

We store settings in localStorage for two reasons:

1. The mock API can read the settings
1. The settings can persist across page reloads and development sessions.

Cypress uses the scenario selector to test each scenario. It's useful to run the app in each of these scenarios to support testing.

### How does Scenario testing work?

The ScenarioSelector component contains all settings. When settings are changed, they're written to localStorage. Zelle mock API files read the settings from localStorage. In development, Zelle loads `.mock` API files by convention. These files can contain static data, or call json-server.

### How do I add new settings?

1. Edit ScenarioSelector.js. Note that each setting has a change handler that writes to localStorage.
2. Add a corresponding mock API call with a filename ending in `.mock.js`. Read the setting that `ScenarioSelector` wrote to localStorage.

### Inspiration

[ng-apimock](https://github.com/mdasberg/ng-apimock) does something similar for Angular.

## Mock API

We handle Mock calls in 3 ways:

1. **Hard coded mock in \*.mock.js** - There is a `*.mock.js` file for each API in `/api`. Some functions inside contain a hard coded response in an async func. The function can return a plain data structure because in async functions the value returned is automatically converted into a promise.
2. **Via json-server** - json-server's data structures are generated from mockData.js and written to db.json each time the app starts.
3. **Via apiServer.js** - The mock API's response is customizable by declaring custom handlers in this file. This is useful when you want to declare custom logic.

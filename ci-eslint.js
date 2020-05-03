// This file deliberately configure ESLint to only run the no-only-tests check
// since this check is only relevant on CI to assure that .only isn't accidentally left
// on a Cypress test. We don't want to run this rule local because it's handy to run only
// one Cypress test at a time locally
module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    jest: true,
    "cypress/globals": true,
  },
  plugins: ["no-only-tests"],
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "no-only-tests/no-only-tests": "error",
  },
};

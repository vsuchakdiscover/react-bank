const rewireWebpackBundleAnalyzer = require("react-app-rewire-webpack-bundle-analyzer");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

// Necessary to allow importing outside of /src.
// (useful for importing components from /reusable)
// Alternatively, could use Lerna or npm link
module.exports = function override(config, env) {
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );
  // Assure that only a single version of React is placed in the app bundle
  // This also assures that the React lib that's part of /reusable isn't included in the app
  // (since doing to would be redundant and causes issues with Hooks)
  config.resolve = {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-router-dom": path.resolve("./node_modules/react-router-dom"),
    },
  };

  // Add webpack-bundle-analyzer to build if requested
  if (process.env.WEBPACK_BUNDLE_ANALYZER === "Y") {
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: "static",
      reportFilename: "report.html",
    });
  }

  return config;
};

// These first two imports are for IE11 support per https://stackoverflow.com/questions/55967048/how-do-i-support-ie-11-with-create-react-app-3-0
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import LogClicks from "./components/LogClicks";

ReactDOM.render(
  <ErrorBoundary>
    <LogClicks>
      <App />
    </LogClicks>
  </ErrorBoundary>,
  document.getElementById("root")
);

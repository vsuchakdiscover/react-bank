import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SmartLink from "./SmartLink";

export default { title: "Links/SmartLink" };
export const absoluteUrl = () => (
  <SmartLink to="http://microsoft.com">http://microsoft.com</SmartLink>
);

export const relativeUrl = () => (
  <Router>
    <p>
      <SmartLink to="/accounts">/accounts</SmartLink>
      <br />
      This relative URL won&apos;t load in Storybook since there is no matching
      route configured. In a real app, this will render as a &lt;Link&gt; so
      React Router will handle it.
    </p>
  </Router>
);

export const anchorUrl = () => (
  <Router>
    <SmartLink to="#faq">#faq</SmartLink>
  </Router>
);

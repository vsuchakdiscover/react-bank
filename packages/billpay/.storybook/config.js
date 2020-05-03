import React from "react";
import { addDecorator } from "@storybook/react";
import "reusable/src/scss/global.scss";

// Use this decorator to wrap all stories.
addDecorator((storyFn) => (
  <div className="container-fluid mt-20">
    <div className="row">
      <div className="col">{storyFn()}</div>
    </div>
  </div>
));

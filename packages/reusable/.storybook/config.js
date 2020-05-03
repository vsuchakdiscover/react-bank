import React from "react";
import { addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import { addParameters } from "@storybook/react";
import { addReadme } from "storybook-readme";
import "../src/scss/global.scss";

// Globally enable addons
addDecorator(withA11y);
addDecorator(withInfo);
addDecorator(
  withKnobs({
    escapeHTML: false,
  })
);
addDecorator(addReadme);
addParameters({
  readme: {
    codeTheme: "github",
  },
});

// Use this decorator to wrap all stories.
addDecorator((storyFn) => (
  <div className="container-fluid mt-20 meta-web-normal">
    <div className="row">
      <div className="col-12">{storyFn()}</div>
    </div>
  </div>
));

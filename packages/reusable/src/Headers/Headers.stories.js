import React from "react";
import H1 from "./H1";
import H2 from "./H2";
import H3 from "./H3";
import H4 from "./H4";
import H5 from "./H5";
import H6 from "./H6";
import { text } from "@storybook/addon-knobs";

export default { title: "Headers" };

export const h1 = () => <H1>{text("Page Title Text", "Payments")}</H1>;
h1.story = { name: "H1" };

export const h1WithSrOnly = () => (
  <H1>
    Test with Sr text <span className="sr-only">helper text</span>
  </H1>
);
h1WithSrOnly.story = { name: "H1 with sr-only" };

export const h2 = () => (
  <H2 className="mb-20">
    {text("children", "This is an H2 Header. It's the most common for Bank.")}
  </H2>
);
h2.story = { name: "H2" };

export const h3 = () => (
  <H3 className="mb-20">{text("children", "This is an H3 Header.")}</H3>
);
h3.story = { name: "H3" };

export const h4 = () => (
  <H4 className="mb-20">{text("children", "This is an H4 Header.")}</H4>
);
h4.story = { name: "H4" };

export const h5 = () => (
  <H5 className="mb-20">{text("children", "This is an H5 Header.")}</H5>
);
h5.story = { name: "H5" };

export const h6 = () => (
  <H6 className="mb-20">{text("children", "This is an H6 Header.")}</H6>
);
h6.story = { name: "H6" };

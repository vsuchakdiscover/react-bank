import React from "react";
import Label from "./Label";
import { text, boolean } from "@storybook/addon-knobs";

export default { title: "FormInputs/Label" };

export const optional = () => <Label>{text("children", "Label")}</Label>;

export const required = () => (
  <Label required={boolean("required", true)}>
    {text("children", "Label")}
  </Label>
);

export const withSublabel = () => (
  <Label sublabel={text("sublabel", "This is a sublabel")}>
    {text("children", "Label")}
  </Label>
);

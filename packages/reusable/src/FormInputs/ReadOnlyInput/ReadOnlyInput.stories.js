import React from "react";
import ReadOnlyInput from "./ReadOnlyInput";
import { text } from "@storybook/addon-knobs";

export default { title: "FormInputs/ReadOnlyInput" };

export const exampleWithHelpText = () => (
  <ReadOnlyInput
    label={text("label", "Email")}
    value={text("value", "c@h.com")}
    helpText={<>Example help text</>}
  />
);

export const exampleWithHiddenLabel = () => (
  <ReadOnlyInput
    label={text("label", "Email")}
    value={text("value", "c@h.com")}
    showLabel={false}
    helpText={<>Example help text</>}
  />
);

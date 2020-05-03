/* eslint-disable react/prop-types */
import React, { useState } from "react";
import TextInput from "./TextInput";
import { text, boolean } from "@storybook/addon-knobs";

function TextInputExample(props) {
  const [firstName, setFirstName] = useState("");

  return (
    <TextInput
      error={text("Error", props.error)}
      formSubmitted={false}
      id="first-name"
      label={text("Label", "First Name")}
      name="input1"
      onChange={(e) => setFirstName(e.target.value)}
      required={boolean("required", false)}
      tooltipContent={text("tooltipContent", props.tooltipContent)}
      value={firstName}
      {...props}
    />
  );
}

export default { title: "FormInputs/TextInput" };

export const defaultExample = () => <TextInputExample />;

export const longLabelExample = () => (
  <TextInputExample
    labelAboveInput
    label="This is an example of a long label (some text in parens)"
  />
);

export const required = () => <TextInputExample required />;

export const withStringHelpText = () => (
  <TextInputExample helpText="An example help text" />
);

export const withElementHelpText = () => (
  <TextInputExample helpText={<p>Element help text</p>} />
);

export const withTooltip = () => (
  <TextInputExample tooltipContent={<div>Hello world</div>} />
);

export const formSubmittedWithError = () => (
  <TextInputExample error="Name is required." />
);

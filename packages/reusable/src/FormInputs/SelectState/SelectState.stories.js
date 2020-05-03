/* eslint-disable react/prop-types */
import React from "react";
import { text, boolean } from "@storybook/addon-knobs";
import SelectState from "./SelectState";

function Example({ required = false, initialValue = "", error = undefined }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <SelectState
      error={error}
      id="state-select"
      label={text("label", "State")}
      name="state-select"
      onChange={(event) => setValue(event.target.value)}
      required={boolean("required", required)}
      setValue={setValue}
      value={value}
    />
  );
}

export default { title: "FormInputs/SelectState" };
export const optional = () => <Example />;
export const initialValueSet = () => <Example initialValue="NY" />;
export const requiredExample = () => <Example required />;
export const formSubmittedWithError = () => <Example error="Example" />;

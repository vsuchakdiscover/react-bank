/* eslint-disable react/prop-types */
import React from "react";
import { text, boolean } from "@storybook/addon-knobs";
import SelectCountry from "./SelectCountry";

function Example({ required = false, initialValue = "", error = undefined }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <SelectCountry
      error={error}
      id="country-select"
      label={text("label", "Country")}
      name="country-select"
      onChange={(event) => setValue(event.target.value)}
      required={boolean("required", required)}
      setValue={setValue}
      value={value}
    />
  );
}

export default { title: "FormInputs/SelectCountry" };
export const optional = () => <Example />;
export const initialValueSet = () => <Example initialValue="ZMB" />;
export const required = () => <Example required />;
export const withError = () => <Example error="Example" />;

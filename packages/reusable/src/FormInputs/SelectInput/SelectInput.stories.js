/* eslint-disable react/prop-types */
import React from "react";
import SelectInput from "./SelectInput";
import { text, boolean } from "@storybook/addon-knobs";

function Example({
  disableEmptyOptions,
  required = false,
  initialValue = "",
  error = undefined,
  suffixAddon,
  tooltipContent,
  options = [
    { label: "Jr.", value: "Jr." },
    {
      label: "This is an example of a long label (with text in parens)",
      value: "This is an example of a long label (with text in parens)",
    },
    { label: "Sr.", value: "Sr." },
  ],
}) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <SelectInput
      disableEmptyOptions={disableEmptyOptions}
      error={error}
      id="suffix"
      label={text("label", "Suffix")}
      name="suffix"
      onValidate={() => {}}
      options={options}
      required={boolean("required", required)}
      setValue={setValue}
      suffixAddon={suffixAddon}
      tooltipContent={tooltipContent}
      value={value}
    />
  );
}

export default { title: "FormInputs/SelectInput" };

export const optional = () => <Example />;

export const arrayOfStrings = () => (
  <Example options={["One", "Two", "Three"]} />
);

export const initialValueSet = () => <Example initialValue="Jr." />;

export const withTooltip = () => (
  <Example initialValue="Jr." tooltipContent={"Hello world"} />
);

export const disableEmptyOption = () => (
  <Example disableEmptyOptions required />
);

export const requiredExample = () => <Example required />;

export const formSubmittedWithError = () => <Example error="Example" />;

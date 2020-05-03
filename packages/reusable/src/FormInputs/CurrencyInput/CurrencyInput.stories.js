/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CurrencyInput from "./CurrencyInput";
import { text, boolean, number } from "@storybook/addon-knobs";

function CurrencyExample(props) {
  const [amount, setAmount] = useState(props.initialValue || "");

  const onChange = (e) => {
    setAmount(e.target.value);
  };
  return (
    <CurrencyInput
      id="amount-input"
      label={text("Label", "Amount")}
      name="input1"
      onChange={onChange}
      required={boolean("required", false)}
      value={number("value", amount)}
      {...props}
    />
  );
}

export default {
  title: "FormInputs/CurrencyInput",
  parameters: {
    info: {
      propTables: [CurrencyInput],
    },
  },
};

export const defaultExample = () => <CurrencyExample />;
export const initialValue = () => <CurrencyExample initialValue={21.42} />;
export const withTooltip = () => (
  <CurrencyExample
    initialValue={21.42}
    tooltipContent={<div>Hello world</div>}
  />
);

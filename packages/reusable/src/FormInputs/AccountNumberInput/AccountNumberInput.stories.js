import React, { useState } from "react";
import AccountNumberInput from "./AccountNumberInput";

function AccountExample() {
  const [value, setValue] = useState("");
  const [lastValue, setLastValue] = useState("");
  return (
    <AccountNumberInput
      id="amount-input"
      instructionalText="Enter numbers or letters only."
      label="Account Number"
      lastValue={lastValue}
      name="input1"
      onChange={(e) => {
        setValue(e.target.value);
        setLastValue(e.target.value);
      }}
      onFocus={() => setValue("")}
      required
      setLastValue={setLastValue}
      setValue={setValue}
      value={value}
    />
  );
}

function AccountExampleWithValue() {
  const [value, setValue] = useState("*****6789");
  const [lastValue, setLastValue] = useState("*****6789");
  return (
    <AccountNumberInput
      id="amount-input"
      instructionalText="Enter numbers or letters only."
      label="Account Number"
      lastValue={lastValue}
      name="input1"
      onChange={(e) => {
        setValue(e.target.value);
        setLastValue(e.target.value);
      }}
      onFocus={() => setValue("")}
      required
      setLastValue={setLastValue}
      setValue={setValue}
      value={value}
    />
  );
}

function AccountExampleNotRequired() {
  const [value, setValue] = useState("*****6789");
  const [lastValue, setLastValue] = useState("*****6789");
  return (
    <AccountNumberInput
      id="amount-input"
      instructionalText="Enter numbers or letters only."
      label="Account Number"
      lastValue={lastValue}
      name="input1"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onFocus={() => setValue("")}
      setLastValue={setLastValue}
      setValue={setValue}
      value={value}
    />
  );
}

export default {
  title: "FormInputs/AccountNumberInput",
  parameters: {
    info: {
      propTables: [AccountNumberInput],
    },
  },
};

export const defaultExample = () => <AccountExample />;
export const withValue = () => <AccountExampleWithValue />;
export const notRequired = () => <AccountExampleNotRequired />;

import React, { useState } from "react";
import PhoneInput from "./PhoneInput";
import { text, boolean } from "@storybook/addon-knobs";

function PhoneExample() {
  const [phoneNumber, setPhonenumber] = useState("");

  const onChange = (e) => {
    setPhonenumber(e.target.value);
  };
  return (
    <PhoneInput
      formSubmitted={false}
      id="first-name"
      label={text("Label", "Work Phone")}
      name="input1"
      onChange={onChange}
      required={boolean("required", false)}
      value={phoneNumber}
    />
  );
}

function SetPhoneExample() {
  const [phoneNumber, setPhonenumber] = useState("");
  const onClick = (e) => {
    setPhonenumber("630-134-8855");
  };

  const onChange = (e) => {
    setPhonenumber(e.target.value);
  };
  return (
    <>
      <PhoneInput
        formSubmitted={false}
        id="first-name"
        label={text("Label", "Work Phone")}
        name="input1"
        onChange={onChange}
        required={boolean("required", false)}
        value={phoneNumber}
      />
      <button onClick={onClick}>Click</button>
    </>
  );
}

export default { title: "FormInputs/PhoneInput" };
export const defaultExample = () => <PhoneExample />;
export const setValueExternally = () => <SetPhoneExample />;

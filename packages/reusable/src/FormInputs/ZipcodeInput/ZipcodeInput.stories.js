import React, { useState } from "react";
import ZipcodeInput from "./ZipcodeInput";
import { text, boolean } from "@storybook/addon-knobs";

function ZipExample() {
  const [zip, setZip] = useState("");

  const onChange = (e) => {
    setZip(e.target.value);
  };
  return (
    <ZipcodeInput
      formSubmitted={false}
      id="zipcode"
      label={text("Label", "Zipcode")}
      name="input1"
      onChange={onChange}
      required={boolean("required", false)}
      value={zip}
    />
  );
}

export default { title: "FormInputs/ZipcodeInput" };
export const defaultExample = () => <ZipExample />;

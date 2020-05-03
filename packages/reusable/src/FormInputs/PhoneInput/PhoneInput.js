import React from "react";
import MaskedTextInput from "../MaskedTextInput";

const PhoneInput = (props) => {
  return <MaskedTextInput {...props} />;
};

PhoneInput.defaultProps = {
  guide: false,
  mask: [
    /[1-9]/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

export default PhoneInput;

import React from "react";
import MaskedTextInput from "../MaskedTextInput";

// Only show mask once they have entered at least 6 chars
const zipMask = (inputValue) => {
  if (inputValue.length <= 5) {
    return [/\d/, /\d/, /\d/, /\d/, /\d/];
  } else {
    return [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
  }
};

const ZipcodeInput = (props) => {
  return <MaskedTextInput {...props} />;
};

ZipcodeInput.defaultProps = {
  guide: false,
  mask: zipMask,
};

export default ZipcodeInput;

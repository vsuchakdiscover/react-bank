/* eslint-disable react/prop-types */
import React from "react";
import MaskedTextInput from "./MaskedTextInput";

export default { title: "FormInputs/MaskedTextInput" };
export const phoneWithTooltip = () => (
  <MaskedTextInput
    mask={[
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
    ]}
    name="phone"
    tooltipContent={"Hello world"}
    value="9137028383"
  />
);

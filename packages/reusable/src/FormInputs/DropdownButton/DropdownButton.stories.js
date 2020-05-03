import React from "react";
import DropdownButton from "./DropdownButton";

export default { title: "FormInputs/DropdownButton" };
export const defaultExample = () => (
  <DropdownButton
    label="Open An Account"
    options={[
      { label: "Checking", value: "http://discover.com" },
      { label: "Savings", value: "http://discover.com" },
      { label: "Call func", value: () => alert("hi") },
    ]}
  ></DropdownButton>
);

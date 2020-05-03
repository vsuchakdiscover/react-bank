/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DateInput from "./DateInput";
import { text, boolean } from "@storybook/addon-knobs";

const DateInputExample = ({
  value = "",
  required = false,
  error,
  formSubmitted,
}) => {
  const [date, setDate] = useState(value);

  function handleChange(event) {
    setDate(event.target.value);
  }

  return (
    <DateInput
      error={text("error", error)}
      formSubmitted={formSubmitted}
      id="date"
      label={text("label", "Date")}
      onChange={handleChange}
      onValidate={() => {}}
      required={boolean("required", required)}
      value={date}
    />
  );
};

export default {
  title: "FormInputs/DateInput",
  parameters: {
    info: {
      propTables: [DateInput],
    },
  },
};
export const optionalExample = () => <DateInputExample />;
export const requiredExample = () => <DateInputExample required />;
export const formSubmittedWithError = () => (
  <DateInputExample error="Date is required." formSubmitted />
);

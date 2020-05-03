import React, { useState } from "react";
import TextInput from "../TextInput";
import { isValidDate } from "../../utils/validators";
import { string, number, func, bool } from "prop-types";

// Facade over TextInput that adds date validation and placeholder.
const DateInput = ({
  id,
  label,
  name,
  error,
  value,
  onChange,
  required,
  onValidate,
  formSubmitted,
  section,
}) => {
  const [localError, setLocalError] = useState("");

  function handleBlur(event) {
    setLocalError(
      isValidDate(event.target.value) ? "" : "Enter date in MM/DD/YYYY format"
    );
  }

  const validationError = localError || error;

  return (
    <TextInput
      error={validationError}
      formSubmitted={formSubmitted}
      id={id}
      label={label}
      name={name}
      onBlur={handleBlur}
      onChange={onChange}
      onValidate={onValidate}
      placeholder="MM/DD/YYYY"
      required={required}
      section={section}
      value={value}
    />
  );
};

DateInput.propTypes = {
  /** Set autocorrect to "on" to enable autocorrect */
  autocorrect: string,

  /** Set error state and display an error message below the input */
  error: string,

  /** Status of form submission */
  formSubmitted: bool,

  /** Input id */
  id: string,

  /** Input label */
  label: string.isRequired,

  /** Input max length */
  maxLength: string,

  /** Input name */
  name: string,

  /** Function called onBlur. This is called in addition to the native onBlur. */
  onBlur: func,

  /** Function called onChange. This is called in addition to the native onChange. */
  onChange: func,

  /** Function called onValidate */
  onValidate: func,

  /** Set to true to enable required field validation on blur */
  required: bool,

  /** Section number */
  section: number,

  /** Section number - Used to derive this input's unique ID using the input's name + section number. Optional since some forms don't allow an array of responses. In those cases, the id is set to the name. */
  sectionNumber: number,

  /** Label displayed below the label */
  sublabel: string,

  /** Input value */
  value: string,
};

DateInput.defaultProps = {
  error: "",
};

export default DateInput;

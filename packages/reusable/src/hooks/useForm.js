import { useState, useCallback, useEffect, useContext } from "react";
import FormSectionContext from "../FormSection/FormSectionContext";
import FormContext from "../Form/FormContext";

// Reusable React Hook that centralizes logic for reusable form inputs.
// Includes the following:
// 1. OnBlur validation when required
// 2. Calls custom validator when formSubmitted is true
// 3. Returns error message passed in via props, if exists
export function useForm(props, styles) {
  const { required, value, label, onBlur, error, name } = props;
  // Warning: Displayed when client-side validation fails
  // Error: Displayed when:
  // 1. Form is submitted and client-side validation fails
  // 2. Server-side validation fails
  const [localError, setLocalError] = useState(null);

  // Using context to avoid having to specify these props on every input, since they're the same for every input on a given form.
  let { onValidate, formSubmitted, onChange } = useContext(FormContext);
  const sectionContext = useContext(FormSectionContext);

  // TODO: If id (or other derived props) are passed in on props, throw an error: "The field's ID is automatically generated. See useForm for the implementation."

  // Derive the input's unique ID by appending the section number (if exists) to the name. This assures each ID is unique.
  const id = name + (sectionContext.sectionNumber || "");

  const { section } = sectionContext;
  // Allow specifying a custom onChange via FormSection, if provided. Otherwise, use the onChange provided via Form.
  if (sectionContext.onChange) onChange = sectionContext.onChange;

  // These fields are required when calling the FormProvider (which is wrapped by Form), so assure they're available as expected.
  if (!onValidate || !onChange)
    throw new Error(
      "The useForm Hook requires the form to be wrapped with the Form component. See the propTypes on Form for the required props that must be passed to the Form component."
    );

  if (!section)
    throw new Error(
      "The useForm Hook requires the form to be wrapped with the FormSection component. See the propTypes on FormSection for the required props that must be passed to the FormSection component."
    );

  const validate = useCallback(() => {
    const _error = required && !value ? label + " is required." : null;
    setLocalError(_error);
    onValidate(section, id, _error);
  }, [id, label, onValidate, required, section, value]);

  useEffect(() => {
    if (formSubmitted) validate();
  }, [formSubmitted, validate]);

  function handleChange(event) {
    // Allow caller to declare a custom onChange func
    if (props.onChange) props.onChange(event);
    onChange(event);
  }

  function handleBlur(event) {
    validate();

    // Allow caller to declare a custom onBlur func
    if (onBlur) onBlur(event);
  }

  // A validation error exists if the built in (local) validation on this component failed, or an error is passed in on props.
  const validationError = localError || error.message;

  // Set the appropriate CSS class based on validation status
  let inputClass = styles.input;
  if (validationError && formSubmitted) inputClass += " " + styles.inputError;

  // Return these values for use in the input
  return [
    validationError,
    inputClass,
    formSubmitted,
    handleChange,
    handleBlur,
    id,
  ];
}

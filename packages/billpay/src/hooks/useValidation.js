import { useState } from "react";
import { sentenceCase } from "reusable/lib/formattingUtils";

// Hook for handling validation and error messages
// Args:
// 1. objectToValidate: A reference to the object you want to validate
// 2. fields: array of fields to validate in this format: { name: "fieldName", label: "fieldLabel" }.
// Label is used for error messages. Label can be omitted in most cases.
// When omitted, it will be derived from the name and sentence-cased.
function useValidation(objectToValidate, fields) {
  const [errors, setErrors] = useState({});

  function isValid() {
    const _errors = {};

    fields.forEach((field) => {
      // Call validate for each field and pass it a simulated event data structure
      const event = {
        target: {
          name: field.name,
          value: objectToValidate[field.name],
        },
      };
      const error = validate(event, field.label);
      if (error) _errors[field.name] = error;
    });

    setErrors(_errors);
    return Object.keys(_errors).length === 0;
  }

  // Validates that field is populated
  function validate(event) {
    const { name, value } = event.target;
    // If custom label was specified for field, use it in the error message. Otherwise, just sentence case the field's name.
    const fieldName =
      fields.find((f) => f.name === name).label || sentenceCase(name);
    if (!value) {
      const error = `Enter a valid ${fieldName}`;
      setErrors({
        ...errors,
        [name]: error,
      });
      return error;
    } else {
      const _errors = { ...errors };
      delete _errors[name]; // remove any previous error
      setErrors(_errors);
      return "";
    }
  }

  return [errors, setErrors, isValid, validate];
}

export default useValidation;

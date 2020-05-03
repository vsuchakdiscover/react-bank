import { useState } from "react";

/**
 * A hook that provides validation for inputs and the form.
 *
 * @param {*} validationRules
 *  - An object of fields with a list of validation rules
 *    Example:
 *    ```
 *    {
 *      firstName: [isNotEmpty, isMoreThanTwoChars],
 *      lastName: [isNotEmpty]
 *    }
 *    ```
 *    where validation rule is a simple function that accepts "value" argument
 *    and returns an error string message if validation fails.
 *
 * @param {*} config
 *  - A configuration object, for now it has a single prop:
 *    - flatErrorsMaxDepth: sets a maximum number of errors that would be joined into a single error message.
 */
function useFormValidation(
  validationRules,
  config = { flatErrorsMaxDepth: 1 }
) {
  const [errors, setErrors] = useState({});

  // Flattens errors into a string, useful for simple error message representation.
  const flatErrors = flattenErrors(errors, config.flatErrorsMaxDepth);

  // Runs through each input validator and saves errors if it
  // gets any after validation.
  const validateInput = (inputValidators = []) => (
    { target: { name, value } },
    values
  ) => {
    const newErrors = { ...errors };
    delete newErrors[name];

    const inputErrors = inputValidators
      .map((validate) => validate(value, { name, values }))
      .filter((errorMessage) => errorMessage !== true);

    if (inputErrors && inputErrors.length > 0) {
      newErrors[name] = inputErrors;
    }

    // Update errors only when there are new errors (prevents focus switch block).
    !objectsAreEqual(newErrors, errors) && setErrors(newErrors);

    return newErrors;
  };

  // Runs validators on the form values.
  const validateForm = (values) => {
    // Build a new errors object by running validator on each input
    const errors = Object.entries(validators).reduce(
      (errors, [name, validator]) => {
        const inputErrors = validator(
          {
            target: { name, value: values[name] },
          },
          values
        );
        return { ...errors, ...inputErrors };
      },
      {}
    );

    setErrors(errors);

    return (
      Object.keys(flattenErrors(errors, config.flatErrorsMaxDepth)).length === 0
    );
  };

  // An object of validation handlers for each input.
  // We build it from passing validation rules into validateInput callback.
  const validators = Object.entries(validationRules).reduce(
    (validators, [fieldName, inputValidators]) => ({
      ...validators,
      [fieldName]: validateInput(inputValidators),
    }),
    {}
  );

  return {
    // An object with errors. Each field might have an array of errors
    errors,

    // An object with errors. If a field has an array of errors, it gets flattened into a string
    flatErrors,

    // Boolean value that indicates whether a form is valid
    isValid: Object.keys(flatErrors).length === 0,

    // Errors setter
    setErrors,

    /**
     * An object of validators for each field, assign a validation to an input's onBlur
     * to get instant validation.
     * Example:
     * ```
     * <input type="text" name="firstName" onBlur={validators.firstName} />
     * ```
     */
    validators,

    // A callback that allows manual validation of the form
    validateForm,
  };
}

const objectsAreEqual = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

const flattenErrors = (errors, flatErrorsMaxDepth = 1) =>
  Object.entries(errors).reduce((flatErrors, [name, errors]) => {
    if (errors && errors.length > 0) {
      flatErrors[name] = errors.slice(0, flatErrorsMaxDepth).join(" ");
    }
    return flatErrors;
  }, {});

export default useFormValidation;

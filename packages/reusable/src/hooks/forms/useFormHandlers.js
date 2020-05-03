import useFormValidation from "./useFormValidation";
import { useState } from "react";

/**
 * A hook that handles input validation and input values binding.
 *
 * @param defaultValues - is an object with initial field values (if any).
 * @param validationRules - is an object with validationRules
 *
 * Usage example:
 *    const {error, values, handleBlur, handleChange} = useFormHandlers({
 *      defaultValues: {
 *        lastName: 'doe'
 *      },
 *      validationRules: {
 *        firstName: [
 *          isMoreThanTwoChars // is a simple function that accepts a value and returns either true (if validation is successful) or error message text string (if validation has failed)
 *        ]
 *      }
 *    })
 *
 * JSX:
 *  <form>
 *    <TextInput
 *      required
 *      label="Name"
 *      name="name"
 *      onBlur={handleBlur}
 *      onChange={handleChange}
 *      error={errors.name}
 *      value={values.name}
 *    />
 *
 *    <TextInput
 *      type="email"
 *      label="Email address"
 *      name="emailAddress"
 *      onBlur={handleBlur}
 *      onChange={handleChange}
 *      error={errors.emailAddress}
 *      value={values.emailAddress}
 *    />
 *  </form>
 */
function useFormHandlers({ defaultValues = {}, validationRules = {} } = {}) {
  const [values, setValues] = useState(defaultValues);

  const { flatErrors, isValid, validators, validateForm } = useFormValidation(
    validationRules
  );

  /**
   * A generic input value handler.
   * */
  function handleChange(e) {
    e.persist();
    const { name } = e.target;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((values) => {
      return {
        ...values,
        [name]: value,
      };
    });
  }

  /**
   * A generic onBlur handler.
   */
  function handleBlur(e) {
    // Runs validator for a field if it exists.
    validators[e.target.name] && validators[e.target.name](e, values);
  }

  return {
    errors: flatErrors,
    handleChange,
    handleBlur,
    isValid,
    validators,
    values,
    setValues,
    validateForm,
  };
}

export default useFormHandlers;

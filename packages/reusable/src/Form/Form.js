import React, { useState } from "react";
import FormContext from "./FormContext";
import { PropTypes } from "prop-types";

// This component is a smart <form> tag. This uses context to provide necessary data to each input.
// This wrapper documents and standardizes form implementations.
// Benefits:
// 1. onChange, onValidate, and formSubmitted props are passed to reusable form inputs (TextInput, SelectInput, etc) via FormContext. Without this, we'd have to pass each of these props to each form input.
// 2. The form auto-scrolls to the top upon submission.
// 3. The form doesn't post back since preventDefault is called.
// 4. The form submission status is stored.
// 5. Errors are automatically added to state via onValidate (which is called by reusable inputs such as TextInput, SelectInput when formSubmitted is set to true)
// 6. Custom onSubmit and onChange handlers are supported.
const Form = ({ onSubmit, onChange, children, serverSideErrors }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // This stores client-side validation errors. Server-side errors are passed in via the serverSideErrors prop.
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    window.scroll(0, 0);
    event.preventDefault();
    setFormSubmitted(true);
    // If the caller has declared a custom onSubmit, run it.
    if (onSubmit) onSubmit();
  }

  // Store errors in state, keyed by the form element's id.
  // These values are displayed by the ValidationSummary component
  // which reads these errors from context.
  function onValidate(section, id, error) {
    setErrors((prevErrors) => {
      const _errors = { ...prevErrors };

      // Remove error property (in case field was previously in error)
      if (!error) {
        delete _errors[id];
        return _errors;
      }

      if (!errors[id]) _errors[id] = {};
      _errors[id] = {
        section,
        message: error,
      };

      return _errors;
    });
  }

  // These values are provided to all child components via FormContext
  // These values are consumed by reusable form inputs like TextInput, SelectInput, etc.
  const providerValue = {
    onValidate,
    formSubmitted,
    onChange,
    errors: serverSideErrors || errors,
  };

  return (
    <FormContext.Provider value={providerValue}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
};

Form.propTypes = {
  /** The children to render */
  children: PropTypes.node.isRequired,

  /** The onChange handler to utilize for all inputs. Optional since you can optionally declare the onChange on <FormSection> instead (useful when each section needs a unique onChange). */
  onChange: PropTypes.func,

  /** The function to run when the form is submitted */
  onSubmit: PropTypes.func.isRequired,

  /** Errors from server-side validation */
  serverSideErrors: PropTypes.object,
};

export default Form;

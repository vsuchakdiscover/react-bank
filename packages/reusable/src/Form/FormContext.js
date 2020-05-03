// Consume this via the Form component.
import React from "react";

// Use this as the default value so developer is alerted if the consumer is called without the provider.
const error =
  "FormContext.Provider not found. All forms should utilize the <Form> component. It configures FormContext, which is used by the useForm Hook which is used in reusable inputs like TextInput, SelectInput, etc.";
const defaultSettings = {
  onSubmit() {
    throw new Error(error);
  },
  onChange() {
    throw new Error(error);
  },
  errors: {},
};

const FormContext = new React.createContext(defaultSettings);

export default FormContext;

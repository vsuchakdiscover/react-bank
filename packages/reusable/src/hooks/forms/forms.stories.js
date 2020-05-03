import React from "react";
import useFormHandlers from "./useFormHandlers";
import TextInput from "../../FormInputs/TextInput";
import Button from "../../Button";

export default { title: "hooks/forms" };

const validateMinThreeChars = (value) =>
  value.length >= 3 || "At least three characters required";

function RawForm() {
  const { values, handleBlur, handleChange, errors } = useFormHandlers({
    validationRules: {
      name: [validateMinThreeChars],
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    alert(JSON.stringify(values));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Form values:</h2>
      {JSON.stringify(values)}

      <TextInput
        required
        label="Name"
        name="name"
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.name}
        value={values.name}
      />

      <TextInput
        type="email"
        label="Email address"
        name="emailAddress"
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.emailAddress}
        value={values.emailAddress}
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

export const useFormExample = () => {
  return <RawForm />;
};

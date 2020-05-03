import React, { useEffect, useState } from "react";
import useTokenListForm from "./hooks/useTokenListForm";
import Button from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import PropTypes from "prop-types";
import ErrorSummary from "reusable/lib/ErrorSummary";
import SmartLink from "reusable/lib/SmartLink";

function AccountVerificationForm({
  tokenList = [],
  tokenListName,
  onSubmit,
  submitting,
}) {
  // Get form values, errors and handlers generated based on tokenList
  const {
    errors,
    handleBlur,
    handleChange,
    schema,
    setValues,
    values: fieldValues,
    validateForm,
  } = useTokenListForm({
    tokenList,
    tokenListName,
  });

  const [formSubmitCount, setFormSubmitCount] = useState(0);

  // Clear form values when tokenList updates.
  useEffect(() => {
    setValues({});
  }, [setValues, tokenList]);

  function handleFormSubmit(e) {
    e.preventDefault();
    const isValid = validateForm(fieldValues);
    isValid ? onSubmit(fieldValues) : setFormSubmitCount((count) => count + 1);
  }

  return (
    <>
      <ErrorSummary
        adobeEvent={{
          prop1: "ENROLL_EBILLS_ENROLL_BTN",
          prop10Label: "EBills:PayeeError",
          list1Label: "EBills:PayeeError",
        }}
        errors={errors}
        formSubmitCount={formSubmitCount}
      />
      <form onSubmit={handleFormSubmit}>
        {schema.map(({ Component, ...props }) => (
          <Component
            key={props.name}
            {...props}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors[props.name]}
            value={fieldValues[props.name] || ""}
          />
        ))}
        <br />
        <ButtonGroup>
          <Button type="submit" disabled={submitting}>
            Enroll
          </Button>
          <ButtonGroup.Link>
            <SmartLink
              to="/manage-ebills"
              adobeEvent="MANAGE_EBILLS_ENROLL_PAYEE_CANCEL_LNK"
            >
              Cancel
            </SmartLink>
          </ButtonGroup.Link>
        </ButtonGroup>
      </form>
    </>
  );
}

AccountVerificationForm.defaultValues = {
  tokenList: [],
};

AccountVerificationForm.propTypes = {
  name: PropTypes.string,
  tokenList: PropTypes.array.isRequired,
  tokenListName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default AccountVerificationForm;

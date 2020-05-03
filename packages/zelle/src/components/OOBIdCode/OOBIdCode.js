import React, { useState } from "react";
import PropTypes from "prop-types";
import H2 from "reusable/lib/H2";
import TextInput from "reusable/lib/TextInput";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Alert, { ALERT_TYPES } from "reusable/lib/Alert";
import styles from "./OOBIdCode.module.scss";

const OOBIdCode = ({ selection, onCancel, clearError, onSubmit, oobError }) => {
  const [idCode, setIdCode] = useState("");
  const [error, setError] = useState(null);

  function onChange(event) {
    clearError(); // clear error if the id code field is changed so if the next code fails, it's clear it's for the new submission.
    setIdCode(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!idCode) return setError("Enter your temporary identification code.");
    onSubmit(idCode);
  }

  function validate() {
    if (!idCode) {
      setError("Enter your temporary identification code.");
      return false;
    }
    setError(null);
    return true;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 542 }}>
      <H2 className={styles.h2}>For Your Added Security</H2>
      {oobError && (
        <Alert
          className={styles.alert}
          closable={false}
          type={ALERT_TYPES.ERROR}
        >
          {oobError.message}
        </Alert>
      )}
      <p>
        Please enter your identification code that was sent to{" "}
        <strong>{selection.replace(/[x*]/g, "•")}</strong>.
      </p>
      <p>
        Haven’t received your code yet?{" "}
        <Button buttonStyle={BUTTON_TYPES.LINK} onClick={onCancel}>
          Get New Code
        </Button>
      </p>
      <TextInput
        label="Identification Code"
        id="idCode"
        value={idCode}
        name="idCode"
        required
        onBlur={validate}
        onChange={onChange}
        error={error}
      />
      <ButtonGroup className={styles.buttonGroup}>
        <Button type="submit">Continue</Button>
        <Button buttonStyle={BUTTON_TYPES.LINK} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  );
};

OOBIdCode.propTypes = {
  clearError: PropTypes.func.isRequired,
  selection: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  oobError: PropTypes.object,
};

export default OOBIdCode;

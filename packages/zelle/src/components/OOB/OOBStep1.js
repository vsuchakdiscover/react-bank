import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import H2 from "reusable/lib/H2";
import RadioButton from "reusable/lib/RadioButton";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import ErrorSummary from "reusable/lib/ErrorSummary";
import styles from "./OOB.module.scss";

const OOB = ({ channels, onCancel, onSubmit }) => {
  const [selection, setSelection] = useState(null);
  const [errors, setErrors] = useState({});
  const [formSubmitCount, setFormSubmitCount] = useState(0);
  const formHeaderRef = useRef();

  function formatMask(val) {
    // Replace any asterisks or x's with a bullet
    const masked = val.replace(/[x*]/g, "•");
    return masked;
  }

  function onChange(event) {
    setSelection(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selection) {
      setFormSubmitCount((count) => count + 1);
      formHeaderRef.current.scrollIntoView();
      return setErrors({
        channel:
          "Select a method for delivering your temporary identification code.",
      });
    }
    // Split value on carrot since it's used to separate channel and delivery method below on input value
    const [channel, description, deliveryMethod] = selection.split("^");
    onSubmit(channel, description, deliveryMethod);
  }

  function renderRadios(label, deliveryMethod) {
    return (
      <div className={styles.radioContainer}>
        <label>{label}</label>
        {channels.map((channel) => {
          return channel.delivery_methods
            .filter((m) => m.name === deliveryMethod)
            .map((m) => {
              const value =
                channel.name + "^" + channel.description + "^" + m.name;
              return (
                <RadioButton
                  key={m.description}
                  name="channel"
                  onChange={onChange}
                  // Replace x's with a bullet per design
                  label={formatMask(channel.description)}
                  value={value}
                  checked={selection === value}
                />
              );
            });
        })}
      </div>
    );
  }

  const textMethodsExist = channels.some((c) =>
    c.delivery_methods.some((dm) => dm.name === "sms")
  );

  const phoneMethodsExist = channels.some((c) =>
    c.delivery_methods.some((dm) => dm.name === "audio")
  );

  const emailMethodsExist = channels.some((c) =>
    c.delivery_methods.some((dm) => dm.name === "email")
  );

  return (
    <form ref={formHeaderRef} onSubmit={handleSubmit} style={{ maxWidth: 542 }}>
      <H2 className={styles.h2}>For Your Added Security</H2>
      <ErrorSummary errors={errors} formSubmitCount={formSubmitCount} />
      <p>
        Before we continue, we need to verify your identity by sending you a
        temporary identification code to enter. Please select how you’d like to
        receive your code and you’ll be prompted to enter it on the next screen.
      </p>
      <p>
        <strong>
          How would you like to receive your temporary identification code?
        </strong>
      </p>

      <div id="channel">
        {textMethodsExist && renderRadios("Text Message", "sms")}
        {phoneMethodsExist && renderRadios("Phone", "audio")}
        {emailMethodsExist && renderRadios("Email", "email")}
      </div>

      <p>
        By selecting one of the contact channels, you are providing a one-time
        authorization for us to send you an identification code. Message and
        data rates may apply.
      </p>
      <ButtonGroup>
        <Button type="submit">Continue</Button>
        <Button buttonStyle={BUTTON_TYPES.LINK} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
      <p style={{ paddingTop: 20 }}>
        <strong>Questions about your contact information?</strong>
      </p>
      <p>
        If any of your contact information is invalid, please call us at
        1-800-347-2665.
      </p>
      <p>
        <strong>Note:</strong> For your added security, recently updated contact
        information may not be available to receive your temporary
        identification code.
      </p>
    </form>
  );
};

OOB.propTypes = {
  channels: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default OOB;

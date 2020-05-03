import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./AccountNumberInput.module.scss";
import InputError from "../InputError";
import ErrorIcon from "../../Icons/ErrorIcon";
import Tooltip from "../../Tooltip";
import { BUTTON_TYPES } from "../../Button";
import cx from "classnames";

const conformValue = (value) => {
  let maskLength = 4;
  if (value.length === 4) {
    maskLength = 2;
  } else if (/^.{2,3}$/.test(value)) {
    maskLength = value.length - 1;
  }
  const lastFour = value.substring(value.length - maskLength, value.length);
  const remainingString = value.substring(value.length - maskLength, 0);
  const maskedAccount = remainingString.replace(/[A-Za-z0-9*]/g, "●");
  return (
    <>
      <span className={styles.mask}>{maskedAccount}</span>
      {lastFour}
    </>
  );
};

// eslint-disable-next-line react/display-name
const AccountInput = React.forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [formattedVal, setFormattedVal] = useState(
    props.value ? conformValue(props.value) : ""
  );
  ref = useRef(ref);

  function handleInputFocus(event) {
    if (props.required) props.setLastValue(event.target.value);
    setIsFocused(true);
    setFormattedVal("");
    if (props.onFocus) props.onFocus(event);
  }

  function handleInputBlur(event) {
    if (props.lastValue !== props.value) {
      if (props.required) {
        props.setValue(props.lastValue);
        setFormattedVal(conformValue(props.lastValue));
      }
      if (props.onBlur) {
        props.onBlur({
          target: {
            name: props.name,
            value: props.lastValue,
          },
        });
      }
    } else {
      setFormattedVal(conformValue(event.target.value));
      if (props.onBlur) props.onBlur(event);
    }

    setIsFocused(false);
  }

  function handleKeyDown(event) {
    const key = event.keyCode;

    if (event.shiftKey) {
      if ((key >= 48 && key <= 57) || key === 192) {
        event.preventDefault();
      }
    }
    if (
      !(key >= 48 && key <= 57) &&
      !(key >= 65 && key <= 90) &&
      !(key >= 96 && key <= 105) &&
      key !== 8 &&
      key !== 9 &&
      key !== 37 &&
      key !== 39
    ) {
      event.preventDefault();
    }

    if (props.onKeyDown) props.onKeyDown(event);
  }

  function handleOnPaste(event) {
    if (!/[a-zA-Z0-9]/.test(event.clipboardData.getData("Text"))) {
      event.preventDefault();
    }
    if (props.onPaste) props.onPaste(event);
  }

  function handleOnChange(event) {
    if (props.onChange) props.onChange(event);
  }

  //Clear input value on focus
  const handleMaskFocus = () => {
    if (ref) ref.current.focus();
  };

  return (
    <>
      <div
        className={cx(
          styles.container,
          props.containerClass,
          props.instructionalText ? styles.hasInstructionalText : ""
        )}
      >
        <label
          className={cx(styles.label, props.labelClass, {
            [styles.focused]: props.value || props.value === 0 || isFocused,
          })}
          htmlFor={props.id}
        >
          {props.label} {!props.required && "(Optional)"}
        </label>
        <div className={styles.inputWrapper}>
          {props.prefixAddon}
          <input
            className={cx(styles.input, props.inputClass, {
              [styles.focused]: isFocused,
              [styles.error]: props.error,
            })}
            data-testid={`${props.id}-input`}
            id={props.id}
            maxLength={props.maxLength}
            name={props.name}
            onBlur={handleInputBlur}
            onChange={handleOnChange}
            onClick={props.onClick}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onKeyUp={props.onKeyUp}
            onPaste={handleOnPaste}
            ref={ref}
            type={props.type}
            value={props.value}
          />
          {props.suffixAddon}
          {formattedVal && (
            <span
              className={styles.root}
              onFocus={handleMaskFocus}
              tabIndex="-1"
            >
              {formattedVal}
            </span>
          )}
        </div>
        {props.tooltipContent && (
          <Tooltip
            buttonStyle={BUTTON_TYPES.TOOLTIP}
            trigger={props.tooltipTrigger}
          >
            {props.tooltipContent}
          </Tooltip>
        )}
        {props.error && <ErrorIcon className={styles.errorIcon} />}
      </div>
      {props.error && <InputError target={props.id} error={props.error} />}
      {props.instructionalText && (
        <span className={styles.instructionalText}>
          {props.instructionalText}
        </span>
      )}
    </>
  );
});

AccountInput.propTypes = {
  /** CSS class applied to input wrapper div */
  containerClass: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** HTML ID */
  id: PropTypes.string.isRequired,

  /** CSS class applied to input */
  inputClass: PropTypes.string,

  /** Helper Text that displays under the input */
  instructionalText: PropTypes.string,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** CSS class applied to input label*/
  labelClass: PropTypes.string,

  /** holds last entered value */
  lastValue: PropTypes.string.isRequired,

  /** Input max length */
  maxLength: PropTypes.number,

  /** Input name */
  name: PropTypes.string.isRequired,

  /** Function called upon blur of the input. This is called in addition to the native onBlur. */
  onBlur: PropTypes.func,

  /** Function called when the input's value changes. This is called in addition to the native onChange. */
  onChange: PropTypes.func.isRequired,

  /** Function called onClick. This is called in addition to the native onClick. */
  onClick: PropTypes.func,

  /** Function called upon focus of the input */
  onFocus: PropTypes.func,

  /** Function called onKeyDown. This is called in addition to the native onKeyDown. */
  onKeyDown: PropTypes.func,

  /** Function called onKeyUp. This is called in addition to the native onKeyUp. */
  onKeyUp: PropTypes.func,

  /** Function called on paste of the input */
  onPaste: PropTypes.func,

  /** A component that's displayed before the input tag. Can be used for icons or buttons. */
  prefixAddon: PropTypes.node,

  /** Set to true to hide the word "(optional)" in label */
  required: PropTypes.bool,

  /** Saves last entered value for comparison  */
  setLastValue: PropTypes.func.isRequired,

  /** Function to set entered value */
  setValue: PropTypes.func.isRequired,

  /** A component that's displayed right after the input tag. Can be used for icons or buttons. */
  suffixAddon: PropTypes.node,

  /** Tooltip Contents */
  tooltipContent: PropTypes.element,

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Input type */
  type: PropTypes.oneOf(["text", "email", "number", "tel"]),

  /** Input value */
  value: PropTypes.string.isRequired,
};

AccountInput.defaultProps = {
  required: false,
  type: "text",
};

export default AccountInput;

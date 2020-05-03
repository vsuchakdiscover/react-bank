import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../TextInput/TextInput.module.scss";
import InputError from "../InputError";
import InputHelp from "../InputHelp";
import ErrorIcon from "../../Icons/ErrorIcon";
import Tooltip from "../../Tooltip";
import { BUTTON_TYPES } from "../../Button";
import cx from "classnames";
import MaskedInput from "react-text-mask";

const MaskedTextInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  function onFocus(event) {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(event);
  }

  function onBlur(event) {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(event);
  }

  return (
    <>
      {props.labelAboveInput && (
        <label
          className={cx(styles.labelAboveInput, props.labelClass)}
          htmlFor={props.id}
        >
          {props.label} {!props.required && "(Optional)"}
        </label>
      )}
      <div
        className={cx(styles.container, props.containerClass, {
          [styles.hasLabelAbove]: props.labelAboveInput,
        })}
      >
        {!props.labelAboveInput && (
          <label
            aria-label={props["aria-label"]}
            className={cx(styles.label, props.labelClass, {
              [styles.focused]:
                (props.value && props.value.length > 0) || isFocused,
            })}
            htmlFor={props.id}
          >
            {props.label} {!props.required && "(Optional)"}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <MaskedInput
            aria-invalid={props.error ? "true" : "false"}
            aria-errormessage={props.id + "-error"}
            className={cx(styles.input, props.inputClass, {
              [styles.focused]: isFocused,
              [styles.error]: props.error,
            })}
            guide={props.guide}
            id={props.id}
            mask={props.mask}
            name={props.name}
            onBlur={onBlur}
            onChange={props.onChange}
            onFocus={onFocus}
            placeholderChar={props.placeholderChar}
            type={props.type}
            value={props.value}
          />
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
      {props.helpText && <InputHelp>{props.helpText}</InputHelp>}
    </>
  );
};

MaskedTextInput.propTypes = {
  /** Alternative label for a11y */
  "aria-label": PropTypes.string,

  /** CSS class applied to input wrapper div */
  containerClass: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** Help text or element(s) to display below the input */
  helpText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /** When guide is true, mask will always shows both placeholder characters and non-placeholder mask characters. */
  guide: PropTypes.bool,

  /** HTML ID */
  id: PropTypes.string.isRequired,

  /** CSS class applied to input */
  inputClass: PropTypes.string,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** CSS class applied to input label*/
  labelClass: PropTypes.string,

  /** Set to true if label should be placed above input instead of inside input - useful for long label names */
  labelAboveInput: PropTypes.bool,

  /** Mask applied to input */
  mask: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.bool])
    .isRequired,

  /** Input name */
  name: PropTypes.string.isRequired,

  /** Function called upon blur of the input. This is called in addition to the native onBlur. */
  onBlur: PropTypes.func,

  /** Function called when the input's value changes. This is called in addition to the native onChange. */
  onChange: PropTypes.func.isRequired,

  /** Function called upon focus of the input */
  onFocus: PropTypes.func,

  /** The placeholder character represents the fillable spot in the mask. */
  placeholderChar: PropTypes.string,

  /** Set to true to hide the word "(optional)" in label */
  required: PropTypes.bool,

  /** Tooltip Contents */
  tooltipContent: PropTypes.element,

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Input type - NOTE: email and number type not supported by react-text-mask. */
  type: PropTypes.oneOf(["text", "tel", "url", "password", "search"]),

  /** Input value */
  value: PropTypes.string.isRequired,
};

MaskedTextInput.defaultProps = {
  labelAboveInput: false,
  placeholderChar: " ",
  required: false,
  type: "text",
};

export default MaskedTextInput;

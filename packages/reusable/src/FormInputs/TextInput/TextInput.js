import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import InputError from "../InputError";
import InputHelp from "../InputHelp";
import ErrorIcon from "../../Icons/ErrorIcon";
import Tooltip from "../../Tooltip";
import { BUTTON_TYPES } from "../../Button";
import styles from "./TextInput.module.scss";

const TextInput = React.forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(props.isFocused);

  function handleInputFocus(event) {
    !props.manualFocus && setIsFocused(true);
    if (props.onFocus) props.onFocus(event);
  }

  function handleInputBlur(event) {
    !props.manualFocus && setIsFocused(false);
    if (props.onBlur) props.onBlur(event);
  }

  useEffect(() => setIsFocused(props.isFocused), [props.isFocused]);

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
        <div className={styles.inputWrapper}>
          {props.prefixAddon}
          <input
            aria-label={props["aria-label"]}
            aria-invalid={props.error ? "true" : "false"}
            aria-errormessage={props.id + "-error"}
            autoComplete={props.autoComplete}
            className={cx(styles.input, props.inputClass, {
              [styles.focused]: isFocused,
              [styles.error]: props.error,
            })}
            data-testid={`${props.id}-input`}
            id={props.id}
            maxLength={props.maxLength}
            name={props.name}
            onBlur={handleInputBlur}
            onChange={props.onChange}
            onClick={props.onClick}
            onFocus={handleInputFocus}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            placeholder={
              isFocused && props.placeholder ? props.placeholder : undefined
            }
            ref={ref}
            type={props.type}
            value={props.value}
          />
          {props.suffixAddon}
        </div>
        {props.tooltipContent && (
          <Tooltip
            buttonStyle={BUTTON_TYPES.TOOLTIP}
            trigger={props.tooltipTrigger}
          >
            {props.tooltipContent}
          </Tooltip>
        )}

        {!props.labelAboveInput && (
          <label
            className={cx(styles.label, props.labelClass, {
              [styles.focused]: props.value || props.value === 0 || isFocused,
            })}
            htmlFor={props.id}
          >
            {props.label} {!props.required && "(Optional)"}
          </label>
        )}
        {props.error && <ErrorIcon className={styles.errorIcon} />}
      </div>
      {props.error && <InputError target={props.id} error={props.error} />}
      {props.helpText && <InputHelp>{props.helpText}</InputHelp>}
    </>
  );
});

TextInput.propTypes = {
  /** Optional aria-label to apply to the input */
  "aria-label": PropTypes.string,

  /** The autocomplete attribute specifies whether or not an input field should have autocomplete enabled. */
  autoComplete: PropTypes.oneOf(["on", "off"]),

  /** CSS class applied to input wrapper div */
  containerClass: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** Help text or element(s) to display below the input */
  helpText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /** HTML ID */
  id: PropTypes.string.isRequired,

  /** CSS class applied to input */
  inputClass: PropTypes.string,

  /** Set to true if input should get a focus by default */
  isFocused: PropTypes.bool,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** CSS class applied to input label*/
  labelClass: PropTypes.string,

  /** Set to true if label should be placed above input instead of inside input - useful for long label names */
  labelAboveInput: PropTypes.bool,

  /** Set to "true" if input focus should be managed manually */
  manualFocus: PropTypes.bool,

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

  /** An input placeholder text */
  placeholder: PropTypes.string,

  /** A component that's displayed before the input tag. Can be used for icons or buttons. */
  prefixAddon: PropTypes.node,

  /** Set to true to hide the word "(optional)" in label */
  required: PropTypes.bool,

  /** A component that's displayed right after the input tag. Can be used for icons or buttons. */
  suffixAddon: PropTypes.node,

  /** Tooltip Contents */
  tooltipContent: PropTypes.element,

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Input type */
  type: PropTypes.oneOf(["text", "email", "number", "tel", "password"]),

  /** Input value */
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  autocomplete: "on",
  isFocused: false,
  labelAboveInput: false,
  manualFocus: false,
  required: false,
  type: "text",
};

TextInput.displayName = "TextInput";

export default TextInput;

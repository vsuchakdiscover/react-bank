import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectInput.module.scss";
import InputError from "../InputError";
import ErrorIcon from "../../Icons/ErrorIcon";
import ChevronDownIcon from "../../Icons/ChevronDownIcon";
import PropTypes from "prop-types";
import cx from "classnames";
import Tooltip from "../../Tooltip";
import { BUTTON_TYPES } from "../../Button";

const SelectInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPleaseSelect, setShowPleaseSelect] = useState(false);
  const [showEmptyOption, setShowEmptyOption] = useState(
    props.disableEmptyOptions
  );
  const [displayFloatingLabel, setDisplayFloatingLabel] = useState(
    props.value !== ""
  );
  const selectEl = useRef();

  useEffect(() => {
    const select = selectEl.current;
    const selectEvents = ["mousedown", "keydown"];

    const handleSelectEvents = (e) => {
      const eventType = e.type;

      switch (eventType) {
        case "mousedown":
          if (props.disableEmptyOptions) {
            setShowEmptyOption(false);
          } else {
            setShowPleaseSelect(true);
          }
          break;
        case "keydown":
          if (e.keyCode === 32) {
            setShowPleaseSelect(true);
          }
          break;
        default:
          break;
      }
    };

    for (let i in selectEvents) {
      select.addEventListener(selectEvents[i], handleSelectEvents);
    }

    return () => {
      for (let i in selectEvents) {
        select.removeEventListener(selectEvents[i], handleSelectEvents);
      }
    };
  }, [props.disableEmptyOptions]);

  function handleInputFocus(event) {
    setIsFocused(true);
    if (props.disableEmptyOptions) {
      setShowEmptyOption(false);
      setDisplayFloatingLabel(true);
    }
    if (props.onFocus) props.onFocus(event);
  }

  function handleInputBlur(event) {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(event);
  }

  function handleOnChange(event) {
    if (event.target.value === "" && !props.disableEmptyOptions)
      setShowPleaseSelect(false);
    if (event.target.value !== "") {
      setDisplayFloatingLabel(true);
    } else {
      setDisplayFloatingLabel(false);
    }
    props.setValue(event.target.value);
    if (props.onChange) props.onChange(event);
  }

  return (
    <>
      <div
        className={cx(styles.container, props.containerClass, {
          [styles.error]: props.error,
        })}
      >
        <label
          className={cx({
            [styles.label]: true,
            [props.labelClass]: true,
            [styles.hasSelectedValue]: displayFloatingLabel,
          })}
          htmlFor={props.id}
        >
          {props.label} {!props.required && "(Optional)"}
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={cx(styles.input, props.inputClass, {
              [styles.focused]: isFocused,
              [styles.error]: props.error,
              [styles.visibleText]:
                displayFloatingLabel || props.disableEmptyOptions,
            })}
            id={props.id}
            name={props.name}
            onBlur={handleInputBlur}
            onChange={handleOnChange}
            onFocus={handleInputFocus}
            ref={selectEl}
            value={props.value}
          >
            {!props.disableEmptyOptions && (
              <option key={""} value={""}>
                {showPleaseSelect ? "Please Select" : ""}
              </option>
            )}

            {props.disableEmptyOptions && showEmptyOption && (
              <option key={""} value={""}>
                {showEmptyOption ? "" : ""}
              </option>
            )}

            {props.options.map((option) => {
              // Since options can be an array of strings, number,
              // or an array of objects, must set label accordingly first.
              const label = option.label || option;
              const value = option.value || option;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className={styles.chevron} />
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
        {props.error && <ErrorIcon className={styles.errorIcon} />}
      </div>
      {props.error && <InputError target={props.id} error={props.error} />}
    </>
  );
};

SelectInput.propTypes = {
  /** CSS class to apply to root wrapper div */
  className: PropTypes.string,

  /** CSS class applied to input wrapper div */
  containerClass: PropTypes.string,

  /** Disable empty options */
  disableEmptyOptions: PropTypes.bool,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** HTML ID */
  id: PropTypes.string.isRequired,

  /** CSS class applied to input */
  inputClass: PropTypes.string,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** CSS class applied to input label*/
  labelClass: PropTypes.string,

  /** Input name */
  name: PropTypes.string.isRequired,

  /** Function called onBlur. This is called in addition to the native onBlur. */
  onBlur: PropTypes.func,

  /** Function called onChange */
  onChange: PropTypes.func,

  /** Function called onBlur. This is called in addition to the native onBlur. */
  onFocus: PropTypes.func,

  /** Array of options. Accepts an array of strings or an array of objects. */
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      })
    ),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
  ]),

  /** Field is labeled as required when true */
  required: PropTypes.bool,

  /** Section number - Used to derive this input's unique ID using the input's name + section number. Optional since some forms don't allow an array of responses. In those cases, the id is set to the name. */
  sectionNumber: PropTypes.number,

  /** Sets the value state of the select input */
  setValue: PropTypes.func.isRequired,

  /** A component that's displayed to the right of the input. Can be used for icons or buttons. */
  suffixAddon: PropTypes.node,

  /** Tooltip Contents */
  tooltipContent: PropTypes.element,

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SelectInput.defaultProps = {
  disableEmptyOptions: false,
  required: false,
};

export default SelectInput;

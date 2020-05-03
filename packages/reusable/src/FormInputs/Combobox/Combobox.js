import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import InputError from "../InputError";
import InputHelp from "../InputHelp";
import { useSelect } from "downshift";
import ErrorIcon from "../../Icons/ErrorIcon";
import ChevronDownIcon from "../../Icons/ChevronDownIcon";
import Tooltip from "../../Tooltip";
import { BUTTON_TYPES } from "../../Button";
import styles from "./Combobox.module.scss";

export const TRUNCATE_TYPES = {
  ACCOUNT_LAST_FOUR: "accountLastFour",
};

const Combobox = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [menuDimensions, setMenuDimensions] = useState({ width: "100%" });
  const [value, setValue] = useState(props.value);
  const toggleButton = useRef(null);
  const isMounted = useRef(false);

  const {
    isOpen,
    selectedItem,
    setHighlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    hideOptionalLabelText,
  } = useSelect({
    items: props.options,
    onSelectedItemChange: handleSelectedItemChange,
    selectedItem: value,
    ...props,
  });

  function handleOnFocus(event) {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(event);
  }

  // Leveraged code from https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
  function handleOnBlur(event) {
    event.persist();
    const inputValue =
      typeof selectedItem === "object" ? selectedItem.value : selectedItem;
    const currentTarget = event.currentTarget;
    // Must use setTimeout to delay otherwise activeElement will report <body>
    setTimeout(function () {
      if (!currentTarget.contains(document.activeElement)) {
        if (isMounted.current) setIsFocused(false);
        if (props.onBlur)
          props.onBlur({ target: { name: props.name, value: inputValue } });
      }
    }, 0);
  }

  function handleSelectedItemChange(changes) {
    // Get input value based on shape
    let inputValue =
      typeof changes.selectedItem === "object"
        ? changes.selectedItem.value
        : changes.selectedItem;

    // Was the 'Please Select' option chosen?
    const isPleaseSelect =
      inputValue === "Please Select" || inputValue === "" ? true : false;

    if (isPleaseSelect) {
      if (isMounted.current) setValue("");
      inputValue = "";
    } else {
      if (isMounted.current) setValue(changes.selectedItem);
    }
    // Simulate the shape of a native select event & pass to onChange
    if (props.onChange)
      props.onChange({
        target: { name: props.name, value: inputValue },
      });
  }

  function getTruncatedText(val) {
    switch (props.truncateType) {
      // If the value includes an account number we need to truncate - and always show account number
      case TRUNCATE_TYPES.ACCOUNT_LAST_FOUR:
        // Regex looking for (1234) pattern in provided string
        const lastFour = val.match(/\(([0-9]{4})\)/g);
        if (lastFour) {
          const withoutAccountNumber = val.substring(0, val.length - 6);
          return (
            <div data-testid="combobox-truncated-value">
              <span
                className={cx(styles.truncatedBlock, {
                  [styles.isError]: props.error,
                })}
              >
                {withoutAccountNumber}
              </span>
              <span className={styles.visibleBlock}>{lastFour}</span>
            </div>
          );
        } else {
          return val;
        }
      // Default when truncateType is set to false
      default:
        return val;
    }
  }

  // Track isMounted to avoid calling setState when unmounted.
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  });

  // When props.value changes, update the value stored in state
  useEffect(() => {
    if (isMounted.current) setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.value) {
      const matchedOption = props.options.find((option) => {
        return typeof option === "object"
          ? option.value === props.value
          : option === props.value;
      });
      if (isMounted.current) setValue(matchedOption);
    }
  }, [props.options, props.value]);

  // Set the width of the dropdown menu to match the toggleButton
  useLayoutEffect(() => {
    if (isOpen && isMounted.current) {
      setMenuDimensions({
        width: toggleButton.current.offsetWidth,
      });
    }
  }, [isOpen]);
  return (
    <>
      <div
        className={cx(styles.container, props.containerClassName)}
        onBlur={handleOnBlur}
      >
        <label
          {...getLabelProps()}
          className={cx(styles.label, {
            [styles.isFocused]: selectedItem,
            [styles.isHidden]: !props.showLabel,
          })}
        >
          {props.label}
          {!props.required && !props.hideOptionalLabelText && "(Optional)"}
        </label>
        <button
          {...getToggleButtonProps({
            ref: (e) => {
              toggleButton.current = e;
            },
            name: props.name,
            type: "button",
            onFocus: handleOnFocus,
          })}
          className={cx(styles.dropdown, props.dropdownClassName, {
            [styles.error]: props.error,
            [styles.isFocused]: isFocused || isOpen,
            [styles.noLabel]: !props.showLabel,
          })}
        >
          <ChevronDownIcon
            className={cx(styles.chevron, {
              [styles.isOpen]: isOpen,
            })}
            size={9}
          />
          {selectedItem
            ? getTruncatedText(props.itemToString(selectedItem))
            : ""}
          {props.suffixAddon}
        </button>
        <ul
          {...getMenuProps({ onMouseLeave: () => setHighlightedIndex(-1) })}
          className={cx(styles.menu, props.menuClassName, {
            [styles.isOpen]: isOpen,
            [styles.error]: props.error,
          })}
          style={{ width: menuDimensions.width }}
        >
          {isOpen &&
            props.options.map((option, index) => (
              <li
                className={
                  highlightedIndex === index
                    ? cx(styles.hover, props.hoverItemClassName)
                    : undefined
                }
                key={`${index}`}
                {...getItemProps({ item: option, index })}
              >
                {props.itemToString(option)}
              </li>
            ))}
        </ul>
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
      {props.error && <InputError error={props.error} />}
      {props.helpText && <InputHelp>{props.helpText}</InputHelp>}
    </>
  );
};

Combobox.propTypes = {
  /** Class to override container styles */
  containerClassName: PropTypes.string,

  /** Class to override dropdown styles */
  dropdownClassName: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** Help text or element(s) to display below the input */
  helpText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /** Class to override hovered/focused item styles */
  hoverItemClassName: PropTypes.string,

  /** Used to generate the first part of the Downshift id on the elements. Uses @reach/auto-id by default.  */
  id: PropTypes.string,

  /** Used to determine the string value for the selected item */
  itemToString: PropTypes.func,

  /** Text for floating label inside of input */
  label: PropTypes.string,

  /** Class to override menu styles */
  menuClassName: PropTypes.string,

  /** Hidden input name */
  name: PropTypes.string.isRequired,

  /** Function called on blur of input */
  onBlur: PropTypes.func,

  /** Called when the selected item changes */
  onChange: PropTypes.func,

  /** Function called on input focus */
  onFocus: PropTypes.func,

  /** Array of options. Accepts an array of strings or an array of objects. */
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.any.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      })
    ),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
  ]),

  /** Field is labeled as required when true */
  required: PropTypes.bool,

  /** Set to "false" to hide the label  */
  showLabel: PropTypes.bool,

  /** Tooltip Contents */
  suffixAddon: PropTypes.node,

  /** A component that's displayed to the right of the input. Can be used for icons or buttons. */
  tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Use to modify the selected value text - Set to false to turn off or when using a React.Fragment */
  truncateType: PropTypes.oneOf([TRUNCATE_TYPES.ACCOUNT_LAST_FOUR, false]),

  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Hide the "(Optional)" Label text */
  hideOptionalLabelText: PropTypes.bool,
};

Combobox.defaultProps = {
  // Default itemToString supports flat array of strings or key/value pair objects
  itemToString: (item) => {
    return typeof item === "object" ? item.label : item;
  },
  showLabel: true,
  truncateType: TRUNCATE_TYPES.ACCOUNT_LAST_FOUR,
  value: "",
};

export default Combobox;

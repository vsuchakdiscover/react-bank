import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import InputError from "../InputError";
import InputHelp from "../InputHelp";
import { useSelect } from "downshift";

import Button, { BUTTON_TYPES } from "../../Button";
import ErrorIcon from "../../Icons/ErrorIcon";
import ChevronDownIcon from "../../Icons/ChevronDownIcon";
import Checkbox from "../Checkbox";
import Tooltip from "../../Tooltip";

import styles from "./Combobox.module.scss";

const MultiSelectCombobox = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [menuDimensions, setMenuDimensions] = useState({ width: "100%" });
  const toggleButton = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const selectedItemsAsOptions = getValueAsOptions(selectedItems);
  const selectedAllItems = props.options.length === selectedItems.length;

  const options = [
    { label: props.selectAllText, value: "__SELECT_ALL__" },
    ...props.options,
  ];

  const {
    isOpen,
    selectedItem,
    setHighlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: options,
    onSelectedItemChange: handleSelectedItemChange,
    selectedItem: selectedItems,
    stateReducer,
    ...props,
  });

  function stateReducer(state, actionAndChanges) {
    // this prevents the menu from being closed when the user selects an item with 'Enter' or mouse
    switch (actionAndChanges.type) {
      case useSelect.stateChangeTypes.MenuKeyDownEnter:
      case useSelect.stateChangeTypes.ItemClick:
        return {
          ...actionAndChanges.changes, // default Downshift new state changes on item selection.
          isOpen: state.isOpen, // keep menu open.
          highlightedIndex: state.highlightedIndex, // with the item highlighted.
        };
      default:
        return actionAndChanges.changes; // otherwise business as usual.
    }
  }

  function handleSelectAllItems() {
    const newSelectedItems = selectedAllItems
      ? []
      : props.options.map((o) => (o.value ? o.value : o));

    if (props.onChange) {
      props.onChange({
        target: { name: props.name, value: newSelectedItems },
      });
    }
  }

  function handleOnFocus(event) {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(event);
  }

  // Leveraged code from https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
  function handleOnBlur(event) {
    event.persist();
    const currentTarget = event.currentTarget;
    // Must use setTimeout to delay otherwise activeElement will report <body>
    setTimeout(function () {
      if (!currentTarget.contains(document.activeElement)) {
        setIsFocused(false);
        if (props.onBlur)
          props.onBlur({
            target: { name: props.name, value: selectedItems },
          });
      }
    }, 0);
  }

  function handleSelectedItemChange({ selectedItem: { value } }) {
    const selectAllIsClicked = value === "__SELECT_ALL__";
    if (selectAllIsClicked) {
      return handleSelectAllItems();
    }

    const newSelectedItems = [...selectedItems];

    const valueWasPreviouslySelected = selectedItems.includes(value);
    if (valueWasPreviouslySelected) {
      // We remove value if it was previously selected.
      newSelectedItems.splice(selectedItems.indexOf(value), 1);
    } else {
      // We add value when it wasn't previously selected.
      newSelectedItems.push(value);
    }

    if (props.onChange) {
      props.onChange({
        target: { name: props.name, value: newSelectedItems },
      });
    }
  }

  function getOptionByValue(value) {
    return props.options.find((o) => o.value === value);
  }

  function getValueAsOptions(value) {
    return value.map((v) => {
      const options = getOptionByValue(v);
      return options ? options : { value: v, label: v };
    });
  }

  useEffect(() => {
    // Handle reset
    setSelectedItems(props.value ? props.value : []);
  }, [props.options, props.value]);

  // Set the width of the dropdown menu to match the toggleButton
  useLayoutEffect(() => {
    if (isOpen) {
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
            [styles.isFocused]: selectedItem.length,
            [styles.isHidden]: !props.showLabel,
          })}
        >
          {props.label} {!props.required && "(Optional)"}
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
          <div className={styles.selectedItemsText}>
            {selectedItemsAsOptions.map((o) => o.label).join(", ")}
          </div>

          <ChevronDownIcon
            className={cx(styles.chevron, {
              [styles.isOpen]: isOpen,
            })}
          />
          {selectedItem ? props.itemToString(selectedItem) : ""}
          {props.suffixAddon}
        </button>
        <ul
          {...getMenuProps({
            // Prevents unwanted item from being selected on click outside of dropdown
            onMouseLeave: () => setHighlightedIndex(-1),
          })}
          className={cx(styles.menu, styles.menuClassName, {
            [styles.isOpen]: isOpen,
            [styles.error]: props.error,
          })}
          style={{ width: menuDimensions.width }}
        >
          {isOpen &&
            options.map((option, index) => (
              <React.Fragment key={index}>
                {index === 0 && (
                  <li
                    className={
                      highlightedIndex === index
                        ? cx(styles.hoverSelectAll)
                        : undefined
                    }
                    key={`${index}`}
                    {...getItemProps({ item: option, index })}
                  >
                    <Button buttonStyle={BUTTON_TYPES.LINK}>
                      {selectedAllItems
                        ? props.unselectAllText
                        : props.selectAllText}
                    </Button>
                    <span className={styles.focusBlocker}></span>
                  </li>
                )}
                {index > 0 && (
                  <li
                    className={
                      highlightedIndex === index
                        ? cx(styles.hover, props.hoverItemClassName)
                        : undefined
                    }
                    key={`${index}`}
                    {...getItemProps({ item: option, index })}
                  >
                    <Checkbox
                      checked={selectedItems.includes(
                        option.value ? option.value : option
                      )}
                      id={props.itemToString(option)}
                      name={props.itemToString(option)}
                      value={props.itemToString(option)}
                    >
                      {props.itemToString(option)}
                    </Checkbox>
                    <span className={styles.focusBlocker}></span>
                  </li>
                )}
              </React.Fragment>
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

      {props.helpText && <InputHelp>{props.helpText}</InputHelp>}
      {props.error && <InputError error={props.error} />}
    </>
  );
};

MultiSelectCombobox.defaultProps = {
  // Default itemToString supports flat array of strings or key/value pair objects
  itemToString: (item) => {
    return typeof item === "object" ? item.label : item;
  },
  selectAllText: "Select all items",
  showLabel: true,
  unselectAllText: "Unselect all items",
  value: "",
};

MultiSelectCombobox.propTypes = {
  /** Class to override container styles */
  containerClassName: PropTypes.string,

  /** Class to override dropdown styles */
  dropdownClassName: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** Class to override hovered/focused item styles */
  hoverItemClassName: PropTypes.string,

  /** A help text that's displayed below the input */
  helpText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),

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

  /** Array of items supplied to the dropdown menu list */
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      })
    ).isRequired,
  ]),

  /** Field is labeled as required when true */
  required: PropTypes.bool,

  /** A label for the "select all" option */
  selectAllText: PropTypes.string,

  /** Set to "false" to hide the label  */
  showLabel: PropTypes.bool,

  /** Tooltip Contents */
  suffixAddon: PropTypes.node,

  /** A component that's displayed to the right of the input. Can be used for icons or buttons. */
  tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** A label for the "Unselect all" option */
  unselectAllText: PropTypes.string,

  /** Input value */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
};

export default MultiSelectCombobox;

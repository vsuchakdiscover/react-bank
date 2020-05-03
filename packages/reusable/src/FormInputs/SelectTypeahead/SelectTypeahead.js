import React from "react";
import PropTypes from "prop-types";
import styles from "./Typeahead.module.scss";
import Downshift from "downshift";
import cx from "classnames";

const SelectTypeahead = ({
  itemToString,
  labelClassName,
  onChange,
  onStateChange,
  selectItemClassName,
  selectWrapperClassName,
  labelPlaceholder,
  minInputLength,
  inputPlaceholder,
  notFoundText,
  id,
  items = [],
}) => {
  return (
    <Downshift
      id={id}
      itemToString={itemToString}
      onChange={onChange}
      onStateChange={onStateChange}
    >
      {({
        getLabelProps,
        getInputProps,
        getMenuProps,
        getItemProps,
        inputValue,
        highlightedIndex,
        isOpen,
      }) => (
        <div className={cx(styles.selectWrapper, selectWrapperClassName)}>
          <div>
            <label className={labelClassName} {...getLabelProps()} required>
              {labelPlaceholder}
            </label>
            <input
              {...getInputProps()}
              className={styles.selectInput}
              placeholder={inputPlaceholder}
            />
          </div>
          <ul
            {...getMenuProps()}
            className={cx(styles.selectDropdown, {
              [styles.isOpen]: isOpen && inputValue.length >= minInputLength,
            })}
          >
            {!isOpen ||
            inputValue.length < minInputLength ? null : items.length < 1 ? (
              <li className={styles.selectItem}>{notFoundText}</li>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  {...getItemProps({
                    item,
                  })}
                  className={cx(styles.selectItem, selectItemClassName, {
                    [styles.highlighted]: highlightedIndex === index,
                  })}
                >
                  {itemToString(item)}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

SelectTypeahead.propTypes = {
  /** Set the id - Defaults to a generated id */
  id: PropTypes.string,

  /** Input placeholder text */
  inputPlaceholder: PropTypes.string,

  /** Used to determine the string value for the selected item (which is used to compute the inputValue) */
  itemToString: PropTypes.func.isRequired,

  /** Array of items to query search against */
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /** Class to override label styles */
  labelClassName: PropTypes.node,

  /** Label placeholder text */
  labelPlaceholder: PropTypes.string,

  /** minLength of input before search query takes place */
  minInputLength: PropTypes.number,

  /** Text to display when search returns 0 results */
  notFoundText: PropTypes.node,

  /** Called when the selected item changes, either by the user selecting an item or the user clearing the selection */
  onChange: PropTypes.func.isRequired,

  /** This function is called any time the internal state changes */
  onStateChange: PropTypes.func.isRequired,

  /** Class to override list item styles */
  selectItemClassName: PropTypes.node,

  /** Class to override select wrapper styles */
  selectWrapperClassName: PropTypes.node,
};

SelectTypeahead.defaultProps = {
  minInputLength: 1,
  notFoundText: "Not found",
};

export default SelectTypeahead;

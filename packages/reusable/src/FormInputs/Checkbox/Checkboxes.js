import React from "react";
import PropTypes from "prop-types";

import cx from "classnames";
import styles from "./Checkboxes.module.scss";
import Checkbox from "./Checkbox";
import InputError from "../InputError/InputError";
import Button from "../../Button";
import { BUTTON_TYPES } from "../../Button/Button";

function Checkboxes({
  childClassName,
  className,
  disabled,
  error,
  label,
  labelVisible,
  name,
  id,
  onChange,
  options,
  showSelectAll,
  value,
}) {
  const values = value;
  const selectedAllItems =
    values.length > 0 && options.length === values.length;

  function handleChange(e) {
    const inputValue = e.target.value;
    const newValues = [...values];

    const valueWasPreviouslySelected = newValues.includes(inputValue);
    if (valueWasPreviouslySelected) {
      // We remove value if it was previously selected.
      newValues.splice(values.indexOf(inputValue), 1);
    } else {
      // We add value when it wasn't previously selected.
      newValues.push(inputValue);
    }

    sendOnChange(name, newValues);
  }

  function handleSelectAll(e) {
    e.preventDefault();
    sendOnChange(
      name,
      selectedAllItems ? [] : options.map((o) => (o.value ? o.value : o))
    );
  }

  function sendOnChange(name, value) {
    onChange && onChange({ target: { name, value } });
  }

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.labelWrapper}>
        <label className={!labelVisible ? "sr-only" : ""}>{label}</label>
        {showSelectAll && options.length > 1 && (
          <Button buttonStyle={BUTTON_TYPES.LINK} onClick={handleSelectAll}>
            {selectedAllItems ? "Unselect all" : "Select all"}
          </Button>
        )}
      </div>
      <div id={id} className={styles.checkboxesWrapper}>
        {options.map((o, index) => (
          <div
            className={cx(styles.checkboxWrapper, childClassName)}
            key={index}
          >
            <Checkbox
              checked={values.includes(o.value)}
              disabled={disabled}
              id={`${name}--${index}`}
              name={name}
              onChange={handleChange}
              value={o.value}
            >
              {o.label}
            </Checkbox>
          </div>
        ))}
      </div>
      {error && <InputError target={id} error={error} />}
    </div>
  );
}

Checkboxes.defaultProps = {
  labelVisible: true,
  showSelectAll: false,
  value: [],
};

Checkboxes.propTypes = {
  /** class to apply to each checkbox wrapper */
  childClassName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelVisible: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  showSelectAll: PropTypes.bool,
  value: PropTypes.array,
};

export default Checkboxes;

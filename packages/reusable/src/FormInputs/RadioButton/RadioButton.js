import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./RadioButton.module.scss";

export const RadioSubField = (props) => {
  return (
    <div className={cx(styles["radio-subfield"], props.className)}>
      {props.children}
    </div>
  );
};

RadioSubField.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

const RadioButton = ({
  id,
  name,
  className,
  label,
  checked,
  disabled,
  onChange,
  value,
  tooltip,
  ...props
}) => {
  const [isFocused, updateFocus] = useState(false);
  function toggleFocus() {
    updateFocus(!isFocused);
  }
  return (
    <>
      <label
        className={cx(
          styles["styled-radio"],
          className ? className : false,
          checked ? styles["checked"] : "",
          disabled ? styles["disabled"] : "",
          isFocused ? styles["focused"] : "",
          tooltip ? styles["withTooltip"] : ""
        )}
        htmlFor={id}
      >
        <input
          checked={checked}
          disabled={disabled}
          id={id}
          name={name}
          onChange={onChange}
          onFocus={toggleFocus}
          type="radio"
          value={value}
        />
        <span className={styles["labeltext"]}>{label}</span>
      </label>
      {tooltip ? <span className={styles.tooltip}>{tooltip}</span> : ""}
      {checked ? props.children : null}
    </>
  );
};

RadioButton.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  tooltip: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

RadioButton.defaultProps = {
  disabled: false,
};

export default RadioButton;

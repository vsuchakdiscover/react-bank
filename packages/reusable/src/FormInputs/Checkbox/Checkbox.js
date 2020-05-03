import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Checkbox.module.scss";
import ErrorIcon from "../../Icons/ErrorIcon";

// Using forwardRef so consumers can set input focus programmatically via ref.
const Checkbox = React.forwardRef(
  (
    {
      checked,
      children,
      disabled,
      error,
      id,
      labelClass,
      name,
      onChange,
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    function handleFocus() {
      setIsFocused(true);
      if (onFocus) onFocus();
    }

    function handleBlur(e) {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    }
    return (
      <div className={error ? styles.root : ""}>
        <label
          className={cx(
            {
              [styles.label]: true,
              [styles.checked]: checked,
              [styles.disabledLabel]: disabled,
              [styles.disabledCheckbox]: disabled,
              [styles.isFocused]: isFocused,
            },
            labelClass
          )}
          htmlFor={id}
        >
          <input
            className={styles.checkbox}
            defaultChecked={checked}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={handleBlur}
            onChange={onChange}
            onFocus={handleFocus}
            ref={ref}
            type="checkbox"
            value={value}
            {...props}
          />
          <span className={styles.labelText}>{children}</span>
          {error && <ErrorIcon className={styles.errorIcon} />}
        </label>

        {error && (
          <p className={cx(styles.errorMsg)}>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

// Set displayName for debugging purposes. Necessary since wrapped above.
Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  /** set to true to check the checkbox input */
  checked: PropTypes.bool,

  /** child text as label */
  children: PropTypes.any,

  /** sets the disabled styles and disabled attribute of the checkbox */
  disabled: PropTypes.bool,

  /** error to display below input. Error icon also displays when this is set. */
  error: PropTypes.string,

  /** needs a unique id for accessiblity */
  id: PropTypes.string.isRequired,

  /** class to apply to label*/
  labelClass: PropTypes.string,

  /** checkbox input name */
  name: PropTypes.string.isRequired,

  /** called onBlur */
  onBlur: PropTypes.func,

  /** function to call when the checkbox is checked/unchecked */
  onChange: PropTypes.func,

  /** called onFocus */
  onFocus: PropTypes.func,

  /** checkbox input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Checkbox.defaultProps = {
  checked: false,
  disabled: false,
};

export default Checkbox;

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./TouchPhoneNumber.module.scss";

const TouchPhoneNumber = ({ children, className }) => {
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.MaxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  if (isTouchDevice) {
    return (
      <a className={cx(styles.root, className)} href={`tel:${children}`}>
        {children}
      </a>
    );
  }
  return children;
};

TouchPhoneNumber.propTypes = {
  /** Phone number */
  children: PropTypes.string.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default TouchPhoneNumber;

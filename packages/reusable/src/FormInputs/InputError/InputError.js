import React from "react";
import PropTypes from "prop-types";
import styles from "./InputError.module.scss";

/** Displays error message below inputs */
const InputError = ({ error, target }) => {
  if (!error) return null;
  return (
    <div role="alert" id={target + "-error"} className={styles.error}>
      {error}
    </div>
  );
};

InputError.propTypes = {
  /** Error string to display above the input */
  error: PropTypes.string,

  /** Target input's ID (in other words, the ID of the input that the error is about) */
  target: PropTypes.string,
};

export default InputError;

/* eslint-disable jsx-a11y/label-has-for */
import React from "react";
import styles from "./Label.module.scss";
import { PropTypes } from "prop-types";

const Label = ({ htmlFor, children, required, sublabel }) => {
  return (
    <>
      <label className={styles.label} htmlFor={htmlFor}>
        <span className={styles.linkText}>{children}</span>{" "}
        {!required && <span className={styles.optional}>optional</span>}
        {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
      </label>
      <br />
    </>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string.isRequired,
  required: PropTypes.bool,
  sublabel: PropTypes.string,
};

Label.defaultProps = {
  required: false,
};

export default Label;

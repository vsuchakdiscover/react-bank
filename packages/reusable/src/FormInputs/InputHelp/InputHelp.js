import React from "react";
import PropTypes from "prop-types";
import styles from "./InputHelp.module.scss";

function InputHelp({ children }) {
  return <div className={styles.root}>{children}</div>;
}

InputHelp.propTypes = {
  /** Content of the help message */
  children: PropTypes.node.isRequired,
};

export default InputHelp;

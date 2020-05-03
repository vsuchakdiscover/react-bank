import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./H1.module.scss";

/** PageHeader */
const H1 = ({ children, className, ...props }) => (
  <h1 className={cx(styles.root, className)} {...props}>
    {children}
  </h1>
);

H1.propTypes = {
  /** Title text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.any,
};

export default H1;

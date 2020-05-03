import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./LinksList.module.scss";

export default function LinksList({ className, children }) {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.links}>{children}</div>
    </div>
  );
}

LinksList.propTypes = {
  /** Child elements -only anchors or buttons- to render inside button */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

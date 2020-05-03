import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./ButtonGroup.module.scss";

const ButtonGroup = ({ className, ...props }) => (
  <div className={cx(styles.root, className)} {...props}>
    {props.children}
  </div>
);

ButtonGroup.Link = ({ className, ...props }) => (
  <div className={cx(styles.buttonGroupLink, className)} {...props}>
    {props.children}
  </div>
);

ButtonGroup.Link.displayName = "ButtonGroup.Link";

ButtonGroup.propTypes = {
  /** Child elements to render inside button */
  children: PropTypes.any,

  /** Class to apply */
  className: PropTypes.string,
};

ButtonGroup.Link.propTypes = {
  /** Child elements to render inside button */
  children: PropTypes.any,

  /** Class to apply */
  className: PropTypes.string,
};

export default ButtonGroup;

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "../Button";
import PrintButton from "../Button/PrintButton";
import SmartLink from "../SmartLink";
import cx from "classnames";
import styles from "./DoNextLinks.module.scss";

const DoNextLinks = ({ header, showHeader, className, children, ...props }) => (
  <div className={cx(styles.root, className)} {...props}>
    {showHeader && <p>{header}</p>}
    <div className={styles.links}>{children}</div>
  </div>
);

DoNextLinks.propTypes = {
  /** Assure children are of valid type */
  checkChildren: function (props, propName, componentName) {
    let error = null;
    props.children.forEach(function (child) {
      if (
        child.type !== "a" &&
        child.type !== "button" &&
        child.type !== Button &&
        child.type !== Link &&
        child.type !== PrintButton &&
        child.type !== SmartLink &&
        child.type !== undefined
      ) {
        error = true;
      }
    });
    if (error) {
      return new Error(
        `Invalid prop ${propName} supplied to '${componentName}'. Validation failed.`
      );
    }
  },

  /** Child elements -only anchors or buttons- to render inside button */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,

  /** Header Text */
  header: PropTypes.string.isRequired,

  /** Set to false if header should be hidden */
  showHeader: PropTypes.bool,
};

DoNextLinks.defaultProps = {
  header: "What would you like to do next?",
  showHeader: true,
};

export default DoNextLinks;

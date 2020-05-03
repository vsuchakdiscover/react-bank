import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Headline.module.scss";

const elements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  div: "div",
  p: "p",
};

/** Header with swappable HTML Tag */
const Headline = ({ type, children, className, ...props }) =>
  React.createElement(
    elements[type],
    { className: cx(styles.root, className), ...props },
    children
  );

Headline.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,

  /** HTML Tag Type */
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "div", "p"]),
};

Headline.defaultProps = {
  type: "h2",
};

export default Headline;

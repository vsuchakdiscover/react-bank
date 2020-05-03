import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.scss";
import cx from "classnames";

function Card({ children, className, design }) {
  return (
    <div className={cx(styles.root, styles[design], className)}>{children}</div>
  );
}

Card.propTypes = {
  /** Specify the wrapper element */
  as: PropTypes.oneOf(["div", "li"]),

  /** Card content */
  children: PropTypes.any.isRequired,

  /** Class name to apply to the card's div */
  className: PropTypes.string,

  /** Specify the card style. "orange" has a thick orange left border. "default" has subtle shadow. */
  design: PropTypes.oneOf(["default", "orange"]),
};

Card.defaultProps = {
  as: "div",
  design: "default",
};

export default Card;

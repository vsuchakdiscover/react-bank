import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Spinner.module.scss";

const Spinner = ({ className, center, fadeIn, ...props }) => {
  return (
    <div
      className={cx({
        [styles.root]: true,
        [styles.center]: center,
        [styles.fadeIn]: fadeIn,
        className: true,
      })}
      {...props}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
};

Spinner.propTypes = {
  /** Set to true to display the spinner in the center of the viewport. True is the default. */
  center: PropTypes.bool,

  /** Class to apply */
  className: PropTypes.string,

  /** Set to true to fade in when displayed. */
  fadeIn: PropTypes.bool,
};

Spinner.defaultProps = {
  center: true,
};

export default Spinner;

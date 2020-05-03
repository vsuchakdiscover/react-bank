import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import styles from "./SpinnerWrapper.module.scss";
import Spinner from "../Spinner";

/** Wraps content and displays spinner when isLoading is true  */
function SpinnerWrapper({ children, isLoading, loadingText, ...props }) {
  return (
    <div {...props} className={props.className}>
      <div
        className={cx(
          isLoading && styles.loadingState,
          isLoading && loadingText && styles.lightLoadingState
        )}
      >
        {children}
      </div>
      {isLoading && (
        <div className={styles.fadeinSpinner}>
          <Spinner />
          {loadingText && (
            <span className={styles.loadingText}>{loadingText}</span>
          )}
        </div>
      )}
    </div>
  );
}

SpinnerWrapper.defaultProps = {
  isLoading: false,
};

SpinnerWrapper.propTypes = {
  children: PropTypes.any,

  /** CSS class to apply to div wrapper */
  className: PropTypes.string,

  /** If set to true, the spinner displays and wrapped content is faded out. */
  isLoading: PropTypes.bool,

  /** Text that appears under the spinner */
  loadingText: PropTypes.string,
};

export default SpinnerWrapper;

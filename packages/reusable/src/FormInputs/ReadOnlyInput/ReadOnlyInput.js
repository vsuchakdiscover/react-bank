import React from "react";
import PropTypes from "prop-types";
import InputHelp from "../InputHelp";
import styles from "./ReadOnlyInput.module.scss";
import cx from "classnames";

const ReadOnlyInput = (props) => {
  return (
    <>
      <div className={cx(styles.root, props.containerClass)}>
        <span
          className={cx({
            [styles.label]: true,
            "sr-only": !props.showLabel,
          })}
        >
          {props.label}
        </span>
        <span className={cx(styles.value, props.valueSpanClass)}>
          {props.value}
        </span>
      </div>
      {props.helpText && <InputHelp>{props.helpText}</InputHelp>}
    </>
  );
};

ReadOnlyInput.propTypes = {
  /** CSS class applied to wrapper div */
  containerClass: PropTypes.string,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** Help text or element(s) to display below the input */
  helpText: PropTypes.oneOfType([PropTypes.any]),

  /** Show or hide the label visually */
  showLabel: PropTypes.bool,

  /** Input value */
  value: PropTypes.string.isRequired,

  /** CSS class applied to value span */
  valueSpanClass: PropTypes.string,
};

ReadOnlyInput.defaultProps = {
  showLabel: true,
};

export default ReadOnlyInput;

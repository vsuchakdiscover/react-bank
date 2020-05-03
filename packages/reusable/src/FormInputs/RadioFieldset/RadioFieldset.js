import React from "react";
import RadioButton from "../RadioButton";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./RadioFieldset.module.scss";

/** RadioFieldset */
const RadioFieldset = ({
  className,
  legend,
  hideLegend,
  radioClass,
  ...props
}) => {
  return (
    <fieldset className={cx(styles.radioFieldset, className)}>
      <legend className={hideLegend ? "sr-only" : ""}>{legend}</legend>
      <div>
        {React.Children.map(props.children, (child) => {
          if (child)
            return (
              <div className={radioClass ? radioClass : ""}>
                <RadioButton className={styles.radio} {...child.props}>
                  {child.props.children}
                </RadioButton>
              </div>
            );
        })}
      </div>
    </fieldset>
  );
};

RadioFieldset.propTypes = {
  /** Child radio buttons and markup to compose inside the fieldset */
  children: PropTypes.any,

  /** CSS class applied to the wrapper fieldset */
  className: PropTypes.string,

  /** Legend to describe the set of radio buttons */
  legend: PropTypes.string.isRequired,

  /** Hide legend if true */
  hideLegend: PropTypes.bool,

  /** CSS class applied to the buttons */
  radioClass: PropTypes.string,
};

RadioFieldset.defaultProps = {
  hideLegend: false,
};

export default RadioFieldset;

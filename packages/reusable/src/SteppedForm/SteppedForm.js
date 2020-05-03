import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./SteppedForm.module.scss";

const SteppedForm = (props) => {
  const length = props.children.length;
  return props.children.map((item, ind) => {
    const activeStep = ind === props.activeStep - 1;
    return (
      <div
        className={cx({
          [styles.root]: true,
          [styles.completedStep]: ind < props.activeStep - 1,
          [styles.activeStep]: activeStep,
          [styles.firstStep]: ind === 0,
          [styles.lastStep]: ind + 1 === length,
        })}
        key={`Step${ind}`}
      >
        <div className={styles.stepNumber}>{activeStep && ind + 1}</div>
        <div className={styles.headerText}>{item.props.header}</div>
        {activeStep && item.props.children}
      </div>
    );
  });
};

SteppedForm.Step = (props) => {
  return props.children;
};

SteppedForm.propTypes = {
  /** Active Step determines display */
  activeStep: PropTypes.number.isRequired,

  /** SteppedForm Content */
  children: PropTypes.any.isRequired,
};

SteppedForm.Step.displayName = "Step";

SteppedForm.Step.propTypes = {
  /** Step Content */
  children: PropTypes.any.isRequired,

  /** Step Header Text */
  header: PropTypes.any.isRequired,
};

SteppedForm.defaultProps = {
  activeStep: 1,
};

export default SteppedForm;

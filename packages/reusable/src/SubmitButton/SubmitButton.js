import React from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "../Button";
import cx from "classnames";
import styles from "../ButtonGroup/ButtonGroup.module.scss"; //styles are identical

/** Wrapper for Button in Submit Contexts */
const SubmitButton = ({
  buttonStyle,
  className,
  showCancel,
  onClickCancel,
  onKeyPressCancel,
  ...props
}) => {
  return (
    <div className={cx(styles.root, className)}>
      <Button buttonStyle={buttonStyle} type="submit" {...props}>
        {props.children}
      </Button>
      {showCancel && (
        <div className={styles.buttonGroupLink}>
          <Button
            buttonStyle={BUTTON_TYPES.LINK}
            className={styles.buttonCancel}
            onClick={onClickCancel}
            onKeyPress={onKeyPressCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

SubmitButton.propTypes = {
  /** Button style */
  buttonStyle: PropTypes.oneOf([
    BUTTON_TYPES.CLOSEX,
    BUTTON_TYPES.GHOST,
    BUTTON_TYPES.LINK,
    BUTTON_TYPES.PRIMARY,
  ]).isRequired,

  /** Child elements to render inside button */
  children: PropTypes.any,

  /** Class to apply */
  className: PropTypes.string,

  /** Set to true to disable the button */
  disabled: PropTypes.bool,

  /** Function to call on click */
  onClick: PropTypes.func,

  /** Function to call on click of Cancel Button */
  onClickCancel: PropTypes.func,

  /** Function to call on key press */
  onKeyPress: PropTypes.func,

  /** Function to call on key press of Cancel Button */
  onKeyPressCancel: PropTypes.func,

  /** Show Cancel Link */
  showCancel: PropTypes.bool,
};

SubmitButton.defaultProps = {
  buttonStyle: BUTTON_TYPES.PRIMARY,
  disabled: false,
  type: "submit",
};

export default SubmitButton;

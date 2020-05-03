import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Button.module.scss";

export const BUTTON_TYPES = {
  PRIMARY: "primary",
  GHOST: "ghost",
  LINK: "link",
  TOOLTIP: "tooltip",
  CLOSEX: "closex",
};

/** Reusable Button */
const Button = React.forwardRef(
  ({ buttonStyle, children, className, adobeEvent, ...props }, ref) => {
    if (adobeEvent && props.type === "submit")
      throw new Error(
        "For safety, Button doesn't support tracking form submit button clicks. Why? Because forms can also be submitted via the enter key. So instead, remove the adobeEvent prop from this component and track the event using the form's submit handler."
      );
    function handleClick(e) {
      if (props.href) window.location.href = props.href;
      if (props.onClick) props.onClick(e);
    }

    return (
      <button
        // This attribute is read by LogClicks which wraps the entire app as a global click handler that runs *before* any child onClick.
        data-track={adobeEvent}
        className={cx(styles.root, styles[buttonStyle], className)}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  /** Event code sent to Adobe for tracking purposes on click.
   * For safety, this is NOT supported for type="submit" because form submissions
   * should be tracked in the form submit handler since the user may not click the
   * submit button to submit the form. */
  adobeEvent: PropTypes.string,

  /** Attribute that identifies the element(by id) that the button activates */
  "aria-controls": PropTypes.string,

  /** Describes state of element toggled */
  "aria-expanded": PropTypes.oneOf(["true", "false"]),

  /** Accessiblity attribute for buttons without semantic context */
  "aria-label": PropTypes.string,

  /** Button style */
  buttonStyle: PropTypes.oneOf([
    BUTTON_TYPES.PRIMARY,
    BUTTON_TYPES.CLOSEX,
    BUTTON_TYPES.GHOST,
    BUTTON_TYPES.LINK,
    BUTTON_TYPES.TOOLTIP,
  ]).isRequired,

  /** Child elements to render inside button */
  children: PropTypes.any,

  /** Class to apply */
  className: PropTypes.string,

  /** Set to true to disable the button */
  disabled: PropTypes.bool,

  /** URL to load on click */
  href: PropTypes.string,

  /** Function to call on click */
  onClick: PropTypes.func,

  /** Function to call on key press */
  onKeyPress: PropTypes.func,

  /** Ref */
  ref: PropTypes.object,

  /** Button type */
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
};

Button.defaultProps = {
  buttonStyle: BUTTON_TYPES.PRIMARY,
  disabled: false,
  type: "button",
};

export default Button;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import SuccessIcon from "../Icons/SuccessIcon";
import WarningIcon from "../Icons/WarningIcon";
import ErrorIcon from "../Icons/ErrorIcon";
import InfoIcon from "../Icons/InfoIcon";
import styles from "./Alert.module.scss";
import Button, { BUTTON_TYPES } from "../Button";

export const ALERT_TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  NEUTRAL: "neutral",
  NO_ICON: "no_icon",
};

function getIcon(type) {
  switch (type) {
    case ALERT_TYPES.SUCCESS:
      return <SuccessIcon className="ml-25 mt-20" />;
    case ALERT_TYPES.WARNING:
      return <WarningIcon className="ml-25 mt-20" />;
    case ALERT_TYPES.ERROR:
      return <ErrorIcon className="ml-25 mt-20" />;
    case ALERT_TYPES.NEUTRAL:
      return <InfoIcon className="ml-25 mt-20" size={30} />;
    case ALERT_TYPES.NO_ICON:
      return null;
    default:
      throw new Error("Unknown type passed: " + type);
  }
}

/** Alert */
const Alert = React.forwardRef(
  ({ closable, onClose, type, className, children, ...props }, ref) => {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
      // Hide alert when escape key is pressed
      function keyHandler({ key }) {
        if (closable && key === "Escape") setHidden(true);
      }

      window.addEventListener("keydown", keyHandler);
      return () => window.removeEventListener("keydown", keyHandler);
    }, [closable]);

    function handleClick(event) {
      event.preventDefault();
      setHidden(true);
      if (onClose) onClose(event);
    }

    if (hidden) return null;

    return (
      <div
        aria-label={props["aria-label"]}
        className={cx(
          styles.root,
          styles[type],
          className,
          ref ? styles.ref : ""
        )}
        ref={ref}
        role="alert"
        tabIndex={ref ? "-1" : ""}
        type={type}
      >
        {getIcon(type)}
        <div className={styles.contentWrapper}>
          {typeof children === "function" ? children() : children}
        </div>
        {closable && (
          <Button
            aria-label="Close alert dialog"
            buttonStyle={BUTTON_TYPES.CLOSEX}
            className="ml-auto"
            onClick={handleClick}
            type="button"
          />
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

Alert.propTypes = {
  /** Accessiblity attribute for buttons without semantic context */
  "aria-label": PropTypes.string,

  /** Holds the alert's content */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,

  /** Class to assign to wrapper div */
  className: PropTypes.string,

  /** Set to false to dissalow closing the alert */
  closable: PropTypes.bool,

  /** Function to call when the alert is closed */
  onClose: PropTypes.func,

  /** Alert type */
  type: PropTypes.oneOf(Object.values(ALERT_TYPES)).isRequired,
};

Alert.defaultProps = {
  className: "",
  closable: true,
  type: ALERT_TYPES.NEUTRAL,
};

export default Alert;

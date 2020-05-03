import React from "react";
import PropTypes from "prop-types";
import Component from "@reach/component-component";
import { Dialog } from "./modalBase";
import Button, { BUTTON_TYPES } from "../Button";
import styles from "./Modal.module.scss";
import cx from "classnames";
import useTrackPageLoad from "../hooks/useTrackPageLoad";

const Modal = ({
  adobeEventOnClose,
  adobeEventOnLoad,
  blueCircleIcon,
  noBodyDismiss,
  showCloseX,
  closeXCopy,
  onClose,
  header,
  ...props
}) => {
  let lastclicked = "";
  useTrackPageLoad(adobeEventOnLoad);
  return (
    <Component>
      <Dialog
        aria-label={props["aria-label"]}
        className={cx(
          styles.dialog,
          props.dialogClass,
          blueCircleIcon ? styles.blueCircleIcon : ""
        )}
        lastclicked={lastclicked}
        onDismiss={noBodyDismiss ? () => {} : onClose}
        tabIndex="0" //forces focus to overlay parent, but not sure we want this
      >
        {showCloseX && (
          <Button
            data-track={adobeEventOnClose}
            aria-label={closeXCopy}
            buttonStyle={BUTTON_TYPES.CLOSEX}
            className={styles["close-modal"]}
            onClick={onClose}
          />
        )}
        {blueCircleIcon && (
          <div className={styles.blueCircleIconHeader}>
            <div className={styles.iconCircle}>{blueCircleIcon}</div>
          </div>
        )}
        {header && (
          <div
            className={cx(styles.header, {
              [styles.hasCloseX]: showCloseX,
            })}
          >
            {typeof header === "function" ? header() : header}
          </div>
        )}
        {props.children}
      </Dialog>
    </Component>
  );
};

Modal.propTypes = {
  /** Adobe event to log when the modal is closed */
  adobeEventOnClose: PropTypes.string,

  /** Adobe event to log when the modal is opened */
  adobeEventOnLoad: PropTypes.string,

  /** aria-label copy for Modal */
  "aria-label": PropTypes.string.isRequired,

  /** Holds content of Modal */
  children: PropTypes.node,

  /** Label copy for close 'X' button */
  closeXCopy: PropTypes.string.isRequired,

  /** className to override dialog styles */
  dialogClass: PropTypes.node,

  /** Display an optional styled header */
  header: PropTypes.any,

  /** If true clicking outside of modal will not close modal */
  noBodyDismiss: PropTypes.bool,

  /** Function to call when the modal is closed */
  onClose: PropTypes.func,

  /** Show close 'X' button in modal */
  showCloseX: PropTypes.bool,

  /** Display Blue Fancy modal style */
  blueCircleIcon: PropTypes.node,
};

Modal.defaultProps = {
  closeXCopy: "Close Modal",
  showCloseX: true,
};

export default Modal;

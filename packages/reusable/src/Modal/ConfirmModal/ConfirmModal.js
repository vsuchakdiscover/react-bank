import React from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "../../Button";
import Spinner from "../../Spinner";
import ButtonGroup from "../../ButtonGroup";
import styles from "../Modal.module.scss";
import Modal from "../Modal";
import cx from "classnames";

const ConfirmModal = ({
  children,
  header,
  loading,
  onConfirmClick,
  confirmButtonLabel,
  onCancelClick,
  cancelButtonLabel,
  cancelButtonAriaLabel,
  ...props
}) => {
  return (
    <Modal header={header} {...props}>
      <div
        className={cx(styles.root, loading ? styles.confirmLoadingState : "")}
      >
        {children}

        <ButtonGroup className={styles.positionButtons}>
          <Button onClick={onConfirmClick}>{confirmButtonLabel}</Button>

          <ButtonGroup.Link>
            <Button
              aria-label={cancelButtonAriaLabel || cancelButtonLabel}
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={onCancelClick}
            >
              {cancelButtonLabel}
            </Button>
          </ButtonGroup.Link>
        </ButtonGroup>
      </div>

      {loading && (
        <div className={styles.fadeinSpinner}>
          <Spinner />
        </div>
      )}
    </Modal>
  );
};

ConfirmModal.propTypes = {
  /** Cancel button Aria label  */
  cancelButtonAriaLabel: PropTypes.string,

  /** Cancel button label */
  cancelButtonLabel: PropTypes.string,

  /** Content to display in the modal */
  children: PropTypes.any,

  /** Confirm button label */
  confirmButtonLabel: PropTypes.any,

  /** Modal header */
  header: PropTypes.any,

  /** Set to true to display a built in spinner */
  loading: PropTypes.bool,

  /** Function called when cancel button is clicked */
  onCancelClick: PropTypes.func,

  /** Function called when the confirm button is clicked */
  onConfirmClick: PropTypes.func.isRequired,
};

ConfirmModal.defaultProps = {
  cancelButtonLabel: "Cancel",
  confirmButtonLabel: "Continue",
  loading: false,
};

export default ConfirmModal;

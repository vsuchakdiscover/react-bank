import React from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import ErrorOverlay from "../../components/reusable/ErrorOverlay";

const DeletePaymentModal = ({
  onClose,
  onDeleteAllConfirmClick,
  payments,
  isDeleting,
  deletionError,
}) => {
  return (
    <Modal aria-label="Delete All Payments" onClose={onClose}>
      <>
        {deletionError ? (
          <ErrorOverlay onClose={onClose} />
        ) : (
          <SpinnerWrapper isLoading={isDeleting}>
            <>
              <p className="overlayHeader">
                Are you sure you want to delete all payments?
              </p>
              <p>
                Your next payment to{" "}
                <b>{nickNameWithLastFour(payments[0].payee)}</b> from{" "}
                <b>{payments[0].paymentMethod.accountName}</b> scheduled on{" "}
                {formatDateStringToMDY(payments[0].deliverByDate)}, and all
                subsequent payments will be deleted.
              </p>
              <ButtonGroup style={{ minHeight: "50px" }}>
                <Button onClick={(e) => onDeleteAllConfirmClick(e, payments)}>
                  Delete All Payments
                </Button>

                <ButtonGroup.Link>
                  <Button
                    onClick={onClose}
                    buttonStyle={BUTTON_TYPES.LINK}
                    aria-label="Cancel Delete All Payments"
                  >
                    Cancel
                  </Button>
                </ButtonGroup.Link>
              </ButtonGroup>
            </>
          </SpinnerWrapper>
        )}
      </>
    </Modal>
  );
};

DeletePaymentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  payments: PropTypes.array.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  deletionError: PropTypes.string,
  onDeleteAllConfirmClick: PropTypes.func.isRequired,
};

export default DeletePaymentModal;

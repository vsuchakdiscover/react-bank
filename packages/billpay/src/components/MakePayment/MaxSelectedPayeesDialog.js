import React from "react";
import PropTypes from "prop-types";
import Button from "reusable/lib/Button";
import Modal from "reusable/lib/Modal";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

function MaxSelectedPayeesDialog({ onClose }) {
  useTrackPageLoad(
    "bankac/billpay/makePayments/schedulePymtsLimitReachedOverlay"
  );
  return (
    <Modal
      aria-label="You&amp;ve reached the limit"
      onClose={onClose}
      header="You've reached the limit"
    >
      <>
        <p>
          You can only schedule up to 5 payments at a time. Complete these
          payments before scheduling more.
        </p>
        <Button
          adobeEvent="MAKE_BILL_PAYMENTS_SCHEDULE_PYMTS_LIMIT_REACHED_OVERLAY_GOT_IT_BTN"
          onClick={onClose}
        >
          Got It
        </Button>
      </>
    </Modal>
  );
}

MaxSelectedPayeesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MaxSelectedPayeesDialog;

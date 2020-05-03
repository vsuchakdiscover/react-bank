import React from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

const RepeatingEditModal = ({
  adobeEvent,
  adobeEventOnGoBack,
  onClose,
  backText,
  onOneTimeClick,
  oneTimeText,
  seriesText,
  onSeriesClick,
  header,
  ariaLabel,
}) => {
  useTrackPageLoad(adobeEvent);
  return (
    <Modal aria-label={ariaLabel} header={header} onClose={onClose}>
      <div className="modalActionButtons">
        <Button buttonStyle={BUTTON_TYPES.GHOST} onClick={onOneTimeClick}>
          {oneTimeText}
        </Button>
        <Button buttonStyle={BUTTON_TYPES.GHOST} onClick={onSeriesClick}>
          {seriesText}
        </Button>
        <Button
          adobeEvent={adobeEventOnGoBack}
          buttonStyle={BUTTON_TYPES.LINK}
          onClick={onClose}
        >
          {backText}
        </Button>
      </div>
    </Modal>
  );
};

RepeatingEditModal.defaultProps = {
  ariaLabel: "Edit payment",
  backText: "Go Back",
  header: "Do you want to edit this payment or all payments in the series?",
  oneTimeText: "Edit This Payment",
  seriesText: "Edit Entire Series",
};

RepeatingEditModal.propTypes = {
  adobeEvent: PropTypes.string,
  adobeEventOnGoBack: PropTypes.string,
  ariaLabel: PropTypes.string,
  backText: PropTypes.string,
  header: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOneTimeClick: PropTypes.func.isRequired,
  oneTimeText: PropTypes.string,
  seriesText: PropTypes.string,
  onSeriesClick: PropTypes.func.isRequired,
};

export default RepeatingEditModal;

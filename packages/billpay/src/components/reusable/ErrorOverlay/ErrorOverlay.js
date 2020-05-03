import React from "react";
import PropTypes from "prop-types";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Button from "reusable/lib/Button";

function ErrorOverlay({ onClose }) {
  return (
    <>
      <p className="overlayHeader">
        There was a problem processing your request.
        <br />
        Please try again.
      </p>
      <ButtonGroup style={{ minHeight: "50px;" }}>
        <Button onClick={onClose} aria-label="Close Overlay">
          Okay, Got It
        </Button>
      </ButtonGroup>
    </>
  );
}

ErrorOverlay.propTypes = {
  /** Function to call when the overlay is closed */
  onClose: PropTypes.func.isRequired,
};

export default ErrorOverlay;

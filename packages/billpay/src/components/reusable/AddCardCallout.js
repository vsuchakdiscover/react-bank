import React from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import Card from "reusable/lib/Card";
import CreditCardIcon from "reusable/lib/CreditCardIcon";
import styles from "./AddCardCallout.module.scss";
import cx from "classnames";

function AddCardCallout({ className, setShowAddCardDialog, adobeEvent }) {
  return (
    <Card className={cx(styles.root, className)}>
      <div className={styles.copy}>
        <CreditCardIcon />
        <p>
          <strong>Add your Discover credit card to your payees</strong>
        </p>
      </div>

      <Button
        adobeEvent={adobeEvent}
        className={styles.addNow}
        buttonStyle={BUTTON_TYPES.GHOST}
        onClick={setShowAddCardDialog}
      >
        Add Now
      </Button>
    </Card>
  );
}

AddCardCallout.propTypes = {
  /** Event code sent to Adobe for tracking purposes on click */
  adobeEvent: PropTypes.string,
  /** class to apply */
  className: PropTypes.string,
  /** opens modal */
  setShowAddCardDialog: PropTypes.func.isRequired,
};

export default AddCardCallout;

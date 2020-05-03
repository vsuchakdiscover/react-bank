import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import CreditCardIcon from "reusable/lib/CreditCardIcon";
import ErrorIcon from "reusable/lib/ErrorIcon";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import styles from "./AddCardModal.module.scss";
import Checkboxes from "reusable/lib/Checkboxes";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import { discoverCardsApi } from "../../api";
import ErrorOverlay from "./ErrorOverlay";
import cx from "classnames";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

function AddCardModal({
  adobePageTrackEvent,
  discoverCreditCards,
  onClose,
  onSuccess,
}) {
  useTrackPageLoad(adobePageTrackEvent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCards, setSelectedCards] = useState(
    discoverCreditCards.map((d) => d.accountNumber)
  );
  const [showFormError, setShowFormError] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const handleChange = (e) => {
    setSelectedCards(e.target.value);
    setShowFormError(false);
  };

  async function handleSave(e) {
    e.preventDefault();
    if (selectedCards.length === 0 && isMounted.current) {
      return setShowFormError(true);
    }
    const cardsToAdd = selectedCards.map((c) =>
      discoverCreditCards.find((d) => d.accountNumber === c)
    );
    try {
      if (isMounted.current) {
        setLoading(true);
        const resp = await discoverCardsApi.addDiscoverCards(cardsToAdd);
        onSuccess(resp.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
      if (isMounted.current) setError(true);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }

  return (
    <Modal
      aria-label="Add your Discover Credit Card to your payees."
      onClose={onClose}
      blueCircleIconModal
      blueCircleIcon={<CreditCardIcon width={40} />}
    >
      <>
        {error ? (
          <ErrorOverlay onClose={onClose} />
        ) : (
          <>
            <SpinnerWrapper
              isLoading={loading}
              loadingText="Adding your Discover credit card..."
            >
              <form onSubmit={handleSave}>
                <div className="row">
                  <p className="col overlayHeader text-center">
                    Add your Discover credit card to your payees
                  </p>
                </div>
                <p className="text-center">
                  It&apos;s the easy way to pay your Discover credit card bill,
                  review payments, and more.
                </p>

                <Checkboxes
                  childClassName={styles.formCheckboxChild}
                  className={cx(
                    styles.formCheckboxes,
                    showFormError ? styles.formCheckBoxesError : ""
                  )}
                  id="discoverCards"
                  label="Your Eligible Discover Cards"
                  labelVisible={false}
                  name="discoverCards"
                  onChange={handleChange}
                  options={discoverCreditCards.map((d) => ({
                    label: nickNameWithLastFour(d),
                    value: d.accountNumber,
                  }))}
                  value={selectedCards}
                />

                {showFormError && (
                  <div className={styles.checkboxesError}>
                    <ErrorIcon /> <span>Please make a selection.</span>
                  </div>
                )}

                <ButtonGroup>
                  <Button type="submit">Add Now</Button>

                  <ButtonGroup.Link>
                    <Button
                      onClick={onClose}
                      buttonStyle={BUTTON_TYPES.LINK}
                      aria-label="Close Overlay"
                    >
                      Cancel
                    </Button>
                  </ButtonGroup.Link>
                </ButtonGroup>
              </form>
            </SpinnerWrapper>
          </>
        )}
      </>
    </Modal>
  );
}

AddCardModal.propTypes = {
  /** Data passed to adobe page track */
  adobePageTrackEvent: PropTypes.string,

  /** array of customer's credits cards that are not already payees returned from api service */
  discoverCreditCards: PropTypes.array.isRequired,

  /** function to close modal */
  onClose: PropTypes.func.isRequired,

  /** function to call on success of ajax request to add discover cards to payee list */
  onSuccess: PropTypes.func.isRequired,
};

export default AddCardModal;

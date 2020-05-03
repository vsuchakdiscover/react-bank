import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import { getDeliveryMethod } from "../../utils/deliveryMethod";
import cx from "classnames";
import ErrorOverlay from "../../components/reusable/ErrorOverlay";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

const DeletePaymentModal = ({
  adobeEventOnDeleteThisPayment,
  adobeEventOnDeleteSeries,
  adobeEventOnDeleteOneTime,
  adobePageTrackEvent,
  adobeEventOnGoBack,
  accounts,
  onClose,
  onOneTimeClick,
  onSeriesClick,
  payment,
  payee,
  isDeleting,
  deletionError,
  seriesOnly,
  onGoBack,
}) => {
  useTrackPageLoad(adobePageTrackEvent);
  return (
    <Modal aria-label="Delete Scheduled Payment" onClose={onClose}>
      <>
        {deletionError ? (
          <ErrorOverlay onClose={onClose} />
        ) : (
          <SpinnerWrapper isLoading={isDeleting}>
            <InnerModal
              adobeEventOnDeleteThisPayment={adobeEventOnDeleteThisPayment}
              adobeEventOnDeleteSeries={adobeEventOnDeleteSeries}
              adobeEventOnDeleteOneTime={adobeEventOnDeleteOneTime}
              adobeEventOnGoBack={adobeEventOnGoBack}
              accounts={accounts}
              onClose={onClose}
              payment={payment}
              payee={payee}
              onOneTimeClick={onOneTimeClick}
              onSeriesClick={onSeriesClick}
              seriesOnly={seriesOnly}
              onGoBack={onGoBack}
            />
          </SpinnerWrapper>
        )}
      </>
    </Modal>
  );
};

const InnerModal = ({
  adobeEventOnDeleteThisPayment,
  adobeEventOnDeleteSeries,
  adobeEventOnDeleteOneTime,
  adobeEventOnGoBack,
  accounts,
  payment,
  payee,
  onClose,
  onOneTimeClick,
  onSeriesClick,
  seriesOnly,
  onGoBack,
}) => {
  const [isConfirm, setIsConfirm] = useState();

  const getAccountName = (paymentId) => {
    const hasPaymentId = accounts.find((a) => a.id === paymentId);
    return hasPaymentId
      ? hasPaymentId.accountName
      : accounts.find((a) => a.fundingId === paymentId).accountName;
  };

  if (isConfirm || seriesOnly || payment.seriesOnly) {
    // in all these scenarios we want to bypass the onetime vs series interstitial
    const isRepeating =
      isConfirm === "seriesClick" || seriesOnly || payment.seriesOnly;
    const isAutoPay = payment.type === FREQUENCY_TYPE.EBILL_AUTOPAY;
    return (
      <>
        {isAutoPay && isRepeating ? (
          <p className="overlayHeader">
            Are you sure you want to delete your eBill AutoPay settings?
          </p>
        ) : (
          <p className="overlayHeader">
            Are you sure you want to delete{" "}
            {isRepeating ? "all payments" : "this payment"}?
          </p>
        )}
        <p>
          Your {isRepeating && "next"} payment to{" "}
          <b>{nickNameWithLastFour(payee)}</b> from{" "}
          <b>
            {payment.paymentMethod
              ? payment.paymentMethod.accountName
              : getAccountName(payment.payFrom)}
          </b>{" "}
          scheduled to be delivered by{" "}
          {formatDateStringToMDY(
            payment.deliverByDate || payment.repeatingPayment.startDate
          )}
          {isRepeating && ", and all subsequent payments "} will be deleted.
        </p>
        <ButtonGroup style={{ minHeight: "50px" }}>
          <Button
            onClick={(e) =>
              isRepeating
                ? onSeriesClick(e, payment)
                : onOneTimeClick(e, payment, onClose)
            }
          >
            {isAutoPay && isRepeating
              ? "Delete eBill AutoPay Setting"
              : "Delete Payment"}
            {isRepeating && "s"}
          </Button>

          <ButtonGroup.Link>
            <Button
              onClick={onClose}
              buttonStyle={BUTTON_TYPES.LINK}
              aria-label="Cancel Delete"
            >
              Cancel
            </Button>
          </ButtonGroup.Link>
        </ButtonGroup>
      </>
    );
  } else {
    switch (payment.type) {
      case FREQUENCY_TYPE.ONE_TIME:
        return (
          <>
            <p className="overlayHeader">
              Are you sure you want to delete this payment?
            </p>
            <p>
              Your payment to <b>{nickNameWithLastFour(payee)}</b> from{" "}
              <b>{payment.paymentMethod.accountName}</b> scheduled to be
              delivered by {formatDateStringToMDY(payment.deliverByDate)} will
              be deleted.
            </p>
            <ButtonGroup style={{ minHeight: "50px" }}>
              <Button
                adobeEvent={adobeEventOnDeleteOneTime}
                onClick={(e) => onOneTimeClick(e, payment, onClose)}
              >
                Delete Payment
              </Button>

              <ButtonGroup.Link>
                <Button
                  onClick={onGoBack}
                  buttonStyle={BUTTON_TYPES.LINK}
                  aria-label="Cancel Delete"
                >
                  Cancel
                </Button>
              </ButtonGroup.Link>
            </ButtonGroup>
          </>
        );
      case FREQUENCY_TYPE.REPEATING:
      case FREQUENCY_TYPE.ONCE_A_WEEK:
      case FREQUENCY_TYPE.ONCE_IN_2_WEEKS:
      case FREQUENCY_TYPE.ONCE_IN_4_WEEKS:
      case FREQUENCY_TYPE.TWICE_A_MONTH:
      case FREQUENCY_TYPE.ONCE_A_MONTH:
      case FREQUENCY_TYPE.ONCE_IN_2_MONTHS:
      case FREQUENCY_TYPE.ONCE_IN_3_MONTHS:
      case FREQUENCY_TYPE.ONCE_IN_6_MONTHS:
      case FREQUENCY_TYPE.ONCE_A_YEAR:
        return (
          <>
            <p className={cx("overlayHeader", "mb-20")}>
              Do you want to delete this{" "}
              {getDeliveryMethod(
                payment.deliveryMethod
              ).shortName.toLowerCase()}{" "}
              payment to {nickNameWithLastFour(payee)} or the entire series?
            </p>
            <div className="modalActionButtons">
              <Button
                adobeEvent={adobeEventOnDeleteThisPayment}
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => setIsConfirm("oneTimeClick")}
              >
                Delete This Payment
              </Button>

              <Button
                adobeEvent={adobeEventOnDeleteSeries}
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => setIsConfirm("seriesClick")}
              >
                Delete Entire Series
              </Button>

              <Button
                adobeEvent={adobeEventOnGoBack}
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={onGoBack}
                aria-label="Cancel Delete"
              >
                Go Back
              </Button>
            </div>
          </>
        );
      case FREQUENCY_TYPE.EBILL_AUTOPAY:
        return (
          <>
            <p className={cx("overlayHeader", "mb-20")}>
              Do you want to delete this payment or your eBill AutoPay settings?
            </p>
            <div className="modalActionButtons">
              <Button
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => setIsConfirm("oneTimeClick")}
              >
                Delete This Payment
              </Button>

              <Button
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => setIsConfirm("seriesClick")}
              >
                Delete AutoPay Settings
              </Button>

              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={onClose}
                aria-label="Cancel Delete"
              >
                Cancel
              </Button>
            </div>
          </>
        );
      default:
        throw new Error("Unknown Payment Type: " + payment.type);
    }
  }
};

InnerModal.propTypes = {
  adobeEventOnDeleteThisPayment: PropTypes.string,
  adobeEventOnDeleteSeries: PropTypes.string,
  adobeEventOnDeleteOneTime: PropTypes.string,
  adobeEvent: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOneTimeClick: PropTypes.func.isRequired,
  onSeriesClick: PropTypes.func.isRequired,
  payment: PropTypes.object.isRequired,
  seriesOnly: PropTypes.bool,
  onGoBack: PropTypes.func.isRequired,
};

DeletePaymentModal.propTypes = {
  adobeEventOnDeleteThisPayment: PropTypes.string,
  adobeEventOnDeleteSeries: PropTypes.string,
  adobeEventOnDeleteOneTime: PropTypes.string,
  adobePageTrackEvent: PropTypes.string,
  adobeEventOnGoBack: PropTypes.string,
  // If coming from edit payment flow our modal content changes
  accounts: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onOneTimeClick: PropTypes.func.isRequired,
  onSeriesClick: PropTypes.func.isRequired,
  payment: PropTypes.object.isRequired,
  payee: PropTypes.object.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  deletionError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  seriesOnly: PropTypes.bool,
  onGoBack: PropTypes.func.isRequired,
};

export default DeletePaymentModal;

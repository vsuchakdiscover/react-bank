import React, { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import FieldValue from "reusable/lib/FieldValue";
import { getFrequencyLabel } from "../../utils/frequencies";
import { getPaymentStatusLabel } from "../../utils/paymentStatuses";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import PrintButton from "reusable/lib/PrintButton";
import DeliveryMethodWithAddress from "../ReviewPayments/DeliveryMethodWithAddress";
import DeliveryMethod from "../reusable/DeliveryMethod";
import GrayCalendarIcon from "reusable/lib/GrayCalendarIcon";
import RevolvingIcon from "reusable/lib/RevolvingIcon";
import SuccessIcon from "reusable/lib/SuccessIcon";
import {
  formatCurrency,
  nickNameWithLastFour,
} from "reusable/lib/formattingUtils";
import { FILTER } from "./PaymentSlider";
import styles from "./PaymentDetailsModal.module.scss";
import cx from "classnames";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

function PaymentDetailsModal({
  payment,
  onDeleteClick,
  onEditClick,
  onEditAutomaticClick,
  onClose,
  onViewRepeatingPaymentHistoryClick,
  payee,
  filter,
  account,
  paymentHistory,
}) {
  const isRepeatingPayment =
    payment.type === "REPEATING" || payment.repeatingPayment;
  const ref = useRef();
  useTrackPageLoad("bankac/billpay/reviewpayments/scheduled/details-overlay");

  function getIcon() {
    if (
      payment.status === "SCHEDULED" ||
      payment.status === "ACTIVE" ||
      payment.status === "PROCESSING"
    )
      return <GrayCalendarIcon width={40} />;
    if (payment.status === "COMPLETED") return <SuccessIcon width={40} />;
    throw new Error("Unhandled icon");
  }

  function getMessage() {
    const isMail = payment.deliveryMethod !== "STANDARD_ELECTRONIC";
    if (filter === FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS) return null;
    if (isRepeatingPayment)
      return (
        <p>
          {payment.status !== "COMPLETED" ? "Next r" : "R"}epeating{" "}
          {!isMail && "electronic"} payment {isMail && "by check"} to{" "}
          <strong>{nickNameWithLastFour(payee)}</strong> from{" "}
          <strong>{nickNameWithLastFour(account)}</strong>{" "}
          {payment.status === "COMPLETED" ? "was" : "will be"} delivered by{" "}
          <strong>
            {formatDateStringToMDY(
              payment.deliverByDate ?? payment.repeatingPayment.nextPaymentDate
            )}
          </strong>
          .
        </p>
      );

    return (
      <p>
        {!isMail && "Electronic"} Payment {isMail && "by check"} to{" "}
        <strong>{nickNameWithLastFour(payee)}</strong> from{" "}
        <strong>{nickNameWithLastFour(account)}</strong>{" "}
        {payment.status === "COMPLETED" ? "was" : "will be"} delivered by{" "}
        <strong>{formatDateStringToMDY(payment.deliverByDate)}</strong>.
      </p>
    );
  }

  return (
    <>
      <Modal
        aria-label="Payment details"
        onClose={onClose}
        blueCircleIconModal
        blueCircleIcon={getIcon()}
      >
        <p className={cx("overlayHeader text-center mr-0", styles.amount)}>
          {formatCurrency(payment.amount ?? payment.repeatingPayment.amount)}{" "}
          {isRepeatingPayment && <RevolvingIcon />}
        </p>
        <p className={cx("overlayHeader text-center mr-0", styles.payee)}>
          {nickNameWithLastFour(payee)}
        </p>
        {getMessage()}

        <div className={styles.root}>
          <div className={styles.content} ref={ref}>
            <FieldValue label="Status">
              {filter === FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS
                ? // Forcing displaying scheduled status per https://github.com/mcdpartners/react-bank/issues/1334#issuecomment-614147572
                  "Scheduled"
                : getPaymentStatusLabel(payment.status)}
            </FieldValue>

            <FieldValue label="Pay From">
              {nickNameWithLastFour(account)}
            </FieldValue>

            <FieldValue label="Scheduled On">
              {formatDateStringToMDY(
                payment.scheduledOn ?? payment.repeatingPayment.startDate
              )}
            </FieldValue>

            {filter !== FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS && (
              <FieldValue
                label={`Deliver${
                  payment.status === "COMPLETED" ? "ed" : ""
                } By`}
              >
                {formatDateStringToMDY(
                  payment.deliverByDate ?? payment.repeatingPayment.startDate
                )}
              </FieldValue>
            )}

            {payment.type !== "EBILL_AUTOPAY" && (
              <FieldValue label="Frequency">
                {getFrequencyLabel(
                  isRepeatingPayment
                    ? filter === FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS
                      ? payment.payee.repeatingPayment.frequency
                      : "REPEATING"
                    : payment.type
                )}
              </FieldValue>
            )}

            {payee.repeatingPayment && payment.type === "REPEATING" && (
              <FieldValue label="Ends">
                {payee.repeatingPayment.noOfPayments
                  ? `After ${payee.repeatingPayment.noOfPayments}  Payments`
                  : "Never"}
              </FieldValue>
            )}

            <FieldValue label="Delivery Method">
              {(!payee.verified && payee.address && payee.repeatingPayment) ||
              payment.paymentAddress ? (
                <DeliveryMethodWithAddress
                  address={
                    payment.paymentAddress || payee.address //if no repeating payment scheduled but payee meets below requirements -- not verified, has address, and has repeating payment prop -- can still show address
                  }
                  method={payment.deliveryMethod}
                  displayLongName
                />
              ) : (
                <DeliveryMethod
                  method={payment.deliveryMethod}
                  displayLongName
                />
              )}
            </FieldValue>
          </div>
        </div>
        {payment.status !== "COMPLETED" && (
          <ButtonGroup>
            <Button
              adobeEvent="BillPay:ReviewPayments:Scheduled:Details:Lnk:Edit"
              aria-label="Edit scheduled payment"
              onClick={(e) =>
                payment.type === "EBILL_AUTOPAY"
                  ? onEditAutomaticClick(e)
                  : onEditClick(e)
              }
            >
              Edit
            </Button>
            <ButtonGroup.Link>
              <Button
                adobeEvent="BillPay:ReviewPayments:Scheduled:Details:Lnk:Delete"
                buttonStyle={BUTTON_TYPES.LINK}
                aria-label={`Delete payment of ${formatCurrency(
                  payment.amount
                )} to ${nickNameWithLastFour(payee)}`}
                onClick={onDeleteClick}
              >
                Delete
              </Button>
            </ButtonGroup.Link>
            {isRepeatingPayment && paymentHistory.length > 0 && (
              <ButtonGroup.Link>
                <Button
                  adobeEvent="BillPay:ReviewPayments:Scheduled:Details:Lnk:View Repeating History"
                  buttonStyle={BUTTON_TYPES.LINK}
                  onClick={onViewRepeatingPaymentHistoryClick}
                >
                  View Repeating Payment History
                </Button>
              </ButtonGroup.Link>
            )}
          </ButtonGroup>
        )}

        <PrintButton className={styles.printButton} ref={ref}></PrintButton>
      </Modal>
    </>
  );
}

PaymentDetailsModal.propTypes = {
  accounts: PropTypes.array.isRequired,
  payment: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onEditAutomaticClick: PropTypes.func.isRequired,
  onViewRepeatingPaymentHistoryClick: PropTypes.func.isRequired,
  payee: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  paymentHistory: PropTypes.array.isRequired,
};

export default PaymentDetailsModal;

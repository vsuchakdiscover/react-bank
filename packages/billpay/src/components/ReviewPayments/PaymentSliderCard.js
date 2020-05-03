import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  formatCurrency,
  nickNameWithLastFour,
  lastFour,
} from "reusable/lib/formattingUtils";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import { getPaymentStatusLabel } from "../../utils/paymentStatuses";
import SuccessIcon from "reusable/lib/SuccessIcon";
import RevolvingIcon from "reusable/lib/RevolvingIcon";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import { useHistory } from "react-router-dom";
import GrayCalendarIcon from "reusable/lib/GrayCalendarIcon";
import RepeatingEditModal from "../reusable/RepeatingEditModal";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { formatDate, formatShortDate } from "./paymentSliderDateUtils";
import RepeatingPaymentsModal from "../MakePayment/RepeatingPaymentsModal";
import cx from "classnames";
import DeletePaymentModal from "../reusable/DeletePaymentModal";
import { useLazyApi } from "reusable/lib/useApi";
import { paymentsApi } from "../../api";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import useAlert from "../../hooks/useAlert";
import styles from "./PaymentSliderCard.module.scss";

const STATUS = {
  IDLE: "IDLE",
  REPEATING_EDIT_MODAL: "REPEATING_EDIT_MODAL",
  DETAIL_MODAL: "DETAIL_MODAL",
  REPEATING_PAYMENT_HISTORY_MODAL: "REPEATING_PAYMENT_HISTORY_MODAL",
  EDIT_EBILL_AUTOPAY_MODAL: "EDIT_EBILL_AUTOPAY_MODAL",
  DELETE_PAYMENT_MODAL: "DELETE_PAYMENT_MODAL",
  REPEATING_EDIT_CONFIRM_MODAL: "REPEATING_EDIT_CONFIRM_MODAL",
};

function PaymentSliderCard({
  payment,
  payee,
  payments,
  onDeletePayment,
  onDeleteSeriesPayment,
  payees,
  accounts,
  filter,
}) {
  const mode = payment ? "payment" : "payee"; // Can handle either a payment or payee.
  const history = useHistory();
  const [status, setStatus] = useState(STATUS.IDLE);

  function getPaymentHistory(ruleId) {
    return payments.filter(
      (r) => r.status !== "SCHEDULED" && r.ruleId === ruleId
    );
  }

  const { showAlert } = useAlert();

  const getAccountName = (paymentId) =>
    accounts.find((a) => a.id === paymentId).accountName;

  const {
    loading: deleting,
    error: deletionError,
    callApi: deletePaymentApi,
  } = useLazyApi(paymentsApi.deletePayment, {
    // Only pass paymentId for payment mode
    ...(mode === "payment" ? { paymentId: payment.paymentId } : {}),
    payeeId: mode === "payee" ? payee.id : payment.payee.id,
    repeating: false,
    automatic: false,
  });

  async function onDeleteOneTimeClick(e, payment) {
    try {
      e.preventDefault();
      await deletePaymentApi({
        paymentId: payment.paymentId,
        repeating: false,
      });
      setStatus(STATUS.IDLE);
      onDeletePayment(payment);
      showAlert(
        <p>
          Your payment to <strong>{nickNameWithLastFour(payment.payee)}</strong>{" "}
          from <strong>{nickNameWithLastFour(payment.paymentMethod)}</strong>{" "}
          scheduled to be delivered by{" "}
          {formatDateStringToMDY(payment.deliverByDate)} has been deleted.
        </p>
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function onDeleteSeriesClick(e, payment) {
    try {
      e.preventDefault();
      if (payment.type === FREQUENCY_TYPE.EBILL_AUTOPAY) {
        await deletePaymentApi({
          payeeId: mode === "payment" ? payment.payee.id : payee.id,
          automatic: true,
        });
        setStatus(STATUS.IDLE);
        onDeletePayment(payment);
        showAlert(
          <p>
            <b>Your eBill AutoPay settings have been deleted</b>
          </p>
        );
      } else {
        await deletePaymentApi({
          payeeId: payment.payee.id,
          repeating: true,
        });
        setStatus(STATUS.IDLE);
        onDeleteSeriesPayment(payment);
        showAlert(
          <p>
            Your repeating payments to{" "}
            <b>{nickNameWithLastFour(payment.payee)}</b> from{" "}
            <b>
              {nickNameWithLastFour(
                payment.paymentMethod
                  ? payment.paymentMethod
                  : getAccountName(payment.payFrom)
              )}
            </b>{" "}
            have been deleted.
          </p>
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function statusIcon() {
    if (mode === "payee") {
      return (
        <>
          <GrayCalendarIcon size="small" /> Scheduled
        </>
      );
    }

    switch (payment.status) {
      case "SCHEDULED":
      case "PROCESSING":
        return (
          <>
            <GrayCalendarIcon size="small" />{" "}
            {getPaymentStatusLabel(payment.status)}
          </>
        );
      case "COMPLETED":
        return (
          <>
            <SuccessIcon size="small" />{" "}
            {/* Hack: In this one spot, we've been asked to say "Completed" instead of "Paid" */}
            {getPaymentStatusLabel(payment.status).replace("Paid", "Completed")}
          </>
        );
      default:
        throw new Error("Unhandled payment status:" + payment.status);
    }
  }

  function getAccount() {
    if (mode === "payment")
      return accounts.find((a) => a.id === payment.paymentMethod.id);
    return accounts.find((a) => a.fundingId === payee.fundingId);
  }

  function renderModals() {
    const account = getAccount();

    switch (status) {
      case STATUS.REPEATING_EDIT_MODAL:
        return (
          <RepeatingEditModal
            onClose={() => setStatus(STATUS.IDLE)}
            onOneTimeClick={() =>
              history.push(`/edit-payment/${payment.paymentId}?onetime&review`)
            }
            onSeriesClick={() =>
              history.push(`/edit-payment/${payment.paymentId}?review`)
            }
          />
        );
      case STATUS.REPEATING_EDIT_CONFIRM_MODAL:
        return (
          <RepeatingEditModal
            onClose={() => setStatus(STATUS.DETAIL_MODAL)}
            onOneTimeClick={() =>
              history.push(`/edit-payment/${payment.paymentId}?onetime&review`)
            }
            onSeriesClick={() =>
              history.push(`/edit-payment/${payment.paymentId}?review`)
            }
          />
        );
      case STATUS.DETAIL_MODAL:
        return (
          <PaymentDetailsModal
            accounts={accounts}
            payment={
              mode === "payment"
                ? payment
                : {
                    ...payee,
                    type: "REPEATING", //do autopay types get sorted here, not sure we want to hardcode here.
                    seriesOnly: true,
                    payFrom: account,
                    paymentMethod: {
                      accountName: account.accountName,
                      accountNumber: account.accountNumber,
                    },
                    payee,
                  }
            }
            payments={payments}
            payees={payees}
            onDeleteClick={() => {
              setStatus(STATUS.DELETE_PAYMENT_MODAL);
            }}
            onClose={() => setStatus(STATUS.IDLE)}
            onEditClick={() => {
              if (mode === "payee") {
                return history.push(`/edit-payment/${payee.id}?review`);
              }
              payment.type === "REPEATING"
                ? setStatus(STATUS.REPEATING_EDIT_CONFIRM_MODAL)
                : history.push(`/edit-payment/${payment.paymentId}?review`);
            }}
            onEditAutomaticClick={() =>
              setStatus(STATUS.EDIT_EBILL_AUTOPAY_MODAL)
            }
            onViewRepeatingPaymentHistoryClick={() =>
              setStatus(STATUS.REPEATING_PAYMENT_HISTORY_MODAL)
            }
            payee={
              mode === "payee"
                ? payee
                : payees.find((p) => p.id === payment.payee.id)
            }
            filter={filter}
            account={account}
            paymentHistory={getPaymentHistory(
              mode === "payment"
                ? payment.ruleId
                : payee.repeatingPayment.ruleId
            )}
          />
        );
      case STATUS.REPEATING_PAYMENT_HISTORY_MODAL:
        return (
          <RepeatingPaymentsModal
            isPaymentHistory
            adobeEvent="bankac/billpay/reviewpayments/scheduled/repeatingdetails-overlay"
            account={account}
            payments={getPaymentHistory(
              mode === "payment"
                ? payment.ruleId
                : payee.repeatingPayment.ruleId
            )}
            onClose={() => setStatus(STATUS.DETAIL_MODAL)}
            payees={payees}
          />
        );
      case STATUS.EDIT_EBILL_AUTOPAY_MODAL:
        return (
          <RepeatingEditModal
            seriesText={"Edit AutoPay Settings"}
            header={
              "Do you want to edit this payment or your eBill AutoPay settings?"
            }
            onClose={() => setStatus(STATUS.IDLE)}
            onOneTimeClick={() =>
              history.push(
                "/edit-payment/" +
                  (mode === "payment" ? payment.paymentId : payee.paymentId) +
                  "?onetime&review"
              )
            }
            onSeriesClick={() =>
              history.push(
                "/edit-payment/" +
                  (mode === "payment" ? payment.payee.id : payee.payee.id) +
                  "?autoPayEdit&review"
              )
            }
          />
        );
      case STATUS.DELETE_PAYMENT_MODAL:
        return (
          <DeletePaymentModal
            account={account}
            accounts={accounts}
            onClose={() => setStatus(STATUS.DETAIL_MODAL)}
            onOneTimeClick={onDeleteOneTimeClick}
            onSeriesClick={onDeleteSeriesClick}
            payment={
              mode === "payment"
                ? payment
                : {
                    ...payee,
                    type: "REPEATING",
                    seriesOnly: true,
                    payFrom: account,
                    paymentMethod: {
                      accountName: account.accountName,
                      accountNumber: account.accountNumber,
                    },
                    payee,
                  }
            }
            payee={mode === "payment" ? payment.payee : payee}
            isDeleting={deleting}
            deletionError={deletionError}
            onGoBack={() => setStatus(STATUS.DETAIL_MODAL)}
          />
        );

      default:
      // Do nothing.
    }
  }

  return (
    <section className={styles.root}>
      {renderModals()}
      <div className={styles.header}>
        {/* Date isn't displayed for payee mode since date info isn't available for 30+ days in the future. */}
        <div className={styles.date}>
          {mode === "payment" ? formatShortDate(payment.deliverByDate) : ""}
        </div>
        <span className={styles.status}>{statusIcon()}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.amount}>
          {formatCurrency(
            mode === "payment" ? payment.amount : payee.repeatingPayment.amount
          )}{" "}
          {(mode === "payee" || payment.type === FREQUENCY_TYPE.REPEATING) && (
            <RevolvingIcon size="small" aria-label="Repeating payment" />
          )}
        </div>
        <div>
          <strong
            className={cx(styles.accountNameContainer, {
              [styles.hasAccountNumber]:
                mode === "payment"
                  ? payment.payee.accountNumber
                  : payee.accountNumber,
            })}
          >
            <span>
              {mode === "payment"
                ? payment.payee.nickName || payment.payee.accountName
                : payee.nickName || payee.accountName}
            </span>{" "}
            {mode === "payment"
              ? payment.payee.accountNumber &&
                `(${lastFour(payment.payee.accountNumber)})`
              : payee.accountNumber && `(${lastFour(payee.accountNumber)})`}
          </strong>
        </div>
        <div>
          <Button
            adobeEvent="BillPay:ReviewPayments:Scheduled:Lnk:View Details"
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={() => setStatus(STATUS.DETAIL_MODAL)}
            aria-label={`View ${
              mode === "payment"
                ? formatDate(payment.deliverByDate)
                : "scheduled"
            } payment details for ${formatCurrency(
              mode === "payment"
                ? payment.amount
                : payee.repeatingPayment?.amount
            )} payment to ${nickNameWithLastFour(
              mode === "payment" ? payment.payee : payee
            )}`}
          >
            View Details
          </Button>{" "}
          {(mode === "payee" || payment.status !== "COMPLETED") && (
            <>
              <span className={styles.pipe}>|</span>{" "}
              <Button
                adobeEvent="BillPay:ReviewPayments:Scheduled:Lnk:Edit"
                style={{ minWidth: "auto" }}
                buttonStyle={BUTTON_TYPES.LINK}
                aria-label={`Edit payment of ${formatCurrency(
                  mode === "payment"
                    ? payment.amount
                    : payee.repeatingPayment?.amount
                )} to ${nickNameWithLastFour(
                  mode === "payment" ? payment.payee : payee
                )}`}
                onClick={() => {
                  if (mode === "payee")
                    return history.push(
                      "/edit-payment/" + payee.id + "?review"
                    );
                  if (payment.type === "REPEATING")
                    return setStatus(STATUS.REPEATING_EDIT_MODAL);
                  if (payment.type === "EBILL_AUTOPAY")
                    return setStatus(STATUS.EDIT_EBILL_AUTOPAY_MODAL);
                  history.push(`/edit-payment/${payment.paymentId}?review`);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

PaymentSliderCard.propTypes = {
  payment: PropTypes.object,
  payee: PropTypes.object,
  payments: PropTypes.array.isRequired,
  onDeletePayment: PropTypes.func.isRequired,
  onDeleteSeriesPayment: PropTypes.func,
  payees: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
};

export default PaymentSliderCard;

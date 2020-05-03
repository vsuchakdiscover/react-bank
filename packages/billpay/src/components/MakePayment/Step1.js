import React, { useState } from "react";
import PropTypes from "prop-types";
import DebitCard from "../../images/icon-cashback-debit.png";
import MoneyMarketIcon from "reusable/lib/MoneyMarketIcon";
import PayeeCard from "./PayeeCard";
import UpdateDefaultPaymentAccountModal from "./UpdateDefaultPaymentAccountModal";
import AddCardCallout from "../reusable/AddCardCallout";
import AddCardModal from "../reusable/AddCardModal";
import Card from "reusable/lib/Card";
import Alert, { ALERT_TYPES } from "reusable/lib/Alert";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import GraySummaryBox from "./GraySummaryBox";
import ButtonGroup from "reusable/lib/ButtonGroup";
import InnerCard from "./InnerCard";
import MaxSelectedPayeesDialog from "./MaxSelectedPayeesDialog";
import {
  formatCurrency,
  nickNameWithLastFour,
  stripCommas,
  stripPeriod,
} from "reusable/lib/formattingUtils";
import styles from "./Step1.module.scss";
import { useHistory, useLocation } from "react-router-dom";
import { useLazyApi } from "reusable/lib/useApi";
import { paymentsApi } from "../../api";
import PlusIconCircle from "reusable/lib/PlusIconCircle";
import DeletePaymentModal from "../../components/reusable/DeletePaymentModal";
import DeleteAllPaymentsModal from "../../components/reusable/DeleteAllPaymentsModal";
import RepeatingEditModal from "../../components/reusable/RepeatingEditModal";
import RepeatingPaymentsModal from "./RepeatingPaymentsModal";
import useAlert from "../../hooks/useAlert";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import Modal from "reusable/lib/Modal";
import SuccessIcon from "reusable/lib/SuccessIcon";
import SmartLink from "reusable/lib/SmartLink";
import { clickTrack } from "reusable/lib/tracking";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

const STEP1_STATUS = {
  IDLE: "idle",
  MAX_SELECTED_PAYEES: "maxSelectedPayees",
  DEFAULT_PAYMENT_ACCOUNT: "defaultPaymentAccount",
  ADD_CARD: "addCard",
  DELETE_PAYMENT: "deletePayment",
  DELETE_SCHEDULED_PAYMENT: "deleteScheduledPayment",
  DELETE_ALL_PAYMENTS: "deleteAllPayments",
  VIEW_SCHEDULED_PAYMENTS: "viewScheduledPaymens",
  EDIT_REPEATING: "editRepeating",
  EDIT_AUTOPAY: "editAutopay",
  DELETE_CONFIRMATION: "deleteConfirmation",
  SINGLE_DELETE_CONFIRMATION: "singleDeleteConfirmation",
  REPEATING_DELETE_CONFIRMATION: "repeatingDeleteConfirmation",
  AUTOPAY_DELETE_CONFIRMATION: "autoPayDeleteConfirmation",
};

function Step1({
  accounts,
  dispatch,
  discoverCreditCards,
  formResetCount,
  payees,
  selectedPayments,
  payments,
  scheduledPayments,
  errors,
  editPaymentId,
  forcedOneTime,
  autoPaySwitch,
}) {
  const {
    loading: deleting,
    error: deletionError,
    setError: setDeletionError,
    callApi: deletePaymentApi,
  } = useLazyApi(paymentsApi.deletePayment, {
    paymentId: editPaymentId,
    payeeId: null,
    repeating: false,
    automatic: false,
  });
  const history = useHistory();
  const location = useLocation();
  const referrer = location.search.includes("review");
  const [status, setStatus] = useState(STEP1_STATUS.IDLE);
  const [scheduledPaymentToDelete, setScheduledPaymentToDelete] = useState(
    null
  );
  const [viewScheduledPayments, setViewScheduledPayments] = useState("");
  const [editPayment, setEditPayment] = useState("");
  const { showAlert } = useAlert();

  useTrackPageLoad(...getPageLoadVars());

  function getPageLoadVars() {
    return editPaymentId
      ? [
          "bankac/billpay/makePayments/editrepeatpayment",
          {
            events: "event51",
            eVar5: "BillPay:EditPayment",
            prop5: "BillPay:EditPayment",
          },
        ]
      : [
          "bankac/billpay/makePayments",
          {
            events: "event51",
            eVar5: "BillPay:SchedulePayment",
            prop5: "BillPay:SchedulePayment",
          },
        ];
  }

  function getSelectedAccountsLackingFunds() {
    const a = accounts.map((a) => ({
      accountName: nickNameWithLastFour(a),
      availableBalance: a.availableBalance,
      id: a.id,
      totalAmount: selectedPayments
        .filter((s) => s.payFrom === a.id)
        .reduce((total, payment) => {
          return payment.amount
            ? parseNum(total) + parseNum(payment.amount)
            : total;
        }, 0),
    }));

    return a.filter((a) => a.availableBalance < a.totalAmount);
  }

  function handlePayeeCheck({ target }) {
    const MAX_PAYEES_PER_TRANSACTION = 5;
    const isAlreadyChecked = selectedPayments.find(
      (p) => p.payee.id === target.value
    );
    // If the user just tried to check the box, show dialog if max has already been reached.
    if (
      !isAlreadyChecked &&
      selectedPayments.length === MAX_PAYEES_PER_TRANSACTION
    ) {
      setStatus(STEP1_STATUS.MAX_SELECTED_PAYEES);
    } else {
      dispatch(["selectPayee", target.value]);
    }
  }

  function handleBlur({ target }, payment) {
    dispatch([
      "validateField",
      { name: target.name, value: target.value, payment },
    ]);
  }

  function handleSubmitStep1(event) {
    event.preventDefault();
    clickTrack(
      editPaymentId
        ? "MAKE_BILL_PAYMENTS_EDIT_REPEAT_PYMT_CONTINUE_BTN"
        : "MAKE_BILL_PAYMENTS_CONTINUE_BTN"
    );
    dispatch(["submitStep1"]);
  }

  function parseNum(num) {
    return parseFloat(stripCommas(num));
  }

  // The errors displayed below fields are shorter than the errors displayed in the error summary.
  // They don't require mentioning the relevant account.
  // Add the period on the end since periods are stripped first to ensure consistency.
  function getShortErrors(errors) {
    const shortErrors = {};
    Object.keys(errors).forEach((e) => {
      shortErrors[e] = stripPeriod(errors[e].message);
    });
    return shortErrors;
  }

  const accountsLackingFunds = getSelectedAccountsLackingFunds();
  const preferredAccount = accounts.find((a) => a.preferred) || accounts[0]; //if no account is preferred in the api response just assign the first one in the list
  const shortErrors = getShortErrors(errors);

  // Discover cards should be displayed first
  const sortedPayments = [...payments].sort((a) =>
    a.payee.name === "Discover Credit Card" ? -1 : 0
  );

  function handleDeleteClick(e) {
    e.preventDefault();
    setStatus(STEP1_STATUS.DELETE_PAYMENT);
  }

  const handleDeleteAllConfirm = async (e, payments) => {
    e.preventDefault();
    try {
      Promise.all(
        payments.map(async (payment) => {
          await deletePaymentApi({
            paymentId: payment.paymentId,
            repeating: false,
          });
        })
      );
      dispatch(["removeAllScheduledPayments", { payments }]);
      setStatus(STEP1_STATUS.DELETE_CONFIRMATION);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  function handleDeleteAllClick(e) {
    e.preventDefault();
    setStatus(STEP1_STATUS.DELETE_ALL_PAYMENTS);
  }

  function handleScheduledDeleteClick(e, payment) {
    e.preventDefault();
    const { deliveryMethod } = payees.find((p) => p.id === payment.payee.id);
    const payee = { ...payment.payee, deliveryMethod };
    setScheduledPaymentToDelete({ ...payment, payee });
    setStatus(STEP1_STATUS.DELETE_SCHEDULED_PAYMENT);
  }

  function handleViewPaymentsClick(e, payments) {
    e.preventDefault();
    setViewScheduledPayments(payments);
    setStatus(STEP1_STATUS.VIEW_SCHEDULED_PAYMENTS);
  }

  function handleEditClick(e, data) {
    e.preventDefault();
    switch (data.type) {
      case FREQUENCY_TYPE.REPEATING:
        setEditPayment(data);
        setStatus(STEP1_STATUS.EDIT_REPEATING);
        break;
      case FREQUENCY_TYPE.EBILL_AUTOPAY:
        setStatus(STEP1_STATUS.EDIT_AUTOPAY);
        setEditPayment(data);
        break;
      default:
        history.push("/edit-payment/" + data.paymentId);
    }
  }

  const getDeleteButtonText = (frequency) => {
    switch (frequency) {
      case FREQUENCY_TYPE.EBILL_AUTOPAY:
        return "Delete eBill AutoPay";
      default:
        return "Delete Payment";
    }
  };

  async function onOneTimeClick(e, payment) {
    const paymentId = editPaymentId ? editPaymentId : payment.paymentId;
    const paymentMethod = payment.paymentMethod || payment.payFrom; //if entering the flow as an automatic payment series the paymentMethod is not available so can alternatively use payFrom

    try {
      e.preventDefault();
      await deletePaymentApi({ paymentId });
      if (editPaymentId) {
        showAlert(
          <p>
            Your payment to <b>{nickNameWithLastFour(payment.payee)}</b> from{" "}
            <b>{nickNameWithLastFour(paymentMethod)}</b> scheduled to be
            delivered by {formatDateStringToMDY(payment.deliverByDate)} has been
            deleted.
          </p>
        );
        redirectToReviewPayments();
      } else {
        dispatch(["removeScheduledPayment", { payment }]);
        setStatus(STEP1_STATUS.SINGLE_DELETE_CONFIRMATION);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function getAccount(paymentId) {
    return (
      accounts.find((a) => a.id === paymentId) ??
      accounts.find((a) => a.fundingId === paymentId)
    );
  }

  async function onSeriesClick(e, payment) {
    try {
      e.preventDefault();
      if (payment.type === FREQUENCY_TYPE.EBILL_AUTOPAY) {
        await deletePaymentApi({
          payeeId: payment.payee.id,
          automatic: true,
        });
        if (editPaymentId) {
          showAlert(
            <p>
              <b>Your eBill AutoPay settings have been deleted</b>
            </p>
          );
          redirectToReviewPayments();
        } else {
          setStatus(STEP1_STATUS.AUTOPAY_DELETE_CONFIRMATION);
          dispatch(["removeAutopay", { payment }]);
        }
      } else {
        await deletePaymentApi({
          payeeId: payment.payee.id,
          repeating: true,
        });
        if (editPaymentId) {
          showAlert(
            <p>
              Your repeating payments to{" "}
              <b>{nickNameWithLastFour(payment.payee)}</b> from{" "}
              <b>
                {nickNameWithLastFour(
                  payment.paymentMethod || getAccount(payment.payFrom)
                )}
              </b>{" "}
              have been deleted.
            </p>
          );
          redirectToReviewPayments();
        } else {
          setStatus(STEP1_STATUS.REPEATING_DELETE_CONFIRMATION);
          dispatch(["removeScheduledPayment", { payment, repeating: true }]);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function redirectToReviewPayments() {
    history.push({
      pathname: "/review-payments",
      state: { preserveAlerts: true },
    });
  }

  function handleDeleteModalCloseClick() {
    setStatus(STEP1_STATUS.IDLE);
    setDeletionError("");
  }

  function renderConfirmModal(closeAriaLabel, header, adobeEventOnLoad) {
    return (
      <Modal
        adobeEventOnLoad={adobeEventOnLoad}
        aria-label={closeAriaLabel}
        onClose={() => setStatus(STEP1_STATUS.IDLE)}
      >
        <>
          <p className="overlayHeader mb-30">
            <>
              <SuccessIcon className={styles.successIcon} /> {header}
            </>
          </p>
          <Button onClick={() => setStatus(STEP1_STATUS.IDLE)}>Got It</Button>
        </>
      </Modal>
    );
  }

  // Render a single modal, if the relevant status is set
  function renderModals() {
    switch (status) {
      case STEP1_STATUS.MAX_SELECTED_PAYEES:
        return (
          <MaxSelectedPayeesDialog
            onClose={() => setStatus(STEP1_STATUS.IDLE)}
          />
        );

      case STEP1_STATUS.DEFAULT_PAYMENT_ACCOUNT:
        return (
          <UpdateDefaultPaymentAccountModal
            accounts={accounts.map((a) => ({
              label: nickNameWithLastFour(a),
              value: a.id,
            }))}
            dispatch={dispatch}
            currentAccount={preferredAccount}
            onClose={() => setStatus(STEP1_STATUS.IDLE)}
          />
        );

      case STEP1_STATUS.ADD_CARD:
        return (
          <AddCardModal
            adobePageTrackEvent="bankac/billpay/makePayments/addDiscoverCardOverlay"
            discoverCreditCards={discoverCreditCards}
            onClose={() => setStatus(STEP1_STATUS.IDLE)}
            onSuccess={(resp) => dispatch(["addCard", resp])}
          />
        );

      case STEP1_STATUS.VIEW_SCHEDULED_PAYMENTS:
        return (
          <>
            <RepeatingPaymentsModal
              adobeEventOnCollapseRow="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_PYMT_COLLAPSE_LNK"
              adobeEventOnExpandRow="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_PYMT_EXPAND_LNK"
              adobeEvent="bankac/billpay/makePayments/upcomingPymtsOverlay"
              onEditClick={handleEditClick}
              account={{
                name: nickNameWithLastFour(viewScheduledPayments[0].payee),
              }}
              payments={viewScheduledPayments}
              onClose={() => setStatus(STEP1_STATUS.IDLE)}
              payees={payees}
              onDeleteScheduledClick={handleScheduledDeleteClick}
              onDeleteAllClick={handleDeleteAllClick}
            />
          </>
        );

      case STEP1_STATUS.EDIT_REPEATING:
        return (
          <RepeatingEditModal
            adobeEvent="bankac/billpay/makePayments/editRepeatingPymtOverlay"
            adobeEventOnGoBack="MAKE_BILL_PAYMENTS_EDIT_REPEATING_PYMT_OVERLAY_GO_BACK_LNK"
            onOneTimeClick={() => {
              clickTrack(
                "MAKE_BILL_PAYMENTS_EDIT_REPEATING_PYMT_OVERLAY_EDIT_THIS_PYMT_BTN"
              );
              history.push(
                "/edit-payment/" + editPayment.paymentId + "?onetime"
              );
            }}
            onSeriesClick={() => {
              clickTrack(
                "MAKE_BILL_PAYMENTS_EDIT_REPEATING_PYMT_OVERLAY_EDIT_ALL_PYMTS_BTN"
              );
              history.push("/edit-payment/" + editPayment.paymentId);
            }}
            onClose={() => setStatus(STEP1_STATUS.VIEW_SCHEDULED_PAYMENTS)}
          />
        );

      case STEP1_STATUS.EDIT_AUTOPAY:
        return (
          <RepeatingEditModal
            seriesText={"Edit AutoPay Settings"}
            header={
              "Do you want to edit this payment or your eBill AutoPay settings?"
            }
            onOneTimeClick={() =>
              history.push(
                "/edit-payment/" + editPayment.paymentId + "?onetime&review"
              )
            }
            onSeriesClick={() =>
              history.push(
                "/edit-payment/" + editPayment.payee.id + "?autoPayEdit&review"
              )
            }
            onClose={() => setStatus(STEP1_STATUS.VIEW_SCHEDULED_PAYMENTS)}
          />
        );

      case STEP1_STATUS.DELETE_PAYMENT:
        //in this case we are in edit mode where there is the option to delete a single payment or scheduled payment rule
        //the payments array will contain only one entry - payments[0]
        return (
          <DeletePaymentModal
            adobePageTrackEvent="bankac/billpay/makePayments/deleteRepeatPymtOverlay"
            adobeEventOnGoBack="MAKE_BILL_PAYMENTS_DELETE_REPEAT_PYMT_SERIES_OVERLAY_GO_BACK_LNK"
            isDeleting={deleting}
            payment={payments[0]}
            payee={payments[0].payee}
            onOneTimeClick={onOneTimeClick}
            onSeriesClick={onSeriesClick}
            deletionError={deletionError}
            onClose={handleDeleteModalCloseClick}
            onGoBack={handleDeleteModalCloseClick}
            accounts={accounts}
            seriesOnly={payments[0].seriesOnly} //Don't prompt the user to select between editing a series of payments and a single payment if seriesOnly. This value is set in the getScheduledPayment function in schedulePaymentReducer and refers to use cases where there are no currently scheduled payments - only a repeating payment rule
          />
        );

      case STEP1_STATUS.DELETE_SCHEDULED_PAYMENT:
        return (
          <DeletePaymentModal
            isDeleting={deleting}
            payment={scheduledPaymentToDelete}
            payee={scheduledPaymentToDelete.payee}
            onOneTimeClick={onOneTimeClick}
            onSeriesClick={onSeriesClick}
            deletionError={deletionError}
            onGoBack={() => {
              setStatus(STEP1_STATUS.VIEW_SCHEDULED_PAYMENTS);
            }}
            onClose={() => {
              setStatus(STEP1_STATUS.IDLE);
            }}
          />
        );

      case STEP1_STATUS.DELETE_ALL_PAYMENTS:
        return (
          <DeleteAllPaymentsModal
            isDeleting={deleting}
            payments={viewScheduledPayments}
            deletionError={deletionError}
            onDeleteAllConfirmClick={handleDeleteAllConfirm}
            onClose={() => setStatus(STEP1_STATUS.IDLE)}
          />
        );

      case STEP1_STATUS.SINGLE_DELETE_CONFIRMATION:
        return renderConfirmModal(
          "Delete a Scheduled Payment",
          "Your payment has been deleted"
        );

      case STEP1_STATUS.REPEATING_DELETE_CONFIRMATION:
        return renderConfirmModal(
          "Delete a Repeating Payment",
          "Your repeating payments have been deleted",
          "bankac/billpay/makePayments/deleteAllRepeatPymtConfirmation"
        );

      case STEP1_STATUS.AUTOPAY_DELETE_CONFIRMATION:
        return renderConfirmModal(
          "Delete a Repeating Payment",
          "Your eBill AutoPay settings have been deleted"
        );

      case STEP1_STATUS.DELETE_CONFIRMATION:
        return renderConfirmModal(
          "Delete All Payments",
          "Your payments have been deleted"
        );

      default:
        return null;
    }
  }

  return (
    <>
      {renderModals()}
      <InnerCard>
        {!editPaymentId && (
          <SmartLink
            className={styles.addPayee}
            adobeEvent="MAKE_BILL_PAYMENTS_ADD_A_PAYEE_LNK"
            to="/manage-payees"
          >
            <PlusIconCircle />{" "}
            <span className={styles.linkText}>Add a Payee</span>
          </SmartLink>
        )}
        {!editPaymentId && (
          <Card className={styles.defaultCard}>
            {preferredAccount.type === "CHECKING" ? (
              <img height="40" src={DebitCard} alt="Bank Account Card" />
            ) : (
              <MoneyMarketIcon />
            )}

            <p className="mb-0">
              <span
                aria-label={`Your default payment account is ${nickNameWithLastFour(
                  preferredAccount
                )}.`}
              >
                Your <strong>default payment account</strong> is{" "}
                <strong>{nickNameWithLastFour(preferredAccount)}</strong>.{" "}
              </span>
              {accounts.length > 1 && (
                <Button
                  buttonStyle={BUTTON_TYPES.LINK}
                  adobeEvent="MAKE_BILL_PAYMENTS_DEFAULT_PAYMENT_ACCOUNT_UPDATE_LNK"
                  aria-label="Update default payment account"
                  onClick={() =>
                    setStatus(STEP1_STATUS.DEFAULT_PAYMENT_ACCOUNT)
                  }
                >
                  Update
                </Button>
              )}
            </p>
          </Card>
        )}

        {discoverCreditCards.length > 0 && (
          <AddCardCallout
            adobeEvent="MAKE_BILL_PAYMENTS_DISCOVER_CARD_ADD_NOW_BTN"
            setShowAddCardDialog={() => setStatus(STEP1_STATUS.ADD_CARD)}
          />
        )}

        <form
          // Use key to completely redraw the form on reset.
          // This assures radio buttons are unselected upon reset.
          key={formResetCount}
          onSubmit={handleSubmitStep1}
          id="step1Form"
        >
          {sortedPayments.map((payment) => (
            <PayeeCard
              key={payment.payee.id}
              payment={payment}
              dispatch={dispatch}
              onCheckPayee={handlePayeeCheck}
              accounts={accounts}
              errors={shortErrors}
              onBlur={handleBlur}
              defaultDeliverByDate={payment.payee.earliestPaymentDate}
              scheduledPayments={scheduledPayments.filter(
                (s) => s.payee.id === payment.payee.id
              )}
              editPaymentId={editPaymentId}
              forcedOneTime={forcedOneTime}
              payees={payees}
              onViewPaymentsClick={handleViewPaymentsClick}
            />
          ))}
          {selectedPayments.length > 0 && (
            <>
              {!editPaymentId && (
                <GraySummaryBox
                  accounts={accounts}
                  selectedPayments={selectedPayments}
                />
              )}
              {accountsLackingFunds.length > 0 && (
                <Alert
                  closable={false}
                  className={styles.paymentWarning}
                  type={ALERT_TYPES.WARNING}
                >
                  <p>
                    <strong>
                      You&apos;ll need to make a deposit to cover your scheduled
                      payments
                    </strong>
                  </p>
                  {accountsLackingFunds.map((a) => {
                    return (
                      <p key={a.id}>
                        {formatCurrency(a.totalAmount)} exceeds your available
                        balance for {a.accountName} of{" "}
                        {formatCurrency(a.availableBalance)}.
                      </p>
                    );
                  })}
                </Alert>
              )}
            </>
          )}
          <ButtonGroup className="mt-25 mb-25">
            <Button type="submit" className={styles.buttonMax}>
              Continue
            </Button>
            <ButtonGroup.Link>
              <>
                {!editPaymentId && (
                  <Button
                    adobeEvent="MAKE_BILL_PAYMENTS_RESET_LNK"
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={() => dispatch(["resetForm", payees])}
                  >
                    Reset
                  </Button>
                )}

                {editPaymentId && (
                  <SmartLink
                    adobeEvent="MAKE_BILL_PAYMENTS_EDIT_REPEAT_PYMT_CANCEL_LNK"
                    to={referrer ? "/review-payments" : "/"}
                  >
                    Back
                  </SmartLink>
                )}
              </>
            </ButtonGroup.Link>
            {editPaymentId && !autoPaySwitch && (
              <>
                <ButtonGroup.Link>
                  <Button
                    adobeEvent="MAKE_BILL_PAYMENTS_EDIT_REPEAT_PYMT_DELETE_PAYMENT_LNK"
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={handleDeleteClick}
                  >
                    {!forcedOneTime
                      ? getDeleteButtonText(payments[0].frequencyType)
                      : "Delete Payment"}
                  </Button>
                </ButtonGroup.Link>
              </>
            )}
          </ButtonGroup>
        </form>
      </InnerCard>
    </>
  );
}

Step1.propTypes = {
  accounts: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  discoverCreditCards: PropTypes.array.isRequired,
  editPaymentId: PropTypes.string,
  formResetCount: PropTypes.number.isRequired,
  payees: PropTypes.array.isRequired,
  selectedPayments: PropTypes.array.isRequired,
  payments: PropTypes.array.isRequired,
  scheduledPayments: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  forcedOneTime: PropTypes.bool.isRequired,
  autoPaySwitch: PropTypes.bool.isRequired,
};

export default Step1;

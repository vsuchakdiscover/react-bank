import React from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import TextInput from "reusable/lib/TextInput";
import Combobox from "reusable/lib/Combobox";
import ReadOnlyInput from "reusable/lib/ReadOnlyInput";
import CurrencyInput from "reusable/lib/CurrencyInput";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import DateHelpText from "./DateHelpText";
import styles from "./InnerPayeeCard.module.scss";
import frequencies from "../../utils/frequencies";
import {
  nickNameWithLastFour,
  formatCurrency,
} from "reusable/lib/formattingUtils";
import { formatDate, parseDateString } from "reusable/lib/dateUtils";
import cx from "classnames";
import Tooltip from "reusable/lib/Tooltip";
import AmountType from "./AmountType";
import DeliveryMethod from "../reusable/DeliveryMethod";
import Alert from "reusable/lib/Alert";
import PencilIcon from "reusable/lib/PencilIcon";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import EBillLinkIcon from "reusable/lib/EBillLinkIcon";
import { EBILL_STATUS } from "../Ebills/Ebills";
import SmartLink from "reusable/lib/SmartLink";

// Lazy loading since a big dependency. This will move it to a separate bundle so it can be shared by other pages that use DatePicker.
const DatePicker = React.lazy(() =>
  import(/* webpackChunkName: "DatePicker" */ "reusable/lib/DatePicker")
);

const InnerPayeeCard = ({
  accounts,
  autoPay,
  errors,
  onBlur,
  onChange,
  oneTimeOnly,
  dispatch,
  payee,
  payment,
  repeatingOnly,
  scheduledPayments,
  onViewPaymentsClick,
  editPaymentId,
  forcedOneTime,
  showAutoPayBanner,
  autoEnrolled,
  repeatingPaymentId,
}) => {
  const history = useHistory();

  const payFromOptions = accounts.map((a) => ({
    label: nickNameWithLastFour(a),
    value: a.id,
  }));

  const dateOneYearAhead = () => {
    const today = new Date();
    today.setFullYear(new Date().getFullYear() + 1);
    const yearAhead = new Date(today);
    // one year ahead minus one day per client request here
    return new Date(yearAhead.setDate(yearAhead.getDate() - 1));
  };

  // Get the account info associated with the selected payFrom account
  const account = payment.payFrom
    ? accounts.find((a) => a.id === payment.payFrom)
    : null;

  const availableBalanceHelpText = account
    ? "Available Balance: " + formatCurrency(account.availableBalance)
    : "";

  const PAYMENT_DATES = {
    ON_DUE_DATE: "Due Date",
    EBILL_ARRIVES: "Date eBill Arrives",
  };

  const isEditingSeries =
    editPaymentId && payment.frequency !== FREQUENCY_TYPE.ONE_TIME;

  const getPaymentDateText = () => {
    if (payment.paymentDate) {
      return payment.paymentDate === "EBILL_ARRIVES"
        ? `Date eBill Arrives: ${formatDate(
            parseDateString(payment.payee.ebill.receivedDate),
            "MM/DD/YYYY"
          )}`
        : `Due Date: ${formatDate(
            parseDateString(payment.payee.ebill.dueDate),
            "MM/DD/YYYY"
          )}`;
    } else {
      return "";
    }
  };

  const showAmountTypeField = () => {
    if (autoPay) return true; // autopay sees the amount dropdown for create and edit flows
    if (editPaymentId) return false; // hide amount for edit flow
    if (repeatingOnly) return false; // hide amount for repeating payments
    return payee.ebill || payee.cardPaymentInfo; // show amount if ebill or discover credit card
  };

  const getDueDate = () => {
    if (payment.payee.ebill) {
      return payment.payee.ebill.dueDate;
    }
    if (payment.payee.cardPaymentInfo) {
      return payment.payee.cardPaymentInfo.dueDate;
    }
    return "";
  };

  return (
    <>
      {showAutoPayBanner && !process.env.REACT_APP_HIDE_AUTOPAY && (
        <Alert
          type="no_icon"
          className={styles.blueAlert}
          onClose={() => dispatch(["dismissAutoPayBanner", payment.payee.id])}
        >
          <p className="meta-web-bold">
            Set up eBill AutoPay for the easiest way to pay
          </p>
          <p>
            Update your scheduled payments to eBill AutoPay and set your
            payments for minimum payment or full balance, on your due date or
            when your eBill arrives.{" "}
            <Button
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={() => {
                history.push(
                  "/edit-payment/" + payment.payee.id + "?onetime&autoPaySwitch"
                );
              }}
            >
              Switch to eBill AutoPay
            </Button>
          </p>
        </Alert>
      )}

      {autoEnrolled && !editPaymentId && !process.env.REACT_APP_HIDE_AUTOPAY && (
        <>
          <p className="dark-gray mb-0">
            <span className={styles.greenDot}></span> eBill AutoPay ON
          </p>
          {!payment.autoPayBannerDismissed && (
            <Alert
              type="no_icon"
              className={styles.blueAlert}
              onClose={() =>
                dispatch(["dismissAutoPayBanner", payment.payee.id])
              }
            >
              <p className="meta-web-bold">
                You have eBill AutoPay set up for this payee
              </p>
              <p>
                You can schedule a One Time payment in addition to your eBill
                AutoPay or edit your eBill AutoPay.
                <br />
                <Button
                  buttonStyle={BUTTON_TYPES.LINK}
                  className="mt-10"
                  onClick={() => {
                    history.push(
                      "/edit-payment/" + payment.payee.id + "?autoPayEdit"
                    );
                  }}
                >
                  <PencilIcon /> Edit eBill AutoPay
                </Button>
              </p>
            </Alert>
          )}
        </>
      )}

      {editPaymentId &&
        payee.ebill &&
        payee.ebillStatus === EBILL_STATUS.ACTIVE && (
          <>
            <SmartLink
              adobeEvent="MAKE_BILL_PAYMENTS_VIEW_BILL_LNK"
              to={payee.ebill.paymentURIDetails}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ebillLink}
              aria-label="Opens a new browser window"
            >
              <EBillLinkIcon />
              View Bill
            </SmartLink>
          </>
        )}

      <div className="d-flex flex-wrap w-100">
        <div className={styles.input}>
          {accounts.length === 1 ? (
            <ReadOnlyInput
              label="Pay From"
              value={nickNameWithLastFour(accounts[0])}
              helpText={availableBalanceHelpText}
            />
          ) : (
            <Combobox
              id={payee.id + "-payFrom"}
              label="Pay From"
              aria-label={"Pay " + nickNameWithLastFour(payee) + " from"}
              name="payFrom"
              value={payment.payFrom}
              onChange={onChange}
              error={errors[payee.id + "-payFrom"]}
              options={payFromOptions}
              helpText={availableBalanceHelpText}
              required
              onBlur={(e) => onBlur(e, payment)}
            />
          )}
          {autoPay && (
            <DeliveryMethod
              allowByTextClass={styles.autopay}
              isBold
              method="STANDARD_ELECTRONIC"
              showAllowByText
              textClass={styles.autopay}
              displayLongName
            />
          )}
          {account && account.type === "MONEYMARKET" && (
            <div className={cx(styles.note, styles.regd, "mt-1 mb-0")}>
              Certain types of transactions from this account are limited to 6
              per calendar month. Additional limited transactions may lead to
              account closure.
              <Tooltip
                adobeEvent="MAKE_BILL_PAYMENTS_SCHEDULE_PYMTS_LIMITED_TRANS_TOOLTIP_LNK"
                ariaLabel="Additional information about limited transactions."
                width="500"
              >
                <span className={styles.regdTitle}>Limited transactions</span>
                <ul className={styles.regdList}>
                  <li>
                    Federal law limits certain types of withdrawals and
                    transfers from savings and money market accounts to a
                    combined total of 6 per calendar month per account.
                  </li>
                  <li>
                    There are no limits on ATM withdrawals or official checks
                    mailed to you. To get an account with an unlimited number of
                    transactions, consider opening a Discover Cashback Debit
                    Account.
                  </li>
                  <li>
                    If you go over these limitations on more than an occasional
                    basis, your account may be closed. See Section 11 of the
                    Deposit Account Agreement for more details.
                  </li>
                </ul>
              </Tooltip>
            </div>
          )}
        </div>
        <div className={styles.input}>
          {showAmountTypeField() ? (
            <>
              <AmountType
                onBlur={onBlur}
                dispatch={dispatch}
                onChange={!autoPay && onChange}
                payee={payee}
                payment={payment}
                error={errors[payee.id + "-amountType"]}
                autoPay={autoPay}
              />
              {payment.amountType === "other" && (
                <CurrencyInput
                  id={payee.id + "-amount"}
                  name="amount"
                  onChange={onChange}
                  value={payment.amount}
                  error={errors[payee.id + "-amount"]}
                  label={
                    payment.amountType === "other" ? "Other Amount" : "Amount"
                  }
                  aria-label={nickNameWithLastFour(payee) + " payment amount"}
                  required
                  onBlur={(e) => onBlur(e, payment)}
                />
              )}
            </>
          ) : (
            <CurrencyInput
              id={payee.id + "-amount"}
              name="amount"
              onChange={onChange}
              value={payment.amount}
              error={errors[payee.id + "-amount"]}
              label={payment.amountType === "other" ? "Other Amount" : "Amount"}
              aria-label={nickNameWithLastFour(payee) + " payment amount"}
              required
              onBlur={(e) => onBlur(e, payment)}
            />
          )}
        </div>
        {!forcedOneTime &&
        !autoPay && ( //user wants to delete one of series of repeating payments, show restricted data*/
            <div className={styles.input}>
              {(payee.hasOwnProperty("repeatingPayment") && !editPaymentId) ||
              oneTimeOnly ||
              (editPaymentId &&
                payment.frequency === FREQUENCY_TYPE.ONE_TIME) ? (
                <ReadOnlyInput
                  label="Frequency"
                  value="One Time"
                  helpText={
                    !oneTimeOnly &&
                    !editPaymentId && (
                      <>
                        You can only have one repeating payment at a time.{" "}
                        <Button
                          adobeEvent="MAKE_BILL_PAYMENTS_EDIT_YOUR_REPEATING_PAYMENT_LNK"
                          buttonStyle={BUTTON_TYPES.LINK}
                          onClick={() =>
                            history.push(
                              `/edit-payment/${repeatingPaymentId || payee.id}`
                            )
                          }
                        >
                          Edit your repeating payment
                        </Button>
                      </>
                    )
                  }
                />
              ) : (
                <Combobox
                  id={payee.id + "-frequency"}
                  label="Frequency"
                  aria-label={
                    nickNameWithLastFour(payee) + " payment frequency"
                  }
                  name="frequency"
                  value={payment.frequency}
                  onChange={onChange}
                  error={errors[payee.id + "-frequency"]}
                  options={[
                    { label: "Please Select", value: "" },
                    ...Object.keys(frequencies)
                      .filter((f) => f !== "REPEATING")
                      .filter((f) =>
                        repeatingOnly || isEditingSeries
                          ? f !== FREQUENCY_TYPE.ONE_TIME
                          : f
                      )
                      .map((f) => ({
                        label: frequencies[f],
                        value: f,
                      })),
                  ]}
                  required
                  onBlur={(e) => onBlur(e, payment)}
                />
              )}
            </div>
          )}
        <div className={styles.input}>
          {autoPay ? (
            <>
              <Combobox
                id={payee.id + "-paymentDate"}
                label="Deliver By"
                aria-label={
                  nickNameWithLastFour(payee) + " automatic payment date"
                }
                name="paymentDate"
                value={payment.paymentDate}
                onChange={onChange}
                error={errors[payee.id + "-paymentDate"]}
                options={Object.keys(PAYMENT_DATES).map((p) => ({
                  label: PAYMENT_DATES[p],
                  value: p,
                }))}
                required
                onBlur={(e) => onBlur(e, payment)}
                helpText={payee.ebill && getPaymentDateText()}
              />
            </>
          ) : (
            <DatePicker
              id={payee.id + "-deliverByDate"}
              name="deliverByDate"
              label={
                isEditingSeries &&
                payment.payee.repeatingPayment?.nextPaymentDate
                  ? "Deliver Next Payment By"
                  : "Deliver By"
              }
              aria-label={
                nickNameWithLastFour(payee) + " payment deliver by date"
              }
              error={errors[payee.id + "-deliverByDate"]}
              onError={(error) => {
                dispatch(["handleDatePickerErrors", { error, payment }]);
              }}
              value={
                isEditingSeries &&
                payment.payee.repeatingPayment?.nextPaymentDate
                  ? payment.payee.repeatingPayment.nextPaymentDate
                  : payment.deliverByDate
              }
              onChange={onChange}
              dueDate={getDueDate()}
              required
              minDate={payment.payee.earliestPaymentDate}
              maxDate={formatDate(dateOneYearAhead())}
              showLegend
              disableBankHolidays
              unavailableDays={[0, 6]}
              isLarge
              dayTypes={{
                selected: { showInLegend: true, legendWeight: 1 },
                available: { showInLegend: true, legendWeight: 2 },
                unavailable: { showInLegend: true, legendWeight: 3 },
                due: { showInLegend: getDueDate() !== "", legendWeight: 4 },
              }}
              helpText={
                <DateHelpText
                  className="copy"
                  deliveryMethod={payee.deliveryMethod}
                  dateString={payment.deliverByDate}
                  frequency={payment.frequency}
                />
              }
              calendarHelpText={
                payment.frequency !== FREQUENCY_TYPE.ONE_TIME
                  ? "If a scheduled payment date falls on a weekend or a holiday, the payment will be made on the prior business day."
                  : ""
              }
            />
          )}
        </div>
        {payment.frequency !== "" &&
          payment.frequency !== FREQUENCY_TYPE.ONE_TIME && (
            <>
              <div className={styles.input}>
                <Combobox
                  id={payee.id + "-ends"}
                  label="Ends"
                  aria-label={nickNameWithLastFour(payee) + " payment ends"}
                  name="ends"
                  value={payment.ends}
                  onBlur={(e) => onBlur(e, payment)}
                  onChange={onChange}
                  options={[
                    { label: "Until I cancel", value: "Never" },
                    {
                      label: "After Set Number of Payments",
                      value: "After Set Number of Payments",
                    },
                  ]}
                  required
                />
              </div>

              {payment.ends === "After Set Number of Payments" && (
                <div className={styles.input}>
                  <TextInput
                    label="Number of Payments"
                    aria-label={
                      nickNameWithLastFour(payee) + " number of payments"
                    }
                    id={payee.id + "-noOfPayments"}
                    name="noOfPayments"
                    onBlur={(e) => onBlur(e, payment)}
                    maxLength={3}
                    onChange={onChange}
                    value={payment.noOfPayments.toString()}
                    error={errors[payee.id + "-noOfPayments"]}
                    required
                  />
                </div>
              )}
            </>
          )}
        {(payment.frequency !== FREQUENCY_TYPE.ONE_TIME || forcedOneTime) &&
        (!autoEnrolled || autoPay) ? (
          ""
        ) : (
          <div className={styles.input}>
            <TextInput
              label="Notes"
              aria-label={nickNameWithLastFour(payee) + " note"}
              id={payee.id + "-note"}
              name="note"
              onBlur={(e) => onBlur(e, payment)}
              onChange={onChange}
              value={payment.note}
              error={errors[payee.id + "-note"]}
              helpText="For your records only"
              maxLength={32}
            />
          </div>
        )}
        {(payee.deliveryMethod === "TRUST_CHECK" ||
          payee.deliveryMethod === "DIRECT_CHECK") && (
          <div className={styles.input}>
            <TextInput
              label="Memo"
              aria-label={nickNameWithLastFour(payee) + " memo"}
              id={payee.id + "-memo"}
              name="memo"
              error={errors[payee.id + "-memo"]}
              onBlur={(e) => onBlur(e, payment)}
              onChange={onChange}
              value={payment.memo}
              helpText="Printed on payee's check"
              maxLength={32}
            />
          </div>
        )}
        {scheduledPayments.length > 0 && !editPaymentId && (
          <p className={cx(styles.note, styles.width100, "mb-0", "mt-15")}>
            You have payment(s) scheduled for this payee.{" "}
            <Button
              adobeEvent="MAKE_BILL_PAYMENTS_VIEW_PAYMENTS_LNK"
              buttonStyle={BUTTON_TYPES.LINK}
              className={cx("text-underline", styles.note)}
              onClick={(e) => onViewPaymentsClick(e, scheduledPayments)}
            >
              View Payments
            </Button>
          </p>
        )}
      </div>
    </>
  );
};

InnerPayeeCard.propTypes = {
  accounts: PropTypes.array.isRequired,
  autoPay: PropTypes.bool.isRequired,
  autoEnrolled: PropTypes.bool.isRequired,
  editPaymentId: PropTypes.string,
  errors: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  payment: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  oneTimeOnly: PropTypes.bool,
  repeatingOnly: PropTypes.bool,
  payee: PropTypes.object.isRequired,
  scheduledPayments: PropTypes.array.isRequired,
  forcedOneTime: PropTypes.bool.isRequired,
  showAutoPayBanner: PropTypes.bool.isRequired,
  repeatingPaymentId: PropTypes.string.isRequired,
  onViewPaymentsClick: PropTypes.func.isRequired,
};

InnerPayeeCard.defaultProps = {
  autoPay: false,
};

export default InnerPayeeCard;

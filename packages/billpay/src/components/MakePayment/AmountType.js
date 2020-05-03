import React from "react";
import PropTypes from "prop-types";
import Combobox from "reusable/lib/Combobox";
import { formatDate, parseDateString } from "reusable/lib/dateUtils";
import {
  formatCurrency,
  nickNameWithLastFour,
} from "reusable/lib/formattingUtils";
import styles from "./AmountType.module.scss";

function AmountType({ autoPay, payee, payment, dispatch, error }) {
  // Per Dana:
  // For entries with a "ebill" property, use ebill.statementDate to display.
  // For entries that just have the "cardPaymentInfo" property you will not show the line about the "as of date" - just show the $XX.XX in the small gray text
  const amountByLine = payee?.ebill?.statementDate
    ? `As of ${formatDate(
        parseDateString(payee.ebill.statementDate),
        "MM/DD/YYYY"
      )}: `
    : "";

  // if ebill property exists, use it. Otherwise fallback to cardPaymentInto. If neither exists an empty value (this is for customers enrolled in ebills but without a current ebill -no ebill object)
  const amountDue =
    payee?.ebill?.totalDue || payee.cardPaymentInfo?.currentBalance;
  const minimumPayment =
    payee?.ebill?.minimumDue || payee.cardPaymentInfo?.minimumBalance;
  const statementBalance = payee?.cardPaymentInfo?.statementBalance;

  function getValueByAmountType(amountType) {
    switch (amountType) {
      case "amountDue":
        return amountDue;
      case "minimumPayment":
        return minimumPayment;
      case "statementBalance":
        return statementBalance;
      case "other":
        return "";
      case "":
        return "";
      default:
        throw new Error("Unhandled amount type: " + amountType);
    }
  }

  function getHelpText() {
    if (!payment.amountType || payment.amountType === "other") return null;
    return (
      amountByLine + formatCurrency(getValueByAmountType(payment.amountType))
    );
  }

  function handleChange({ target }) {
    const { value } = target;
    dispatch([
      "changeAmountType",
      { amountType: value, amount: getValueByAmountType(value), payment },
    ]);
  }

  return (
    <Combobox
      hoverItemClassName={styles.amountByLineHover}
      id={payee.id + "-amountType"}
      label="Please Select Amount"
      aria-label={nickNameWithLastFour(payee) + " payment amount type"}
      name="amountType"
      value={payment.amountType}
      onChange={handleChange}
      error={error}
      options={[
        {
          label: "Please Select Amount",
          value: "",
        },
        {
          label: (
            <>
              Amount Due
              {
                <span className={styles.amountByLine}>
                  {amountByLine}
                  {formatCurrency(amountDue)}
                </span>
              }
            </>
          ),
          value: "amountDue",
        },
        {
          label: (
            <>
              Minimum Payment
              {
                <span className={styles.amountByLine}>
                  {amountByLine}
                  {formatCurrency(minimumPayment)}
                </span>
              }
            </>
          ),
          value: "minimumPayment",
        },
        ...(statementBalance !== undefined
          ? [
              {
                label: (
                  <>
                    Last Statement Balance
                    {
                      <span className={styles.amountByLine}>
                        {amountByLine}
                        {formatCurrency(statementBalance)}
                      </span>
                    }
                  </>
                ),
                value: "statementBalance",
              },
            ]
          : []),
        ...(!autoPay ? [{ label: "Other", value: "other" }] : []),
      ]}
      required
      helpText={getHelpText()}
      truncateType={false}
    />
  );
}

AmountType.propTypes = {
  error: PropTypes.string,
  payee: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  autoPay: PropTypes.bool,
};

export default AmountType;

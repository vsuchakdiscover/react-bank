import React from "react";
import PropTypes from "prop-types";
import styles from "./GraySummaryBox.module.scss";
import {
  nickNameWithLastFour,
  formatCurrency,
  stripCommas,
} from "reusable/lib/formattingUtils";

function parseNum(num) {
  return parseFloat(stripCommas(num));
}

function GraySummaryBox({ accounts, selectedPayments }) {
  if (selectedPayments.length === 0) return null;

  const totalPayments = selectedPayments.reduce((total, payment) => {
    return payment.amount ? parseNum(total) + parseNum(payment.amount) : total;
  }, 0);

  const _accounts = accounts.map((a) => ({
    accountName: nickNameWithLastFour(a),
    id: a.id,
    totalAmount: selectedPayments
      .filter((s) => s.payFrom === a.id)
      .reduce((total, payment) => {
        return payment.amount
          ? parseNum(total) + parseNum(payment.amount)
          : total;
      }, 0),
  }));

  return (
    <dl className={styles.root}>
      <dt>Payee(s) Selected:</dt>
      <dd aria-label="Number of Payees Selected">{selectedPayments.length}</dd>

      {_accounts
        .filter((a) => a.totalAmount > 0)
        .map((a) => {
          return (
            <React.Fragment key={a.id}>
              <dt>Total from {a.accountName}:</dt>
              <dd>{formatCurrency(a.totalAmount)}</dd>
            </React.Fragment>
          );
        })}

      <dt>
        <strong>Total Payment Amount:</strong>
      </dt>
      <dd aria-label="Total Payment Amount">
        <strong>{formatCurrency(totalPayments)}</strong>
      </dd>
    </dl>
  );
}

GraySummaryBox.propTypes = {
  accounts: PropTypes.array.isRequired,
  selectedPayments: PropTypes.array.isRequired,
};

export default GraySummaryBox;

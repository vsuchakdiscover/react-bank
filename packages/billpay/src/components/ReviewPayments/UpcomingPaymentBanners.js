import React from "react";
import WarningIcon from "reusable/lib/WarningIcon";
import Banner from "./Banner";
import {
  formatCurrency,
  nickNameWithLastFour,
} from "reusable/lib/formattingUtils";
import URLS from "reusable/lib/urls";
import { accountsApi } from "../../api";
import { useApi } from "reusable/lib/useApi";
import MoneyMarketIcon from "reusable/lib/MoneyMarketIcon";
import { FILTER } from "./PaymentSlider";

// Render upcoming payment summary banners for each account.
function UpcomingPaymentBanners({ upcomingPayments, filter }) {
  const {
    loading: accountsLoading,
    error: accountError,
    data: accounts = [],
  } = useApi(accountsApi.getAccounts);

  // Returns an array of objects like this for each account:
  // summaries = [{
  //   account: account,
  //   numPayments: 2,
  //   totalPayments: 348
  // }]
  function getAccountSummaries() {
    return accounts.reduce((accountSummaries, account) => {
      const paymentsUsingThisAccount = upcomingPayments.reduce(
        (payments, payment) => {
          if (payment.paymentMethod.id === account.id)
            payments.push(payment.amount);
          return payments;
        },
        []
      );

      if (paymentsUsingThisAccount.length > 0) {
        accountSummaries.push({
          account,
          numPayments: paymentsUsingThisAccount.length,
          totalPayments: paymentsUsingThisAccount.reduce(
            (prev, cur) => cur + prev,
            0
          ),
        });
      }

      return accountSummaries;
    }, []);
  }

  function getPaymentPeriod() {
    switch (filter) {
      case FILTER.CURRENT_WEEK:
        return "this week";
      case FILTER.NEXT_30_DAYS:
        return "in the next 30 days";
      case FILTER.NEXT_WEEK:
        return "next week";
      case FILTER.ONE_TIME_PAYMENTS_AFTER_30_DAYS:
      case FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS:
        return "after the next 30 days";
      default:
        throw new Error("Unhandled filter: " + filter);
    }
  }

  if (accountsLoading) return null;

  if (accountError) {
    console.error("Error loading accounts in UpcomingPaymentsBanners.js");
    console.error(accountError);
    throw accountError;
  }

  return getAccountSummaries().map((summary) => {
    const { account, numPayments, totalPayments } = summary;
    const icon =
      account.type === "MONEYMARKET" ? (
        <div style={{ marginRight: 20 }}>
          <MoneyMarketIcon />
        </div>
      ) : (
        <img
          src={require("../../images/icon-cashback-debit.png")}
          style={{ width: "auto", height: 40, marginRight: 20 }}
          alt="Cashback Debit icon"
        />
      );
    return (
      <Banner key={account.id} icon={icon}>
        <div>
          <p className="mb-0">
            <strong>{nickNameWithLastFour(account)}</strong> has an available
            balance of{" "}
            <strong>{formatCurrency(account.availableBalance)}</strong> and{" "}
            <strong>{numPayments}</strong> scheduled payment(s) totaling{" "}
            <strong>{formatCurrency(totalPayments)}</strong>{" "}
            {getPaymentPeriod()}.
          </p>
          {account.availableBalance < totalPayments && (
            <p className="mb-0 mt-10">
              <WarningIcon size="small" />{" "}
              <em>
                Make sure you have enough available funds in your account to
                cover these payments.
              </em>{" "}
              <a href={URLS.TRANSFER_FUNDS}>Transfer funds</a>
            </p>
          )}
        </div>
      </Banner>
    );
  });
}

export default UpcomingPaymentBanners;

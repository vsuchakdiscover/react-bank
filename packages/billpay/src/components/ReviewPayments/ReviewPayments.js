import React from "react";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { useApi } from "reusable/lib/useApi";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import { paymentsApi } from "../../api";
import EnrollmentStatus from "../reusable/EnrollmentStatus";
import ErrorBoundary from "../../ErrorBoundary";
import { useHistory } from "react-router-dom";
import PaymentSlider from "./PaymentSlider";

export const OperationsBarContext = React.createContext();

function ReviewPayments() {
  useTrackPageLoad("bankac/billpay/reviewpayments");
  const history = useHistory();

  const { loading, error, data: payments = [], setData: setPayments } = useApi(
    paymentsApi.getPaymentList
  );

  function addToPaymentsAsCancelled(payments = []) {
    const cancelledPayments = payments.map((payment) => {
      return { ...payment, status: "CANCELED" };
    });
    setPayments((payments) => [...payments, ...cancelledPayments]);
  }

  if (error) {
    if (error?.response?.statusText) throw new Error(error.response.statusText);
    console.error("Error: General.TechnicalDifficulties");
    history.push("/tech-diff");
  }

  return (
    <ErrorBoundary>
      <EnrollmentStatus>
        <PaymentSlider addToPaymentsAsCancelled={addToPaymentsAsCancelled} />
        <PaymentHistoryTable loading={loading} payments={payments} />
      </EnrollmentStatus>
    </ErrorBoundary>
  );
}

export default ReviewPayments;

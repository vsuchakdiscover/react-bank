import { get, post } from "./apiUtils.mock";

export async function getPaymentList(params = {}) {
  return get("payments", {
    params,
    headers: {
      paymentScenario:
        localStorage.getItem("getPaymentsResponse") || "All payments",
      accountScenario: localStorage.getItem("getAccountsResponse") || "2",
    },
  });
}

export async function deletePayment({
  paymentId,
  repeating,
  automatic,
  payeeId,
}) {
  const url =
    automatic || repeating
      ? `payments/rule/delete/${payeeId}`
      : `payments/delete/${paymentId}`;
  const resp = await post(
    url,
    {},
    {
      headers: {
        deletePaymentResponseScenario:
          localStorage.getItem("deletePaymentResponse") || "Success",
      },
    }
  );
  if (resp.status === 204) return resp;
}

export async function schedulePayments(payment) {
  return post("payments/add", payment, {
    headers: {
      addPaymentResponseScenario:
        localStorage.getItem("schedulePaymentResponse") || "Success",
      accountScenario: localStorage.getItem("getAccountsResponse") || "2",
    },
  });
}

export async function editScheduledPayment(payment) {
  return post("payments/add", payment, {
    headers: {
      addPaymentResponseScenario:
        localStorage.getItem("schedulePaymentResponse") || "Success",
      accountScenario: localStorage.getItem("getAccountsResponse") || "2",
    },
  });
}

export async function automaticPayment(payment) {
  //right now this doesn't really do anything
  return post("payments/add?automatic", payment, {
    headers: {
      addPaymentResponseScenario:
        localStorage.getItem("schedulePaymentResponse") || "Success",
      accountScenario: localStorage.getItem("getAccountsResponse") || "2",
    },
  });
}

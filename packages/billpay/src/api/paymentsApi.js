import { get, post } from "./apiUtils";

export const getPaymentList = (params = {}) => {
  let queryString = "";
  Object.entries(params).forEach(([key, value], index) => {
    queryString = queryString + `${key}=${value}` + (index > 0 ? "&" : "");
  });
  return get("payment/v1", {
    additionalQuerystring: queryString !== "" ? "&" + queryString : "",
  });
};

export async function deletePayment({
  paymentId,
  repeating,
  automatic,
  payeeId,
}) {
  const url =
    automatic || repeating
      ? `payment/v1/rule/delete/${payeeId}`
      : `payment/v1/delete/${paymentId}`;
  return post(url, {});
}

export const schedulePayments = (payments) => post("payment/v1/add", payments);

export const editScheduledPayment = (payment, paymentId) =>
  post(`payment/v1/edit/${paymentId}`, payment);

export const automaticPayment = (payment) =>
  post(`payment/v1/autopay/add/`, payment);

import { get, post } from "./apiUtils";

export const getPayees = () => get("payee/v1");
export const addPayee = (payee) => post("payee/v1", payee);
export const editPayee = (payee, id) => post(`payee/v1/update/${id}`, payee);
export const deletePayee = (id) => post("payee/v1/" + id);
export const getScheduledPayments = (id) =>
  get("payment/v1", {
    additionalQuerystring: `&payees=${id}&statuses=SCHEDULED`,
  });
export const getBankHolidays = (year) => get(`payee/v1/holidays/${year}`);

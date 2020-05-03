import { get, post } from "./apiUtils";

export const getAccounts = () => get("payment/v1/account");

export const setPreferred = (accountId) =>
  post("payment/v1/setPreferred/" + accountId);

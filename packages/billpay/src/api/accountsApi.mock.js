import { get, post } from "./apiUtils.mock";

function getAccountId() {
  const accountId = localStorage.getItem("getAccountsResponse") || "2";
  return parseInt(accountId, 10);
}

export async function getAccounts() {
  const { data } = await get("accounts/" + getAccountId());
  return {
    data: data.accounts,
  };
}

export async function setPreferred(accountId) {
  return post("setPreferred/" + accountId);
}

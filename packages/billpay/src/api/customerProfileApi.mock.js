import { get } from "./apiUtils.mock";

export async function getCustomerProfile() {
  return await get("customerProfiles", {
    headers: {
      scenario: localStorage.getItem("customer"),
    },
  });
}

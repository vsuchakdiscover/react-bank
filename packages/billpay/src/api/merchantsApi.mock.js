import { get } from "./apiUtils.mock";

export async function getMerchants() {
  return get("merchants");
}

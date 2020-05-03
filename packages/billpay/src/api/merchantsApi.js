import { get } from "./apiUtils";

export const getMerchants = () => get("payee/v1/merchants");

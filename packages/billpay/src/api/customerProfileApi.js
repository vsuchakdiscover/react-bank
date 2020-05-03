import { get } from "./apiUtils";

export const getCustomerProfile = () => get("customer/v1/profile");

import { get, post } from "./apiUtils";

export const getStatus = () => get("customer/v1/enroll");
export const postStatus = () => post("customer/v1/enroll");

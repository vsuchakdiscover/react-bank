import { get, post } from "./apiUtils";

export const getEBillDetails = () => get("ebill/v1");
export const getEBillTokens = ({ payeeId }) => get("ebill/v1/token/" + payeeId);
export const eBillEnrollment = (data) => post("ebill/v1/enroll", data);
export const eBillUnenroll = (payeeId) => post("ebill/v1/unenroll/" + payeeId);
export const fileEbill = (billId) => post("ebill/v1/filebill/" + billId);

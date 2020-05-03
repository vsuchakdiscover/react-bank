const PAYMENT_STATUSES = {
  CANCELED: "Canceled",
  CLEARED: "Paid",
  COMPLETED: "Paid",
  DECLINED: "Failed",
  FAILED: "Failed",
  FUNDS_CLEARED: "Paid",
  FUNDS_OUTBOUND: "Funds outbound",
  HOLD: "Hold",
  IN_PROCESS: "Processing",
  INSUFFICIENT_FUNDS: "Failed",
  PENDING: "Processing",
  PROCESSING: "Processing",
  PROCESSED: "Paid",
  REVIEW: "Processing",
  RETURNED: "Failed",
  SCHEDULED: "Scheduled",
  SENT: "Paid",
  STOPPED: "Failed",
  SUSPENDED: "Processing",
};
export const getPaymentStatusLabel = (statusKey) =>
  PAYMENT_STATUSES[statusKey] || statusKey;

export const PROCESSING_STATUS_GROUP = [
  "PENDING",
  "IN_PROCESS",
  "REVIEW",
  "SUSPENDED",
];

export const COMPLETED_STATUS_GROUP = [
  "COMPLETED",
  "CLEARED",
  "PROCESSED",
  "SENT",
  "FUNDS_CLEARED",
];

export const CANCELLED_STATUS_GROUP = ["CANCELED"];

export const FAILED_STATUS_GROUP = [
  "FAILED",
  "INSUFFICIENT_FUNDS",
  "DECLINED",
  "RETURNED",
  "STOPPED",
];

export const OTHER_STATUS_GROUP = ["FUNDS_OUTBOUND", "HOLD"];

export const getPaymentStatusGroup = (statusGroupKey) =>
  ({
    processing: PROCESSING_STATUS_GROUP,
    completed: COMPLETED_STATUS_GROUP,
    cancelled: CANCELLED_STATUS_GROUP,
    failed: FAILED_STATUS_GROUP,
    other: OTHER_STATUS_GROUP,
  }[statusGroupKey]);

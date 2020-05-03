import dateUtils from "reusable/lib/dateUtils";
import { getPaymentStatusGroup } from "../../utils/paymentStatuses";

export function filterByDateRange(rows, id, { value, value2 }) {
  if (!value && value === value2) {
    return rows;
  }
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return dateUtils.isDateStringInRange(rowValue, value, value2);
  });
}

export function filterExactMultipleOr(rows, id, value) {
  if (value && !Array.isArray(value)) {
    value = [value];
  }

  if (!value || !value.length) {
    return rows;
  }

  return rows.filter((row) => {
    const rowValue = row.values[id];
    return value.includes(rowValue);
  });
}

export function filterByPaymentStatus(rows, id, value) {
  value = value && !Array.isArray(value) ? [value] : value;

  if (!value || !value.length) {
    // When there's no filter values, we should return and empty data.
    return [];
  }

  const paymentStatuses = value
    .map(getPaymentStatusGroup)
    .filter((v) => v)
    .flat();

  return rows.filter((row) => {
    const rowStatus = row.values[id];
    return paymentStatuses.includes(rowStatus);
  });
}

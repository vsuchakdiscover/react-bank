import { isDateStringInRange, parseDateString } from "../../utils/dateUtils";

export const getInvalidDateFormatMessage = (dateFormat) =>
  `Enter a valid date in ${dateFormat} format`;

/**
 * A factory for the validation result
 */
const validationResult = (valid, message) => [valid, !valid ? message : null];

const validateDateStringIsNotDisabled = (dateString, unavailableDates) => {
  const valid = !unavailableDates.includes(dateString);
  return validationResult(valid, "Date is disabled");
};

const validateDateStringIsNotUnavailableDay = (dateString, unavailableDays) => {
  const date = parseDateString(dateString);
  const valid = !unavailableDays.includes(date.getDay());
  return validationResult(valid, "This day cannot be selected");
};

const validateDateStringIsInRange = (dateString, startDate, endDate) => {
  const valid = isDateStringInRange(dateString, startDate, endDate);
  return validationResult(valid, "Value doesn't fit allowed range of dates");
};

/**
 * Runs validation functions and short circuits on the first error.
 */
const runValidators = (...validators) => {
  for (let validator of validators) {
    const [valid, message] = validator();
    if (!valid) {
      return message;
    }
  }
};

function validateDateStringIsNotBankHoliday(dateString, bankHolidays) {
  const date = parseDateString(dateString, "YYYY-MM-DD");
  const valid = !bankHolidays.find((bh) => bh.getTime() === date.getTime());
  return validationResult(valid, "Date is disabled");
}

/**
 *
 * Validates a DateString against calendar-specific requirements.
 */
export const validateDateStringForCalendar = ({
  unavailableDates,
  unavailableDays,
  minDate,
  maxDate,
  bankHolidays,
}) => (dateString) => {
  const validators = [
    () => validateDateStringIsNotDisabled(dateString, unavailableDates),
    () => validateDateStringIsNotUnavailableDay(dateString, unavailableDays),
    () => validateDateStringIsInRange(dateString, minDate, maxDate),
    () => validateDateStringIsNotBankHoliday(dateString, bankHolidays),
  ];

  return runValidators(...validators);
};

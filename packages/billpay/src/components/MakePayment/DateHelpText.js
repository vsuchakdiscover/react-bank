import React from "react";
import PropTypes from "prop-types";
import dateUtils from "reusable/lib/dateUtils";
import DeliveryMethod from "../reusable/DeliveryMethod";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

function getDayName(date) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

function getMonthName(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
}

export function getFrequencyHelpText(frequency, dateString) {
  if (!frequency || !dateString) return null;

  const date = dateUtils.parseDateString(dateString);

  switch (frequency) {
    case FREQUENCY_TYPE.ONE_TIME:
      return ""; // No help text to display for this one.

    case FREQUENCY_TYPE.ONCE_A_MONTH:
      return `Payments will be delivered each month by the ${formatDay(date)}.`;

    case FREQUENCY_TYPE.ONCE_A_WEEK:
      return `Payments will be delivered each week by ${getDayName(date)}.`;

    case FREQUENCY_TYPE.ONCE_IN_2_WEEKS:
      return `Payments will be delivered every other week by ${getDayName(
        date
      )}.`;

    case FREQUENCY_TYPE.ONCE_IN_2_MONTHS:
      return `Payments will be delivered every 2 months by the ${formatDay(
        date
      )}.`;

    case FREQUENCY_TYPE.ONCE_IN_3_MONTHS:
      return `Payments will be delivered every 3 months by the ${formatDay(
        date
      )}.`;

    case FREQUENCY_TYPE.ONCE_IN_6_MONTHS:
      return (
        "Payments will be delivered every 6 months by the " +
        formatDay(date) +
        "."
      );

    case FREQUENCY_TYPE.TWICE_A_MONTH:
      return ""; // deliberately return empty since dates were decided to be too nebulous with this scenario https://github.com/mcdpartners/react-bank/issues/609#issuecomment-553461237

    case FREQUENCY_TYPE.ONCE_A_YEAR:
      return `Payments will be delivered every year by ${getMonthName(
        date
      )} ${formatDay(date)}.`;

    case FREQUENCY_TYPE.ONCE_IN_4_WEEKS:
      return `Payments will be delivered every 4 weeks by ${getDayName(date)}.`;

    default:
      throw new Error("Unknown frequency: " + frequency);
  }
}

function formatDay(date) {
  return date.getDate() + nth(date.getDate());
}

// Returns number suffix for 1st, 2nd, 3rd etc.
function nth(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function DateHelpText({ deliveryMethod, frequency, dateString }) {
  return (
    <>
      <p className="mb-0">{getFrequencyHelpText(frequency, dateString)}</p>
      <DeliveryMethod
        allowByTextClass="copy"
        isBold
        method={deliveryMethod}
        showAllowByText
        textClass="copy"
        displayLongName
      />
    </>
  );
}

DateHelpText.propTypes = {
  dateString: PropTypes.string,
  frequency: PropTypes.string.isRequired,
  deliveryMethod: PropTypes.oneOf(["STANDARD_ELECTRONIC", "TRUST_CHECK"])
    .isRequired,
};

export default DateHelpText;

import React from "react";
import PropTypes from "prop-types";

import {
  formatDateForScreenReader,
  getMonthName,
} from "../../../utils/dateUtils";

import styles from "./Calendar.module.scss";

import { ReactComponent as ArrowLeft } from "../svgs/arrowLeft.svg";
import { ReactComponent as ArrowRight } from "../svgs/arrowRight.svg";

export default function MonthHeader({
  headerId,
  selectedDate,
  selectedDateLabel,
  currentMonth,
  hidePreviousMonthLink,
  hideNextMonthLink,
  onPreviousMonthClick,
  onNextMonthClick,
}) {
  const month = getMonthName(currentMonth);
  const year = currentMonth.getFullYear();
  const screenReaderText = getScreenReaderText(selectedDate, selectedDateLabel);

  return (
    <div className={styles.header} data-testid="header">
      {!hidePreviousMonthLink && (
        <button
          aria-label="previous month"
          className={styles.pagelink}
          onClick={onPreviousMonthClick}
          tabIndex={0}
        >
          <ArrowLeft />
        </button>
      )}
      <div
        aria-atomic="true"
        aria-level={1}
        aria-live="assertive"
        className={styles.monthname}
        data-testid="monthname"
        id={headerId}
        role="heading"
      >
        {month} {year}
      </div>
      <span aria-atomic="true" aria-live="assertive" className="sr-only">
        {screenReaderText}
      </span>
      {!hideNextMonthLink && (
        <button
          aria-label="next month"
          className={styles.pagelink}
          onClick={onNextMonthClick}
          tabIndex={0}
        >
          <ArrowRight />
        </button>
      )}
    </div>
  );
}

MonthHeader.defaultProps = {
  hideNextMonthLink: false,
  hidePreviousMonthLink: false,
  selectedDateLabel: "Select date",
};

MonthHeader.propTypes = {
  /** Current month */
  currentMonth: PropTypes.instanceOf(Date).isRequired,

  /** Header id. Needed for accessibility */
  headerId: PropTypes.string.isRequired,

  /** Set to true to hide next month arrow */
  hideNextMonthLink: PropTypes.bool,

  /** Set to true to hide previous month arrow */
  hidePreviousMonthLink: PropTypes.bool,

  /** A function that's called when a next month button is clicked */
  onNextMonthClick: PropTypes.func,

  /** A function that's called when a previous month button is clicked */
  onPreviousMonthClick: PropTypes.func,

  /** Currently selected date */
  selectedDate: PropTypes.instanceOf(Date),

  /** Selected date label */
  selectedDateLabel: PropTypes.string,
};

const getScreenReaderText = (date, label) =>
  date ? `${label} ${formatDateForScreenReader(date)}` : "please select a date";

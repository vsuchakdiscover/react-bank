import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { getCalendarRows } from "../utils";
import {
  getFirstDayOfMonth,
  getNextMonthFirstDay,
  getPreviousMonthFirstDay,
  isSameMonth,
} from "../../../utils/dateUtils";
import { WEEK_DAYS } from "../data";
import useMonthGridKeyNavigation from "../hooks/useMonthGridKeyNavigation";
import { assignDayTypes, DEFAULT_DAY_TYPES } from "../dayTypes";
import { dayTypeType } from "../propTypes";

import Day from "./Day";
import MonthHeader from "./MonthHeader";

import styles from "./Calendar.module.scss";

export default function Month({
  id,
  value,
  initialMonth,
  startDate,
  endDate,
  minDate,
  maxDate,
  dueDate,
  unavailableDates,
  unavailableDays,
  dayTypes,
  headerIsHidden,
  monthPaginationIsHidden,
  onDayKeyDown,
  onChange,
  onPreviousMonthClick,
  onNextMonthClick,
}) {
  const [currentMonth, setCurrentMonth] = useState(
    getFirstDayOfMonth(initialMonth || value || new Date())
  );

  const [hoverDate, setHoverDate] = useState(null);

  const [
    monthGridRef,
    handleDayKeyDown,
    focusDate,
    setFocusDate,
  ] = useMonthGridKeyNavigation({
    initialFocusDate:
      value && isSameMonth(value, currentMonth)
        ? value
        : initialMonth || currentMonth,
    onDaySelection: handleDayClick,
    switchToNextMonth: handleNextMonthClick,
    switchToPreviousMonth: handlePreviousMonthClick,
    onDayKeyDown: onDayKeyDown,
  });

  const weeks = useMemo(() => getCalendarRows(currentMonth), [currentMonth]);
  const daysAndTypes = assignDayTypes([].concat(...weeks), dayTypes, {
    value,
    focusDate,
    hoverDate,
    currentMonth,
    startDate,
    endDate,
    dueDate,
    minDate,
    maxDate,
    unavailableDates,
    unavailableDays,
    dayTypes,
  });

  const headers = Object.keys(WEEK_DAYS);
  const headerId = getCalendarHeaderId(id);

  function handlePreviousMonthClick(e) {
    e && e.preventDefault();
    const previousMonthFirstDay = getPreviousMonthFirstDay(currentMonth);
    onPreviousMonthClick(previousMonthFirstDay);
    setCurrentMonth(previousMonthFirstDay);
    setFocusDate(previousMonthFirstDay);
  }

  function handleNextMonthClick(e) {
    e && e.preventDefault();
    const nextMonthFirstDay = getNextMonthFirstDay(currentMonth);
    onNextMonthClick(nextMonthFirstDay);
    setCurrentMonth(nextMonthFirstDay);
    setFocusDate(nextMonthFirstDay);
  }

  function handleDayClick(date) {
    onChange && onChange(date);
  }

  function handleDayHover(date) {
    setHoverDate(date);
  }

  function getThId(weekDay) {
    return `${id}-${weekDay}`;
  }

  return (
    <div className={cx(styles.month)}>
      {!headerIsHidden && (
        <MonthHeader
          currentMonth={currentMonth}
          headerId={headerId}
          hideNextMonthLink={monthPaginationIsHidden}
          hidePreviousMonthLink={monthPaginationIsHidden}
          onNextMonthClick={handleNextMonthClick}
          onPreviousMonthClick={handlePreviousMonthClick}
          selectedDate={focusDate}
          selectedDateLabel={
            focusDate &&
            daysAndTypes[focusDate] &&
            daysAndTypes[focusDate].legendLabel
          }
        />
      )}
      <table aria-labelledby={headerId} className={cx(styles.grid)} role="grid">
        <thead className={styles.weekdays}>
          <tr>
            {Object.entries(WEEK_DAYS).map(([name, shortName]) => (
              <th id={getThId(name)} key={name} scope="col">
                <abbr title={name}>{shortName}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.days} ref={monthGridRef}>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((date, weekDayIndex) => (
                <Day
                  currentMonth={currentMonth}
                  date={date}
                  dayType={daysAndTypes[date]}
                  headers={getThId(headers[weekDayIndex])}
                  key={+date}
                  onClick={handleDayClick}
                  onHover={handleDayHover}
                  onKeyDown={handleDayKeyDown}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function getCalendarHeaderId(calendarId) {
  return `calendar-${calendarId}-header`;
}

Month.defaultProps = {
  dayTypes: DEFAULT_DAY_TYPES,
  headerIsHidden: false,
  isLarge: false,
  monthPaginationIsHidden: false,
  onNextMonthClick: () => {},
  onPreviousMonthClick: () => {},
  unavailableDates: [],
  unavailableDays: [],
};

/**
 * Factory function that builds calendar props depending on
 * supported data type: Date or String
 *
 * This allows us to re-use propTypes declaration both on
 * Calendar component, which expects dates as Date objects, and
 * on DatePicker component, which expects dates as String objects.
 */
Month.getCommonPropTypes = function (instanceOf) {
  return {
    /** Selected date value */
    value: instanceOf,

    /** An initial month to show in calendar */
    initialMonth: instanceOf,

    /** Start date of a range */
    startDate: instanceOf,

    /** End date of a range */
    endDate: instanceOf,

    /** Minimum available date */
    minDate: instanceOf,

    /** Maximum available date */
    maxDate: instanceOf,

    /** Due date */
    dueDate: instanceOf,

    /** An array of unavailable dates */
    unavailableDates: PropTypes.arrayOf(instanceOf),
  };
};

Month.propTypes = {
  ...Month.getCommonPropTypes(PropTypes.instanceOf(Date)),

  /** An object of dayTypes */
  dayTypes: PropTypes.objectOf(dayTypeType),

  /** Set to true to hide calendar header (month and pagers) */
  headerIsHidden: PropTypes.bool,

  /** Set to true to hide month pagination in calendar header */
  monthPaginationIsHidden: PropTypes.bool,

  onChange: PropTypes.func,

  /** Callback to run when keyDown event is registered on day cell */
  onDayKeyDown: PropTypes.func,

  /** Function called when the next month button is clicked */
  onNextMonthClick: PropTypes.func,

  /** Function called when the previous month button is clicked */
  onPreviousMonthClick: PropTypes.func,

  /** An array of day of the week indexes to be set as unavailable,
   *  Expected values are between 0 and 6, where 0 is Sunday and 6 is Saturday.
   */
  unavailableDays: PropTypes.arrayOf(PropTypes.number),
};

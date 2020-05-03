import { CALENDAR_WEEKS, KEY } from "./data";
import {
  addDays,
  getDaysInMonth,
  getFirstWeekDayOfMonth,
  getMonthDates,
  getNextMonthFirstDay,
  getPreviousMonthFirstDay,
} from "../../utils/dateUtils";

export const getCalendarRows = (monthDate) => {
  const rowsThatHaveDaysFromAMonth = atLeastOneDayInWeekBelongsToAMonth(
    monthDate.getMonth()
  );

  return chunk(getCalendarGrid(monthDate), 7).filter(
    rowsThatHaveDaysFromAMonth
  );
};

// Returns an array of [year, month, day] arrays to fill the calendar grid
// for the month.
export const getCalendarGrid = (currentMonth) => {
  const previousMonth = getPreviousMonthFirstDay(currentMonth);
  const nextMonth = getNextMonthFirstDay(currentMonth);

  const days = [].concat(
    ...[previousMonth, currentMonth, nextMonth].map(getMonthDates)
  );

  return days.splice(
    getDaysInMonth(previousMonth) - getFirstWeekDayOfMonth(currentMonth) + 1,
    (CALENDAR_WEEKS + 1) * 7
  );
};

export const getNextDateFromKeyCode = (initialDate, keyCode) => {
  const keyCodeToDelta = {
    [KEY.LEFT]: -1,
    [KEY.RIGHT]: 1,
    [KEY.UP]: -7,
    [KEY.DOWN]: 7,
  };

  return addDays(initialDate, keyCodeToDelta[keyCode]);
};

const atLeastOneDayInWeekBelongsToAMonth = (month) => (weekDates) =>
  weekDates[0].getMonth() === month || weekDates[6].getMonth() === month;

export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

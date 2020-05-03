import { DATE_FORMATS } from "../FormInputs/DatePicker/data";

export const cloneDate = (date) => new Date(+date);

const zeroPad = (value, length) => {
  return `${value}`.padStart(length, "0");
};

export const formatDate = (date, format = "YYYY-MM-DD") => {
  validateDateFormat(format);

  const formatCallbacks = {
    MM: getMonth,
    DD: getDay,
    YYYY: getYear,
  };

  const separator = format.includes("/")
    ? "/"
    : format.includes("-")
    ? "-"
    : undefined;
  if (!separator) {
    return;
  }

  return format
    .split(separator)
    .map((p) => {
      return formatCallbacks[p](date);
    })
    .join(separator);
};

/**
 * Converts arrays of YYYY-MM-DD formatted dateStrings into arrays of date objects.
 * @param args - arrays of date string
 * @returns arrays of date objects
 */
export const convertToDateObjects = (...args) => {
  return args.map((arg) =>
    Array.isArray(arg)
      ? arg.map((dateString) => parseDateString(dateString))
      : arg
      ? parseDateString(arg)
      : undefined
  );
};

export const formatDateForScreenReader = (date) =>
  date.toLocaleString("en-US", {
    dateStyle: "full",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatDateStringToMDY = (dateString) =>
  formatDate(parseDateString(dateString), "MM/DD/YYYY");

export const formatDateStringToShortMD = (dateString) =>
  parseDateString(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const isValidDateObjectFormat = (format) =>
  Object.keys(DATE_FORMATS).includes(format);

export const validateDateFormat = (format) => {
  if (!isValidDateObjectFormat(format)) {
    throw new Error(
      `Provided format "${format}" is not valid. Please provide one of: ${Object.keys(
        DATE_FORMATS
      ).join(", ")}`
    );
  }
};

export const parseDateString = (dateString, format = "YYYY-MM-DD") => {
  validateDateFormat(format);

  const separator = format.includes("/")
    ? "/"
    : format.includes("-")
    ? "-"
    : undefined;

  const dateParts = dateString.split(separator);
  const { dd = 1, mm = 1, yyyy = 0 } = format
    .toLowerCase()
    .split(separator)
    .reduce(
      (acc, token, index) => ({
        ...acc,
        [token]: parseInt(dateParts[index]),
      }),
      {}
    );

  // We're doing this nasty hack, because Date constructor doesn't support
  // years less than 100 - the numbers from 0 to 99 will be incremented by 1900 automatically 😂
  // Thus, we create a fake date at first (I just like 1/1/2000) and then update it via Date object
  // setters with correct Year, month and date.
  const date = new Date(2000, 0, 1, 0, 0, 0, 0);
  date.setFullYear(yyyy);
  date.setMonth(mm - 1);
  date.setDate(dd);

  return date;
};

export const isDateInArray = (date, arrayOfDates) =>
  arrayOfDates.some((d) => isSameDay(d, date));

export const isSameDay = (date1, date2) =>
  formatDate(date1) === formatDate(date2);

export const isSameMonth = (date1, date2) =>
  date1.getMonth() === date2.getMonth();

export const isSameYear = (date1, date2) =>
  date1.getFullYear() === date2.getFullYear();

export const isToday = (date) => isSameDay(date, new Date());

const isDateObject = (date) =>
  Object.prototype.toString.call(date) === "[object Date]";

export const isValidDateObject = (date) =>
  isDateObject(date) && !Number.isNaN(+date);

export const isValidDateString = (dateString, dateFormat = "YYYY-MM-DD") => {
  const regex = DATE_FORMATS[dateFormat];
  return regex.test(dateString);
};

export const getMonthName = (date) =>
  date.toLocaleString("en-US", { month: "long" });

export const addDays = (date, daysToAdd) => {
  const newDate = cloneDate(date);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
};

export const addMonths = (date, monthsToAdd) => {
  const newDate = cloneDate(date);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);
  return newDate;
};

export const isDateInRange = (date, start, end) => {
  const dateStamp = date.valueOf();
  const startStamp = start ? start.valueOf() : Number.MIN_SAFE_INTEGER;
  const endStamp = end ? end.valueOf() : Number.MAX_SAFE_INTEGER;
  return startStamp <= dateStamp && dateStamp <= endStamp;
};

export const isDateStringInRange = (
  dateString,
  startDateString,
  endDateString
) => {
  return isDateInRange(
    dateString ? parseDateString(dateString) : undefined,
    startDateString ? parseDateString(startDateString) : undefined,
    endDateString ? parseDateString(endDateString) : undefined
  );
};

export const getDaysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

/**
 * Get an array of date objects for the month.
 * @param date - date object.
 * @returns array of date objects.
 */
export const getMonthDates = (date) =>
  [...new Array(getDaysInMonth(date))].map((_, index) => {
    const newDate = cloneDate(date);
    newDate.setDate(index + 1);
    return newDate;
  });

export const getFirstWeekDayOfMonth = (date) =>
  getFirstDayOfMonth(date).getDay() + 1;

export const getFirstDayOfMonth = (date) => {
  const newDate = cloneDate(date);
  newDate.setDate(1);
  return newDate;
};

export const getXMonthsFirstDay = (date, delta) => {
  date = getFirstDayOfMonth(date);
  date.setMonth(date.getMonth() + delta);
  return date;
};

export const getPreviousMonthFirstDay = (date) => getXMonthsFirstDay(date, -1);
export const getNextMonthFirstDay = (date) => getXMonthsFirstDay(date, 1);

const getYear = (date) => date.getFullYear();
const getMonth = (date) => zeroPad(date.getMonth() + 1, 2);
const getDay = (date) => zeroPad(date.getDate(), 2);

// Source: https://stackoverflow.com/a/39138057/26180
// Accepts a JS date
export function getNextWeekday(date) {
  // Copy date so don't affect original
  date = new Date(+date);
  // Add days until get not Sat or Sun
  do {
    date.setDate(date.getDate() + 1);
  } while (!(date.getDay() % 6));
  return date;
}

export function isWeekendDay(date) {
  const day = date.getDay();
  return day === 6 || day === 0;
}

// Returns the nearest date in YYYY-MM-DD format that isn't:
// 1. A weekend
// 2. A bank holiday
// for the date passed
export function getNextBusinessDay(holidays, date) {
  if (isWeekendDay(date)) {
    const nextDay = addDays(date, 1); // get the next day
    return getNextBusinessDay(holidays, nextDay); // call this func recursively
  }
  // After above, day is assured not to be a weekend. Now return the next non-bank holiday
  const nextNonHoliday = getNextNonHoliday(holidays, date);
  return nextNonHoliday;
}

// Returns the next non-bank holiday for the provided startDate, in YYYY-MM-DD format
export function getNextNonHoliday(holidays, date) {
  if (holidays.find((h) => h === formatDate(date))) {
    const nextDay = addDays(date, 1); // get the next day
    return getNextNonHoliday(holidays, nextDay); // call this func recursively
  }
  return formatDate(date);
}

export default {
  addDays,
  formatDate,
  formatDateStringToMDY,
  formatDateStringToShortMD,
  getNextWeekday,
  parseDateString,
  isDateStringInRange,
  isWeekendDay,
  getNextNonHoliday,
  getNextBusinessDay,
};

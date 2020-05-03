// Centralized utils for working with mock data
// Some of these functions are copied from reusable, but
// that code is written as an ES Import, so rather than convert it to CommonJS
// format so it could be consumed by Node, just copying here.

const {
  getMockBankHolidays,
} = require("../mockData/bankHolidayMockData").default;

// Returns next date that isn't a holiday or a weekend day
function getNextNonHoliday(holidays, date) {
  const day = date.getDay();
  const isWeekendDay = day === 6 || day === 0;
  if (isWeekendDay || holidays.find((h) => h === formatDateYYYYMMDD(date))) {
    const nextDay = addDays(date, 1); // get the next day
    return getNextNonHoliday(holidays, nextDay); // call this func recursively
  }
  return date;
}

const cloneDate = (date) => new Date(+date);

const addDays = (date, daysToAdd) => {
  const newDate = cloneDate(date);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
};

// Returns a weekday, non-holiday date that is a specified number of days in the future
function daysInFuture(numDaysInFuture, format = "YYYY-MM-DD") {
  const date = addDays(new Date(), numDaysInFuture);

  // The requested date may fall on a weeked or bank holiday. Weekend and holiday dates should be avoided
  // in mock data since they're disallowed by the datepicker on many pages.
  // Thus call getNextNonHoliday. If the requested date is on a weekend or holiday, we'll get the next date that works instead.
  const holidays = getMockBankHolidays(date.getFullYear());
  const nonHolidayDate = getNextNonHoliday(holidays, date);
  const formattedDate =
    format === "YYYY-MM-DD"
      ? formatDateYYYYMMDD(nonHolidayDate)
      : formatDateMMDDYYYY(nonHolidayDate);
  return formattedDate;
}

function formatDateMMDDYYYY(date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() + offset * 60 * 1000);
  return (
    `${date.getMonth() + 1}`.padStart(2, 0) +
    "/" +
    `${date.getDate()}`.padStart(2, 0) +
    "/" +
    date.getFullYear()
  );
}

// Format date as YYYY-MM-DD - via https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd#comment84587622_29774197
function formatDateYYYYMMDD(date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() + offset * 60 * 1000);
  return date.toISOString().split("T")[0];
}

module.exports = {
  daysInFuture,
};

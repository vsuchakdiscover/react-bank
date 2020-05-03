import { parseDateString } from "reusable/lib/dateUtils";

// These values and functions are used by PaymentSlider and its tests
export function dateRange(start, end) {
  return `${start.getMonth() + 1}/${start.getDate()} - ${
    end.getMonth() + 1
  }/${end.getDate()}`;
}

// Returns a future date for the provided number of days in the future.
export function futureDate(numDaysInFuture, fromDate = new Date()) {
  const date = new Date(fromDate.getTime());
  date.setDate(date.getDate() + numDaysInFuture);
  return date;
}

// Returns the date for Sunday in the week provided
function getSunday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

// Returns a futureTime x days in the future.
export function futureTime(numDaysInFuture, date) {
  return futureDate(numDaysInFuture, date).getTime();
}

// Accepts a date string, parses it, and returns getTime()
export function getTime(date) {
  return parseDateString(date).getTime();
}

// Formats date to January 1 format by default. Or pass monthLength as "short" to format as Jan 01.
export function formatDate(date, monthLength = "long") {
  const formatter = new Intl.DateTimeFormat("en", { month: monthLength });
  const [year, month, day] = date.split("-");
  const shortMonth = formatter.format(new Date(year, month - 1, day));
  return shortMonth + " " + parseInt(day, 10);
}

export function formatShortDate(date) {
  return formatDate(date, "short");
}

export const todayAtMidnight = new Date();
todayAtMidnight.setHours(0, 0, 0, 0);

export const sundayThisWeek = getSunday(new Date());
sundayThisWeek.setHours(0, 0, 0, 0);

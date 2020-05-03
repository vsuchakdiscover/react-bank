/* eslint-disable no-useless-escape */

// Temporary phone input validation
export function isValidPhone(phone) {
  //Generic phone format regex via https://stackoverflow.com/a/4339299/26180
  const regex = RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "im"
  );

  switch (phone) {
    case "000-000-0000":
    case "111-111-1111":
    case "222-222-2222":
    case "333-333-3333":
    case "444-444-4444":
    case "555-555-5555":
    case "666-666-6666":
    case "777-777-7777":
    case "888-888-8888":
    case "999-999-9999":
      return;
    default:
      if (phone.match(regex)) {
        return true;
      }
  }
}

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
// via https://stackoverflow.com/a/6178341/26180
export function isValidDate(dateString) {
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

  // Parse the date parts to integers
  var parts = dateString.split("/");
  var day = parseInt(parts[1], 10);
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

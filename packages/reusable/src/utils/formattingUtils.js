export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeFirstLetterOnly(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function stripCommas(x) {
  return x.toString().replace(/,/g, "");
}

// Strip period from the end of a string.
export function stripPeriod(str) {
  return str.replace(/\.$/, "");
}

export function formatCurrency(x) {
  if (x === undefined || x === null) return "";
  //is negative number
  const isNegative = x.toString().includes("-");
  // Strip any existing commas first and remove the dash from negatives -- ie doesn't like negative numbers for currency and displays negatives with parentheses
  let num = Number(stripCommas(x.toString().replace("-", "")));
  return (
    (isNegative ? "-" : "") +
    num.toLocaleString("en-US", { style: "currency", currency: "USD" })
  );
}

export function stripCurrencyFormatting(amount) {
  const string = amount.toString();
  return string.replace(/[$,]/g, "");
}

// Return the last four digits of the passed value
export function lastFour(value) {
  const stringVal = value.toString();
  return stringVal.substring(stringVal.length - 4, stringVal.length);
}

/** Converts a camelCased string into sentence case.
    Capitalizes the first letter, and adds spaces after each word.
    Useful for converting field names for display in validation error messages.
*/
export function sentenceCase(str) {
  let result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/** Accepts account, payee, or paymentMethod objects, with nickName and optional accountNumber properties.
 *  Returns the account or paymentMethod with the last 4 digits in parens.
 *  Omits the account number and parens if accountNumber isn't available.
 */
export function nickNameWithLastFour(accountOrPayeeOrPaymentMethod) {
  const {
    nickName,
    accountName,
    accountNumber,
  } = accountOrPayeeOrPaymentMethod;
  return (
    (nickName || accountName) +
    (accountNumber ? ` (${lastFour(accountNumber)})` : "")
  );
}

/** Adds a '-' to any zip-code larger than 5 digits
 *  i.e 1452291 will return 14522-91
 */
export function formatZip(num) {
  if (num && num.length === 5) {
    return num;
  }
  if (num) return num.toString().replace(/(\d{5})(\d{4})/, "$1-$2");
}

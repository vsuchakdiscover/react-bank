export const fiveCharacters = (value) =>
  (value && value.length === 5) || "Enter 5 characters";

export const maxLength11 = (value) =>
  (value && value.length <= 11) || "Enter a value up to 11 characters";

export const mobilePhoneNumber = (value) =>
  /^\d{10}$/g.test(value) || "Enter your 10-digit phone number";

export const zipCode = (value) =>
  /^\d{5}$/g.test(value) || "Enter your 5-digit ZIP code";

export const last4DigitsOfSsnOrTaxId = (value) => {
  return (
    /^\d{4}$/g.test(value) || "Enter the last 4 digits of your SSN or Tax ID"
  );
};

export const isNumber = (value) => /^[0-9]*$/g.test(value) || "Enter a number";

export const isNotEmpty = (value) =>
  (value && value.length > 0) || "Enter a value";

export const passwordsMatch = (value, context) => {
  return (
    // By convention, the confirmation field is named as {password_name}___CONFIRMATION___
    // so to get that password_field name we need to strip ___CONFIRMATION___ from the confirmation
    // input name.
    value === context.values[context.name.replace("___CONFIRMATION___", "")] ||
    "Confirm Password must match"
  );
};

export const isNotEmptyWithMessage = (errorMessage) => (value) => {
  const result = isNotEmpty(value);
  return result === true || errorMessage;
};

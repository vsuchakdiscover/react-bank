import { string, number, shape } from "prop-types";

export const beneficiaryType = shape({
  number: number,
  firstName: string.isRequired,
  middleName: string.isRequired,
  lastName: string.isRequired,
  suffix: string.isRequired,
  ssn: string.isRequired,
  dob: string.isRequired,
  phone: string.isRequired,
  country: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  zip: string,
});

// Holds form validation errors
export const errorType = shape({
  // The input's unique html ID.
  inputId: string,

  // The section where the input exists
  section: string,

  // Error message
  message: string,
});

export const account = shape({
  id: number,
  number: number,
  balance: number,
  userId: number,
});

export const user = shape({
  id: number,
  name: string,
});

export const contact = shape({
  id: number,
  email: string.isRequired,
  twitterHandle: string.isRequired,
  message: string.isRequired,
});

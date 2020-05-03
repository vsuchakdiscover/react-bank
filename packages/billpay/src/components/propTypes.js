import { string, number, shape, oneOfType } from "prop-types";

export const reminderPropType = shape({
  payeeId: string.isRequired,
  frequency: string.isRequired,
  date: string.isRequired,
  amount: oneOfType([string, number]).isRequired,
});

const FREQUENCIES = {
  ONE_TIME: "One Time",
  REPEATING: "Repeating",
  ONCE_A_WEEK: "Weekly",
  ONCE_IN_2_WEEKS: "Every 2 Weeks",
  ONCE_IN_4_WEEKS: "Every 4 Weeks",
  TWICE_A_MONTH: "Twice a Month",
  ONCE_A_MONTH: "Monthly",
  ONCE_IN_2_MONTHS: "Every 2 Months",
  ONCE_IN_3_MONTHS: "Every 3 Months",
  ONCE_IN_6_MONTHS: "Every 6 Months",
  ONCE_A_YEAR: "Annually",
};

export const getFrequencyLabel = (frequencyKey) =>
  FREQUENCIES[frequencyKey] || frequencyKey;

export default FREQUENCIES;

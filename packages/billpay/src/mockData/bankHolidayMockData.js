// Returns array of mock bank holidays for the requested year
function getMockBankHolidays(year) {
  return [
    "2020-01-01",
    "2020-01-20",
    "2020-02-17",
    "2020-05-25",
    "2020-07-03",
    "2020-09-07",
    "2020-10-12",
    "2020-11-11",
    "2020-11-26",
    "2020-12-25",
  ].map((d) => d.replace("2020", year));
}

module.exports = {
  default: {
    getMockBankHolidays,
  },
};

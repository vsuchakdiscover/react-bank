// Using CommonJS so we can consume via Node (without using Babel-node)
module.exports = {
  accounts: require("./accountMockData").default,
  cards: require("./cardMockData").default,
  customerProfiles: require("./customerProfileMockData").default,
  customerEnrollmentStatus: require("./customerEnrollmentStatusMockData")
    .default,
  payees: require("./payeeMockData").default,
  payments: require("./paymentMockData").default,
  profiles: require("./profileMockData").default,
  scheduledPayments: require("./scheduledPaymentsMockData").default,
  merchants: require("./merchantMockData").default,
  ebills: require("./ebillsMockData").default,
  ebillTokens: require("./ebillsTokenMockData").default,
};

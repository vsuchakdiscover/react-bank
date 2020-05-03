// Use CommonJS require below so we can dynamically import during build-time.
// This way only the relevant files are included in the bundle.
// The one downside: This breaks autocomplete.
// By convention, all mock API files end in .mock, so call .mock in dev.
const suffix =
  process.env.NODE_ENV === "development" ||
  process.env.REACT_APP_USE_MOCK_API === "Y"
    ? ".mock"
    : "";

module.exports = {
  accountsApi: require("./accountsApi" + suffix),
  customerProfileApi: require("./customerProfileApi" + suffix),
  discoverCardsApi: require("./discoverCardsApi" + suffix),
  enrollmentStatusApi: require("./enrollmentStatusApi" + suffix),
  merchantsApi: require("./merchantsApi" + suffix),
  payeesApi: require("./payeesApi" + suffix),
  paymentsApi: require("./paymentsApi" + suffix),
  profileApi: require("./profileApi" + suffix),
  ebillsApi: require("./ebillsApi" + suffix),
};

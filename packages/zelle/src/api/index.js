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
  enrollmentApi: require("./enrollmentApi" + suffix),
  oobApi: require("./oobApi" + suffix),
  profileApi: require("./profileApi" + suffix),
  tmxApi: require("./tmxApi" + suffix),
};

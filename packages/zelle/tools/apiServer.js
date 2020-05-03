const path = require("path");
const { start } = require("../../reusable/tools/mockApiUtils");

start({
  port: 3003,
  mockData: require("../src/mockData"),
  routesDir: path.join(__dirname, "routes"),
  dbJsonFilePath: path.join(__dirname, "db.json"),
});

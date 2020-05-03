// Centralizes utilities for working with mock APIs.

/* eslint-disable no-console */
const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

/*
Use json-server to host a local mock API, with the module approach (which provides more config power): https://github.com/typicode/json-server#module
Downside: You can't pass the json-server command line options.
Instead, can override some defaults by passing a config object to jsonServer.defaults();
You have to check the source code to set some items.
Examples:
Validation/Customization: https://github.com/typicode/json-server/issues/266
Delay: https://github.com/typicode/json-server/issues/534
ID: https://github.com/typicode/json-server/issues/613#issuecomment-325393041
Relevant source code: https://github.com/typicode/json-server/blob/master/src/cli/run.js
*/
function start({ port, routesDir, dbJsonFilePath, mockData }) {
  createDb(mockData, dbJsonFilePath, () => {
    const server = jsonServer.create();
    const router = jsonServer.router(dbJsonFilePath);

    // Can pass a limited number of options to this to override (some) defaults. See https://github.com/typicode/json-server#api
    const middlewares = jsonServer.defaults({
      logger: process.env.ENABLE_MOCK_API_LOGGER === "Y",
    });

    // Set default middlewares (logger, static, cors and no-cache)
    server.use(middlewares);

    // To handle POST, PUT and PATCH you need to use a body-parser. Using JSON Server's bodyParser
    server.use(jsonServer.bodyParser);

    // Simulate delay on all requests
    server.use(function (req, res, next) {
      const delay = process.env.API_CALL_DELAY || 0;
      setTimeout(next, delay);
    });

    // import and init custom routes declared in the routes path, and pass the server and mock db (json-server's lowdb) to each.
    fs.readdirSync(routesDir).forEach((filename) => {
      // By convention, each routes file should expose an init function that accepts:
      // 1. The server
      // 2. Optionally the db (if needed by the route to access json - server's lowDb database directly)
      require(path.join(routesDir, filename))(server, router.db);
    });

    // declare resetDb route. This is called by the reusable scenario selector
    server.post("/resetDb", function (req, res) {
      createDb(mockData, dbJsonFilePath, () => {
        // Approach via https://github.com/typicode/json-server/issues/872
        router.db.setState(JSON.parse(fs.readFileSync(dbJsonFilePath)));
        return res.sendStatus(201);
      });
    });

    // Use default router
    server.use(router);

    // Start server
    server.listen(port, () =>
      console.log(`json-server is running on port ${port}.`)
    );
  });
}

// Create a db.json file using the mockData provided.
// This way json-server has consistent data to serve upon app start.
function createDb(mockData, dbJsonFilePath, callback) {
  fs.writeFile(dbJsonFilePath, JSON.stringify(mockData), function (err) {
    if (err) return console.log(err);
    console.log("Mock DB created.");
    callback();
  });
}

module.exports = {
  start,
};

module.exports = function init(server) {
  server.get("/customerEnrollmentStatus/:id", function (req, res, next) {
    // We need a special handling of OOB Error scenarios.
    if (req.params.id === "OOB_ERROR_BASIC_LOGIN_SCENARIO") {
      res.header("WWW-Authenticate", "Basic login");
      res.header("Access-Control-Expose-Headers", "WWW-Authenticate");
      return res.sendStatus(401);
    } else if (req.params.id === "OOB_ERROR_BASIC_OOB_BANK_SCENARIO") {
      res.set("WWW-Authenticate", "Basic oob-bank");
      res.header("Access-Control-Expose-Headers", "WWW-Authenticate");
      return res.sendStatus(401);
    }

    next();
  });

  server.post("/customerEnrollmentStatus/", function (req, res) {
    req.method = "GET";
    res.jsonp({ eligible: true, enrolled: true });
  });
};

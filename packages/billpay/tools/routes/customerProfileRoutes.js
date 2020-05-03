module.exports = function init(server, db) {
  server.get("/customerProfiles", function (req, res, next) {
    let customerProfiles = db.get("customerProfiles").value();

    switch (req.header("scenario")) {
      default:
        return res.json(customerProfiles[0]); // There's only one customer in the mock API for now, so just return it.
    }
  });
};

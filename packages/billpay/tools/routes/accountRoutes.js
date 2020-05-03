module.exports = function init(server, db) {
  server.get("/accounts", function (req, res, next) {
    switch (req.header("scenario")) {
      case "No accounts":
        return res.status(200).json([]);
      default:
        next(); // do nothing, let default json-server response take over.
    }
  });

  //set preferred
  server.post("/setPreferred/:accountId", function (req, res, next) {
    switch (req.header("scenario")) {
      case "General.TechnicalDifficulties":
        return res.status(500).json({
          errors: [
            {
              code: "General.TechnicalDifficulties",
              httpStatus: 500,
              message:
                "Some of our web site features are unavailable at this time. We sincerely apologize for this temporary inconvenience and are working to resolve this issue. Please contact us for more information.",
            },
          ],
        });
      default:
        // See the lowdb docs (the db used by json-server) for info on this syntax: https://github.com/typicode/lowdb

        // Set existing preferred account to no longer be preferred
        db.get("accounts")
          .find({ preferred: true })
          .assign({ preferred: false })
          .write();

        // Now mark the passed account as preferred
        const preferredAccount = db
          .get("accounts")
          .find({ id: req.params.accountId })
          .assign({ preferred: true })
          .write();

        return res.status(200).json(preferredAccount);
    }
  });
};

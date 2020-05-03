module.exports = function init(server) {
  server.post("/profiles/:id", function (req, res, next) {
    switch (req.header("editEmailResponse")) {
      case "Profiles.Invalid.Email":
        return res.status(422).json({
          errors: [
            {
              code: "Profiles.Invalid.Email",
              httpStatus: 422,
              message: "Email address doesnt look right",
              name: "email",
            },
          ],
        });

      case "Profiles.Invalid.CharSet":
        return res.status(422).json({
          errors: [
            {
              code: "Profiles.Invalid.CharSet",
              httpStatus: 422,
              message: "The field has invalid characters in it",
              name: "email",
            },
          ],
        });
      case "Profiles.Edit.Success.Customer.NotFound":
        return res.status(500).json({
          errors: [
            {
              code: "Profiles.Edit.Success.Customer.NotFound",
              httpStatus: 500,
              message: "There was an issue getting the information back.",
            },
          ],
        });

      case "Profiles.Customer.NoChangeRequired":
        return res.status(500).json({
          errors: [
            {
              code: "Profiles.Customer.NoChangeRequired",
              httpStatus: 500,
              message: "No change required",
            },
          ],
        });

      case "Profiles.Customer.UpdateFailed":
        return res.status(500).json({
          errors: [
            {
              code: "Profiles.Customer.UpdateFailed",
              httpStatus: 500,
              message: "Update failed",
            },
          ],
        });

      case "Profiles.Customer.UpdateError":
        return res.status(500).json({
          errors: [
            {
              code: "Profiles.Customer.UpdateError",
              httpStatus: 500,
              message: "Update error",
            },
          ],
        });

      case "Success":
        next();
        break;

      default:
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
    }
  });
};

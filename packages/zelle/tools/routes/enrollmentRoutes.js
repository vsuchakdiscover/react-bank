module.exports = function init(server) {
  server.get("/enrollment", function (req, res) {
    const scenario = req.header("scenario");
    switch (scenario) {
      case "enrolled":
        return res.status(200).json({
          enrolled: true,
          url: "https://www.discover.com",
        });
      // Default to returning unenrolled if no scenario is passed
      case undefined:
      case "unenrolled":
        return res.status(401).json({
          errors: [
            {
              code: "Terms.Acceptance.Required",
              message: "",
            },
          ],
        });
      case "General.AccessDenied":
        return res.status(403).json({
          errors: [
            {
              code: "General.AccessDenied",
              message: "Zelle access is denied due to TMX reject",
            },
          ],
        });
      case "General.AccessDenied.BankAuth":
        return res.status(401).json({
          errors: [
            {
              code: "General.AccessDenied.BankAuth",
              message: "Unauthorized for accessing the endpoint",
            },
          ],
        });
      case "General.AccessDenied.BankSA":
        return res.status(401).json({
          errors: [
            {
              code: "General.AccessDenied.BankSA",
              message: "RSA challenge is required.",
            },
          ],
        });
      case "Ineligible.Customer.Profile.Incomplete":
        return res.status(401).json({
          errors: [
            {
              code: "Ineligible.Customer.Profile.Incomplete",
              message:
                "Not eligible for P2P due to phone or email are missing in customer profile",
            },
          ],
        });
      case "Ineligible.No.Eligible.Accounts":
        return res.status(401).json({
          errors: [
            {
              code: "Ineligible.No.Eligible.Accounts",
              message:
                "Not eligible for P2P due to no eligible accounts for Zelle",
            },
          ],
        });
      case "Ineligible.No.Positive.Balance":
        return res.status(401).json({
          errors: [
            {
              code: "Ineligible.No.Positive.Balance",
              message:
                "Not eligible for P2P due to no eligible accounts with positive balance",
            },
          ],
        });
      case "Terms.Acceptance.Required":
        return res.status(401).json({
          errors: [
            {
              code: "Terms.Acceptance.Required",
              message:
                "The customer is not enrolled. It requires the customer to read & accept Terms and Conditions in order to enroll",
            },
          ],
        });
      case "General.TechnicalDifficulties":
        return res.status(500).json({
          errors: [
            {
              code: "General.TechnicalDifficulties",
              message: "Internal server error",
            },
          ],
        });
      default:
        throw new Error("Unhandled get enrollment: " + scenario);
    }
  });

  server.post("/enrollment", function (req, res) {
    const scenario = req.header("scenario");
    switch (scenario) {
      case "success":
        return res.status(200).json({
          enrolled: true,
          url: "https://www.mockedzelle.com",
        });
      case "General.AccessDenied":
        return res.status(403).json({
          errors: [
            {
              code: "General.AccessDenied",
              message: "Zelle access is denied due to TMX reject",
            },
          ],
        });
      case "General.AccessDenied.BankAuth":
        return res.status(401).json({
          errors: [
            {
              code: "General.AccessDenied.BankAuth",
              message: "Unauthorized for accessing the endpoint",
            },
          ],
        });
      case "General.TechnicalDifficulties":
        return res.status(500).json({
          errors: [
            {
              code: "General.TechnicalDifficulties",
              message: "Internal server error",
            },
          ],
        });
      default:
        throw new Error("Unhandled post enrollment: " + scenario);
    }
  });
};

const {
  getMockBankHolidays,
} = require("../../src/mockData/bankHolidayMockData").default;

module.exports = function init(server) {
  server.get("/payees", function (req, res, next) {
    switch (req.header("scenario")) {
      case "No reminders":
        return res.status(200).json([]);
      default:
        next(); // do nothing, let default json-server response take over.
    }
  });

  // Return different responses based on scenario header
  server.put("/payees/:userId", function (req, res, next) {
    switch (req.header("scenario")) {
      case "Payee.Address.PostcalCode.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Address.PostalCode.Invalid",
              httpStatus: 500,
              message: "Invalid Zip Code",
              name: "address.postalCode",
            },
          ],
        });
      case "Payee.Address.StreetAddress.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Address.StreetAddress.Invalid",
              httpStatus: 500,
              message: "Invalid Street Address",
              name: "address.streetAddress",
            },
          ],
        });
      case "Payee.Address.Locality.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Address.Locality.Invalid",
              httpStatus: 500,
              message: "Invalid City",
              name: "address.locality",
            },
          ],
        });
      case "Payee.Nickname.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Nickname.Invalid",
              httpStatus: 500,
              message: "Invalid Nickname",
              name: "nickName",
            },
          ],
        });
      case "Payee.Nickname.Exist":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Nickname.Exists",
              httpStatus: 500,
              message: "Nickname already exists. Enter a new Nickname.",
              name: "nickName",
            },
          ],
        });
      case "Payee.PhoneNumber.Number.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.PhoneNumber.Number.Invalid",
              httpStatus: 500,
              message: "Invalid Phone Number",
              name: "phoneNumber.number",
            },
          ],
        });
      case "Payee.InvalidAccountNumber":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.InvalidAccountNumber",
              httpStatus: 500,
              message: "Invalid Account Number.",
              name: "accountNumber",
            },
          ],
        });
      case "Payee.Name.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Name.Invalid",
              httpStatus: 500,
              message: "Invalid Name",
              name: "name",
            },
          ],
        });
      case "Payee.AccountNumber.Mismatch":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.AccountNumber.Mismatch",
              httpStatus: 500,
            },
          ],
        });
      case "Payee.ZipCode.Mismatch":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.ZipCode.Mismatch",
              httpStatus: 500,
            },
          ],
        });
      case "Payee.Duplicate":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Duplicate",
              httpStatus: 500,
              message: "Payee Already Exists.",
            },
          ],
        });
      case "Payee.Address.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.Address.Invalid",
              httpStatus: 500,
              message: "Invalid Address.",
            },
          ],
        });
      case "Payee.NotFound":
        return res.status(500).json({
          errors: [
            {
              code: "Payee.NotFound",
              httpStatus: 500,
            },
          ],
        });
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
        return next();
    }
  });

  server.get("/payees/holidays/:year", function (req, res, next) {
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
        const resp = getMockBankHolidays(req.params.year);
        return res.status(200).json(resp);
    }
  });
};

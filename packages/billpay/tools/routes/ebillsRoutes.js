module.exports = function init(server, db) {
  server.get("/ebill", function (req, res) {
    let ebills = db.get("ebills").value();
    res.json(ebills);
  });

  server.post("/enroll", function (req, res) {
    const payeeId = req.body.id;
    const { id, accountNumber, sessionKey, name, nickName } = db
      .get("ebillTokens")
      .find({ id: payeeId })
      .value().body;

    const successResponse = () => {
      return res.json({
        id,
        name,
        nickName,
        accountNumber,
        ebillStatus: "PENDING_ACTIVATION",
      });
    };

    switch (req.header("enrollmentResponse")) {
      case "Another set of tokens":
        const ebillsTokenList = [
          {
            tokenID: "Q1",
            label:
              "In what city was your high school? (full name of city only)",
            name: "In what city was your high school? (full name of city only)",
            formatType: "TextBox",
          },
        ];

        const hasAlreadySubmittedAnotherSetOfTokens =
          req.body.ebillsTokenList.length > 0 &&
          req.body.ebillsTokenList[0].label === ebillsTokenList[0].label;

        // If we get another set of tokens in POST, that
        // means user has already submitted them as the second step
        // and we can now show the success response.
        if (hasAlreadySubmittedAnotherSetOfTokens) {
          return successResponse();
        } else {
          return res.json({
            id,
            accountNumber,
            sessionKey,
            ebillsTokenList,
            ebillStatus: "AVAILABLE",
          });
        }
      case "Ebill.Enroll.NotEligible":
        return res.status(500).json({
          errors: [
            {
              code: "Ebill.Enroll.NotEligible",
              httpStatus: 500,
              message: "This payee is not eligible for E-Bill enrollment.",
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
      case "eBillStatus returned as AVAILABLE":
        return res.json({
          id,
          name,
          nickName,
          accountNumber,
          ebillStatus: "AVAILABLE",
        });
      default:
        return successResponse();
    }
  });

  server.post("/filebill/:billId", function (req, res) {
    switch (req.header("fileEbillResponse")) {
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
        return res.status(204).json();
    }
  });

  server.post("/unenroll/:payeeId", function (req, res) {
    switch (req.header("unenrollResponse")) {
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
      case "Ebill.UnEnroll.NotEligible":
        return res.status(500).json({
          errors: [
            {
              code: "Ebill.UnEnroll.NotEligible",
              httpStatus: 500,
              message: "This payee is not eligible for E-Bill un-enrollment.",
            },
          ],
        });
      default:
        return res.status(204).json();
    }
  });

  server.get("/eBillTokens/:payeeId", function (req, res) {
    const payeeId = req.params.payeeId;
    switch (req.header("payeeId")) {
      case "Ebill.Enroll.NotEligible":
        return res.status(500).json({
          errors: [
            {
              code: "Ebill.Enroll.NotEligible",
              httpStatus: 500,
              message: "This payee is not eligible for E-Bill enrollment.",
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
        return res.json(
          db.get("ebillTokens").find({ id: payeeId }).value().body
        );
    }
  });
};

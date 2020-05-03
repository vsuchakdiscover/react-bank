module.exports = function init(server) {
  server.get("/oob/status", function (req, res) {
    const scenario = req.header("scenario");
    switch (scenario) {
      case "challenge":
        return res.status(200).json({
          channels: [
            {
              name: "mobile_phone",
              description: "xxx-xxx-1234",
              delivery_methods: [
                {
                  name: "sms",
                  description: "Text",
                  active: false,
                },
                {
                  name: "audio",
                  description: "Voice",
                  active: true,
                },
              ],
            },
            {
              name: "work_phone",
              description: "xxx-xxx-4567",
              delivery_methods: [
                {
                  name: "audio",
                  description: "Voice",
                  active: false,
                },
              ],
            },
            {
              name: "email",
              description: "b***2@gmail.com",
              delivery_methods: [
                {
                  name: "email",
                  description: "Email",
                  active: false,
                },
              ],
            },
          ],
          bindDeviceEnabled: true,
        });
      case "Auth.OOB.ChallengeAnswer.Locked":
        return res.status(403).json({
          errors: [
            {
              code: "Auth.OOB.ChallengeAnswer.Locked",
              httpStatus: "403",
              title: "Account Locked",
              message: "Your account is locked.",
            },
          ],
        });
      case "OOB.Unauthenticated":
        return res.status(401).json({
          errors: [
            {
              code: "OOB.Unauthenticated",
              httpStatus: 401,
            },
          ],
        });

      default:
        throw new Error("Unhandled oob status: " + scenario);
    }
  });

  server.post("/oob/challenge", function (req, res) {
    switch (req.header("scenario")) {
      // TODO: Handle other scenarios
      default:
        res.status(201).json({
          channel: req.channel,
          delivery_method: req.deliveryMethod,
        });
    }
  });

  server.post("/oob/answer", function (req, res) {
    const scenario = req.header("scenario");
    switch (scenario) {
      case "success":
        return res.status(200).json({
          identificationCode: req.idCode,
          bindDevice: req.bindDevice,
          challengeResult: "success",
        });

      case "OOB.ChallengeAnswer.Locked":
        return res.status(403).json({
          errors: [
            {
              code: "OOB.ChallengeAnswer.Locked",
              httpStatus: "403",
              name: "Account locked.",
              message: "Your account is locked.",
            },
          ],
        });

      case "OOB.ChallengeAnswer.CodeExpired":
        return res.status(422).json({
          errors: [
            {
              code: "OOB.ChallengeAnswer.CodeExpired",
              httpStatus: "422",
              name: "The code expired.",
              message: "The code expired.",
            },
          ],
        });

      case "OOB.ChallengeAnswer.InvalidCode":
        return res.status(422).json({
          errors: [
            {
              code: "OOB.ChallengeAnswer.InvalidCode",
              httpStatus: "422",
              name: "Invalid Code",
              message: "The code you entered is invalid.",
            },
          ],
        });

      case "OOB.ChallengeAnswer.LastAttempt":
        return res.status(422).json({
          errors: [
            {
              code: "OOB.ChallengeAnswer.LastAttempt",
              httpStatus: "422",
              name: "Invalid Code",
              message: "This is your last try.",
            },
          ],
        });

      case "OOB.Unauthenticated":
        return res.status(401).json({
          errors: [
            {
              code: "OOB.Unauthenticated",
              httpStatus: "401",
              name: "Unauthenticated",
              message: "You're not logged in.",
            },
          ],
        });

      default:
        throw new Error("Unknown oob answer: " + scenario);
    }
  });
};

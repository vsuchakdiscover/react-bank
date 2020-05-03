function addDashes(f) {
  return f.slice(0, 3) + "-" + f.slice(3, 6) + "-" + f.slice(6);
}

module.exports = function init(server) {
  // Yes, this is weird. We're using POST to update because the prod API requires it. See item 1 here: https://github.com/mcdpartners/react-bank/issues/135
  server.post("/profiles/:id", function (req, res) {
    const scenario = req.header("scenario");
    switch (scenario) {
      case "oob":
        return res.status(401).json({
          errors: [
            {
              code: "General.AccessDenied.BankSA",
              message: "RSA challenge is required.",
            },
          ],
        });

      case "success":
        // The real API formats phone numbers with dashes. Do same here.
        const profile = { ...req.body };
        if (
          profile.phoneNumbers &&
          profile.phoneNumbers.home &&
          profile.phoneNumbers.home.number
        ) {
          profile.phoneNumbers.home.formatted = addDashes(
            profile.phoneNumbers.home.number
          );
        }

        if (
          profile.phoneNumbers &&
          profile.phoneNumbers.work &&
          profile.phoneNumbers.work.number
        ) {
          // Note that prod API slaps Ext on end if it exists. So doing the same here.
          profile.phoneNumbers.work.formatted =
            addDashes(profile.phoneNumbers.work.number) +
            (profile.phoneNumbers.work.ext
              ? " Ext " + profile.phoneNumbers.work.ext
              : "");
        }

        if (
          profile.phoneNumbers &&
          profile.phoneNumbers.mobile &&
          profile.phoneNumbers.mobile.number
        ) {
          profile.phoneNumbers.mobile.formatted = addDashes(
            profile.phoneNumbers.mobile.number
          );
        }

        return res.status(200).json(profile);

      default:
        return res.status(500).json({
          errors: [
            {
              code: "General.AccessDenied.BankAuth",
              message: "Session timed out",
            },
          ],
        });
    }
  });
};

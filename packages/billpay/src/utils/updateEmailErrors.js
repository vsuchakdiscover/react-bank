export const UPDATE_EMAIL_ERROR_MESSAGES = {
  "Profiles.Invalid.Email": {
    message: "Add an email address to update your reminders.",
  },
  "Profiles.Invalid.CharSet": {
    message: "Add an email address formatted like email@domain.com.",
  },
  "Profiles.Edit.Success.Customer.NotFound": {
    message: "Hmm, something went wrong",
    note: "We’re working on fixing this issue. Try again in a few minutes.",
  },
  "Profiles.Customer.NoChangeRequired": {
    message: "Your email address stayed the same",
    note:
      "You entered the same email address we had on file so no change was made. If you’d still like to edit, please enter a different email address.",
  },
  "Profiles.Customer.UpdateFailed": {
    message: "Hmm, something went wrong",
    note: "We’re working on fixing this issue. Try again in a few minutes.",
  },
  "Profiles.Customer.UpdateError": {
    message: "Hmm, something went wrong",
    note: "We’re working on fixing this issue. Try again in a few minutes.",
  },
  "General.TechnicalDifficulties": {
    message: "Hmm, something went wrong",
    note: "We’re working on fixing this issue. Try again in a few minutes.",
  },
};

export const getUpdateEmailErrorMessage = (errorCode) => {
  return (
    UPDATE_EMAIL_ERROR_MESSAGES[errorCode] || {
      message: "Hmm, something went wrong",
      note: "We’re working on fixing this issue. Try again in a few minutes.",
    }
  );
};

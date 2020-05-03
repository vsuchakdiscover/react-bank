module.exports = function init(server, db) {
  server.get("/payments", function (req, res) {
    // Get accounts for the selected account scenario
    const selectedAccountScenario = db
      .get("accounts")
      .find({ id: parseInt(req.header("accountScenario"), 10) })
      .value();

    const { accounts } = selectedAccountScenario;

    let payments = db.get("payments").value();

    // Only return payments that have a payment method associated with the selected account scenario
    payments = payments.filter((p) =>
      accounts.some((a) => a.id === p.paymentMethod.id)
    );

    const statuses = req.query.statuses
      ? Array.isArray(req.query.statuses)
        ? req.query.statuses
        : [req.query.statuses]
      : [];

    const scheduledPaymentsMode =
      statuses.length === 1 && statuses.includes("SCHEDULED");

    if (statuses.length) {
      payments = payments.filter((r) => statuses.includes(r.status));
    } else {
      // By default, scheduled payments should be omitted.
      payments = payments.filter((r) => r.status !== "SCHEDULED");
    }

    switch (req.header("paymentScenario")) {
      case "Without scheduled payments":
        if (scheduledPaymentsMode) {
          payments = [];
        }
        break;
      case "No payments":
        payments = [];
        break;
      case "Scheduled payments return error":
        if (scheduledPaymentsMode) {
          res.status(500);
        }
        break;
      case "Payments history with error":
        if (!scheduledPaymentsMode) {
          res.status(500);
        }
        break;
      case "Without one-time payments":
        payments = payments.filter((p) => p.type !== "ONE_TIME");
        break;
      default:
        break;
    }

    res.json(payments);
  });

  server.post("/payments/delete/:paymentId", function (req, res) {
    switch (req.header("deletePaymentResponseScenario")) {
      case "Payment.CannotBeDeleted":
        return res.status(500).json({
          errors: [{ code: "Payment.CannotBeDeleted", httpStatus: 500 }],
        });
      case "Payments.NotFound":
        return res.status(500).json({
          errors: [
            {
              code: "Payments.NotFound",
              httpStatus: 500,
              message: "The requested payment could not be found.",
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
        // See the lowdb docs (the db used by json-server) for info on this syntax: https://github.com/typicode/lowdb
        // we are not using the default id property for delete so have to use this workaround
        const payments = db.get("payments");
        if (req.query.type === "all") {
          const ruleId = payments
            .find({ paymentId: req.params.paymentId })
            .value().ruleId;
          payments.remove({ ruleId: ruleId }).write();
        } else {
          payments.remove({ paymentId: req.params.paymentId }).write();
        }

        return res.status(204).json();
    }
  });

  server.post("/payments/rule/delete/:payeeId", function (req, res) {
    switch (req.header("deletePaymentResponseScenario")) {
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

  server.post("/payments/add/:paymentId?", function (req, res) {
    const scenario = req.header("addPaymentResponseScenario");
    switch (scenario) {
      case "Payments.PaymentNotEditable":
        return res.status(500).json({
          errors: [
            {
              code: "Payments.PaymentNotEditable",
              httpStatus: 500,
              message: "This payment is not editable.",
            },
          ],
        });

      case "Payments.NotFound":
        return res.status(500).json({
          errors: [
            {
              code: "Payments.NotFound",
              httpStatus: 500,
              message: "The requested payment could not be found.",
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

      case "Payment.Duplicate":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Duplicate",
              httpStatus: 500,
              message: "You cannot schedule a duplicate payment.",
            },
          ],
        });

      case "Payment.Exceeds.DailyLimit":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Exceeds.DailyLimit",
              httpStatus: 500,
              message:
                "The total dollar amount of your payments exceeds your daily limit of $20,000.00.",
            },
          ],
        });

      case "Payment.DeliverBy.Invalid.BankHoliday":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.DeliverBy.Invalid.BankHoliday",
              httpStatus: 500,
              message: "Please select a valid delivery date.",
              name: "deliverByDate",
            },
          ],
        });

      case "Payment.Note.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Note.Invalid",
              httpStatus: 500,
              message: "Please enter a valid Note.",
              name: "note",
            },
          ],
        });

      case "Payments.Frequency.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payments.Frequency.Invalid",
              httpStatus: 500,
              message: "Please select a valid Frequency.",
              name: "frequency",
            },
          ],
        });

      case "Payment.Memo.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Memo.Invalid",
              httpStatus: 500,
              message: 'The following characters are not allowed: <>()&;"[]{}',
              name: "memo",
            },
          ],
        });

      case "Payment.Amount.Invalid.Min":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Amount.Invalid.Min",
              httpStatus: 500,
              message:
                "Your bill payment is less than the minimum allowable amount of $1.",
              name: "amount",
            },
          ],
        });

      case "Payment.Amount.Invalid":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.Amount.Invalid",
              httpStatus: 500,
              message:
                "The entered amount is invalid. Please enter a valid amount.",
              name: "amount",
            },
          ],
        });

      case "Payment.DeliverBy.Invalid.Start":
        return res.status(500).json({
          errors: [
            {
              code: "Payment.DeliverBy.Invalid.Start",
              httpStatus: 500,
              message: "Please select a valid delivery date.",
              name: "deliverByDate",
            },
          ],
        });

      case "Fail Only DiscoverCard (4065)":
        if (req.body.payee.id === "102260910") {
          return res.status(500).json({
            errors: [
              {
                code: "General.TechnicalDifficulties",
                httpStatus: 500,
              },
            ],
          });
        }
        return res
          .status(200)
          .json(getSuccessResponse(req.body, req.header("accountScenario")));

      case "Response403":
        return res.status(403).json();

      case "Success":
        return res
          .status(200)
          .json(getSuccessResponse(req.body, req.header("accountScenario")));

      default:
        throw new Error("Unknown scenario: " + scenario);
    }
  });

  function getSuccessResponse(payment, accountScenarioId) {
    // TODO: Get the selected scenario here
    // (Need to send all selected scenarios instead of just one),
    // Get the payees from the db for the first scenario

    // TODO fork this response for one time vs recurring since they return a few different values.
    let payees = db
      .get("payees")
      .value()
      .find((p) => p.id === 1).payees;

    let accounts = db.get("accounts").value();

    const payee = payees.find((p) => payment.payee.id === p.id);

    const accountsForSelectedScenario = accounts.find(
      (a) => a.id === parseInt(accountScenarioId, 10)
    ).accounts;

    const {
      name: accountName,
      accountNumber,
      preferred,
    } = accountsForSelectedScenario.find(
      (a) => a.id === payment.paymentMethod.id
    );
    return {
      payee: {
        id: payee.id,
        name: payee.nickName,
        accountNumber: payee.accountNumber,
      },
      amount: payment.amount,
      paymentMethod: {
        accountName,
        accountNumber,
        preferred,
      },
      memo: payment.memo,
      deliverByDate: payment.deliverByDate,
      confirmationNumber: "DBWBRZZ4",
      deliveryMethod: payment.paymentMethod,
      frequency: payment.frequency,
    };
  }
};

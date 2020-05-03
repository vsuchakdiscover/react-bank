import {
  sentenceCase,
  stripCurrencyFormatting,
} from "reusable/lib/formattingUtils";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

// UI statuses
export const STATUS = {
  LOADING: "loading",
  SUBMITTING: "submitting",
  STEP1: "step1",
  STEP2: "step2",
  STEP3: "step3",
};

export function schedulePaymentReducer(state, [action, data]) {
  switch (action) {
    case "init": {
      const preferredAccountId = getPreferredAccountId(data.accounts);

      return {
        ...state,
        customerProfile: data.customerProfile,
        accounts: data.accounts,
        preferredAccountId,
        payments: getInitialPayments(
          data.payees,
          preferredAccountId,
          data.selectedPayeeId
        ),
        scheduledPayments: data.scheduledPayments,
        discoverCreditCards: data.discoverCreditCards,
        payees: data.payees,
        status: data.status,
      };
    }

    // Reinitializing step 1 requires:
    // 1. Getting updated payee data that may have just been edited via a successful step 2 submission.
    // 2. Reinitializing payments
    // 3. Setting the status back to STEP1.
    case "reInit": {
      const preferredAccountId = getPreferredAccountId(data.accounts);

      return {
        ...state,
        payees: data.payees,
        payments: getInitialPayments(
          data.payees,
          preferredAccountId,
          data.selectedPayeeId
        ),
        scheduledPayments: data.scheduledPayments,
        status: STATUS.STEP1,
      };
    }

    case "edit": {
      const scheduledPayment = getScheduledPayment(
        data.editPaymentId,
        data.scheduledPayments,
        data.payees,
        data.forcedOneTime,
        data.accounts
      );

      return {
        ...state,
        customerProfile: data.customerProfile,
        accounts: data.accounts,
        payments: [scheduledPayment],
        scheduledPayments: data.scheduledPayments,
        discoverCreditCards: data.discoverCreditCards,
        payees: data.payees,
        status: data.status,
      };
    }

    case "removeAutopay": {
      const newState = { ...state };
      const { paymentId } = data.payment;
      const { id: payeeId } = data.payment.payee;
      let scheduledPayments = newState.scheduledPayments.filter(
        (s) => s.paymentId !== paymentId
      );

      //remove the automaticPayment property from the payee
      const updatedPayee = newState.payees.find((n) => n.id === payeeId);
      delete updatedPayee.automaticPayment;
      //then remove the other automatic payments that are scheduled for that payee
      scheduledPayments = scheduledPayments.filter(
        (s) =>
          s.payee.id !== payeeId ||
          (s.payee.id === payeeId && s.type !== FREQUENCY_TYPE.EBILL_AUTOPAY)
      );

      return { ...newState, scheduledPayments };
    }

    case "removeScheduledPayment": {
      let { payees, payments } = state;

      let scheduledPayments = state.scheduledPayments.filter(
        (s) => s.paymentId !== data.payment.paymentId
      );
      if (data.repeating) {
        const { id: payeeId } = data.payment.payee;

        // if deleting a repeating payment, remove the repeatingPayment property from the payee
        payees = state.payees.map((p) => {
          if (p.id !== payeeId) return p;
          const payeeWithoutRepeatingPayment = { ...p };
          delete payeeWithoutRepeatingPayment.repeatingPayment;
          return payeeWithoutRepeatingPayment;
        });
        //also need to update the payee repeatingPayment property associated with each payment, two places
        payments = state.payments.map((p) => {
          if (p.payee.id !== payeeId) return p;
          const paymentPayeeWithoutRepeatingPayment = { ...p };
          delete paymentPayeeWithoutRepeatingPayment.payee.repeatingPayment;
          return paymentPayeeWithoutRepeatingPayment;
        });

        scheduledPayments = scheduledPayments.filter(
          //then remove the other repeating payments that are scheduled for that payee
          (s) =>
            s.payee.id !== payeeId ||
            (s.payee.id === payeeId && s.type !== FREQUENCY_TYPE.REPEATING)
        );
      }
      return { ...state, payments, payees, scheduledPayments };
    }

    case "removeAllScheduledPayments": {
      const paymentIdsToRemove = data.payments.map((d) => d.paymentId);
      let scheduledPayments = state.scheduledPayments.filter(
        (s) => !paymentIdsToRemove.includes(s.paymentId)
      );
      return { ...state, scheduledPayments };
    }

    case "autoPaySwitch": {
      const preferredAccountId = getPreferredAccountId(data.accounts);
      const date = new Date();
      const initialPayment = getInitialPayments(
        data.payees.filter((p) => p.id === data.editPaymentId),
        preferredAccountId,
        data.selectedPayeeId
      );

      let updatedPayment = {
        ...initialPayment[0],
        type: FREQUENCY_TYPE.EBILL_AUTOPAY,
        autoPay: true,
        frequencyType: FREQUENCY_TYPE.EBILL_AUTOPAY,
        frequency: "",
        selected: true,
      };

      if (initialPayment[0].payee.hasOwnProperty("automaticPayment")) {
        updatedPayment.amountType =
          initialPayment[0].payee.automaticPayment.amount === "PAY_FULL_BALANCE"
            ? "amountDue"
            : "minimumPayment";
        updatedPayment.amount =
          initialPayment[0].payee.automaticPayment.amount === "PAY_FULL_BALANCE"
            ? initialPayment[0].payee.ebill.totalDue
            : initialPayment[0].payee.ebill.minimumDue;
        updatedPayment.paymentDate =
          initialPayment[0].payee.automaticPayment.paymentDate;
      }

      return {
        ...state,
        customerProfile: data.customerProfile,
        accounts: data.accounts,
        bankHolidays: { [date.getFullYear()]: data.bankHolidays },
        payments: [updatedPayment],
        scheduledPayments: data.scheduledPayments,
        discoverCreditCards: data.discoverCreditCards,
        payees: data.payees,
        status: data.status,
      };
    }

    case "resetForm":
      return {
        ...state,
        payments: getInitialPayments(data, state.preferredAccountId),
        errors: {},
        formResetCount: state.formResetCount + 1,
      };

    case "status":
      return { ...state, status: data };

    case "setPaymentStatus":
      const { payment, success, errorMsg } = data;
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.payee.id === payment.payee.id
            ? {
                ...p,
                confirmationNumber: payment.confirmationNumber,
                errorMsg,
                success,
              }
            : p
        ),
      };

    case "addCard":
      const newPayments = data.map((d) =>
        getInitialPayment(d, state.preferredAccountId)
      );

      const usedAccounts = data.map((r) => r.accountNumber);
      return {
        ...state,
        payments: [...newPayments, ...state.payments],
        discoverCreditCards: state.discoverCreditCards.filter(
          (d) => !usedAccounts.includes(d.accountNumber)
        ),
      };

    case "selectPayee": {
      const selectedPayments = getSelectedPayments(state.payments);
      const isAlreadyChecked = selectedPayments.find(
        (p) => p.payee.id === data
      );
      const payments = state.payments.map((p) => {
        if (p.payee.id !== data) return p; // Not the payment to change, so return untouched
        if (isAlreadyChecked) {
          const { autoPayBannerDismissed } = p; //before clearing everything note the banner dismissed state
          // Since payee is being deselected, clear out any existing values
          const clearedPayment = getInitialPayment(
            p.payee,
            state.preferredAccountId
          );
          return { ...clearedPayment, autoPayBannerDismissed };
        } else {
          return { ...p, selected: true };
        }
      });

      return {
        ...state,
        payments,
        // If payee is being deselected, clear out any existing errors
        errors: isAlreadyChecked
          ? getErrorsClearedForPayee(state.errors, data)
          : state.errors,
      };
    }
    case "dismissAutoPayBanner":
      const payments = state.payments.map((p) => {
        if (p.payee.id !== data) return p; // Not the payment to change, so return untouched
        return { ...p, autoPayBannerDismissed: true };
      });
      return { ...state, payments };

    case "clearErrorsForPayeeId":
      return { ...state, errors: getErrorsClearedForPayee(action.data) };

    case "saveDefaultPaymentAccount":
      return {
        ...state,
        accounts: state.accounts.map((a) => ({
          ...a,
          preferred: data === a.id,
        })),
        preferredAccountId: data,
        // Now set the initial payFrom on each unselected record
        // (for selected payeeIds, leave the selected payFrom as is
        // since the user may have changed it)
        payments: state.payments.map((p) =>
          p.selected ? p : { ...p, payFrom: data }
        ),
      };

    case "validateField": {
      const { name, value, payment } = data;
      const error = validateField(name, value);
      const newErrors = { ...state.errors };

      const prop = [payment.payee.id + "-" + name];
      if (error) {
        return {
          ...state,
          errors: {
            ...newErrors,
            [prop]: { message: error, payee: payment.payee },
          },
        };
      } else {
        // Since no errors were found, clear existing errors, if any
        if (state.errors[prop]) {
          delete newErrors[prop];
          return {
            ...state,
            errors: newErrors,
          };
        }
      }
      // If neither of above apply, return untouched state.
      return state;
    }

    case "changeAmountType": {
      const { amountType, amount, payment } = data;
      // Validate selected amount type and store error.
      // Don't validate if other was selected since there's no preset amount associated with other.
      // Don't validate if it's Autopay before an ebill is sent
      const error =
        amountType === "other" ||
        (!payment.payee.ebill &&
          payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY)
          ? null
          : validateField("amount", amount);

      const payments = state.payments.map((p) => {
        const { id } = payment.payee;
        return p.payee.id === id ? { ...p, amountType, amount } : p;
      });

      const newErrors = { ...state.errors };
      const prop = [payment.payee.id + "-amountType"]; // Assigning amount validation errors to amountType so that they display below the amount type dropdown.

      if (error) {
        newErrors[prop] = {
          message: error,
          payee: payment.payee,
        };
      } else {
        delete newErrors[prop]; // clear any previous amountType error
      }
      delete newErrors[payment.payee.id + "-amount"]; // clear amount input errors when amountType changes
      return { ...state, payments, errors: newErrors };
    }

    case "handleDatePickerErrors": {
      const { error, payment } = data;
      let errors = { ...state.errors };
      const key = payment.payee.id + "-deliverByDate";
      if (error) {
        errors[key] = {
          message: error,
          payee: payment.payee,
        };
      } else {
        delete errors[key]; // delete error if field is no longer in error
      }
      return { ...state, errors };
    }

    case "changePayment": {
      const { name, value, payment } = data;

      validateField(name, value);
      let errors = null;

      const payments = state.payments.map((p) => {
        const { id } = payment.payee;
        if (p.payee.id !== id) return p;
        // Given check above, we've found the relevant payment to update...
        let updatedPayment = { ...p, [name]: value };

        // Handle a few fields in a special way
        switch (name) {
          case "amount":
            updatedPayment.amount =
              value === "" ? "" : parseFloat(stripCurrencyFormatting(value)); // Strip $ from amount
            break;
          case "ends":
            if (value === "Never") updatedPayment.noOfPayments = ""; // clear noOfPayments if user just selected payments that never end
            break;
          case "frequencyType":
            // User just selected a different frequency on an ebill. So clear out child fields for that payee and clear any errors.
            // This way when they switch between "One Time Payment" and "Repeating" or "AutoPay", they see an empty form.
            errors = getErrorsClearedForPayee(state.errors, payment.payee.id);
            updatedPayment = getInitialPayment(
              p.payee,
              state.preferredAccountId
            );
            updatedPayment.frequencyType = value; // now set the value that was passed in.
            updatedPayment.selected = true; // since the initialPayment doesn't default to true, must explicitly set this.
            if (value === FREQUENCY_TYPE.ONE_TIME)
              updatedPayment.frequency = FREQUENCY_TYPE.ONE_TIME; // Set frequency to ONE_TIME too since there's no follow-up for that selection.
            break;
          default:
          // Do nothing special since cases above are just for fields that need handled in a special way.
        }
        return updatedPayment;
      });

      return {
        ...state,
        payments,
        // Only update errors if new errors were set above
        ...(errors && { errors }),
      };
    }

    case "submitStep1":
      let dateErrors = {}; //save date errors held in state as we handle these a little differently
      Object.keys(state.errors).forEach((e) => {
        if (e.includes("-deliverByDate")) {
          dateErrors[e] = state.errors[e];
        }
      });

      let errors = validate(getSelectedPayments(state.payments));
      errors = { ...errors, ...dateErrors };

      const errorsExist = Object.keys(errors).length > 0;
      return errorsExist
        ? { ...state, formSubmitCount: state.formSubmitCount + 1, errors }
        : { ...state, status: STATUS.STEP2, errors };

    default:
      throw new Error("Unhandled action: " + action);
  }
}

// *********** Helpers **************
function getErrorsClearedForPayee(errors, payeeId) {
  const newErrors = { ...errors };
  Object.keys(newErrors).forEach((key) => {
    if (key.startsWith(payeeId + "-")) {
      delete newErrors[key];
    }
  });
  return newErrors;
}

// Returns validation errors object. Returns empty object if not validation errors are found.
function validate(selectedPayments) {
  if (selectedPayments.length === 0) {
    return {
      step1Form: {
        message: "Select at least one Payee",
        payee: null,
      },
    };
  }

  const errors = {};

  // Storing message and payee in separate properties so we can generate different
  // longer error messages that include the relevant account for the error summary at the top.
  selectedPayments.forEach((payment) => {
    let fieldsToValidate = [
      "frequency",
      "amount",
      "deliverByDate",
      "note",
      "memo",
    ];

    if (payment.ends !== "Never") {
      fieldsToValidate.push("noOfPayments");
    }

    //if payment is autopay we use the amountType rather than the amount field
    if (payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY) {
      fieldsToValidate = fieldsToValidate.filter(
        (f) => f !== "frequency" && f !== "amount"
      );
      fieldsToValidate.push("amountType");
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, payment[field]);
      if (error) {
        const prop = [payment.payee.id + "-" + field];
        errors[prop] = {
          message: error,
          payee: payment.payee,
        };
      }
    });
  });

  return errors;
}

function checkAllowedAmount(value) {
  let error = "";
  if (!value) {
    error = "Enter a valid Amount";
  } else {
    const unformattedAmount = stripCurrencyFormatting(value);
    const MAX_BILL_PAYMENT = 10000;
    if (unformattedAmount > MAX_BILL_PAYMENT) {
      error =
        "Your bill payment exceeds the maximum allowable amount of $10,000.00";
    }
    if (unformattedAmount < 0) {
      error =
        "Your bill payment is less than the minimum allowable amount of $1";
    }
  }
  return error;
}

function validateField(field, value) {
  let error = "";

  switch (field) {
    case "deliverByDate":
      if (!value) error = "Enter a valid Date format (MM/DD/YYYY)";
      break;

    case "noOfPayments":
      if (value < 1) {
        error = "Enter a valid Number of Payments";
      }
      break;

    case "amount":
      error = checkAllowedAmount(value);
      break;

    case "amountType":
      if (value === "") {
        error = "Enter a valid Amount";
      }
      break;

    case "memo":
    case "note":
      if (value) {
        const invalidChars = [
          "<",
          ">",
          "(",
          ")",
          "&",
          ";",
          "\\",
          '"',
          "[",
          "]",
          "{",
          "}",
        ];
        if (invalidChars.some((char) => value.includes(char))) {
          error = `The following characters are not allowed in ${field}: <>()&;"[]{}`;
        }
      }
      break;

    // Default case to handle requiring other fields
    default:
      if (!value) error = "Enter a valid " + sentenceCase(field);
      break;
  }

  return error;
}

function getInitialPayment(payee, preferredAccountId, selectedPayeeId) {
  const defaultFrequency =
    payee.hasOwnProperty("repeatingPayment") ||
    payee.hasOwnProperty("automaticPayment")
      ? FREQUENCY_TYPE.ONE_TIME
      : "";
  return {
    payee, // Payments state holds form state. But also nesting payee object into here for easy reference
    payFrom: preferredAccountId, // Initialize payFrom to the preferred account number
    amountType: "",
    amount: "",
    frequencyType: defaultFrequency,
    frequency: defaultFrequency,
    deliverByDate: payee.deliverByDate || payee.earliestPaymentDate,
    ends: "Never",
    noOfPayments: "",
    note: "",
    memo: "",
    paymentDate: "ON_DUE_DATE",
    selected: payee.id === selectedPayeeId, // tracks whether the payee's checkbox is checked
  };
}

function getScheduledPayment(
  editPaymentId,
  scheduledPayments,
  payees,
  forcedOneTime,
  accounts
) {
  const paymentToEdit = scheduledPayments.find(
    (s) => s.paymentId === editPaymentId
  );

  if (!paymentToEdit) {
    //no scheduled payment, editing a repeating payment in the future scenario
    const payeeToEdit = payees.find((p) => p.id === editPaymentId);
    return {
      payee: payeeToEdit, // Payments state holds form state. But also nesting payee object into here for easy reference
      payFrom: accounts.find((a) => a.fundingId === payeeToEdit.fundingId).id,
      paymentMethod: "",
      amountType: "",
      amount: payeeToEdit.repeatingPayment.amount.toFixed(2),
      frequencyType: payeeToEdit.repeatingPayment.frequency,
      frequency: payeeToEdit.repeatingPayment.frequency,
      type: payeeToEdit.repeatingPayment.frequency,
      deliveryMethod: payeeToEdit.deliveryMethod,
      deliverByDate: payeeToEdit.repeatingPayment.startDate,
      ends: payeeToEdit.repeatingPayment.noOfPayments
        ? "After Set Number of Payments"
        : "Never",
      noOfPayments: payeeToEdit.repeatingPayment.noOfPayments
        ? payeeToEdit.repeatingPayment.noOfPayments
        : "",
      note: "",
      memo: "",
      selected: true, // tracks whether the payee's checkbox is checked
      seriesOnly: true, // no scheduled payment exists so track this here - we are only editing a ruleId/repeating payment
    };
  }

  const editPayee = payees.find((p) => p.id === paymentToEdit.payee.id);

  const getAmountType = () => {
    return editPayee.automaticPayment?.amount === "PAY_FULL_BALANCE"
      ? "amountDue"
      : "minimumPayment";
  };

  const defaultFrequency =
    paymentToEdit.type === "REPEATING" && !forcedOneTime
      ? editPayee.repeatingPayment.frequency
      : FREQUENCY_TYPE.ONE_TIME;

  const noOfPayments = editPayee?.repeatingPayment?.hasOwnProperty(
    "noOfPayments"
  );

  return {
    payee: editPayee, // Payments state holds form state. But also nesting payee object into here for easy reference
    payFrom: paymentToEdit.paymentMethod.id, // Initialize payFrom to the preferred account number
    paymentMethod: paymentToEdit.paymentMethod,
    amountType: editPayee.automaticPayment ? getAmountType() : "",
    amount: paymentToEdit.amount.toFixed(2),
    frequencyType: defaultFrequency,
    frequency: defaultFrequency,
    type: defaultFrequency,
    deliveryMethod: paymentToEdit.deliveryMethod,
    deliverByDate:
      paymentToEdit.type === "REPEATING" && !forcedOneTime
        ? editPayee.repeatingPayment.startDate
        : paymentToEdit.deliverByDate,
    ends: noOfPayments ? "After Set Number of Payments" : "Never",
    noOfPayments: noOfPayments ? editPayee.repeatingPayment.noOfPayments : "",
    note: paymentToEdit.note ? paymentToEdit.note : "",
    memo: paymentToEdit.hasOwnProperty("memo") ? paymentToEdit.memo : "",
    selected: true, // tracks whether the payee's checkbox is checked
  };
}

function getInitialPayments(payees, preferredAccountId, selectedPayeeId) {
  return payees.map((payee) =>
    getInitialPayment(payee, preferredAccountId, selectedPayeeId)
  );
}

function getPreferredAccountId(accounts) {
  return accounts.find((a) => a.preferred)
    ? accounts.find((a) => a.preferred).id
    : accounts[0].id;
}

// *********** Selectors **************
export function getSelectedPayments(payments) {
  return payments.filter((p) => p.selected);
}

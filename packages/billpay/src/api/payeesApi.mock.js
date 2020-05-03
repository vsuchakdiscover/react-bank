import { get, put, uuid } from "./apiUtils.mock";
import {
  addEnrollmentPayee,
  deleteEnrollmentPayee,
  editEnrollmentPayee,
} from "./enrollmentStatusApi.mock";

// Note: Since mock data holds payees under userIds, must get existing record for the current scenario user for adds and edits. Then add the new payee to the user's existing list of payees.
function getUserId() {
  const userId = localStorage.getItem("customerEnrollmentStatus") || 1;
  return parseInt(userId, 10);
}

function addDashes(f) {
  return f.slice(0, 3) + "-" + f.slice(3, 6) + "-" + f.slice(6);
}

export async function getPayeeById(payeeId) {
  const { data: payees } = await getPayees();
  return payees.find((p) => p.id === payeeId);
}

const maskAccountValue = (value) => {
  let maskLength = 4;
  if (value.length === 4) {
    maskLength = 2;
  } else if (/^.{2,3}$/.test(value)) {
    maskLength = value.length - 1;
  }
  const lastFour = value.substring(value.length - maskLength, value.length);
  const remainingString = value.substring(value.length - maskLength, 0);
  const maskedAccount = remainingString.replace(/[A-Za-z0-9*]/g, "*");
  return `${maskedAccount}${lastFour}`;
};

export async function getPayees() {
  const { data } = await get("payees/" + getUserId());
  return {
    data: data.payees.sort((a, b) =>
      a.nickName.toLowerCase() > b.nickName.toLowerCase() ? 1 : -1
    ),
  };
}

const deliveryMethods = ["STANDARD_ELECTRONIC", "TRUST_CHECK"];
const ebillStatus = [
  "AVAILABLE",
  "ACTIVE",
  "NOT_AVAILABLE",
  "PENDING_ACTIVATION",
];

export async function addPayee(payee) {
  const { data: user } = await get("payees/" + getUserId());
  payee.id = uuid();
  // Prod API adds address info for verified. Adding here to simulate. Only postalCode is used by client.
  if (payee.verified) {
    payee.accountNumber = maskAccountValue(payee.accountNumber);
    if (payee.address) {
      payee.address = {
        postalCode: payee.address.postalCode,
      };
    }
    payee.reminderEligible = Math.random() >= 0.5;
  } else {
    //blank value is required for extended address if not entered
    payee.address.extendedAddress = payee.address.extendedAddress || "";
    // Real API returns the formatted phone. So do that here to simulate.
    payee.phoneNumber = {
      formatted: addDashes(payee.phoneNumber.number),
      number: payee.phoneNumber.number, //adding just for completion
    };
    if (payee.accountNumber) {
      payee.accountNumber = maskAccountValue(payee.accountNumber);
    }
  }

  payee.deliveryMethod = deliveryMethods[0]; // TODO: use scenario to vary this and write tests accordingly.
  payee.ebillStatus = ebillStatus[2]; // TODO: use scenario to vary this and write tests accordingly.
  user.payees = [...user.payees, payee];
  await put("payees/" + getUserId(), user, {
    headers: {
      scenario: localStorage.getItem("payee"),
    },
  });
  await addEnrollmentPayee(payee, user);
  return { data: payee }; // since the put above will return the record wrapped in the user object, simply return the saved payee here instead.
}

export async function editPayee(payee, id) {
  const { data: user } = await get("payees/" + getUserId());
  // Must blend the existing payee with the posted one since only some payee fields are passed into this.
  let updatedPayee = {};
  user.payees = user.payees.map((p) => {
    if (p.id === id) {
      updatedPayee = { ...p, ...payee };
      if (updatedPayee.accountNumber && updatedPayee.accountNumber !== "") {
        updatedPayee.accountNumber = maskAccountValue(
          updatedPayee.accountNumber
        );
      }
      if (!p.verified) updatedPayee.address = { ...p.address }; //TODO: Modify to send the updated data
      // Real API returns the formatted phone. Fake that here by just setting formatted to the same value so it's populated in the response.
      if (updatedPayee.phoneNumber && updatedPayee.phoneNumber.number) {
        updatedPayee.phoneNumber.formatted = addDashes(
          updatedPayee.phoneNumber.number
        );
      }
      return updatedPayee;
    }
    return p;
  });
  await put("payees/" + getUserId(), user, {
    headers: {
      scenario: localStorage.getItem("payee"),
    },
  });
  await editEnrollmentPayee(updatedPayee);
  return { data: updatedPayee };
}

export async function deletePayee(payeeId) {
  const { data: user } = await get("payees/" + getUserId());
  user.payees = user.payees.map((p) =>
    p.id === payeeId ? { ...p, status: "DELETED" } : p
  );
  const deletedPayee = user.payees.find((p) => p.id === payeeId);
  await deleteEnrollmentPayee(deletedPayee.id);
  return { data: deletedPayee };
}

export async function getScheduledPayments() {
  return get("scheduledPayments");
}

export async function getBankHolidays(year) {
  return get(`payees/holidays/${year}`, {
    headers: {
      scenario: localStorage.getItem("holidays"),
    },
  });
}

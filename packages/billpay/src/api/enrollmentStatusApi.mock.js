import { get, post, put } from "./apiUtils.mock";

// Note: Since mock data holds payees under userIds, must get existing record for the current scenario user for adds and edits. Then add the new payee to the user's existing list of payees.

// Return the corresponding id for the selected scenario
function getStatusId() {
  const id = localStorage.getItem("customerEnrollmentStatus") || 1;
  return parseInt(id, 10);
}

async function getUserWithStatus() {
  return get("customerEnrollmentStatus/" + getStatusId());
}

export async function getStatus() {
  const { data } = await getUserWithStatus();
  return { data: data.status };
}

export async function postStatus() {
  return post("customerEnrollmentStatus");
}

export async function deleteEnrollmentPayee(payeeId) {
  const { data: user } = await getUserWithStatus();
  user.status.payees = user.status.payees.filter((p) => p.id !== payeeId);
  await put("customerEnrollmentStatus/" + getStatusId(), user);
  return { data: user.status.payees };
}

export async function addEnrollmentPayee(payee) {
  const { data: user } = await getUserWithStatus();
  user.status.payees = [...user.status.payees, payee].sort((a, b) =>
    a.nickName.toLowerCase() > b.nickName.toLowerCase() ? 1 : -1
  );
  await put("customerEnrollmentStatus/" + getStatusId(), user);
  return { data: user.status.payees };
}

export async function editEnrollmentPayee(payee) {
  const { data: user } = await getUserWithStatus();
  user.status.payees = user.status.payees.map((p) =>
    p.id === payee.id ? payee : p
  );
  await put("customerEnrollmentStatus/" + getStatusId(), user);
  return { data: user.status.payees };
}

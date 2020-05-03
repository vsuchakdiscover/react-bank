import { get, post } from "./apiUtils.mock";
import { getPayeeById, editPayee } from "./payeesApi.mock";

export async function getEBillDetails() {
  return get("ebill");
}

export async function getEBillTokens({ payeeId }) {
  return get(`eBillTokens/${payeeId}`);
}

export async function eBillEnrollment(data) {
  const resp = post(`enroll`, data, {
    headers: {
      enrollmentResponse: localStorage.getItem("enrollmentResponse"),
    },
  });
  // If enrollment was successful we need to simulate what the actual API does and update a payees ebillStatus
  if (resp.status === 200) {
    const payee = await getPayeeById(data.id);
    payee.ebillStatus = "PENDING_ACTIVATION";
    await editPayee(payee, payee.id);
  }
  return resp;
}

export async function eBillUnenroll(payeeId) {
  return post(
    `unenroll/${payeeId}`,
    {},
    {
      headers: {
        unenrollResponse: localStorage.getItem("unenrollResponse"),
      },
    }
  );
}

export async function fileEbill(billId) {
  return post(
    `filebill/${billId}`,
    {},
    {
      headers: {
        fileEBillResponse: localStorage.getItem("fileEbillResponse"),
      },
    }
  );
}

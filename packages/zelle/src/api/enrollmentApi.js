import axios from "axios";
const baseUrl = "https://bank.discover.com/bankac/pay/enrollment";

export function getEnrollment(tmxId, riskEval) {
  return axios.get(baseUrl, {
    headers: {
      "Content-Type": "application/json",
      "X-TMX-SID": tmxId,
      "X-Client-Platform": "Web",
      "X-RiskEvaled": riskEval,
    },
  });
}

export function postEnrollment(tmxId) {
  return axios
    .create({
      headers: {
        "Content-Type": "application/json",
        "X-Client-Platform": "Web",
        "X-TMX-SID": tmxId,
      },
    })
    .post(baseUrl, { termsAccepted: true });
}

import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL + "/enrollment/";

export async function getEnrollment(tmxId) {
  return axios.get(baseUrl, {
    headers: {
      scenario: localStorage.getItem("enrollment status") || "unenrolled",
    },
  });
}

export async function postEnrollment(tmxId) {
  return axios.post(
    baseUrl,
    {},
    {
      headers: {
        scenario: localStorage.getItem("enroll response") || "success",
      },
    }
  );
}

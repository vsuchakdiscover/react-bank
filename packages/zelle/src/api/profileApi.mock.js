import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL + "/profiles/";

const profileId = localStorage.getItem("profileId") || 1;

export async function getProfile() {
  return axios.get(baseUrl + "?id=" + profileId).then((resp) => ({
    status: resp.status,
    data: resp.data[0], // Unlike prod, an array of profiles is returned on mock API. just take the first since only one should match.
  }));
}

// Note, this should semantically be a PUT, but due to an issue in production, we need to send a POST, so doing the same in mock.
// Note that a custom func in apiServer.js handles this.
// See item 1 here: https://github.com/mcdpartners/react-bank/issues/135
export async function saveProfile(tmxId, profile) {
  return axios.post(baseUrl + profileId, profile, {
    // In dev, use data from localStorage to tell the mock API to return the requested scenario.
    // Pass this decision via "scenario" HTTP header to mock API.
    // If not set, just return the default (success)
    // In this case, could also just return a rejected promise right here, but
    // handling in mock API so the concern is in one spot and to prove a pattern for other apps.
    headers: {
      scenario: localStorage.getItem("save profile response") || "success",
      "Content-Type": "application/json",
      "X-Client-Platform": "Web",
      "X-HTTP-Method-Override": "PUT", // required per item 1 here: https://github.com/mcdpartners/react-bank/issues/135
      "X-TMX-SID": tmxId,
    },
  });
}

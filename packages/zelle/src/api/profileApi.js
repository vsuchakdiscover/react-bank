import axios from "axios";
const baseUrl = "https://bank.discover.com/api/profiles";

export async function getProfile() {
  return axios
    .create({
      headers: {
        "Content-Type": "application/json",
        "X-Client-Platform": "Web",
      },
    })
    .get(baseUrl);
}

export async function saveProfile(tmxId, profile) {
  return axios
    .create({
      headers: {
        "Content-Type": "application/json",
        "X-Client-Platform": "Web",
        "X-HTTP-Method-Override": "PUT", // required per item 1 here: https://github.com/mcdpartners/react-bank/issues/135
        "X-TMX-SID": tmxId,
      },
    })
    .post(baseUrl, profile);
}

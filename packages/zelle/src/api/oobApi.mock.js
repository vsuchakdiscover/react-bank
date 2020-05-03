import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL + "/oob/";

export async function getStatus() {
  return axios.get(baseUrl + "status", {
    headers: {
      scenario: localStorage.getItem("oob status") || "challenge",
    },
  });
}

export async function postChallenge(channel, deliveryMethod) {
  return axios.post(
    baseUrl + "challenge",
    {
      channel,
      deliveryMethod,
    },
    {
      headers: {
        scenario: localStorage.getItem("oob challenge") || "success",
      },
    }
  );
}

// Details: https://github.com/mcdpartners/react-bank/issues/144
export async function postAnswer(idCode, bindDevice) {
  return axios.post(
    baseUrl + "answer",
    {
      idCode,
      bindDevice,
    },
    {
      headers: {
        scenario: localStorage.getItem("oob answer") || "success",
      },
    }
  );
}

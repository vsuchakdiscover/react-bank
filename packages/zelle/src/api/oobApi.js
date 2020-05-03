import axios from "axios";
const baseUrl = "https://bank.discover.com/bank/oob";

export function getStatus() {
  return axios.get(baseUrl + "/status");
}

export function postChallenge(channel, deliveryMethod) {
  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance.post(baseUrl + "/challenge", {
    channel,
    delivery_method: deliveryMethod,
  });
}

export function postAnswer(idCode) {
  return axios
    .create({
      headers: {
        "Content-Type": "application/json",
      },
    })
    .post(baseUrl + "/answer", {
      identificationCode: idCode,
      bindDevice: true,
    });
}

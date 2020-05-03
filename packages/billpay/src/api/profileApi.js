import { get, post } from "./apiUtils";

const baseUrl = "https://bank.discover.com/api/profiles";

export async function getProfile() {
  return get("profiles", {
    baseUrl,
    headers: {
      "X-Client-Platform": "Web",
    },
  });
}

export async function saveProfile({ updatedProfileFields }) {
  return post("profiles", updatedProfileFields, {
    baseUrl,
    headers: {
      "X-Client-Platform": "Web",
      "X-HTTP-Method-Override": "PUT",
    },
  });
}

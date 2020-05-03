import { post, get } from "./apiUtils.mock";

const profileId = localStorage.getItem("profileId") || 1;

export async function getProfile() {
  return get("profiles", { additionalQueryString: `&id=${profileId}` }).then(
    (resp) => ({
      status: resp.status,
      data: resp.data[0], // Unlike prod, an array of profiles is returned on mock API. Just take the first since only one should match.
    })
  );
}

export async function saveProfile({ updatedProfileFields }) {
  return post(`profiles/${profileId}`, updatedProfileFields, {
    headers: {
      editEmailResponse: localStorage.getItem("editEmailResponse") || "Success",
      "X-HTTP-Method-Override": "PUT",
    },
  });
}

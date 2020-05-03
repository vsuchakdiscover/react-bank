import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL + "/genarateTMXId";

export function getTMX() {
  return axios.get(baseUrl);
}

// Several issues with tmx need to be fixed before moving forward.  For now we just call
// the end point and get the id.  There is also an issue with profiling causing a CORS issue
// that Discover still needs to fix.  For now we simplified.

// export async function getTMX() {
//   // Since async func, promise will be returned automatically
//   return {
//     code: 200,
//     json: "7afb3eb1-3d4e-4454-8b6d-448fe7adcd7-1564417534794"
//   };
// }

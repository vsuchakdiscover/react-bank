import axios from "axios";
const baseUrl =
  "https://bank.discover.com/bankac/pay/enrollment/genarateTMXId/";

export function getTMX() {
  return axios.get(baseUrl, {
    headers: {
      "Content-Type": "application/json",
      "X-Client-Platform": "Web",
    },
  });
}

// Several issues with tmx need to be fixed before moving forward.  For now we just call
// the end point and get the id.  There is also an issue with profiling causing a CORS issue
// that Discover still needs to fix.  For now we simplified.

// import axios from "axios";
// import { handleError } from "./apiUtils";
// import { handleResponse } from "./apiUtils";
// const baseUrl = "/bankac/pay/enrollment/genarateTMXId/";

// export async function getTMX() {
//   try {
//     const response = await axios.get(baseUrl);
//     const parsedResponse = handleResponse(response);
//     const tmxId = parsedResponse.json;
//     // Now, must call the profiler to send tracking info per https://github.com/mcdpartners/react-bank/issues/95
//     axios.get(
//       `https://content.discover.com/fp/tags.js?org_id=o7f2hmf6&session_id=${tmxId}`
//     );
//     return parsedResponse;
//   } catch (error) {
//     handleError(error);
//   }
// }

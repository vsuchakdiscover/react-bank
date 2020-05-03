// These utils are only used by the mocks.
import axios from "axios";
import { getOOBRedirectUrlFromError } from "./apiUtils";

const baseUrl = process.env.REACT_APP_API_BASE_URL + "/";

/**
 * Builds an axios instance with an injected error interceptor.
 */
function axiosFactory() {
  const instance = axios.create();
  instance.interceptors.response.use(null, (error) => errorHandler(error));
  return instance;
}

/**
 * Intercepts axios error responses.
 */
function errorHandler(error) {
  const redirectUrl = getOOBRedirectUrlFromError(error);

  // When an error is OOB, we redirect a user to the login page.
  if (redirectUrl) {
    // In dev mode we show the confirmation window before the redirect.
    window.confirm(
      `Go to "${redirectUrl}"? In production environment user will get redirected to that url without any prompt.`
    ) && window.location.replace(redirectUrl);

    // We return empty promise to win time for a redirect to happen
    // without flash of an error message.
    return new Promise((resolve) => {});
  }

  // Pass the error along.
  return Promise.reject({ ...error });
}

export async function get(relativeUrl, config) {
  return axiosFactory().get(baseUrl + relativeUrl, config);
}

export async function post(relativeUrl, data, config) {
  return axiosFactory().post(baseUrl + relativeUrl, data, config);
}

export async function put(relativeUrl, data, config) {
  return axiosFactory().put(baseUrl + relativeUrl, data, config);
}

// via https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

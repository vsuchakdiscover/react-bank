import axios from "axios";
import URLS from "reusable/lib/urls";

export const prodBaseUrl =
  "https://bank.discover.com/bank/deposits/pay/billpay/";
export const prodQuerystring = "?envc=aer&X-DFS-ENV=asys";
console.log("Build XX.X"); //added console statement with build #, confirm we have the correct build when testing

function getUrl(url, config = {}) {
  const baseUrl = config.baseUrl || prodBaseUrl; // Allow overriding the default baseUrl via config.
  return (
    baseUrl +
    url +
    prodQuerystring +
    (config.additionalQuerystring ? config.additionalQuerystring : "")
  );
}

/**
 * Builds an axios instance with an injected error interceptor.
 */
function axiosFactory() {
  const instance = axios.create({
    withCredentials: true,
  });
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
    window.location.replace(redirectUrl);

    // We return empty promise to win time for a redirect to happen
    // without flash of an error message.
    return new Promise((resolve) => {});
  }

  // Pass the error along.
  return Promise.reject({ ...error });
}

/**
 * Returns a login redirect URL if an HTTP error is of the "OOB access denied" type.
 */
export function getOOBRedirectUrlFromError(error) {
  if (error.response?.status === 401) {
    const authenticateMessage = error.response?.headers?.[
      "www-authenticate"
    ].toLowerCase();

    if (authenticateMessage === "basic login") {
      return URLS.LOGOUT;
    }

    if (authenticateMessage === "basic oob-bank") {
      return URLS.OOB_INDEX;
    }
  }

  return null;
}

export const hasErrorResponse = (err) => {
  return err.response && err.response.data && err.response.data.errors;
};

// Return first error in array, if any exists. Otherwise, return an empty array.
export function parseErrors(err) {
  return hasErrorResponse(err) ? err.response.data.errors : [];
}

export async function get(relativeUrl, config = {}) {
  return axiosFactory().get(getUrl(relativeUrl, config));
}

export async function post(relativeUrl, data, config) {
  return axiosFactory().post(getUrl(relativeUrl, config), data);
}

export async function put(relativeUrl, data, config) {
  return axiosFactory().put(getUrl(relativeUrl, config), data);
}

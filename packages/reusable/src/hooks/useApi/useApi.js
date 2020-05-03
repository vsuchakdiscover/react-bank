import { useCallback, useEffect } from "react";
import useSafeState from "../useSafeState";

const defaultOptions = {
  lazy: false,
};

/**
 * A hook for API calls. It's a part of a future separate proposal, some details
 * should be refined but it works as is fine for now.
 *
 * @param {*} apiCallback - any function that returns a promise
 * @param {*} params params - an optional object that's passed as params to the API call
 * @param {*} options - a set of options that alters the hook's behaviour:
 *  - lazy - if set to 'true', apiCallback doesn't run automatically on mount,
 */
export function useApi(apiCallback, params = {}, options = {}) {
  const config = { ...defaultOptions, ...options };

  const [data, _setData] = useSafeState();
  const [error, _setError] = useSafeState("");
  const [loading, _setLoading] = useSafeState(!config.lazy);

  // Wrapping setters into useCallback so we could use them
  // as a dependency in useCallback down below.
  const setData = useCallback(_setData, []);
  const setError = useCallback(_setError, []);
  const setLoading = useCallback(_setLoading, []);

  // We're stringifying params because we need to use
  // them as dependency in useCallback and useEffect.
  const defaultParamsAsJson = JSON.stringify(params);

  const callApi = useCallback(
    async (withParams) => {
      return new Promise(async (resolve, reject) => {
        setError("");
        setLoading(true);
        try {
          const { data } = await apiCallback(
            // Prefer params passed to a callback to default params set in hook.
            withParams ? withParams : JSON.parse(defaultParamsAsJson)
          );
          setData(data);
          resolve({ data });
        } catch (err) {
          setError(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      });
    },
    [apiCallback, defaultParamsAsJson, setLoading, setError, setData]
  );

  useEffect(() => {
    !config.lazy && callApi(JSON.parse(defaultParamsAsJson));
  }, [callApi, config.lazy, defaultParamsAsJson]);

  return { loading, error, data, setError, setData, callApi };
}

/**
 * A syntactic sugar over useApi hook that sets useApi to execute lazily,
 * i.e. not on the mount, but on-demand.
 */
export function useLazyApi(apiCallback, params = {}, options = {}) {
  options.lazy = true;
  return useApi(apiCallback, params, options);
}

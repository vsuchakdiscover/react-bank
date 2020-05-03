// Hook to make consuming Alert context more convenient
import { useContext } from "react";
import AlertContext from "../components/AlertContext";
import { ALERT_TYPES } from "reusable/lib/Alert";
import { useHistory } from "react-router";

export default function useAlert() {
  const history = useHistory();
  const { setAlerts } = useContext(AlertContext);

  function addAlert(content, type) {
    setAlerts((alerts) => {
      return [
        {
          // Assign each Alert a unique ID using the current time in milliseconds. This ID is useful for removing the alert later, and as a key.
          // Deliberately placing new alerts above existing alerts so the first element in the array is always the newest alert.
          // This makes it easy to focus the newest alert when an alert is removed.
          id: new Date().getTime(),
          type,
          content,
        },
        ...alerts,
      ];
    });
  }

  /** Show an alert. Defaults to success. **NOTE**: This will NOT display an alert if
   * you redirect immediately after calling this.
   * Why? Because alerts are cleared when the URL changes.
   * If you need to redirect, then show an alert, use `redirectAndAlert`.
   * @param {Object} alert - Alert content. Accepts JSX.
   * @param {string} [type=success] - Alert type.
   *  */
  function showAlert(alert, type = ALERT_TYPES.SUCCESS) {
    addAlert(alert, type);
  }
  /** Redirect to a new page, then show an alert. Defaults to success alert.
   * If you call the plain showAlert immediately before redirecting, the alert won't show
   * because alerts are cleared when the URL changes. Alternatively, you can call
   * showAlert **after** calling history.push so the alert is associated to the new URL.
   * @param {string} path - Path to redirect to.
   * @param {Object} alert - Alert content. Accepts JSX.
   * @param {ALERT_TYPES} [ALERT_TYPES.SUCCESS] type - Alert type.
   * */
  function redirectAndAlert(path, alert, type = ALERT_TYPES.SUCCESS) {
    history.push(path);
    addAlert(alert, type);
  }

  return { showAlert, redirectAndAlert };
}

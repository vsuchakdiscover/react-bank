import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ErrorSummary.module.scss";
import Card from "../Card";
import cx from "classnames";
import ErrorIcon from "../Icons/ErrorIcon";
import { clickTrack } from "../utils/tracking";

const ErrorSummary = ({
  errors,
  className,
  formSubmitCount,
  adobeEvent,
  ...props
}) => {
  const [oldFormSubmitCount, setOldFormSubmitCount] = useState(null);
  const ref = useRef();

  // Focus error summary when errors exist and the formSubmitCount changes.
  useEffect(() => {
    const errorsExist = Object.keys(errors).length > 0;
    const formSubmitted = formSubmitCount !== oldFormSubmitCount;
    if (formSubmitted) {
      setOldFormSubmitCount(formSubmitCount);
      if (errorsExist) {
        ref.current.focus();
        if (adobeEvent) {
          // Validation errors are tracked like clicks, but with some extra properties assigned.
          clickTrack(adobeEvent.prop1, {
            prop10: `${adobeEvent.prop10Label}:${Object.keys(errors)
              .map((key) => errors[key])
              .join("|")}`,
            list1: `${adobeEvent.list1Label}:${Object.keys(errors)
              .map((key) => errors[key])
              .join(",")}`,
          });
        }
      }
    }
  }, [adobeEvent, errors, formSubmitCount, oldFormSubmitCount]);

  // Don't show errors until the form has been submitted at least once.
  if (Object.keys(errors).length === 0 || formSubmitCount < 1) return null;

  return (
    <div
      className={cx(styles.root, className)}
      ref={ref}
      tabIndex="-1"
      role="alert"
    >
      <Card className={styles.errorSummary} {...props}>
        <div className={styles.errorSummaryHeader}>
          <ErrorIcon name="error" />
          <p className={styles.topMessage}>
            <span className="meta-web-bold">Please fix the errors below</span>
            <br />
            Information within the form is either missing or incorrect:
          </p>
        </div>
        <ul>
          {Object.keys(errors).map((key) => (
            <li key={key}>
              <a href={`#${key}`}>{errors[key]}</a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

ErrorSummary.displayName = "Error Summary";

ErrorSummary.propTypes = {
  /** Adobe event to log when validation error(s) are displayed. */
  adobeEvent: PropTypes.shape({
    /** Event logged to prop1 */
    prop1: PropTypes.string.isRequired,

    /** Label prepended to the list of errors sent to Adobe under `prop10`  */
    prop10Label: PropTypes.string.isRequired,

    /** Label prepended to the list of errors sent to Adobe under `list1`  */
    list1Label: PropTypes.string.isRequired,
  }),

  /** Class to apply */
  className: PropTypes.string,

  /** Error list object. To support anchors that link to the relevant input, each property should correspond to the element's ID. */
  errors: PropTypes.object.isRequired,

  /** Pass a form submit count in so error summary can refocus each time the form is submitted with any errors. */
  formSubmitCount: PropTypes.number.isRequired,
};

export default ErrorSummary;

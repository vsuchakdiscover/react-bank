import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { dateStringType } from "../propTypes";

import DatePicker from "./DatePicker";
import styles from "./DateRangePicker.module.scss";
import { parseDateString, isValidDateString } from "../../../utils/dateUtils";

export default function DateRangePicker({
  className,
  hasFloatingCalendarOverlay,
  id,
  inputClassName,
  input2ClassName,
  startLabel,
  endLabel,
  name,
  error,
  error2,
  value,
  value2,
  required,
  onBlur,
  onBlur2,
  onChange,
  onChange2,
  onError,
  onError2,
  onValidate,
  formSubmitted,
  section,
  ...calendarProps
}) {
  const [activeFocus, setActiveFocus] = useState(
    calendarProps.focused ? "start" : null
  );

  const [activeCalendar, setActiveCalendar] = useState(
    calendarProps.showOverlay ? "start" : null
  );

  function handleStartChange({ target: { value } }) {
    !value && callOnChange(undefined);

    if (isValidDateString(value)) {
      if (
        isValidDateString(value2) &&
        parseDateString(value) > parseDateString(value2)
      ) {
        callOnChange(value2);
        callOnChange2(value);
      } else {
        callOnChange(value);
      }
    }

    setActiveFocus("end");
    setActiveCalendar("end");
  }

  function handleEndChange({ target: { value: value2 } }) {
    value2 && callOnChange2(undefined);

    if (isValidDateString(value2)) {
      if (
        isValidDateString(value) &&
        parseDateString(value) > parseDateString(value2)
      ) {
        callOnChange(value2);
        callOnChange2(value);
      } else {
        callOnChange2(value2);
      }
    }

    setActiveCalendar(null);
  }

  const handleCalendarToggle = (calendar) => (active) => {
    setActiveCalendar(active ? calendar : null);
  };

  function callOnChange(value) {
    onChange && onChange({ target: { name, value } });
  }

  function callOnChange2(value) {
    onChange2 && onChange2({ target: { name, value } });
  }

  return (
    <div
      className={cx(
        styles.range,
        className,
        !hasFloatingCalendarOverlay && styles.isRelative
      )}
    >
      <DatePicker
        {...calendarProps}
        className={cx(styles.datePicker, styles.startDate, inputClassName)}
        endDate={value2}
        error={error}
        focused={activeFocus === "start"}
        formSubmitted={formSubmitted}
        id={id}
        isRelative={hasFloatingCalendarOverlay}
        label={startLabel}
        name={name}
        onBlur={onBlur}
        onChange={handleStartChange}
        onError={onError}
        onShowOverlay={handleCalendarToggle("start")}
        onValidate={onValidate}
        required={required}
        section={section}
        showOverlay={activeCalendar === "start"}
        startDate={value}
        value={value}
      />

      <DatePicker
        {...calendarProps}
        className={cx(styles.datePicker, styles.endDate, input2ClassName)}
        endDate={value2}
        error={error2}
        focused={activeFocus === "end"}
        formSubmitted={formSubmitted}
        id={`${id}--2`}
        initialMonth={calendarProps.initialMonth || value2 || value}
        isRelative={hasFloatingCalendarOverlay}
        label={endLabel}
        name={`${name}--2`}
        onBlur={onBlur2}
        onChange={handleEndChange}
        onError={onError2}
        onShowOverlay={handleCalendarToggle("end")}
        onValidate={onValidate}
        required={required}
        section={section}
        showOverlay={activeCalendar === "end"}
        startDate={value}
        value={value2}
      />
    </div>
  );
}

DateRangePicker.defaultProps = {
  ...DatePicker.defaultProps,
  endLabel: "To",
  hasFloatingCalendarOverlay: false,
  startLabel: "From",
};

DateRangePicker.propTypes = {
  ...DatePicker.propTypes,

  /** Second input label */
  endLabel: PropTypes.string,

  /** First value error */
  error: PropTypes.string,

  /** Second value error */
  error2: PropTypes.string,

  /** If set to 'true' calendar overlay is shown below active input. */
  hasFloatingCalendarOverlay: PropTypes.bool,

  /** A css class for the second input field */
  input2ClassName: PropTypes.string,

  /** A css class for the first input field */
  inputClassName: PropTypes.string,

  /** A function called when a user leaves the first input field */
  onBlur: PropTypes.func,

  /** A function called when a user leaves the second input field */
  onBlur2: PropTypes.func,

  /** A function that's called when the first date is changed */
  onChange: PropTypes.func,

  /** A function that's called when the second date is changed */
  onChange2: PropTypes.func,

  /** A function called when the first input validation error is created or updated */
  onError: PropTypes.func,

  /** A function called when the second input validation error is created or updated */
  onError2: PropTypes.func,

  /** First input label */
  startLabel: PropTypes.string,

  /** First input value */
  value: dateStringType,

  /** Second input value */
  value2: dateStringType,
};

import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import BankHolidaysContext from "./BankHolidaysContext";

import { KEY, DATE_FORMATS } from "../data";
import {
  convertToDateObjects,
  formatDate,
  parseDateString,
  isValidDateString,
} from "../../../utils/dateUtils";

import { dateStringType } from "../propTypes";
import useParentOrLocalState from "../hooks/useParentOrLocalState";

import Calendar from "./Calendar";
import Month, { getCalendarHeaderId } from "./Month";
import Overlay from "./Overlay";
import TextInput from "../../TextInput";

import styles from "./DatePicker.module.scss";
import {
  validateDateStringForCalendar,
  getInvalidDateFormatMessage,
} from "../validation";

import CalendarIcon from "../../../Icons/CalendarIcon";

function DatePicker({
  className,
  dateFormat,
  disableBankHolidays,
  error,
  helpText,
  id,
  isFocused,
  isRelative,
  label,
  name,
  onBlur,
  onChange,
  onError,
  onFocus,
  onShowOverlay,
  onValidate,
  required,
  section,
  showOverlay,
  value,
  ...calendarProps
}) {
  const [
    initialMonth,
    startDate,
    endDate,
    dueDate,
    minDate,
    maxDate,
    unavailableDates,
  ] = convertToDateObjects(
    calendarProps.initialMonth,
    calendarProps.startDate,
    calendarProps.endDate,
    calendarProps.dueDate,
    calendarProps.minDate,
    calendarProps.maxDate,
    calendarProps.unavailableDates
  );

  const hasPressedEnterKeyOnDateInput = useRef(false);

  const [internalIsFocused, setInternalIsFocused] = useParentOrLocalState(
    isFocused
  );

  const [values, setValues] = useState(() => {
    const date = isValidDateString(value) ? parseDateString(value) : undefined;
    return {
      value,
      input: date ? formatDate(date, dateFormat) : "",
      error: "",
    };
  });

  const previousValues = useRef({});

  // Compute date from a valid date string value.
  const date = isValidDateString(values.value)
    ? parseDateString(values.value)
    : undefined;

  const { bankHolidays, getBankHolidays } = useContext(BankHolidaysContext);

  const [calendarIsShown, setCalendarIsShown] = useParentOrLocalState(
    showOverlay,
    onShowOverlay
  );

  useEffect(() => {
    async function fetchBankHolidays() {
      if (!disableBankHolidays) {
        return;
      }

      if (disableBankHolidays && !getBankHolidays) {
        throw new Error(
          "DatePicker must be a child of BankHolidaysProvider when disableBankHolidays is set to true. BankHolidaysProvider provides shared bank holidays throughout the app. This avoids DatePicker requesting holidays for a given year more than once."
        );
      }

      const year = date ? date.getFullYear() : new Date().getFullYear(); // get bank holidays for current year if date isn't set yet.
      await getBankHolidays(year);
    }

    fetchBankHolidays();
  }, [date, disableBankHolidays, getBankHolidays]);

  const validationCallback = useMemo(
    () =>
      validateDateStringForCalendar({
        unavailableDates: calendarProps.unavailableDates,
        unavailableDays: calendarProps.unavailableDays,
        minDate: calendarProps.minDate,
        maxDate: calendarProps.maxDate,
        bankHolidays,
      }),
    [
      calendarProps.unavailableDates,
      calendarProps.unavailableDays,
      calendarProps.minDate,
      calendarProps.maxDate,
      bankHolidays,
    ]
  );

  const validationError = values.error || error;

  const validateDate = useCallback(
    (date, validationCallback) => {
      const isDateObject = date instanceof Date;

      if (!isDateObject) {
        return getInvalidDateFormatMessage(dateFormat);
      }

      return validationCallback(formatDate(date));
    },
    [dateFormat]
  );

  const updateValues = useCallback(
    (updatedValues) => {
      const isValueChanged =
        updatedValues.value !== previousValues.current.value;

      const isEmptyError = !updatedValues.error || updatedValues.error === "";

      // We assume that error has changed if
      //  a) current error is different from the previous error, or
      //  b) value has changed and while the error message is the same, it's not empty.
      const isErrorChanged =
        updatedValues.error !== previousValues.current.error ||
        (isValueChanged && !isEmptyError);

      isValueChanged &&
        onChange &&
        onChange({ target: { value: updatedValues.value, name } });

      isErrorChanged && onError && onError(updatedValues.error);

      // Only update values when at least one prop has changed.
      if (
        previousValues.current.value !== updatedValues.value ||
        previousValues.current.input !== updatedValues.input ||
        previousValues.current.error !== updatedValues.error
      ) {
        previousValues.current = {
          ...previousValues.current,
          ...updatedValues,
        };
        setValues((values) => ({ ...values, ...updatedValues }));
      }
    },
    [name, onChange, onError]
  );

  function handleInputChange({ target: { value } }) {
    previousValues.current.input = value;
    setValues((values) => ({ ...values, input: value }));
  }

  function handleInputClick(e) {
    e.preventDefault();
    hideCalendar();
  }

  function handleInputKeyDown(e) {
    if (e.keyCode === KEY.ENTER) {
      // We log "ENTER" key press to prevent
      // calendar icon from firing an overlay (undesirable behaviour).
      hasPressedEnterKeyOnDateInput.current = true;
    }
  }

  function handleCalendarChange(date) {
    hideCalendar();
    const error = validateDate(date, validationCallback);
    updateValues({
      value: formatDate(date),
      input: formatDate(date, dateFormat),
      error: error || "",
    });
  }

  function handleOnBlur(e) {
    e.preventDefault();

    setInternalIsFocused(false);

    const value = e.target.value;
    if (!value) {
      updateValues({
        value: undefined,
        input: "",
        error: "",
      });
      onBlur && onBlur(e);
      return;
    }

    if (!isValidDateString(value, dateFormat)) {
      updateValues({
        value,
        input: value,
        error: getInvalidDateFormatMessage(dateFormat),
      });

      onBlur && onBlur(e);
      return;
    }

    const date = parseDateString(value, dateFormat);
    const error = validateDate(date, validationCallback);
    updateValues({
      value: formatDate(date),
      input: value,
      error: error || "",
    });

    onBlur && onBlur(e, date && formatDate(date));
  }

  function handleOnFocus(e) {
    setInternalIsFocused(true);
    onFocus && onFocus(e);
  }

  function handleCalendarIconClick(e) {
    e.preventDefault();

    // We show calendar only if user hasn't pressed "ENTER" key
    // on "date input" field before that.
    if (!hasPressedEnterKeyOnDateInput.current) {
      showCalendar();
    }

    hasPressedEnterKeyOnDateInput.current = false;
  }

  function handleDayKeyDown(e) {
    e.keyCode === KEY.ESC && handleOverlayClose(e);
  }

  function handleOverlayClose(e) {
    hideCalendar();
  }

  function showCalendar() {
    setCalendarIsShown(true);
    setInternalIsFocused(false);
  }

  function hideCalendar() {
    setCalendarIsShown(false);
    setInternalIsFocused(true);
  }

  useEffect(() => {
    function onValueChange() {
      if (!value) {
        if (previousValues.current.value !== value) {
          updateValues({
            date: undefined,
            value: undefined,
            input: "",
            error: "",
          });
        }
        return;
      }

      if (!isValidDateString(value)) {
        updateValues({
          value,
          input: value,
          error: getInvalidDateFormatMessage(dateFormat),
        });
        return;
      }

      const date = parseDateString(value);
      const error = validateDate(date, validationCallback);
      updateValues({
        value: formatDate(date),
        input: formatDate(date, dateFormat),
        error: error || "",
      });
    }

    onValueChange();
  }, [
    dateFormat,
    onChange,
    updateValues,
    value,
    validateDate,
    validationCallback,
  ]);

  async function addBankHolidaysForYear(year) {
    const alreadyLoadedBankHolidaysForYear = bankHolidays.some(
      (h) => h.getFullYear() === year
    );
    if (alreadyLoadedBankHolidaysForYear) return;
    try {
      await getBankHolidays(year);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get bank holidays in DatePicker.");
    }
  }

  // Called when the user just clicked the calendar's next month button
  // If they're now looking at the last month of the year, load the bank
  // holidays for the next year if they haven't already been loaded.
  async function onNextMonthClick(_date) {
    disableBankHolidays &&
      _date.getMonth() === 11 &&
      addBankHolidaysForYear(_date.getFullYear() + 1);
  }

  // Called when the user just clicked the calendar's previous month button
  // If they're now looking at the first month of the year, load the bank holidays
  // for the previous year if they haven't already been loaded.
  async function onPreviousMonthClick(_date) {
    disableBankHolidays &&
      _date.getMonth() === 0 &&
      addBankHolidaysForYear(_date.getFullYear() - 1);
  }

  return (
    <div
      className={cx(styles.root, className, isRelative && styles.isRelative)}
    >
      <div className={styles.isRelative2}>
        <TextInput
          autoComplete="off"
          error={validationError}
          helpText={helpText}
          id={id}
          inputClass={styles.textInput}
          isFocused={internalIsFocused}
          label={label}
          manualFocus={true}
          maxLength={10}
          name={name}
          onBlur={handleOnBlur}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleOnFocus}
          onKeyDown={handleInputKeyDown}
          onValidate={onValidate}
          placeholder={dateFormat}
          ref={(input) => internalIsFocused && input && input.focus()}
          required={required}
          section={section}
          suffixAddon={
            <button
              aria-label={`open ${label} input calendar`}
              className={styles.calendarTrigger}
              onClick={handleCalendarIconClick}
            >
              <CalendarIcon name="calendar" />
              <span className="sr-only">
                Opens a calendar date picker overlay
              </span>
            </button>
          }
          value={values.input}
        />
      </div>

      {calendarIsShown && (
        <Overlay
          ariaLabelledBy={getCalendarHeaderId(`${id}--0`)}
          className={cx(
            styles.overlay,
            calendarProps.isLarge && styles.isLarge,
            calendarProps.monthNumber > 1 && styles.overlayTwoMonths,
            calendarProps.showLegend &&
              calendarProps.legendOrientation === "h" &&
              styles.overlayHorizontalLegend
          )}
          onCloseClick={handleOverlayClose}
        >
          <Calendar
            {...calendarProps}
            dueDate={dueDate}
            endDate={endDate}
            id={id}
            initialMonth={initialMonth}
            maxDate={maxDate}
            minDate={minDate}
            onChange={handleCalendarChange}
            onDayKeyDown={handleDayKeyDown}
            onNextMonthClick={onNextMonthClick}
            onPreviousMonthClick={onPreviousMonthClick}
            startDate={startDate}
            unavailableDates={[...unavailableDates, ...bankHolidays]}
            value={date}
          />
        </Overlay>
      )}
    </div>
  );
}

DatePicker.defaultProps = {
  ...TextInput.defaultProps,
  ...Calendar.defaultProps,
  dateFormat: "MM/DD/YYYY",
  disableBankHolidays: false,
  isFocused: false,
  isRelative: true,
  label: "Date",
  showOverlay: false,
};

DatePicker.propTypes = {
  ...TextInput.propTypes,
  ...Calendar.propTypes,
  ...Month.getCommonPropTypes(dateStringType),

  /** A css class for DatePicker wrapper */
  className: PropTypes.string,

  /** A format for displaying a date in input */
  dateFormat: PropTypes.oneOf(Object.keys(DATE_FORMATS)),

  /** Set to true to disallow selecting bank holidays.
   * NOTE: Must compose DatePicker under BankHolidaysProvider if this is set to true.
   * The Context Provider provides centralized state for storing bank holidays to avoid duplicate bank holiday requests,
   * as well as an async function for requesting bank holidays. */
  disableBankHolidays: PropTypes.bool,

  /** Help text or element(s) to display below the input */
  helpText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /** Set to true if input should get a focus */
  isFocused: PropTypes.bool,

  /** Set to false if input wrapper shouldn't have position:relative. Useful for overlay positioning */
  isRelative: PropTypes.bool,

  /** A function called when a user leaves the input field */
  onBlur: PropTypes.func,

  /** A function called when input changes or date on calendar is selected */
  onChange: PropTypes.func,

  /** A function called when validation error is created or updated */
  onError: PropTypes.func,

  /** A custom handler that allows to control overlay opening from parent component */
  onShowOverlay: PropTypes.func,

  /** Set to true to open calendar by default */
  showOverlay: PropTypes.bool,

  /** Currently selected value */
  value: PropTypes.string,
};

export default DatePicker;

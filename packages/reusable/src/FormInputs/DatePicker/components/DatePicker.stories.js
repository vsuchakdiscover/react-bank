/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { boolean, text, select, number } from "@storybook/addon-knobs";
import DatePickerComponent from "./DatePicker";
import legendStyles from "./Legend.module.scss";
import dayCellStyles from "./Day.module.scss";
import BankHolidaysProvider from "./BankHolidaysProvider";

// Simulate the bank holiday API response from Axios
async function getBankHolidays(year) {
  return {
    data: [
      "2020-01-01",
      "2020-01-20",
      "2020-02-17",
      "2020-05-25",
      "2020-07-04",
      "2020-09-07",
      "2020-10-12",
      "2020-11-11",
      "2020-11-26",
      "2020-12-25",
    ].map((d) => d.replace("2020", year)),
  };
}

const DatePicker = ({ value, required, formSubmitted, error, ...props }) => {
  const [date, setDate] = useState(value);

  function handleChange({ target: { value } }) {
    setDate(value);
  }

  return (
    <form className="meta-web-normal">
      <DatePickerComponent
        error={text("error", error)}
        formSubmitted={formSubmitted}
        id="date"
        label={text("label", "Date")}
        name="date"
        onChange={handleChange}
        required={boolean("required", required)}
        value={date}
        {...props}
      />
    </form>
  );
};

export default {
  title: "FormInputs/DatePicker",
  parameters: {
    info: {
      propTables: [DatePickerComponent],
    },
  },
};

export const optional = () => <DatePicker />;

export const required = () => <DatePicker required />;

export const focusedInput = () => <DatePicker isFocused />;

export const withError = () => <DatePicker error="An error happened" />;

export const withHelpText = () => (
  <DatePicker helpText="An example help text" />
);

export const withCalendarHelpText = () => (
  <DatePicker calendarHelpText="An example calendar help text" />
);

export const initialValue = () => (
  <DatePicker unavailableDates={["2019-04-23"]} value="2019-04-20" />
);

export const invalidInitialValue = () => (
  <DatePicker unavailableDates={["2019-04-23"]} value="2019-04-23" />
);

export const invalidInitialValueWithOnError = () => (
  <DatePicker
    onError={(error) => {
      alert(`The validation error is "${error}"`);
    }}
    unavailableDates={["2019-04-23"]}
    value="2019-04-23"
  />
);

export const calendarOpenedByDefault = () => <DatePicker showOverlay />;

export const largeCalendar = () => <DatePicker isLarge={true} />;

export const hiddenHeader = () => <DatePicker headerIsHidden />;

export const withHiddenMonthPagination = () => (
  <DatePicker monthPaginationIsHidden />
);

export const disabledDates = () => (
  <DatePicker
    showOverlay
    unavailableDates={["2019-04-17", "2019-04-23"]}
    value="2019-04-24"
  />
);

export const tuesdaysAndFridaysDisabled = () => (
  <DatePicker unavailableDays={[2, 5]} />
);

export const minDateAndMaxDate = () => (
  <DatePicker maxDate="2019-07-10" minDate="2019-07-04" value="2019-07-08" />
);

export const dueDate = () => (
  <DatePicker dueDate="2019-05-21" value="2019-05-16" />
);

export const customStylesForDays = () => (
  <DatePicker
    dayTypes={{
      starDay: {
        className: dayCellStyles.green,
        handler: ({ dateString }) => dateString === "2019-04-22",
        Component: () => "⭐️",
      },
    }}
    value="2019-04-20"
  />
);

export const legend = () => <DatePicker showLegend />;

export const verticalLegend = () => (
  <DatePicker legendOrientation="v" showLegend />
);

export const legendWithCustomizedLabels = () => (
  <DatePicker
    dayTypes={{
      available: {
        legendLabel: "Custom available date label 2",
      },
    }}
    showLegend
  />
);

export const legendWithCustomItemAdded = () => (
  <DatePicker
    dayTypes={{
      new: {
        legendLabel: "New green legend item",
        className: legendStyles.green,
        showInLegend: true,
      },
    }}
    showLegend
  />
);

export const legendWithDueDateStyleChanged = () => (
  <DatePicker
    dayTypes={{
      due: { className: legendStyles.green },
    }}
    showLegend
  />
);

export const legendWithPaymentDueDateOnly = () => (
  <DatePicker
    dayTypes={{
      selected: { showInLegend: false },
      available: { showInLegend: false },
      unavailable: { showInLegend: false },
    }}
    showLegend
  />
);

export const legendWithDueDateOnTop = () => (
  <DatePicker
    dayTypes={{
      due: { legendWeight: -1 },
    }}
    showLegend
  />
);

export const twoCalendars = () => <DatePicker monthNumber={2} />;

export const twoCalendarsAndALegend = () => (
  <DatePicker monthNumber={2} showLegend />
);

export const twoCalendarsAndAVerticalLegend = () => (
  <DatePicker legendOrientation="v" monthNumber={2} showLegend />
);

export const disabledWeekends = () => <DatePicker unavailableDays={[0, 6]} />;

// Note that in order to disable bank holidays, you must wrap DatePicker in the BankHolidaysProvider
// This provider centralizes bank holiday data in a context to avoid redundant calls to request bank holidays
// when multiple datepickers exist on a page, or when navigating from page to page.
// Ideally, place this provider at the app's entry point.
// See App.js in billpay for a working example that looks similar to below.
export const disabledBankHolidays = () => (
  <BankHolidaysProvider getBankHolidays={getBankHolidays}>
    <DatePicker disableBankHolidays />
  </BankHolidaysProvider>
);

export const kitchenSink = () => (
  <DatePicker
    calendarHelpText={text("calendarHelpText", "An example calendar help text")}
    dayTypes={{
      available: {
        legendLabel: "Yep, it's available!",
      },
      unavailable: {
        legendWeight: 100,
      },
      starDay: {
        showInLegend: true,
        legendLabel: "Pay day!",
        legendWeight: 5,
        className: dayCellStyles.green,
        handler: ({ dateString }) => dateString === "2019-04-10",
        Component: () => "⭐️",
      },
    }}
    dueDate="2019-05-30"
    isLarge={boolean("isLarge", false)}
    legendOrientation={select("legendOrientatiion", ["v", "h"], "v")}
    monthNumber={number("monthNumber", 2)}
    required
    showLegend={boolean("showLegend", true)}
    showOverlay
    unavailableDates={["2019-04-23"]}
    unavailableDays={[0]}
    value="2019-04-20"
  />
);

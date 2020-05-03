/* eslint-disable react/prop-types */

import React, { useState } from "react";
import DateRangePickerComponent from "./DateRangePicker";
import { boolean, text } from "@storybook/addon-knobs";
import dayCellStyles from "./Day.module.scss";

const DateRangePicker = (props) => {
  const { value, value2, required, error, error2 } = props;
  const [date, setDate] = useState(value);
  const [date2, setDate2] = useState(value2);

  function handleStartChange({ target: { value } }) {
    setDate(value);
  }

  function handleEndChange({ target: { value } }) {
    setDate2(value);
  }

  return (
    <form>
      <DateRangePickerComponent
        {...props}
        endLabel={text("endLabel", "To")}
        error={text("error", error)}
        error2={text("error2", error2)}
        id="date"
        name="date"
        onChange={handleStartChange}
        onChange2={handleEndChange}
        required={boolean("required", required)}
        startLabel={text("startLabel", "From")}
        value={date}
        value2={date2}
      />
    </form>
  );
};

export default { title: "FormInputs/DateRangePicker" };

export const optional = () => <DateRangePicker />;

export const required = () => <DateRangePicker required />;

export const initialValue = () => (
  <DateRangePicker value="2019-04-20" value2="2019-04-25" />
);

export const withFloatingCalendarOverlay = () => (
  <DateRangePicker hasFloatingCalendarOverlay />
);

export const withErrors = () => (
  <DateRangePicker error="First input error" error2="Second input error" />
);

export const kitchenSink = () => (
  <DateRangePicker
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
    legendOrientation="v"
    monthNumber={2}
    required
    showLegend
    showOverlay
    unavailableDates={["2019-04-23"]}
    unavailableDays={[0]}
    value="2019-04-15"
    value2="2019-04-19"
  />
);

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Combobox from "reusable/lib/Combobox";
import dateUtils from "reusable/lib/dateUtils";

import styles from "./ComboDateRangePicker.module.scss";

// Lazy loading since a big dep. Since this depends on datepicker it's helpful to lazy load this so datepicker remains in a separate bundle in the prod build.
const DateRangePicker = React.lazy(() =>
  import(
    /* webpackChunkName: "DateRangePicker" */ "reusable/lib/DateRangePicker"
  )
);

function ComboDateRangePicker({
  className,
  helpText,
  id,
  inputClassName,
  input2ClassName,
  label,
  name,
  mode,
  values,
  onChange,
}) {
  const showDateRangePicker = mode === "DATE_RANGE";

  const options = [
    { label: "All Dates", value: "ALL" },
    {
      label: "Last 30 Days",
      value: "LAST_30_DAYS",
    },
    {
      label: "Last 60 Days",
      value: "LAST_60_DAYS",
    },
    {
      label: "Last 90 Days",
      value: "LAST_90_DAYS",
    },
    {
      label: "Enter Date Range",
      value: "DATE_RANGE",
    },
  ];

  function getDeliverByDateRange(deliverByDateMode) {
    let deliverByDateRange;

    const getLastXDaysRange = (days) => {
      const now = new Date();
      return {
        value: dateUtils.formatDate(dateUtils.addDays(now, -days)),
        value2: dateUtils.formatDate(now),
      };
    };

    switch (deliverByDateMode) {
      case "ALL":
      case "DATE_RANGE":
        deliverByDateRange = { value: undefined, value2: undefined };
        break;
      case "LAST_30_DAYS":
        deliverByDateRange = getLastXDaysRange(30);
        break;
      case "LAST_60_DAYS":
        deliverByDateRange = getLastXDaysRange(60);
        break;
      case "LAST_90_DAYS":
        deliverByDateRange = getLastXDaysRange(90);
        break;
      default:
        deliverByDateRange = values;
        break;
    }

    return deliverByDateRange;
  }

  function handleModeChange({ target: { value } }) {
    onChange({ mode: value, values: getDeliverByDateRange(value) });
  }

  const handleDateChange = (name) => ({ target: { value } }) => {
    onChange({
      mode: "DATE_RANGE",
      values: {
        ...values,
        [name]: value,
      },
    });
  };

  return (
    <div className={cx(styles.root, className)}>
      <Combobox
        id={id}
        helpText={helpText}
        label={label}
        name={name}
        onChange={handleModeChange}
        options={options}
        value={mode || "ALL"}
      />

      {showDateRangePicker && (
        <DateRangePicker
          id={`${id}--2`}
          inputClassName={inputClassName}
          input2ClassName={input2ClassName}
          hasFloatingCalendarOverlay
          name={`${name}--2`}
          label="From Date"
          label2="To Date"
          onChange={handleDateChange("value")}
          onChange2={handleDateChange("value2")}
          value={values.value}
          value2={values.value2}
        />
      )}
    </div>
  );
}

ComboDateRangePicker.defaultProps = {
  mode: null,
  values: { value: undefined, value2: undefined },
};

ComboDateRangePicker.propTypes = {
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  input2ClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  mode: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape({
    value: PropTypes.string,
    value2: PropTypes.string,
  }),
};

export default ComboDateRangePicker;

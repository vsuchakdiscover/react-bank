import React from "react";
import PropTypes from "prop-types";
import Combobox from "reusable/lib/Combobox";
import styles from "./ScheduledPaymentsTable.module.scss";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

function ScheduledPaymentsFilterForm({ values, onSubmit }) {
  const options = [
    { label: "Show All Payments", value: "ALL" },
    { label: "Show One-Time Payments", value: FREQUENCY_TYPE.ONE_TIME },
    { label: "Show Repeating Payments", value: FREQUENCY_TYPE.REPEATING },
  ];

  return (
    <Combobox
      className={styles.select}
      name="payments"
      onChange={({ target: { value } }) => {
        onSubmit(value && value !== "ALL" ? { type: value } : {});
      }}
      options={options}
      required
      showLabel={false}
      value={values.type || "ALL"}
    />
  );
}

ScheduledPaymentsFilterForm.defaultProps = {
  values: {},
};

ScheduledPaymentsFilterForm.propTypes = {
  values: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default ScheduledPaymentsFilterForm;

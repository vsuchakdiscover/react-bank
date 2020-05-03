import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Checkboxes from "reusable/lib/Checkboxes";
import MultiSelectCombobox from "reusable/lib/MultiSelectCombobox";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import { uniqueArrayByProperty } from "reusable/lib/arrayUtils";
import ComboDateRangePicker from "./ComboDateRangePicker";
import styles from "./PaymentHistoryFilterForm.module.scss";
import { clickTrack } from "reusable/lib/tracking";

function PaymentHistoryFilterForm({
  payments,
  initialValues,
  values,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(values);

  useEffect(() => {
    setForm(values);
  }, [values]);

  const payToOptions = uniqueArrayByProperty(
    payments.map((payment) => ({
      // Store value without last four of account so filter will match table value
      label: nickNameWithLastFour(payment.payee),
      value: payment.payee.nickName,
    })),
    "label"
  );

  const payFromOptions = uniqueArrayByProperty(
    payments.map((payment) =>
      // Store value without last four of account so filter will match table value
      ({
        label: nickNameWithLastFour(payment.paymentMethod),
        value: payment.paymentMethod.accountName,
      })
    ),
    "label"
  );

  const statusOptions = [
    { label: "Processing", value: "processing" },
    {
      label: "Completed",
      value: "completed",
    },
    { label: "Canceled", value: "cancelled" },
    { label: "Failed", value: "failed" },
    { label: "Other", value: "other" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleComboDateRangeChange = (name, modeName) => ({ values, mode }) => {
    setForm({ ...form, [name]: values, [modeName]: mode });
  };

  function handleReset(e) {
    e.preventDefault();
    onSubmit(initialValues);
  }

  function handleCancel(e) {
    e.preventDefault();
    onCancel();
  }

  function handleSubmit(e) {
    e.preventDefault();
    clickTrack("BillPay:ReviewPayments:History:Search:Lnk:Show");
    onSubmit(form);
  }

  return (
    <section role="contentinfo" aria-label="Payment History Search">
      <form className={styles.root} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <MultiSelectCombobox
            id="payTo"
            label="Pay To"
            name="payee.nickName"
            containerClassName={styles.input}
            options={payToOptions}
            onChange={handleChange}
            selectAllText="Select All Payees"
            unselectAllText="Unselect All Payees"
            value={form["payee.nickName"] || []}
          />

          <MultiSelectCombobox
            id="payFrom"
            label="Pay From"
            name="paymentMethod.accountName"
            containerClassName={styles.payFrom}
            onChange={handleChange}
            options={payFromOptions}
            selectAllText="Select All Accounts"
            unselectAllText="Unselect All Accounts"
            value={form["paymentMethod.accountName"] || []}
          />
        </div>

        <ComboDateRangePicker
          helpText='"All Dates" includes bill payments within the last 24 months'
          id="deliverByDate"
          inputClassName={styles.input}
          label="Delivered By"
          name="deliverByDate"
          values={form.deliverByDate}
          mode={form.deliverByDateMode}
          onChange={handleComboDateRangeChange(
            "deliverByDate",
            "deliverByDateMode"
          )}
        />

        <Checkboxes
          childClassName={styles.formCheckboxChild}
          className={styles.formCheckboxes}
          id="status"
          label="Status"
          name="status"
          onChange={handleChange}
          options={statusOptions}
          showSelectAll
          value={form.status || []}
        />

        <ButtonGroup className={styles.actions}>
          <Button
            aria-label="Filter the table"
            buttonStyle={BUTTON_TYPES.PRIMARY}
            type="submit"
          >
            Filter
          </Button>

          <Button
            adobeEvent="BillPay:ReviewPayments:History:Search:Lnk:Reset"
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={handleReset}
            aria-label="Reset table filters"
          >
            Reset
          </Button>

          <Button
            adobeEvent="BillPay:ReviewPayments:History:Search:Lnk:Cancel"
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={handleCancel}
            aria-label="Cancel table filter"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </section>
  );
}

PaymentHistoryFilterForm.propTypes = {
  payments: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
  values: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

PaymentHistoryFilterForm.defaultProps = {
  payments: [],
  initialValues: {},
  values: {},
};

export default PaymentHistoryFilterForm;

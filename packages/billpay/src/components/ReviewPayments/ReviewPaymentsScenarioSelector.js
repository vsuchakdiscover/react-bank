import React from "react";
import ScenarioDropdown from "../reusable/ScenarioDropdown";
import BillpayScenarioSelector from "../reusable/BillpayScenarioSelector";

function ReviewPaymentsScenarioSelector() {
  return (
    <BillpayScenarioSelector>
      <ScenarioDropdown
        label="Get Accounts Response"
        localStorageKey="getAccountsResponse"
        defaultValue="2"
        reloadOnChange
        options={[
          { value: "1", label: "Personal Checking" },
          { value: "2", label: "Personal Checking and Money Market" },
          {
            value: "3",
            label: "Personal Checking and Money Market with low balances",
          },
        ]}
      />
      <ScenarioDropdown
        label="Get Payments Response"
        localStorageKey="getPaymentsResponse"
        defaultValue="All payments"
        reloadOnChange
        options={[
          "All payments",
          "No payments",
          "Without scheduled payments",
          "Without one-time payments",
          "Scheduled payments return error",
          "Payments history with error",
        ]}
      />
      <ScenarioDropdown
        label="Delete Payment Response"
        localStorageKey="deletePaymentResponse"
        defaultValue="Success"
        reloadOnChange
        options={[
          "Success",
          "Payment.CannotBeDeleted",
          "Payments.NotFound",
          "General.TechnicalDifficulties",
        ]}
      />
    </BillpayScenarioSelector>
  );
}

export default ReviewPaymentsScenarioSelector;

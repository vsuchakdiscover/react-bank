import React from "react";
import ScenarioDropdown from "../reusable/ScenarioDropdown";
import BillpayScenarioSelector from "../reusable/BillpayScenarioSelector";

function MakePaymentScenarioSelector() {
  return (
    <BillpayScenarioSelector>
      <ScenarioDropdown
        label="Schedule Payment Response"
        localStorageKey="schedulePaymentResponse"
        defaultValue="Success"
        options={[
          "Success",
          "General.TechnicalDifficulties",
          "Fail Only DiscoverCard (4065)",
          "Payment.Duplicate",
          "Payment.Exceeds.DailyLimit",
          "Payments.PaymentNotEditable",
          "Payments.NotFound",
          "Payment.DeliverBy.Invalid.BankHoliday",
          "Payment.Note.Invalid",
          "Payments.Frequency.Invalid",
          "Payment.Memo.Invalid",
          "Payment.Amount.Invalid.Min",
          "Payment.Amount.Invalid",
          "Payment.DeliverBy.Invalid.Start",
          "Payment.Response403",
        ]}
      />
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
    </BillpayScenarioSelector>
  );
}

export default MakePaymentScenarioSelector;

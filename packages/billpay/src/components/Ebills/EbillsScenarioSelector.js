import React from "react";
import ScenarioDropdown from "../reusable/ScenarioDropdown";
import BillpayScenarioSelector from "../reusable/BillpayScenarioSelector";

function EbillsScenarioSelector() {
  return (
    <BillpayScenarioSelector>
      <ScenarioDropdown
        label="Enrollment response"
        localStorageKey="enrollmentResponse"
        defaultValue="Success"
        options={[
          "Success",
          "Another set of tokens",
          "Ebill.Enroll.NotEligible",
          "eBillStatus returned as AVAILABLE",
          "General.TechnicalDifficulties",
        ]}
      />
      <ScenarioDropdown
        label="Unenroll Response"
        localStorageKey="unenrollResponse"
        defaultValue="Success"
        reloadOnChange
        options={[
          "Success",
          "Ebill.UnEnroll.NotEligible",
          "General.TechnicalDifficulties",
        ]}
      />
      <ScenarioDropdown
        label="File Bill Response (Mark as Paid)"
        localStorageKey="fileEbillResponse"
        defaultValue="Success"
        reloadOnChange
        options={["Success", "General.TechnicalDifficulties"]}
      />
    </BillpayScenarioSelector>
  );
}

export default EbillsScenarioSelector;

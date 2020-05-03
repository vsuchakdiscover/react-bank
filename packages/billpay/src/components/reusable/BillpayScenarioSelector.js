// Most scenario selectors in billpay allow selecting customer enrollment status.
// This base component centralizes the code to enforce cross-page consistency and avoid duplication.
import React from "react";
import PropTypes from "prop-types";
import ScenarioDropdown from "../reusable/ScenarioDropdown";
import ScenarioSelector from "reusable/lib/ScenarioSelector";
import scenarios from "../../mockData/centralizedPayeeScenarios";

function BillpayScenarioSelector({ children }) {
  return (
    <ScenarioSelector>
      <ScenarioDropdown
        label="Customer Enrollment Status"
        localStorageKey="customerEnrollmentStatus"
        defaultValue="1"
        reloadOnChange
        options={scenarios.map((s) => ({
          label: s.scenario,
          value: s.id,
        }))}
      />
      {children}
    </ScenarioSelector>
  );
}

BillpayScenarioSelector.propTypes = {
  children: PropTypes.any,
};

export default BillpayScenarioSelector;

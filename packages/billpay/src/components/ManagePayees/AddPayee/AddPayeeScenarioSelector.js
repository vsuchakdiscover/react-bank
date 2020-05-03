import React from "react";
import PropTypes from "prop-types";
import ScenarioDropdown from "../../reusable/ScenarioDropdown";
import ScenarioSelector from "reusable/lib/ScenarioSelector";

function AddPayeeScenarioSelector({ type }) {
  function renderSettings() {
    switch (type) {
      case "verifiedPayee":
        return (
          <ScenarioDropdown
            label="Save Payee Response"
            localStorageKey="payee"
            defaultValue="Success.Verified.Payee"
            options={[
              "Success.Verified.Payee",
              "Payee.Address.PostalCode.Invalid",
              "Payee.Nickname.Invalid",
              "Payee.Nickname.Exist",
              "Payee.InvalidAccountNumber",
              "Payee.AccountNumber.Mismatch",
              "Payee.ZipCode.Mismatch",
              "Payee.Duplicate",
              "Payee.NotFound",
              "General.TechnicalDifficulties",
            ]}
          />
        );
      case "managedPayee":
        return (
          <ScenarioDropdown
            label="Save Payee Response"
            localStorageKey="payee"
            defaultValue="Success.Managed.Payee"
            options={[
              "Success.Managed.Payee",
              "Payee.Address.PostcalCode.Invalid",
              "Payee.Address.StreetAddress.Invalid",
              "Payee.Address.Locality.Invalid",
              "Payee.Nickname.Invalid",
              "Payee.Nickname.Exist",
              "Payee.PhoneNumber.Number.Invalid",
              "Payee.Name.Invalid",
              "Payee.ZipCode.Mismatch",
              "Payee.Duplicate",
              "Payee.Name.NotEmpty",
              "Payee.Address.Invalid",
              "General.TechnicalDifficulties",
            ]}
          />
        );
      default:
        return <p>No Scenarios</p>;
    }
  }

  return <ScenarioSelector>{renderSettings()}</ScenarioSelector>;
}

AddPayeeScenarioSelector.propTypes = {
  type: PropTypes.string.isRequired,
};

export default AddPayeeScenarioSelector;

import React from "react";
import PropTypes from "prop-types";
import SelectInput from "reusable/lib/SelectInput";
import useLocalStorage from "reusable/lib/useLocalStorage";

function ScenarioDropdown({
  defaultValue,
  label,
  localStorageKey,
  options,
  reloadOnChange,
}) {
  const [value, setValue] = useLocalStorage(localStorageKey, defaultValue);

  return (
    <SelectInput
      label={label}
      id={localStorageKey}
      required
      name={localStorageKey}
      value={value}
      setValue={setValue}
      onChange={({ target }) => {
        setValue(target.value);
        if (reloadOnChange) window.location.reload();
      }}
      options={options}
    />
  );
}

ScenarioDropdown.propTypes = {
  /** The default selected value if no value is stored in localStorage */
  defaultValue: PropTypes.string.isRequired,

  /** The dropdown label */
  label: PropTypes.string.isRequired,

  /** The key where the setting should be stored in localStorage */
  localStorageKey: PropTypes.string.isRequired,

  /** List of options */
  options: PropTypes.array.isRequired,

  /** Set to true to automatically reload the browser when the value changes */
  reloadOnChange: PropTypes.bool,
};

ScenarioDropdown.defaultProps = {
  reloadOnChange: false,
};

export default ScenarioDropdown;

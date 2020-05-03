/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Combobox from "./Combobox";
import MultiSelectCombobox from "./MultiSelectCombobox";
import CleanCombobox from "./CleanCombobox";
import { text } from "@storybook/addon-knobs";

const simpleOptions = [
  "Please Select",
  "Discover Credit Card account with very long name (1234)",
  "Neptunium",
  "Plutonium",
  "Americium",
  "Curium",
  "Berkelium",
  "Californium",
  "Einsteinium",
  "Fermium",
  "Mendelevium",
  "Nobelium",
  "Lawrencium",
  "Rutherfordium",
  "Dubnium",
  "Seaborgium",
  "Bohrium",
  "Hassium",
  "Meitnerium",
  "Darmstadtium",
  "Roentgenium",
  "Copernicium",
  "Nihonium",
  "Flerovium",
  "Moscovium",
  "Livermorium",
  "Tennessine",
  "Oganesson",
];

const keyValueOptions = [
  { label: "Neptunium", value: "Nep" },
  { label: "Plutonium", value: "Plu" },
  { label: "Americium", value: "Ame" },
  { label: "Curium", value: "Cur" },
  { label: "Berkelium", value: "Ber" },
  { label: "Californium", value: "Cal" },
  { label: "Einsteinium", value: "Ein" },
  { label: "Fermium", value: "Fer" },
  { label: "Mendelevium", value: "Men" },
  { label: "Nobelium", value: "Nob" },
  { label: "Lawrencium", value: "Law" },
  { label: "Rutherfordium", value: "Rut" },
  { label: "Dubnium", value: "Dub" },
  { label: "Seaborgium", value: "Sea" },
  { label: "Bohrium", value: "Boh" },
  { label: "Hassium", value: "Has" },
  { label: "Meitnerium", value: "Mei" },
  { label: "Darmstadtium", value: "Dar" },
  { label: "Roentgenium", value: "Roe" },
  { label: "Copernicium", value: "Cop" },
  { label: "Nihonium", value: "Nih" },
  { label: "Flerovium", value: "Fle" },
  { label: "Moscovium", value: "Mos" },
  { label: "Livermorium", value: "Liv" },
  { label: "Tennessine", value: "Ten" },
  { label: "Oganesson", value: "Oga" },
];

const dateFilterOptions = [
  {
    label: "Current Week 11/17-11/23",
    value: "CW",
  },
  {
    label: "Next Week 11/24-11/30",
    value: "NW",
  },
  {
    label: "Next 30 days 11/20-12/19",
    value: "N30",
  },
  {
    label: "One Time Payments after 30 days",
    value: "OTP30",
  },
  {
    label: "Repeating Payments after 30 days",
    value: "RP30",
  },
];

const itemToStringOverride = (item) => (item ? item.value : "");

const SimpleCombobox = ({
  initialValue,
  required = true,
  showLabel = true,
  hideOptionalLabelText = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Combobox
        label="Please Select"
        name="simplecombo"
        onChange={handleChange}
        options={simpleOptions}
        required={required}
        showLabel={showLabel}
        value={value}
        hideOptionalLabelText={hideOptionalLabelText}
      />
      <p>Selected option {JSON.stringify(value)}</p>
    </>
  );
};

const KeyValuePairCombobox = ({ initialValue, itemToString }) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Combobox
        itemToString={itemToString}
        label="Please Select"
        name="keyvaluecombo"
        onChange={handleChange}
        options={keyValueOptions}
        required
        value={value}
      />
      <p>Selected option {JSON.stringify(value)}</p>
    </>
  );
};

const MultiCheckCombo = ({ initialValue = [] }) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <MultiSelectCombobox
        label="Please Select"
        name="checkboxcombo"
        onChange={handleChange}
        options={keyValueOptions}
        required
        value={value}
      />
      <p>Selected options {JSON.stringify(value)}</p>
    </>
  );
};

const TooltipCombobox = () => {
  const [value, setValue] = useState();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Combobox
        label="Please Select"
        name="tooltipcombo"
        onChange={handleChange}
        options={keyValueOptions}
        required
        tooltipContent="Hello world"
      />
      <p>Selected option {JSON.stringify(value)}</p>
    </>
  );
};

const ComboboxWithError = () => {
  const [value, setValue] = useState();
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <>
      <Combobox
        error={text("Error", "This is an error")}
        id="simpleComboboxWithError"
        label="Please Select"
        onChange={handleChange}
        options={keyValueOptions}
        required
      />
      <p>Selected option {JSON.stringify(value)}</p>
    </>
  );
};

const ComboboxWithHelpText = () => {
  const [value, setValue] = useState();
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <>
      <Combobox
        helpText={text("helpText", "An example help text")}
        id="simpleComboboxWithHelpText"
        label="Please Select"
        onChange={handleChange}
        options={keyValueOptions}
        required
      />
      <p>Selected option {JSON.stringify(value)}</p>
    </>
  );
};

const CleanSelectCombobox = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <CleanCombobox
      value={value}
      onChange={handleChange}
      options={dateFilterOptions}
    />
  );
};

export default {
  title: "FormInputs/Combobox",
  parameters: {
    info: {
      propTables: [Combobox],
    },
  },
};

export const arrayOfStrings = () => <SimpleCombobox initialValue="Fermium" />;

export const noLabel = () => (
  <SimpleCombobox showLabel={false} initialValue="Fermium" />
);

export const hideOptionalLabelText = () => (
  <SimpleCombobox
    required={false}
    hideOptionalLabelText={true}
    initialValue="Fermium"
  />
);

export const keyValuePairs = () => (
  <KeyValuePairCombobox initialValue={"Plu"} />
);

export const overrideItemToString = () => (
  <KeyValuePairCombobox
    initialValue={keyValueOptions[1]}
    itemToString={itemToStringOverride}
  />
);

export const withError = () => <ComboboxWithError />;
export const withHelpText = () => <ComboboxWithHelpText />;

export const withTooltip = () => <TooltipCombobox />;

export const multiSelectCombobox = () => <MultiCheckCombo />;
export const multiSelectComboboxWithValues = () => (
  <MultiCheckCombo initialValue={["Nep", "Plu"]} />
);

export const cleanCombobox = () => <CleanSelectCombobox initialValue={"CW"} />;

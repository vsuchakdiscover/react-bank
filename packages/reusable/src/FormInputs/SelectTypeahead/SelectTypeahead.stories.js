import React, { useState } from "react";
import SelectTypeahead from "./SelectTypeahead";
import MerchantList from "./MerchantList";
import matchSorter from "match-sorter";

const simpleItemArray = [
  { name: "apple" },
  { name: "banana" },
  { name: "pear" },
  { name: "orange" },
  { name: "lemon" },
];

//Reduces MerchantList to a shape the Typeahead can digest
const allItems = MerchantList.reduce((acc, currValue) => {
  return acc.concat(currValue.names);
}, []).map((s) => ({ name: s }));

const itemToString = (item) => (item ? item.name : "");

const getItemsToShow = (value) => {
  return value
    ? matchSorter(allItems, value, {
        threshold: matchSorter.rankings.CONTAINS,
        keys: ["name"],
      })
    : allItems;
};

const SimpleTypeahead = () => {
  const [value, setValue] = useState();
  const [itemsToShow, setItemsToShow] = useState([]);
  const handleChange = (item) => {
    setValue(item.name);
  };
  const handleStateChange = (changes, downshiftState) => {
    if (changes.hasOwnProperty("inputValue")) {
      setItemsToShow(
        matchSorter(simpleItemArray, downshiftState.inputValue, {
          keys: ["name"],
        })
      );
    }
  };
  return (
    <SelectTypeahead
      id="typeahead"
      inputPlaceholder="Input placeholder"
      itemToString={(item) => (item ? item.name : "")}
      items={itemsToShow}
      labelPlaceholder="Label placeholder"
      onChange={handleChange}
      onStateChange={handleStateChange}
      value={value}
    />
  );
};

const LargeListTypahead = () => {
  const [value, setValue] = useState();
  const [itemsToShow, setItemsToShow] = useState([]);
  const handleChange = (item) => {
    setValue(item.name);
  };
  const handleStateChange = (changes, downshiftState) => {
    if (changes.hasOwnProperty("inputValue")) {
      setItemsToShow(getItemsToShow(downshiftState.inputValue));
    }
  };
  return (
    <SelectTypeahead
      inputPlaceholder="Enter Company or Business Name"
      items={itemsToShow}
      itemToString={itemToString}
      labelPlaceholder="Find a Verified Payee"
      minInputLength={2}
      notFoundText="Payee not found. Please enter manually."
      onChange={handleChange}
      onStateChange={handleStateChange}
      value={value}
    />
  );
};

export default { title: "FormInputs/SelectTypeahead" };
export const simpleTypeahead = () => <SimpleTypeahead />;
export const largeJsonList = () => <LargeListTypahead />;

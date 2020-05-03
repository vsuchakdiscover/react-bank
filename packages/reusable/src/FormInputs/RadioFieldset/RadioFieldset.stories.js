/* eslint-disable react/prop-types */
import React from "react";
import RadioFieldset from "./RadioFieldset";
import RadioButton from "../RadioButton/RadioButton";
import { text } from "@storybook/addon-knobs";

export default { title: "FormInputs/RadioFieldset" };

function Example(props) {
  const [checked, setChecked] = React.useState("A");

  function handleChange(e) {
    setChecked(e.target.value);
  }

  return (
    <RadioFieldset
      legend="Please Select a Radio Button"
      showLegend={props.showLegend}
      selectedRadio={checked}
      wrapperClass="defaultSpacing"
    >
      <RadioButton
        id="radioA"
        label={text("Radio A label", "A")}
        name="example"
        onChange={handleChange}
        checked={checked === "A"}
        value="A"
      />
      <RadioButton
        id="radioB"
        label={text("Radio B label", "B")}
        name="example"
        onChange={handleChange}
        checked={checked === "B"}
        value="B"
      />
    </RadioFieldset>
  );
}

export const example = () => <Example />;

export const hiddenLegend = () => <Example showLegend={false} />;

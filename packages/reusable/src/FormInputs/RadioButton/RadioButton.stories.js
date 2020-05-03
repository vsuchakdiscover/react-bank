import React from "react";
import RadioButton from "./RadioButton";
import Tooltip from "../../Tooltip";
import { text } from "@storybook/addon-knobs";

export default { title: "FormInputs/RadioButton" };

export const selected = () => (
  <RadioButton
    checked={true}
    id="radioA"
    label={text("Radio A label text", "A Basic Radio Selected")}
    name="radios"
  />
);

export const unselected = () => {
  return (
    <RadioButton
      checked={false}
      id="radioA"
      label={text("Radio A label text", "A Basic Radio Unselected")}
      name="radios"
    />
  );
};

export const disabled = () => (
  <RadioButton
    checked={false}
    disabled={true}
    id="radioA"
    label={text("Radio A label text", "A Basic Radio Disabled")}
    name="radios"
  />
);

export const disabledSelected = () => (
  <RadioButton
    checked={true}
    disabled={true}
    id="radioA"
    label={text("Radio A label text", "A Basic Radio Selected but Disabled")}
    name="radios"
  />
);

export const withTooltip = () => (
  <RadioButton
    checked={true}
    id="radioA"
    label={text("Radio A label text", "A Basic Radio Selected")}
    name="radios"
    tooltip={
      <Tooltip
        ariaLabel="Additional information about eBill AutoPay."
        width="500"
      >
        <p className="mb-0">
          Automatically pay the minimum payment or the full balance of your
          eBill on the due date or date of arrival.
        </p>
      </Tooltip>
    }
  />
);

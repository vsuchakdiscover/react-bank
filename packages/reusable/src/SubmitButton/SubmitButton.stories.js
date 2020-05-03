import React from "react";
import SubmitButton from "./SubmitButton";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default { title: "Buttons/SubmitButton" };
export const defaultExample = () => (
  <SubmitButton
    onClick={action("clicked")}
    onClickCancel={action("cancel clicked")}
    onKeyPress={action("keypressed")}
    onKeyPressCancel={action("cancel keypressed")}
    showCancel={true}
  >
    {text("button text", "Submit")}
  </SubmitButton>
);

export const hideCancel = () => (
  <SubmitButton
    onClick={action("clicked")}
    onKeyPress={action("keypressed")}
    showCancel={false}
  >
    {text("button text", "Submit")}
  </SubmitButton>
);

import React from "react";
import Button, { BUTTON_TYPES } from "./Button";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default { title: "Buttons/Button" };

export const defaultExample = () => (
  <Button onClick={action("clicked")} onKeyPress={action("keypressed")}>
    {text("button text", "Your Average Button")}
  </Button>
);

export const href = () => (
  <Button href="http://www.discover.com">
    {text("button text", "Go to Discover.com")}
  </Button>
);

export const ghost = () => (
  <Button
    buttonStyle={BUTTON_TYPES.GHOST}
    onClick={action("clicked")}
    onKeyPress={action("keypressed")}
  >
    {text("button text", "It's a Ghost!")}
  </Button>
);

export const submit = () => (
  <Button
    onClick={action("clicked")}
    onKeyPress={action("keypressed")}
    type="submit"
  >
    {text("button text", "Submit This")}
  </Button>
);

export const link = () => (
  <Button
    buttonStyle={BUTTON_TYPES.LINK}
    onClick={action("clicked")}
    onKeyPress={action("keypressed")}
    type="button"
  >
    {text("button text", "Modal Link Style")}
    <span className="sr-only"> opens a modal window</span>
  </Button>
);

export const modalCloseX = () => (
  <Button
    aria-label="Close modal dialog"
    buttonStyle={BUTTON_TYPES.CLOSEX}
    onClick={action("clicked")}
    onKeyPress={action("keypressed")}
    type="button"
  />
);

export const tooltip = () => (
  <div className="col-12">
    <Button
      aria-label="Close modal dialog"
      buttonStyle={BUTTON_TYPES.TOOLTIP}
      onClick={action("clicked")}
      onKeyPress={action("keypressed")}
      type="button"
    >
      Tooltip Button
    </Button>
  </div>
);

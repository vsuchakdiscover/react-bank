import React from "react";
import ButtonGroup from "./ButtonGroup";
import Button, { BUTTON_TYPES } from "../Button";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Buttons/ButtonGroup",
};

export const buttonWithLink = () => (
  <ButtonGroup>
    <Button type="submit">{text("Button text", "Continue")}</Button>
    <ButtonGroup.Link>
      <a href="#cancel">{text("Link text", "Cancel")}</a>
    </ButtonGroup.Link>
  </ButtonGroup>
);

export const buttonWith2Links = () => (
  <ButtonGroup>
    <Button type="submit">{text("Button text", "Continue")}</Button>
    <ButtonGroup.Link>
      <a href="#back">{text("Link 1 text", "Back")}</a>
    </ButtonGroup.Link>
    <ButtonGroup.Link>
      <a href="#cancel">{text("Link 2 text", "Cancel")}</a>
    </ButtonGroup.Link>
  </ButtonGroup>
);

export const buttonWith3Links = () => (
  <ButtonGroup>
    <Button type="button">{text("Button text", "Continue")}</Button>
    <ButtonGroup.Link>
      <a href="#back">{text("Link 1 text", "Back")}</a>
    </ButtonGroup.Link>
    <ButtonGroup.Link>
      <a href="#cancel">{text("Link 2 text", "Cancel")}</a>
    </ButtonGroup.Link>
    <ButtonGroup.Link>
      <a href="#cancel">{text("Link 3 text", "Run Away Fast")}</a>
    </ButtonGroup.Link>
  </ButtonGroup>
);

export const buttonWithCancelButton = () => (
  <ButtonGroup>
    <Button type="submit">{text("Button text", "Continue")}</Button>
    <ButtonGroup.Link>
      <Button buttonStyle={BUTTON_TYPES.LINK}>Cancel</Button>
    </ButtonGroup.Link>
  </ButtonGroup>
);

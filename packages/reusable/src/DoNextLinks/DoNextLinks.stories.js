import React from "react";
import DoNextLinks from "./DoNextLinks";
import { BrowserRouter as Router } from "react-router-dom";
import Button, { BUTTON_TYPES } from "../Button";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Links/Do Next Links",
  parameters: {
    info: {
      propTables: [DoNextLinks],
    },
  },
};

export const defaultExample = () => (
  <Router>
    <DoNextLinks>
      <a href="#makeABillPayment">Make a Bill Payment</a>
      <a href="#managePayees">Regular Link</a>
    </DoNextLinks>
  </Router>
);

export const custom = () => (
  <DoNextLinks header={text("Header text", "What would you like for dinner?")}>
    <a href="#Spaghett">Spaghett</a>
    <a href="#Tacos">Tacos</a>
    <a href="#Boiled Ham">Boiled Ham</a>
    <Button buttonStyle={BUTTON_TYPES.LINK}>A button could be here too!</Button>
  </DoNextLinks>
);

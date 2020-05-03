import React from "react";
import BlueBox from "./BlueBox";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Bluebox",
};

export const defaultExample = () => (
  <BlueBox header={text("Header", "Blue Box Header")}>
    So many things can go in here!
  </BlueBox>
);

export const withHeaderTagReset = () => (
  <BlueBox header={<h3>Blue Box Header</h3>}>
    So many things can go in here!
  </BlueBox>
);

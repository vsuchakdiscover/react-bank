import React from "react";
import ColorSwatch from "./ColorSwatch";
import { styled } from "@storybook/theming";
import colors from "./Colors.module.scss";
const List = styled.div({
  display: "flex",
  flexFlow: "row wrap",
});
const Item = styled.div({
  marginBottom: "32px",
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "10%",
  boxSizing: "border-box",
});
const colorKeys = Object.keys(colors);

export default {
  title: "Colors",
};

export const allColors = () => (
  <List>
    {colorKeys.map((key) => (
      <Item key={key}>
        <ColorSwatch hex={colors[key]} name={key} />
      </Item>
    ))}
  </List>
);

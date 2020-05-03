import React from "react";
import Headline from "./Headline";
import { render } from "@testing-library/react";

it("should display text", () => {
  const { getByText } = render(<Headline>Header Text</Headline>);
  getByText("Header Text");
});

it("should render the tag defined by prop.type", () => {
  render(<Headline type="h4">Header Text</Headline>);
  expect(document.querySelectorAll("h4").length).toBe(1);
});

it("should render an H2 if type is not defined", () => {
  render(<Headline>Header Text</Headline>);
  expect(document.querySelectorAll("h2").length).toBe(1);
});

import React from "react";
import H1 from "./H1";
import { render } from "@testing-library/react";

it("should display text", () => {
  const { getByText } = render(<H1>Page Title</H1>);
  getByText("Page Title");
});

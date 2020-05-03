import React from "react";
import Alert from "./Alert";
import { render, fireEvent } from "@testing-library/react";

it("should display close button by default", () => {
  const { getByLabelText } = render(<Alert>Message</Alert>);
  // Automatic assertion. If I can't find this, then fail the test.
  getByLabelText("Close alert dialog");
});

it("should hide close button when closable is false", () => {
  const { queryByLabelText } = render(<Alert closable={false}>Message</Alert>);
  // Since queryBy doesn't automatically assert, use Jest's expect to assert that value is NOT found.
  expect(queryByLabelText("Close alert dialog")).toBeNull();
});

it("should display text passed as child", () => {
  const { getByText } = render(<Alert>Child text</Alert>);
  getByText("Child text");
});

it("should close when the close button is clicked", () => {
  const { getByLabelText, queryByRole } = render(<Alert>Message</Alert>);
  fireEvent.click(getByLabelText("Close alert dialog"));
  expect(queryByRole("alert")).toBeNull();
});

it("should close when the Escape key is pressed", () => {
  const { queryByRole } = render(<Alert>Message</Alert>);
  fireEvent.keyDown(queryByRole("alert"), { key: "Escape", code: 27 });
  expect(queryByRole("alert")).toBeNull();
});

it("should NOT close when the Escape key is pressed if closable is false", () => {
  const { getByRole } = render(<Alert closable={false}>Message</Alert>);
  fireEvent.keyDown(getByRole("alert"), { key: "Escape", code: 27 });
  getByRole("alert");
});

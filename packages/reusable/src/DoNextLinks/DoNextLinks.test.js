import React from "react";
import DoNextLinks from "./DoNextLinks";
import renderer from "react-test-renderer";

it("renders with the default header", () => {
  const tree = renderer
    .create(
      <DoNextLinks>
        <a href="#makeABillPayment">Make a Bill Payment</a>
        <a href="#managePayees">Manage Payees</a>
      </DoNextLinks>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders with a custom header", () => {
  const tree = renderer
    .create(
      <DoNextLinks header="Custom Header">
        <a href="#makeABillPayment">Make a Bill Payment</a>
        <a href="#managePayees">Manage Payees</a>
      </DoNextLinks>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

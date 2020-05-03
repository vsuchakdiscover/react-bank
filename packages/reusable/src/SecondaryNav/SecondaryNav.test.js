import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SecondaryNav from "./SecondaryNav";
import SecondaryNavItem from "./SecondaryNav";
import { render } from "@testing-library/react";

const renderNav = (screenWidth = 975) =>
  render(
    <Router>
      <SecondaryNav
        activeIndex={1}
        flyoutId="secondaryNav1"
        screenWidth={screenWidth}
      >
        {/* Note, have to pass screenWidth to these even though not used due to some bug with propType validation. Otherwise, will get a propType warning. */}
        <SecondaryNavItem screenWidth={screenWidth} to="#a">
          Make a Bill Payment
        </SecondaryNavItem>
        <SecondaryNavItem screenWidth={screenWidth} to="#b">
          Repeating Payments
        </SecondaryNavItem>
        <SecondaryNavItem screenWidth={screenWidth} to="#c">
          Payment Activity
        </SecondaryNavItem>
        <SecondaryNavItem screenWidth={screenWidth} to="#d">
          Manage Payees
        </SecondaryNavItem>
        <SecondaryNavItem screenWidth={screenWidth} to="#e">
          Manage eBills
        </SecondaryNavItem>
      </SecondaryNav>
    </Router>
  );

it("should display nav items as list elements", () => {
  renderNav();
  expect(document.querySelectorAll("li").length).toBe(5);
});

it("should display a url for each nav item", () => {
  renderNav();
  expect(document.querySelectorAll("li a").length).toBe(5);
});

it("should display text passed as child", () => {
  const { getByText } = renderNav();
  getByText("Make a Bill Payment");
});

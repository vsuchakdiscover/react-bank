/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SecondaryNav, { SecondaryNavItem } from "./SecondaryNav";
import useWindowSize from "../hooks/useWindowSize";
import { number } from "@storybook/addon-knobs";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

function NavWrapper() {
  const { w } = useWindowSize(100);

  return (
    <Router>
      <SecondaryNav
        activeIndex={number("activeIndex", 1)}
        flyoutId="secondaryNav0"
        screenWidth={w}
      >
        <SecondaryNavItem to="/make-payment">
          Make a Bill Payment
        </SecondaryNavItem>
        <SecondaryNavItem to="/repeating-payments">
          Repeating Payments
        </SecondaryNavItem>
        <SecondaryNavItem to="http://cnet.com">
          Payment Activity
        </SecondaryNavItem>
        <SecondaryNavItem to="/manage-payees">Manage Payees</SecondaryNavItem>
        <SecondaryNavItem to="#e">Manage eBills</SecondaryNavItem>
      </SecondaryNav>
    </Router>
  );
}

export default {
  title: "SecondaryNav",
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    info: {
      propTables: [SecondaryNav],
    },
  },
};

export const responsive = () => <NavWrapper />;

export const mobile = () => (
  <Router>
    <SecondaryNav
      activeIndex={number("activeIndex", 0)}
      flyoutId="secondaryNav0"
      screenWidth={375}
    >
      <SecondaryNavItem to="#a">Make a Bill Payment</SecondaryNavItem>
      <SecondaryNavItem to="#b">Repeating Payments</SecondaryNavItem>
      <SecondaryNavItem to="http://cnet.com">Payment Activity</SecondaryNavItem>
      <SecondaryNavItem to="#d">Manage Payees</SecondaryNavItem>
      <SecondaryNavItem to="#e">Manage eBills</SecondaryNavItem>
    </SecondaryNav>
  </Router>
);

// This throws an error with CSF format so commenting out for now.
mobile.story = {
  parameters: {
    viewport: { defaultViewport: "iphonex" },
  },
};

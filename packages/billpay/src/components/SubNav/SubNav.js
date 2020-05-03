import React from "react";
import PropTypes from "prop-types";
import useWindowSize from "reusable/lib/useWindowSize";
import SecondaryNav, { SecondaryNavItem } from "reusable/lib/SecondaryNav";
import { useLocation } from "react-router-dom";

const SubNav = ({ activeIndex }) => {
  const location = useLocation();
  const { w: screenWidth } = useWindowSize(100);
  return (
    <SecondaryNav
      screenWidth={screenWidth}
      activeIndex={activeIndex}
      flyoutId="secondaryNav0"
      className="mb-30"
    >
      <SecondaryNavItem
        to={{
          pathname: "/",
          // If user clicks on this link while on Step 3 of Make a Payment,
          // reinitialize the form by passing state that instructs the page to do so.
          state:
            location.pathname === "/" ||
            location.pathname.includes("edit-payment")
              ? { reinit: true }
              : "",
        }}
      >
        Make a Bill Payment
      </SecondaryNavItem>
      <SecondaryNavItem to="/review-payments">Review Payments</SecondaryNavItem>
      <SecondaryNavItem to="/manage-payees">Manage Payees</SecondaryNavItem>
      <SecondaryNavItem to="/manage-ebills">Manage eBills</SecondaryNavItem>
    </SecondaryNav>
  );
};

SubNav.propTypes = {
  /** sets the index of the "active" tab */
  activeIndex: PropTypes.number,
};

export default SubNav;

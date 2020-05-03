/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useEffect, useRef, useState } from "react";
import SmartLink from "../SmartLink";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./SecondaryNav.module.scss";

export const SecondaryNavItem = ({ isFlyout, to, isActive, children }) => {
  return (
    <li className={cx({ [styles.flyout]: isFlyout })} key={to}>
      <SmartLink className={cx({ [styles.active]: isActive })} to={to}>
        {children}
      </SmartLink>
    </li>
  );
};

const SecondaryNav = ({ flyoutId, activeIndex, ...props }) => {
  const [flyouts, setFlyouts] = useState([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const isMobile = props.screenWidth < 768;
  const hasFlyout = flyouts.length > 0;
  const ref = useRef(null);
  const navRef = useRef(null);

  const handleMenu = () => {
    if (isMobile || (!isMobile && hasFlyout)) {
      setMenuIsOpen(!menuIsOpen);
    }
  };

  const handleClickOutside = useCallback((e) => {
    if (!navRef.current.contains(e.target)) {
      setMenuIsOpen(false);
      document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    // Reset the flyouts when window size changes. Prefixing this var with underscore to avoid naming conflict with flyouts held in state.
    const _flyouts = [];

    if (!isMobile) {
      let itemsWidth = 50; //accounting for the trigger also
      for (let [i, item] of ref.current.querySelectorAll("li").entries()) {
        itemsWidth = itemsWidth + item.getBoundingClientRect().width;
        if (itemsWidth > ref.current.getBoundingClientRect().width) {
          _flyouts.push(i);
        }
      }
      setFlyouts(_flyouts);
    }
  }, [flyouts.length, isMobile, props.children, props.screenWidth]);

  useEffect(() => {
    if ((isMobile && menuIsOpen) || (!isMobile && hasFlyout)) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside, hasFlyout, isMobile, menuIsOpen]);

  const renderChildren = () => {
    return props.children.map((item, ind) => (
      <SecondaryNavItem
        key={item.props.to}
        {...item.props}
        isActive={activeIndex === ind}
        isFlyout={flyouts.includes(ind)}
      />
    ));
  };

  const renderFlyout = () => {
    return props.children
      .filter((item, ind) => flyouts.includes(ind))
      .map((item) => <SecondaryNavItem key={item.props.to} {...item.props} />);
  };

  return (
    <nav
      className={cx(
        [styles.root],
        props.className,
        isMobile ? [styles.mobile] : "",
        hasFlyout ? [styles.hasFlyout] : ""
      )}
      onClick={isMobile ? handleMenu : null}
      ref={navRef}
    >
      {isMobile && (
        <div className={styles.mobileHeader} onClick={handleMenu} role="button">
          {props.children[activeIndex || 0].props.children}
        </div>
      )}
      {(isMobile || hasFlyout) && (
        <button
          aria-controls={flyoutId}
          aria-expanded={menuIsOpen}
          aria-label={(menuIsOpen ? "Close" : "Open") + " Payments Menu"}
          className={styles.trigger}
          onClick={!isMobile ? handleMenu : null}
          type="button"
        >
          <span aria-hidden="true" className={styles.triggerDot} />
        </button>
      )}
      <ul
        className={menuIsOpen ? "" : styles.mobileHide}
        id={flyoutId}
        ref={ref}
      >
        {renderChildren()}
      </ul>

      {!isMobile && menuIsOpen && hasFlyout && (
        <ul className={cx(styles.flyoutMenu, styles.flyoutOpen)} id={flyoutId}>
          {renderFlyout()}
        </ul>
      )}
    </nav>
  );
};

SecondaryNav.propTypes = {
  /** Active Menu item index */
  activeIndex: PropTypes.number,

  /** Menu Items */
  children: PropTypes.node.isRequired,

  /** Class to apply */
  className: PropTypes.string,

  /** Unique identifier to be used for button/content pairing with aria-controls/id */
  flyoutId: PropTypes.string,

  /** Screen width in pixels */
  screenWidth: PropTypes.number.isRequired,
};

SecondaryNavItem.propTypes = {
  /** Menu Item text */
  children: PropTypes.string.isRequired,

  /** Is Menu Item active */
  isActive: PropTypes.bool,

  /** Does Menu Item appear in flyout for tablet and desktop, calculated on window resize */
  isFlyout: PropTypes.bool,

  /** Link URL */
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default SecondaryNav;

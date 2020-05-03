/* eslint-disable react/jsx-key, jsx-a11y/label-has-associated-control */
import React from "react";
import { BUTTON_TYPES } from "../../Button";
import cx from "classnames";
import PropTypes from "prop-types";
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import styles from "./DropdownButton.module.scss";
import dropdownCaret from "./dropdown-caret.svg";

export const MENU_ITEM_TYPES = {
  ANCHOR: "anchor",
  ITEM: "item",
};

function DropdownButton({ label, buttonStyle, options, onClick }) {
  return (
    <Menu>
      <MenuButton
        className={cx(styles.button, styles[buttonStyle])}
        onClick={onClick}
      >
        {label}
        <span aria-hidden>
          <img alt="" src={dropdownCaret} />
        </span>
      </MenuButton>
      <MenuList className={styles.menuList}>
        {options.map(({ label, value }) => {
          return typeof value === "function" ? (
            <MenuItem className={styles.menuItem} key={label} onSelect={value}>
              {label}
            </MenuItem>
          ) : (
            <MenuLink
              as="a"
              className={styles.menuItem}
              href={value}
              key={label}
            >
              {label}
            </MenuLink>
          );
        })}
      </MenuList>
    </Menu>
  );
}

DropdownButton.propTypes = {
  /** Button style */
  buttonStyle: PropTypes.string,

  /** Button label */
  label: PropTypes.string.isRequired,

  /** Function to call when menu button is clicked */
  onClick: PropTypes.func,

  /** Array of options. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** Menu item label */
      label: PropTypes.string.isRequired,

      /** Pass a URL string for anchors. Pass a func to call for menu items. */
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    })
  ).isRequired,
};

DropdownButton.defaultProps = {
  buttonStyle: BUTTON_TYPES.PRIMARY,
};

export { BUTTON_TYPES };
export default DropdownButton;

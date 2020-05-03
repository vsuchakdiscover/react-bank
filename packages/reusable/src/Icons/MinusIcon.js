import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const MinusIcon = ({ className }) => (
  <Icon className={className}>
    <svg width="13px" height="3px" viewBox="0 0 13 3" version="1.1">
      <g
        id="Key-Screens"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id=".Com-Brand-Elements-/-Icons-for-Web-/-Utility-/-Minus"
          transform="translate(-6.000000, -11.000000)"
          fill="#1E71AC"
        >
          <path
            d="M18.0714286,11 C18.3422633,11 18.5647313,11.1004454 18.7388393,11.3013393 C18.9129473,11.5022331 19,11.758927 19,12.0714286 C19,12.3839301 18.9129473,12.640624 18.7388393,12.8415179 C18.5647313,13.0424117 18.3422633,13.1428571 18.0714286,13.1428571 L13.4285714,13.1428571 L11.5714286,13.1428571 L6.92857143,13.1428571 C6.65773674,13.1428571 6.43526873,13.0424117 6.26116071,12.8415179 C6.0870527,12.640624 6,12.3839301 6,12.0714286 C6,11.758927 6.0870527,11.5022331 6.26116071,11.3013393 C6.43526873,11.1004454 6.65773674,11 6.92857143,11 L11.5714286,11 L13.4285714,11 L18.0714286,11 Z"
            id="Path"
          ></path>
        </g>
      </g>
    </svg>
  </Icon>
);

MinusIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default MinusIcon;

import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const MoneyMarketIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 51.96 41.71"
      width="35"
      height="29"
    >
      <g id="Symbols">
        <g id="mobile-account-main-_-MM" data-name="mobile-account-main-/-MM">
          <g id="Money-Market-Icon">
            <path
              id="Shape"
              fill="#b6b6b6"
              d="M34.68,31.91a3.3,3.3,0,1,0-3.3,3.33,3.32,3.32,0,0,0,3.3-3.33Zm2.08,0a5.38,5.38,0,1,1-5.38-5.44A5.41,5.41,0,0,1,36.76,31.91Zm-15-8.73a3.3,3.3,0,1,0-3.3,3.33A3.32,3.32,0,0,0,21.71,23.18Zm2.08,0a5.38,5.38,0,1,1-5.38-5.44A5.41,5.41,0,0,1,23.79,23.18ZM8.72,36.27a3.33,3.33,0,0,0-1.65-2.88,3.25,3.25,0,0,0-3.3,0,3.32,3.32,0,1,0,5,2.88Zm2.08,0A5.45,5.45,0,0,1,8.11,41a5.34,5.34,0,0,1-5.38,0A5.44,5.44,0,0,1,5.42,30.84a5.41,5.41,0,0,1,5.38,5.43Z"
              transform="translate(-0.04)"
            />
            <path
              id="Shape-2"
              data-name="Shape"
              fill="#b6b6b6"
              d="M9.11,33.71,7.54,32.33,14,24.86l1.57,1.38Zm26.35-4.4a1,1,0,0,1-1.45.11A1.05,1.05,0,0,1,33.86,28l6.32-7.6a1,1,0,0,1,1.46-.13,1.06,1.06,0,0,1,.13,1.48l-6.31,7.6Zm-14-2.92,1.24-1.68,5.56,4.17L27,30.56Z"
              transform="translate(-0.04)"
            />
            <path
              id="Shape-3"
              data-name="Shape"
              fill="#ff6000"
              d="M47.32,10.5a1.05,1.05,0,0,1,0,2.1A4.73,4.73,0,1,1,52,7.87a1.05,1.05,0,0,1-.52.91,1,1,0,0,1-1,0,1.05,1.05,0,0,1-.52-.91,2.6,2.6,0,1,0-2.6,2.63Z"
              transform="translate(-0.04)"
            />
            <path
              id="Shape-4"
              data-name="Shape"
              fill="#ff6000"
              d="M47.32,12.6a1.05,1.05,0,0,1,0-2.1,4.73,4.73,0,1,1-4.68,4.73,1,1,0,1,1,2.08,0,2.6,2.6,0,1,0,2.6-2.63Zm1.43-8.4a1,1,0,1,1-2.08,0V1.05a1,1,0,1,1,2.08,0Z"
              transform="translate(-0.04)"
            />
            <path
              id="Shape-5"
              data-name="Shape"
              fill="#ff6000"
              d="M48.75,23.1a1,1,0,1,1-2.08,0V20a1,1,0,1,1,2.08,0Z"
              transform="translate(-0.04)"
            />
          </g>
        </g>
      </g>
    </svg>
  </Icon>
);

MoneyMarketIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default MoneyMarketIcon;

import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const PrintIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path d="M0 .004V7.34h15.531V.004H0z" id="print-icon-a" />
        <path d="M0 15.363h15.531V0H0z" id="print-icon-c" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(0 3.141)">
          <mask fill="#fff" id="print-icon-b">
            <use xlinkHref="#print-icon-a" />
          </mask>
          <path
            d="M1.974 7.34h11.584c1.085 0 1.973-1.047 1.973-2.326V2.33c0-1.28-.888-2.326-1.973-2.326H1.974C.888.004 0 1.05 0 2.33v2.684C0 6.294.888 7.34 1.974 7.34"
            fill="#63686B"
            mask="url(#print-icon-b)"
          />
        </g>
        <mask fill="#fff" id="print-icon-d">
          <use xlinkHref="#print-icon-c" />
        </mask>
        <path
          d="M3.13 4.648H12.4V.611H3.13z"
          mask="url(#print-icon-d)"
          stroke="#63686B"
        />
        <path
          d="M3.13 14.752H12.4V7.75H3.13z"
          fill="#FEFEFE"
          mask="url(#print-icon-d)"
        />
        <path
          d="M3.13 14.752H12.4V7.75H3.13zM5.568 10.182H8.69M5.568 12.32h4.603"
          mask="url(#print-icon-d)"
          stroke="#63686B"
        />
      </g>
    </svg>
  </Icon>
);

PrintIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default PrintIcon;

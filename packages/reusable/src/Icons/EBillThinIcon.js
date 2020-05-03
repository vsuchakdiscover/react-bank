import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const EBillThinIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="32"
      viewBox="0 0 26 32"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd" stroke="#FF6000" strokeWidth="2">
        <path d="M3.8 1.4h10.486a2 2 0 0 1 1.414.586L23.614 9.9a2 2 0 0 1 .586 1.414V28.6a2 2 0 0 1-2 2H3.8a2 2 0 0 1-2-2V3.4a2 2 0 0 1 2-2z" />
        <path
          d="M8.827 18.164h8.22a.125.125 0 0 0 .125-.127c-.035-3.625-1.58-5.437-4.636-5.437-3.09 0-4.636 1.855-4.636 5.564 0 4.79 3.117 6.336 9.35 4.636"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </Icon>
);

EBillThinIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default EBillThinIcon;

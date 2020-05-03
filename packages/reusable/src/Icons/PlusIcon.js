import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const PlusIcon = ({ className }) => (
  <Icon className={className}>
    <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
      <g
        id="Key-Screens"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id=".Com-Brand-Elements-/-Icons-for-Web-/-Utility-/-Plus"
          transform="translate(-5.000000, -5.000000)"
          fill="#1E71AC"
        >
          <path
            d="M18.9285714,11.4285714 C19.241073,11.4285714 19.4977669,11.5290169 19.6986607,11.7299107 C19.8995546,11.9308046 20,12.1874984 20,12.5 C20,12.8125016 19.8995546,13.0691954 19.6986607,13.2700893 C19.4977669,13.4709831 19.241073,13.5714286 18.9285714,13.5714286 L13.5714286,13.5714286 L13.5714286,18.9285714 C13.5714286,19.241073 13.4709831,19.4977669 13.2700893,19.6986607 C13.0691954,19.8995546 12.8125016,20 12.5,20 C12.1874984,20 11.9308046,19.8995546 11.7299107,19.6986607 C11.5290169,19.4977669 11.4285714,19.241073 11.4285714,18.9285714 L11.4285714,13.5714286 L6.07142857,13.5714286 C5.75892701,13.5714286 5.50223315,13.4709831 5.30133929,13.2700893 C5.10044542,13.0691954 5,12.8125016 5,12.5 C5,12.1874984 5.10044542,11.9308046 5.30133929,11.7299107 C5.50223315,11.5290169 5.75892701,11.4285714 6.07142857,11.4285714 L11.4285714,11.4285714 L11.4285714,6.07142857 C11.4285714,5.75892701 11.5290169,5.50223315 11.7299107,5.30133929 C11.9308046,5.10044542 12.1874984,5 12.5,5 C12.8125016,5 13.0691954,5.10044542 13.2700893,5.30133929 C13.4709831,5.50223315 13.5714286,5.75892701 13.5714286,6.07142857 L13.5714286,11.4285714 L18.9285714,11.4285714 Z"
            id="Mask"
          ></path>
        </g>
      </g>
    </svg>
  </Icon>
);

PlusIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default PlusIcon;

import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const ArrowRightIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
    >
      <path
        fill="#1E71AC"
        fillRule="evenodd"
        d="M4.7 2.5l8 8-8 8c-.667.667-.667 1.333 0 2s1.333.667 2 0l9.111-9.111c.222-.222.445-.445.445-.889s-.223-.667-.445-.889L6.7.5c-.667-.667-1.333-.667-2 0s-.667 1.333 0 2z"
      />
    </svg>
  </Icon>
);

ArrowRightIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default ArrowRightIcon;

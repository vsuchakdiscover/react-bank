import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const ChevronDownIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="5"
      viewBox="0 0 9 5"
      width="9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 .653L8.347 0l-.354.354.3.299-3.64 3.64L4.5 4.14l-.153.153L.707.653l.3-.3L.653 0 0 .653l.354.354.299-.3 3.64 3.64-.3.3.354.353.153-.153.153.153.354-.354-.3-.299 3.64-3.64.3.3L9 .653z"
        fill="none"
        fillRule="evenodd"
        stroke="#63686b"
      />
    </svg>
  </Icon>
);

ChevronDownIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default ChevronDownIcon;

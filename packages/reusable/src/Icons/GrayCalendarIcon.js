import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const GrayCalendarIcon = ({ className, size }) => {
  const [width, height] = size === "default" ? [40, 40] : [14, 14];

  return (
    <Icon className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 26 26"
      >
        <g fill="none" fillRule="evenodd" stroke="#63686B" strokeWidth="2.6">
          <path strokeLinecap="round" d="M6.5 1.3L6.5 6.5M19.5 1.3L19.5 6.5" />
          <rect width="23.4" height="20.8" x="1.3" y="3.9" rx="2.6" />
          <path strokeLinecap="round" d="M24.7 10.4L1.3 10.4" />
        </g>
      </svg>
    </Icon>
  );
};

GrayCalendarIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon size */
  size: PropTypes.oneOf(["default", "small"]),
};

GrayCalendarIcon.defaultProps = {
  size: "default",
};

export default GrayCalendarIcon;

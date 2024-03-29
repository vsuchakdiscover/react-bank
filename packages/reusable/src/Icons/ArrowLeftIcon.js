import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const ArrowLeftIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
    >
      <path
        fill="#DBDBDB"
        fillRule="evenodd"
        d="M11.095 13.214L5.381 7.5l5.714-5.714c.476-.476.476-.953 0-1.429-.476-.476-.952-.476-1.428 0l-6.35 6.508C3.16 7.024 3 7.183 3 7.5s.159.476.317.635l6.508 6.508c.477.476.953.476 1.429 0 .317-.476.317-.953-.159-1.429z"
      />
    </svg>
  </Icon>
);

ArrowLeftIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default ArrowLeftIcon;

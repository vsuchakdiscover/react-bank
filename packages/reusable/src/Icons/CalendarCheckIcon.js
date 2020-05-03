import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const CalendarCheckIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="31"
      viewBox="0 0 32 31"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.666 14.933a1 1 0 0 0-1.588.072l-4.47 6.431-2.24-2.669a1 1 0 1 0-1.532 1.286l3.066 3.653a.96.96 0 0 0 .397.297 1.001 1.001 0 0 0 1.218-.37l5.204-7.487a1.001 1.001 0 0 0-.055-1.213zM2.125 9h27.75V6.157a1 1 0 0 0-1-1h-5v2.01a1 1 0 1 1-2 0v-2.01h-12v2.01a1 1 0 1 1-2 0v-2.01h-4.75a1 1 0 0 0-1 1V9zm0 2v16.5a1 1 0 0 0 1 1h25.75a1 1 0 0 0 1-1V11H2.125zm26.75 19.5H3.125c-1.654 0-3-1.345-3-3V6.157c0-1.655 1.346-3 3-3h4.75V1a1 1 0 1 1 2 0v2.157h12V1a1 1 0 1 1 2 0v2.157h5c1.654 0 3 1.345 3 3V27.5c0 1.655-1.346 3-3 3z"
        fill="#FF6000"
        fillRule="evenodd"
      />
    </svg>
  </Icon>
);

CalendarCheckIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default CalendarCheckIcon;

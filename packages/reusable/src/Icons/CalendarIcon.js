import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const CalendarIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="17"
      viewBox="0 0 17 17"
      width="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#1e71ac" fillRule="evenodd">
        <path d="m1.055 15.821h14.765v-8.438h-14.765zm15.758-12.855c-.135-.43-.519-.747-.993-.747h-1.055v1.637c0 .872-.71 1.582-1.582 1.582s-1.582-.71-1.582-1.582v-1.637h-6.333v1.637c0 .872-.71 1.582-1.582 1.582s-1.582-.71-1.582-1.582v-1.637h-1.049c-.474 0-.86.317-.993.747h-.062v12.855c0 .582.472 1.054 1.055 1.054h14.765c.582 0 1.055-.472 1.055-1.054v-12.855z" />
        <path d="m3.6862 4.3831c.291 0 .527-.236.527-.527v-3.329c0-.291-.236-.527-.527-.527s-.527.236-.527.527v3.329c0 .291.236.527.527.527" />
        <path d="m13.1833 4.3831c.29 0 .527-.236.527-.527v-3.329c0-.291-.237-.527-.527-.527s-.527.236-.527.527v3.329c0 .291.237.527.527.527" />
      </g>
    </svg>
  </Icon>
);

CalendarIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default CalendarIcon;

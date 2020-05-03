import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const MobilePhoneIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="36"
      viewBox="0 0 26 36"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.937 14.333h3.25v-3.25h-3.25v3.25zm3.251 2h-3.251c-1.103 0-2-.897-2-2v-3.25c0-1.103.897-2 2-2h3.251c1.103 0 2 .897 2 2v3.25c0 1.103-.897 2-2 2zm.937 3.625h-5.25a1 1 0 1 1 0-2h5.25a1 1 0 1 1 0 2zm.063 3.625h-5.251a1 1 0 1 1 0-2h5.251a1 1 0 1 1 0 2zm-9.639 8.011H8.451a1 1 0 0 1 0-2h3.098a1 1 0 1 1 0 2zM14.562 7.25c-.551 0-1 .448-1 1v16.041c0 .552.449 1 1 1h8.001c.551 0 1-.448 1-1V8.25c0-.552-.449-1-1-1h-8.001zM3.437 2.844c-.551 0-1 .448-1 1v28.312c0 .552.449 1 1 1h13.126c.551 0 1-.448 1-1v-4.865h-3.001c-1.654 0-3-1.346-3-3V8.25c0-1.654 1.346-3 3-3h3.001V3.844c0-.552-.449-1-1-1H3.437zm13.126 32.312H3.437c-1.654 0-3-1.345-3-3V3.844c0-1.655 1.346-3 3-3h13.126c1.654 0 3 1.345 3 3V5.25h3c1.654 0 3 1.346 3 3v16.041c0 1.654-1.346 3-3 3h-3v4.865c0 1.655-1.346 3-3 3z"
        fill="#FF6000"
        fillRule="evenodd"
      />
    </svg>
  </Icon>
);

MobilePhoneIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default MobilePhoneIcon;

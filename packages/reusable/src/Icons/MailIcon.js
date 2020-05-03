import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const MailIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      viewBox="0 0 20 15"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        style={{
          stroke: "#ff6000",
          strokeWidth: 2,
          fill: "none",
          fillRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        transform="translate(1 1)"
      >
        <path d="m16.8 12.4829545h-15.6c-.66 0-1.2-.5318181-1.2-1.1818181v-10.11931822c0-.65.54-1.18181818 1.2-1.18181818h15.6c.66 0 1.2.53181818 1.2 1.18181818v10.11931822c0 .65-.54 1.1818181-1.2 1.1818181z" />
        <path d="m0 1.18181818 9 7.3125 9-7.3125" />
      </g>
    </svg>
  </Icon>
);

MailIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default MailIcon;

import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const RevolvingIcon = ({ className, size }) => {
  const dim = size === "default" ? 20 : 14;
  return (
    <Icon className={className}>
      <svg fontSize={dim} height="1em" viewBox={`0 0 20 20`} width="1em">
        <defs>
          <path d="M.14.18h14.753V9.84H.139z" id="Revolving_svg__a"></path>
          <path d="M.457.022h4.85v5.502H.457z" id="Revolving_svg__c"></path>
        </defs>
        <g fill="none" fillRule="evenodd">
          <path
            d="M6.22 19.01l-.386-2.477 2.415-.395a.834.834 0 00.676-.957.818.818 0 00-.933-.694l-3.22.527a.82.82 0 00-.532.335.86.86 0 00-.144.623l.514 3.302c.071.455.49.767.933.694a.833.833 0 00.677-.958"
            fill="#000"
          ></path>
          <g transform="translate(4 9.21)">
            <mask fill="#fff" id="Revolving_svg__b">
              <use xlinkHref="#Revolving_svg__a"></use>
            </mask>
            <path
              d="M13.253 1.063c.15 2.748-1.382 5.423-4.002 6.544-2.634 1.142-5.955.495-7.692-1.503a.8.8 0 00-1.152-.06.852.852 0 00-.057 1.182C2.667 9.821 6.62 10.53 9.88 9.15c3.274-1.402 5.19-4.741 5.001-8.18a.823.823 0 00-.86-.788.828.828 0 00-.767.882z"
              fill="#000"
              mask="url(#Revolving_svg__b)"
            ></path>
          </g>
          <g transform="translate(11.5 .491)">
            <mask fill="#fff" id="Revolving_svg__d">
              <use xlinkHref="#Revolving_svg__c"></use>
            </mask>
            <path
              d="M3.172.99l.386 2.476-2.414.396a.834.834 0 00-.677.957.818.818 0 00.933.694l3.22-.528a.818.818 0 00.532-.334.858.858 0 00.144-.623L4.782.726A.818.818 0 003.85.032a.834.834 0 00-.677.958"
              fill="#000"
              mask="url(#Revolving_svg__d)"
            ></path>
          </g>
          <path
            d="M3.64 10.22C3.49 7.47 5.022 4.795 7.642 3.674c2.634-1.142 5.955-.495 7.692 1.503a.8.8 0 001.151.06.851.851 0 00.057-1.182C14.226 1.46 10.274.752 7.014 2.133c-3.275 1.402-5.19 4.741-5.001 8.18.026.462.41.814.86.788a.828.828 0 00.767-.882z"
            fill="#000"
          ></path>
        </g>
      </svg>
    </Icon>
  );
};

RevolvingIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon size */
  size: PropTypes.oneOf(["default", "small"]),
};

RevolvingIcon.defaultProps = {
  size: "default",
};

export default RevolvingIcon;

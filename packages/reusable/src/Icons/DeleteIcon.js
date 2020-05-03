import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const DeleteIcon = ({ className }) => (
  <Icon className={className}>
    <svg height="19px" version="1.1" viewBox="0 0 19 19" width="19px">
      <defs>
        <path
          d="M8.77978125,14.9921875 L8.77978125,5.878125 L10.2202187,5.878125 L10.2202187,14.9921875 L8.77978125,14.9921875 Z M11.3160734,14.8970688 L12.0549953,5.84356875 L13.4912766,5.93886563 L12.7526516,14.9923656 L11.3160734,14.8970688 Z M5.69940625,5.95373906 L7.1345,5.84241094 L7.99929687,14.9146141 L6.56420312,15.0259422 L5.69940625,5.95373906 Z M13.6458891,17.4865016 L5.57831094,17.4865016 L4.04821719,4.30406406 L14.9812328,4.30406406 L13.6458891,17.4865016 Z M8.17092031,1.29879844 L10.7531391,1.29879844 L11.1254203,2.76476719 L7.84524844,2.76476719 L8.17092031,1.29879844 Z M19.0000297,2.79059531 L12.8425453,2.79059531 L11.9629047,0.207782812 C11.9044203,0.0890328125 11.8162484,-2.96875e-05 11.6989828,-2.96875e-05 L7.21290469,-2.96875e-05 C7.09563906,-2.96875e-05 6.97837344,0.0890328125 6.94898281,0.178095313 L6.15751406,2.76090781 L2.96875e-05,2.76090781 L2.96875e-05,4.39668906 L2.58017031,4.39668906 L4.25157656,18.4359078 C4.28096719,18.7624703 4.54488906,18.9999703 4.86729531,18.9999703 L14.2794203,18.9999703 C14.6018266,18.9999703 14.8657484,18.7624703 14.8951391,18.4359078 L16.3611078,4.39668906 L18.9412484,4.39668906 L18.9412484,2.79059531 L19.0000297,2.79059531 Z"
          id="delete-path"
        ></path>
      </defs>
      <g
        fill="none"
        fillRule="evenodd"
        id="Pencil-Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g id="dfs-delete">
          <mask fill="white" id="mask-2">
            <use xlinkHref="#delete-path"></use>
          </mask>
          <use fill="#1E71AC" xlinkHref="#delete-path"></use>
        </g>
      </g>
    </svg>
  </Icon>
);

DeleteIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default DeleteIcon;

import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const EBillIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="20px"
      version="1.1"
      viewBox="0 0 16 20"
      width="16px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        fill="none"
        fillRule="evenodd"
        id="Manage-Payees"
        stroke="none"
        strokeWidth="1"
      >
        <g
          id="2-W-Expanded-Payee-Verified-Address---V2"
          stroke="#FF6000"
          transform="translate(-457.000000, -303.000000)"
        >
          <g id="eBill" transform="translate(459.042361, 305.000000)">
            <g id="Artboard-Copy">
              <path
                d="M3.54545455,9.27272727 L8.45454545,9.27272727 C8.45454545,7.09090909 7.54545455,6 5.72727273,6 C3.90909091,6 3,7.09090909 3,9.27272727 C3,12.1818182 5,13.0909091 9,12"
                id="Path-3"
                strokeWidth="2"
              ></path>
              <g id="Group" strokeWidth="2">
                <path
                  d="M1,-1 L6.58578644,-1 C7.11621942,-1 7.62492724,-0.789286319 8,-0.414213562 L12.4142136,4 C12.7892863,4.37507276 13,4.88378058 13,5.41421356 L13,15 C13,16.1045695 12.1045695,17 11,17 L1,17 C-0.1045695,17 -1,16.1045695 -1,15 L-1,1 C-1,-0.1045695 -0.1045695,-1 1,-1 Z"
                  id="Rectangle"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </Icon>
);

EBillIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default EBillIcon;

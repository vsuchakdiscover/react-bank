import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const ElectronicIcon = ({ className }) => (
  <Icon className={className}>
    <svg
      height="20"
      width="20"
      viewBox="0 0 16 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m4.71270356 1.01015217-1.71054546 10.97600003c-.00102052.0065483.00346068.0126842.01000905.0137047.00061134.0000952.00122912.0001431.00184783.0001431h3.98598502l-.99410231 6.9587161c-.00093725.0065609.00362153.0126392.01018234.0135765.00408846.0005841.00818997-.0009753.01085769-.0041281l10.95634968-12.94841319c.0042809-.00505928.0036499-.01263102-.0014094-.01691195-.0021667-.00183334-.004913-.00283936-.0077513-.00283936h-5.9741267l2.1356884-4.98327297c.0026107-.00609156-.0002111-.0131461-.0063027-.01575677-.0014937-.00064017-.0031019-.00097026-.004727-.00097026h-8.40009827c-.00591398 0-.01094621.00430873-.01185687.01015217z"
        fill="none"
        stroke="#ff6000"
        strokeWidth="2"
        transform="translate(-2)"
      />
    </svg>
  </Icon>
);

ElectronicIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default ElectronicIcon;

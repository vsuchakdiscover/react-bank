import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const WarningIcon = ({ className, size }) => {
  const dim = size === "default" ? 30 : 22;
  return (
    <Icon className={className}>
      <svg
        height={dim}
        viewBox="0 0 30 30"
        width={dim}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd" transform="translate(.062)">
          <circle cx="15" cy="15" fill="#EBD22F" r="15" />
          <g fill="#63686B" fillRule="nonzero">
            <path d="M13.252 12.522v1.245c-.003 1.504-.002 2.172.003 3.008.007 1.125.702 1.975 1.745 1.975.978 0 1.738-.81 1.742-1.828.01-2.92.01-5.868 0-8.845-.004-1.018-.76-1.825-1.74-1.827-1.009-.002-1.732.804-1.743 1.868a218.36 218.36 0 0 0-.006 3.654v.75zM15.01 21.25c-1.02-.006-1.757.724-1.76 1.743-.003 1.018.725 1.753 1.743 1.757 1.019.004 1.755-.726 1.757-1.744.001-1.018-.723-1.75-1.74-1.756z" />
          </g>
        </g>
      </svg>
    </Icon>
  );
};

WarningIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon size */
  size: PropTypes.oneOf(["default", "small"]),
};

WarningIcon.defaultProps = {
  size: "default",
};

export default WarningIcon;

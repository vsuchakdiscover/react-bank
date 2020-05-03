import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const SuccessIcon = ({ className, size }) => {
  const dim = size === "default" ? 30 : 14;
  return (
    <Icon className={className}>
      <svg
        height={dim}
        viewBox={`0 0 30 30`}
        width={dim}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd">
          {/* <circle cx="15" cy="15" fill="#008A25" r="15" /> */}
          <circle cx="15" cy="15" fill="#008A25" r="15" />
          <path
            d="M19.788 11.988l.107-.113 1.047-1.095.038-.04c.124-.131.198-.202.31-.286a1.551 1.551 0 0 1 1.718-.129c.527.286.831.793.867 1.43a1.712 1.712 0 0 1-.376 1.091 2.89 2.89 0 0 1-.19.21l-.032.033c-2.812 2.945-5.707 5.975-8.729 9.137-.822.86-1.769.867-2.589.009l-1.213-1.27c-1.54-1.613-2.224-2.329-3.081-3.223-.465-.485-.664-1.068-.466-1.726.337-1.117 1.65-1.55 2.56-.816.089.072.145.128.247.236l.036.037.772.808a783.428 783.428 0 0 1 2.437 2.554c1.753-1.84 3.344-3.507 6.537-6.847z"
            fill="#FFF"
            fillRule="nonzero"
          />
        </g>
      </svg>
    </Icon>
  );
};

SuccessIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon size */
  size: PropTypes.oneOf(["default", "small"]),
};

SuccessIcon.defaultProps = {
  size: "default",
};

export default SuccessIcon;

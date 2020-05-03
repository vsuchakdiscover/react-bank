import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const CreditCardIcon = React.forwardRef(({ className, width, height }, ref) => (
  <Icon className={className} ref={ref}>
    <svg
      viewBox="0 0 34 22"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.84 8.64h-9.39a1 1 0 1 1 0-2h9.39a1 1 0 1 1 0 2zm8.77-3.3a3.518 3.518 0 0 0-2.512 3.368 3.519 3.519 0 0 0 2.512 3.368V5.34zM3.404 2.216c-.55 0-1 .448-1 1v15.539c0 .552.45 1 1 1H30.61c.551 0 1-.448 1-1v-4.625a5.52 5.52 0 0 1-4.512-5.421 5.52 5.52 0 0 1 4.512-5.421v-.072c0-.552-.449-1-1-1H3.404zM30.61 21.754H3.404c-1.654 0-3-1.345-3-3V3.214c0-1.653 1.346-3 3-3H30.61c1.654 0 3 1.347 3 3v15.54c0 1.655-1.346 3-3 3z"
        fill="#FF6000"
        fillRule="evenodd"
      />
    </svg>
  </Icon>
));

CreditCardIcon.displayName = "CreditCardIcon";

CreditCardIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon height */
  height: PropTypes.number,

  /** Icon width */
  width: PropTypes.number,
};

CreditCardIcon.defaultProps = {
  width: 34,
  height: 28,
};

export default CreditCardIcon;

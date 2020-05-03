import React from "react";
import Icon from "./Icon";
import PropTypes from "prop-types";

const InfoIcon = React.forwardRef(({ className, size }, ref) => (
  <Icon className={className} ref={ref}>
    <svg
      height={size}
      viewBox="0 0 13 14"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5.813c1.794 0 3.326.634 4.596 1.904S13 5.518 13 7.312c0 1.795-.635 3.327-1.904 4.596-1.27 1.27-2.802 1.905-4.596 1.905s-3.326-.635-4.596-1.905S0 9.107 0 7.313c0-1.795.635-3.327 1.904-4.596C3.174 1.447 4.706.812 6.5.812zM6.5 13c1.574 0 2.916-.554 4.024-1.663 1.11-1.109 1.664-2.45 1.664-4.024 0-1.575-.555-2.916-1.664-4.025C9.416 2.18 8.074 1.625 6.5 1.625c-1.574 0-2.916.554-4.024 1.663C1.366 4.397.813 5.738.813 7.312c0 1.575.554 2.916 1.663 4.025C3.584 12.446 4.926 13 6.5 13zm0-7.313c.22 0 .41.08.571.242a.78.78 0 0 1 .242.571v4.063c0 .22-.08.41-.242.57a.78.78 0 0 1-.571.242.78.78 0 0 1-.571-.241.78.78 0 0 1-.242-.572V6.5c0-.22.08-.41.242-.571a.78.78 0 0 1 .571-.242zm-.813-1.612c0-.228.08-.419.242-.571a.803.803 0 0 1 .571-.229c.22 0 .41.077.571.229.161.152.242.343.242.571 0 .229-.08.423-.242.584A.78.78 0 0 1 6.5 4.9a.78.78 0 0 1-.571-.24.795.795 0 0 1-.242-.585z"
        fill="#1E71AC"
        fillRule="evenodd"
      />
    </svg>
  </Icon>
));

InfoIcon.displayName = "InfoIcon";

InfoIcon.propTypes = {
  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,

  /** Icon size */
  size: PropTypes.number,
};

InfoIcon.defaultProps = {
  size: 14,
};

export default InfoIcon;

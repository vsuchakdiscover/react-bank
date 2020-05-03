import React from "react";
import PropTypes from "prop-types";

const Icon = React.forwardRef((props, ref) => (
  <span aria-hidden="true" className={props.className} ref={ref}>
    {props.children}
  </span>
));

Icon.displayName = "Icon";

Icon.propTypes = {
  /** SVG icon */
  children: PropTypes.element,

  /** Class for the span that wraps the SVG icon */
  className: PropTypes.string,
};

export default Icon;

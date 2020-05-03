import React from "react";
import PropTypes from "prop-types";
import Headline from "../Headline";

/** H3 */
const H3 = ({ children, className, ...props }) => (
  <Headline type="h3" {...props} className={className}>
    {children}
  </Headline>
);

H3.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default H3;

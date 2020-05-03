import React from "react";
import PropTypes from "prop-types";
import Headline from "../Headline";

/** H6 */
const H6 = ({ children, className, ...props }) => (
  <Headline type="h6" {...props} className={className}>
    {children}
  </Headline>
);

H6.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default H6;

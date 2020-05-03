import React from "react";
import PropTypes from "prop-types";
import Headline from "../Headline";

/** H4 */
const H4 = ({ children, className, ...props }) => (
  <Headline type="h4" {...props} className={className}>
    {children}
  </Headline>
);

H4.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default H4;

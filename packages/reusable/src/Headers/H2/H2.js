import React from "react";
import PropTypes from "prop-types";
import Headline from "../Headline";

/** H2 */
const H2 = ({ children, className, ...props }) => (
  <Headline type="h2" {...props} className={className}>
    {children}
  </Headline>
);

H2.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default H2;

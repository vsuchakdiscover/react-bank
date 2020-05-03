import React from "react";
import PropTypes from "prop-types";
import Headline from "../Headline";

/** H5 */
const H5 = ({ children, className, ...props }) => (
  <Headline type="h5" {...props} className={className}>
    {children}
  </Headline>
);

H5.propTypes = {
  /** Headline text/content */
  children: PropTypes.any.isRequired,

  /** Class to apply */
  className: PropTypes.string,
};

export default H5;

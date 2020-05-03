import React from "react";
import AnimateHeight from "react-animate-height";
import { PropTypes } from "prop-types";

const Accordion = ({ children, isOpen, duration, id, ...props }) => {
  return (
    <AnimateHeight
      animationStateClasses={{ static: "static" }}
      duration={duration}
      height={isOpen ? "auto" : 0}
      id={id}
      {...props}
    >
      {children}
    </AnimateHeight>
  );
};

Accordion.propTypes = {
  /** Holds the accordion's content */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  /** Animation duration in milliseconds when opening/closing */
  duration: PropTypes.number.isRequired,

  /** HTML id */
  id: PropTypes.string,

  /** Set to true to open the accordion */
  isOpen: PropTypes.bool.isRequired,
};

Accordion.defaultProps = {
  duration: 500,
};

export default Accordion;

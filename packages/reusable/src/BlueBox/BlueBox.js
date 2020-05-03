import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./BlueBox.module.scss";

const BlueBox = React.forwardRef((props, ref) => (
  <section
    role="contentinfo"
    aria-label={props["aria-label"] ?? props.header}
    className={cx(styles.root, props.className)}
    id={props.id || undefined}
    data-testid={props.id || undefined}
    ref={ref}
    x-ms-format-detection="none"
  >
    <div className={cx(styles.blueBoxHeader, props.headerClassName)}>
      {props.header}
    </div>
    <div className={cx(styles.blueBoxContent, props.childrenClassName)}>
      {props.children}
    </div>
  </section>
));

BlueBox.propTypes = {
  /** Aria label applied to blue box section tag. Defaults to the Header text if aria-label is not provided. */
  "aria-label": PropTypes.string,

  /** Child markup to display within box */
  children: PropTypes.any.isRequired,

  /** CSS class applied to the content */
  childrenClassName: PropTypes.string,

  /** Class to apply to wrapper div */
  className: PropTypes.string,

  /** Header displayed in the blue bar */
  header: PropTypes.any.isRequired,

  /** CSS class applied to the header */
  headerClassName: PropTypes.string,

  /** HTML ID assigned to the top-level DOM element */
  id: PropTypes.string,
};

BlueBox.displayName = "BlueBox";

export default BlueBox;

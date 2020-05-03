import React, { useState } from "react";
import { PropTypes } from "prop-types";
import styles from "./ClickToExpand.module.scss";
import Button, { BUTTON_TYPES } from "../Button";
import Accordion from "../Accordion";

const ClickToExpand = ({ children, collapsedHeight }) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(collapsedHeight);
  const toggle = () => {
    setOpen(!open);
    open ? setHeight(collapsedHeight) : setHeight("auto");
  };
  return (
    <div className={styles.container}>
      <Accordion
        className={styles.overflowScroll}
        height={height}
        isOpen={open}
      >
        <div className={styles.inner}>{children}</div>
      </Accordion>
      <Button
        aria-expanded={open ? "true" : "false"}
        aria-pressed="false"
        buttonStyle={BUTTON_TYPES.LINK}
        className={styles.expandBtn}
        id="expandButton"
        onClick={toggle}
      >
        <span className={styles.expandIcon}>{open ? "-" : "+"}</span>
        {open ? "Close" : "Expand"}
      </Button>
    </div>
  );
};

ClickToExpand.propTypes = {
  /** Click to expand content */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  /** Content height once the accordion closes */
  collapsedHeight: PropTypes.number,
};

ClickToExpand.defaultProps = {
  collapsedHeight: 300,
};

export default ClickToExpand;

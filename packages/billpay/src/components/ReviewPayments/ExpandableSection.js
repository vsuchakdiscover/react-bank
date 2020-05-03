import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./ExpandableSection.module.scss";

import Accordion from "reusable/lib/Accordion";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";

function ExpandableSection({
  adobeEvent,
  children,
  className,
  id,
  label,
  ...props
}) {
  const [open, setOpen] = useState(props.open);

  const toggle = () => {
    const nextState = !open;
    setOpen(nextState);
    props.onToggle && props.onToggle(nextState);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <section className={className}>
      <Button
        adobeEvent={adobeEvent}
        aria-label={`${open ? "close" : "open"} search`}
        aria-controls={id}
        aria-expanded={open ? "true" : "false"}
        buttonStyle={BUTTON_TYPES.LINK}
        className={styles.btn}
        onClick={toggle}
      >
        <span aria-hidden="true" className={styles.expandIcon}>
          {open ? "-" : "+"}
        </span>{" "}
        {label}
      </Button>

      <Accordion id={id} isOpen={open}>
        {children}
      </Accordion>
    </section>
  );
}

ExpandableSection.defaultProps = {
  open: false,
};

ExpandableSection.propTypes = {
  /** Event code sent to Adobe for tracking purposes on click */
  adobeEvent: PropTypes.string,

  /** A content that's displayed inside the section */
  children: PropTypes.any.isRequired,

  /** A css class for the section */
  className: PropTypes.string,

  /** A section id */
  id: PropTypes.string.isRequired,

  /** A toggle button label */
  label: PropTypes.string.isRequired,

  /**
   * A function that's called when the section is toggled.
   * In combination with open prop can be used to controll open/close
   * from parent scope.
   */
  onToggle: PropTypes.func,

  /** A prop that controls open/closed state */
  open: PropTypes.bool,
};

export default ExpandableSection;

import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./FAQ.module.scss";
import Accordion from "../Accordion";
import { clickTrack } from "../utils/tracking";
import Button, { BUTTON_TYPES } from "../Button";

const FAQ = ({ answer, index, question, tracking }) => {
  const [open, setOpen] = useState(false);
  const toggle = (tracking) => {
    if (tracking && tracking.length > 0) {
      if (open === false) {
        clickTrack(tracking);
      }
    }
    setOpen(!open);
  };

  return (
    <dl className={styles.descriptionList}>
      <dt className={styles.term}>
        <Button
          aria-controls={`faq${index}`}
          aria-expanded={open ? "true" : "false"}
          buttonStyle={BUTTON_TYPES.LINK}
          className={styles.btn}
          onClick={() => toggle(tracking)}
        >
          <div aria-hidden="true" className={styles.expandIcon}>
            {open ? "-" : "+"}
          </div>
          <div className={styles.question}>{question}</div>
        </Button>
      </dt>
      <dd className={styles.description}>
        <Accordion id={`faq${index}`} isOpen={open}>
          <div className={styles.descriptionInner}>{answer}</div>
        </Accordion>
      </dd>
    </dl>
  );
};

FAQ.propTypes = {
  /** Answer - Placed inside of accordion */
  answer: PropTypes.node.isRequired,

  /** Index used to associate aria-controls to the accordion id */
  index: PropTypes.number.isRequired,

  /** Question - Placed inside of button */
  question: PropTypes.node.isRequired,

  /** Tracking - Used to track clicks for Adobe Sitecat */
  tracking: PropTypes.string,
};

export default FAQ;

import React, { useState } from "react";
import Label from "../FormInputs/Label";
import styles from "./ExpandButton.module.scss";
import { PropTypes } from "prop-types";

const ExpandButton = ({ label, onClick, id }) => {
  const [expanded, setExpanded] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    setExpanded((prevValue) => !prevValue);
    if (onClick) onClick();
  }

  return (
    <button
      aria-expanded={expanded ? "true" : "false"}
      className={styles.button}
      id={id + "expandButton"}
      onClick={handleClick}
    >
      <span className={styles.icon}>{expanded ? "-" : "+"}</span>
      <Label htmlFor={id + "expandButton"} required>
        {label}
      </Label>
    </button>
  );
};

ExpandButton.propTypes = {
  /** HTML ID applied to the button */
  id: PropTypes.string.isRequired,

  /** Button label */
  label: PropTypes.string.isRequired,

  /** Function called on click */
  onClick: PropTypes.func,
};

export default ExpandButton;

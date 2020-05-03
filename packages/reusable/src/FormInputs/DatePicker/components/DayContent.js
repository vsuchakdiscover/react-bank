import React from "react";
import PropTypes from "prop-types";

import styles from "./Day.module.scss";

export function DayContent({ date }) {
  return <span>{date.getDate()}</span>;
}

DayContent.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export function DayContentWithLabel({ date, label }) {
  return (
    <div className={styles.hasLabel}>
      {date.getDate()}
      <div>{label}</div>
    </div>
  );
}

DayContentWithLabel.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  label: PropTypes.string,
};

export function DueDateContent({ date }) {
  return <DayContentWithLabel date={date} label="due" />;
}

DueDateContent.propTypes = {
  ...DayContentWithLabel.propTypes,
};

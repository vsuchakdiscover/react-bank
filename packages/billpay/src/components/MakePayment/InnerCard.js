import React from "react";
import PropTypes from "prop-types";
import styles from "./InnerCard.module.scss";

export default function InnerCard({ children }) {
  return <div className={styles.root}>{children}</div>;
}

InnerCard.propTypes = {
  children: PropTypes.any.isRequired,
};

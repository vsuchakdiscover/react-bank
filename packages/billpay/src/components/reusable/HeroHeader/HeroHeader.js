import React from "react";
import PropTypes from "prop-types";
import styles from "./HeroHeader.module.scss";

function HeroHeader({ children }) {
  return (
    <>
      <div className={styles.blueHeader}>
        <h2>{children}</h2>
      </div>{" "}
      <div className={styles.blueHeaderBg}></div>
    </>
  );
}

HeroHeader.defaultProps = {};

HeroHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default HeroHeader;

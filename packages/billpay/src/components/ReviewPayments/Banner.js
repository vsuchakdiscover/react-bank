import React from "react";
import PropTypes from "prop-types";
import styles from "./Banner.module.scss";

const Banner = ({ icon, children }) => {
  return (
    <div className={styles.root}>
      {icon}
      <>{children}</>
    </div>
  );
};

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
};

export default Banner;

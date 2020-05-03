import React from "react";
import PropTypes from "prop-types";
import styles from "./ColorSwatch.module.scss";

const ColorSwatch = ({ name, hex }) => {
  return (
    <div className={styles.swatchBox}>
      <button className={styles.swatchButton}>
        <div className={styles.swatchColor} style={{ backgroundColor: hex }} />
        <div className={styles.swatchDetail}>
          <div className={styles.swatchName}>${name}</div>
          <code>{hex}</code>
        </div>
      </button>
    </div>
  );
};

ColorSwatch.propTypes = {
  /** Color swatch hex */
  hex: PropTypes.string.isRequired,

  /** Color swatch name */
  name: PropTypes.string.isRequired,
};

export default ColorSwatch;

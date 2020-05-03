import React from "react";
import PropTypes from "prop-types";
import styles from "./LastFourMask.module.scss";
import cx from "classnames";

export default function LastFourMask({
  className,
  largeFont,
  value,
  ...props
}) {
  let mask = "";
  let alphaNumeric = "";

  value = value.slice(-4);
  const valueArray = Array.from(value);

  if (valueArray.includes("*")) {
    valueArray.forEach((d) => {
      if (d === "*") {
        mask = mask + "●";
      } else {
        alphaNumeric = alphaNumeric + d;
      }
    });
  } else {
    alphaNumeric = value.slice(-4);
  }

  return (
    <>
      (
      {mask !== "" && (
        <span
          className={cx(styles.root, className, largeFont ? styles.large : "")}
        >
          {mask}
        </span>
      )}
      {alphaNumeric})
    </>
  );
}

LastFourMask.propTypes = {
  /** value must be at least 2 characters in length */
  checkStringLength: function (value) {
    if (value.length === 1) {
      return new Error(`Value must be at least 2 characters.`);
    }
  },
  /** classname to apply */
  className: PropTypes.string,

  /** sets larger font size (12px) for the dotted mask versus default 8px */
  largeFont: PropTypes.bool,

  /** value to format */
  value: PropTypes.string,
};

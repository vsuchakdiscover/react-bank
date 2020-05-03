import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import styles from "./AccountNumberMask.module.scss";

export default function AccountNumberMask({ className, value }) {
  const valueArray = Array.from(value);
  let mask = "";
  let alphaNumeric = "";

  if (value === 1) {
    // value of 1 should error, no value can silently fail
    console.error("Account Number must be at least 2 characters.");
    return false;
  }

  if (valueArray.includes("*")) {
    //value comes from api
    valueArray.forEach((d, ind) => {
      if (d === "*") {
        mask = mask + "●";
      } else {
        alphaNumeric = alphaNumeric + d;
      }
    });
  } else {
    //value is new or updated and hasn't come back masked from the api yet
    let num = 4;
    const len = value.length;
    if (len <= 4) {
      const lookup = {
        4: 2,
        3: 2,
        2: 1,
      };
      num = lookup[len];
    }
    alphaNumeric = value.substring(len - num, len);
    Array.from(value.substring(len - num, 0)).forEach(() => {
      mask = mask + "●";
    });
  }

  return (
    <span className={cx(styles.root, className)}>
      <span className={styles.mask}>{mask}</span>
      {alphaNumeric}
    </span>
  );
}

AccountNumberMask.propTypes = {
  /** Function called to check the string's length */
  checkStringLength: function (props) {
    if (props.value.length === 1) {
      return new Error(`Value must be at least 2 characters.`);
    }
  },

  /** Class applied to the wrapper span */
  className: PropTypes.string,

  /** Value to mask */
  value: PropTypes.string,
};

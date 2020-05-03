import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./FieldValue.module.scss";

export default function FieldValue({
  label,
  children,
  mobileOnlyLabel,
  prefix,
  suffix,
}) {
  return (
    <dl className={styles.root}>
      <dt
        className={cx(
          "meta-web-bold",
          mobileOnlyLabel && styles.mobileOnlyLabel
        )}
      >
        {label}
      </dt>
      <dd>
        {prefix}
        {children}
        {suffix}
      </dd>
    </dl>
  );
}

FieldValue.defaultProps = {
  mobileOnlyLabel: false,
};

FieldValue.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
  mobileOnlyLabel: PropTypes.bool,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
};

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { legendItemType, legendItemTypePropTypes } from "../propTypes";

import styles from "./Legend.module.scss";

export default function Legend({ items, className }) {
  return (
    <div className={cx(styles.legend, className)} data-testid="legend">
      <h2 className={styles.title}>Legend</h2>
      <ul className={styles.legendItems}>
        {items.map((item) => (
          <LegendItem
            className={item.className}
            key={item.typeName}
            label={item.legendLabel}
          />
        ))}
      </ul>
    </div>
  );
}

Legend.defaultProps = {
  items: [],
};

Legend.propTypes = {
  /** Legend's css class */
  className: PropTypes.string,

  /** An array of legend items */
  items: PropTypes.arrayOf(legendItemType),
};

export function LegendItem({ label, className }) {
  return (
    <li className={styles.legendItem}>
      <span
        className={cx(
          className ? className : styles.defaultLegendIcon,
          styles.legendIcon
        )}
      />{" "}
      {label}
    </li>
  );
}

LegendItem.propTypes = {
  ...legendItemTypePropTypes,
};

export function buildLegendItems(dayTypes) {
  const canBeInLegend = ([_, style]) => style.showInLegend && style.legendLabel;
  const sortByWeight = (style, style2) =>
    style.legendWeight - style2.legendWeight;
  const appendTypeName = ([typeName, style]) => ({
    ...style,
    typeName: typeName,
  });

  return Object.entries(dayTypes)
    .filter(canBeInLegend)
    .map(appendTypeName)
    .sort(sortByWeight);
}

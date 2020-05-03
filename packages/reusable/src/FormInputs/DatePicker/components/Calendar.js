import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { addMonths } from "../../../utils/dateUtils";
import { DEFAULT_DAY_TYPES } from "../dayTypes";
import mergeDeep from "../../../utils/mergeDeep";

import Legend, { buildLegendItems } from "./Legend";
import Month from "./Month";

import styles from "./Calendar.module.scss";
import legendStyles from "./Legend.module.scss";

export default function Calendar({
  calendarHelpText,
  isLarge,
  legendOrientation,
  monthNumber,
  onNextMonthClick,
  onPreviousMonthClick,
  showLegend,
  ...props
}) {
  const months = [...Array(monthNumber)];
  const initialMonth =
    props.initialMonth || props.value || props.minDate || new Date();

  const dayTypes = mergeDeep(DEFAULT_DAY_TYPES, props.dayTypes);

  return (
    <div
      className={cx(
        styles.root,
        isLarge && styles.isLarge,
        showLegend && legendOrientation === "h" && styles.hasHorizontalLegend
      )}
      data-testid={cx(
        showLegend && legendOrientation === "v" && "hasVerticalLegend",
        showLegend && legendOrientation === "h" && "hasHorizontalLegend"
      )}
    >
      <div className={styles.monthsWrapper}>
        <div className={cx(styles.months, monthNumber > 2 && styles.asGrid)}>
          {months.map((_, index) => (
            <Month
              key={index}
              {...props}
              dayTypes={dayTypes}
              id={`${props.id}--${index}`}
              initialMonth={
                index > 0 ? addMonths(initialMonth, index) : initialMonth
              }
              onNextMonthClick={onNextMonthClick}
              onPreviousMonthClick={onPreviousMonthClick}
            />
          ))}
        </div>
        {calendarHelpText && (
          <div className={styles.calendarHelpText}>{calendarHelpText}</div>
        )}
      </div>

      {showLegend && (
        <Legend
          className={cx(
            legendOrientation === "v" && legendStyles.isVertical,
            legendOrientation === "h" && legendStyles.isHorizontal
          )}
          items={buildLegendItems(dayTypes)}
        />
      )}
    </div>
  );
}

Calendar.defaultProps = {
  ...Month.defaultProps,
  isLarge: false,
  legendOrientation: "h",
  monthNumber: 1,
  onNextMonthClick: () => {},
  onPreviousMonthClick: () => {},
  showLegend: false,
};

Calendar.propTypes = {
  ...Month.propTypes,

  /** A help text that's displayed below the calendar */
  calendarHelpText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),

  /** Set to true to show enlarged version of calendar */
  isLarge: PropTypes.bool,

  /** Legend orientation. Display legend below calendar (v) or next to calendar (h) */
  legendOrientation: PropTypes.oneOf(["v", "h"]),

  /** Set a number of calendars to be displayed in overlay */
  monthNumber: PropTypes.number,

  /** Function called when the next month button is clicked */
  onNextMonthClick: PropTypes.func,

  /** Function called when the previous month button is clicked */
  onPreviousMonthClick: PropTypes.func,

  /** Set to true to show a legend */
  showLegend: PropTypes.bool,
};

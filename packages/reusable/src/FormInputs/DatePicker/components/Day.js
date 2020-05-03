import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { formatDate } from "../../../utils/dateUtils";
import { dayTypeType } from "../propTypes";

import { DayContent } from "./DayContent";

import styles from "./Day.module.scss";
import { KEY } from "../data";

export default function Day({
  date,
  currentMonth,
  headers,
  onKeyDown,
  onHover,
  onClick,
  dayType,
}) {
  // Show empty cell if day doesn't belong to active month.
  if (currentMonth.getMonth() !== date.getMonth()) {
    return <td />;
  }

  const dayCanBeSelected = !isDayUnavailable(dayType);

  const Component = dayType.Component ? dayType.Component : DayContent;

  function handleClick(e) {
    e.preventDefault();
    dayCanBeSelected && onClick && onClick(date);
  }

  function handleKeyDown(e) {
    if (dayCanBeSelected || e.keyCode !== KEY.ENTER) {
      onKeyDown && onKeyDown(date, e);
    } else {
      e.preventDefault();
    }
  }

  return (
    <td headers={headers} role="gridcell">
      <button
        aria-pressed={isDaySelected(dayType)}
        className={cx(styles.day, dayType.className)}
        data-date={`${formatDate(date)}`}
        data-testid={cx(...dayType.appliedTypes)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(e) => onHover(date, e)}
        tabIndex={isDayFocused(dayType) ? 0 : -1}
      >
        <Component date={date} />
      </button>
    </td>
  );
}

Day.propTypes = {
  /** Current month */
  currentMonth: PropTypes.instanceOf(Date).isRequired,

  /** Day's date value */
  date: PropTypes.instanceOf(Date).isRequired,

  /** An object with day properties */
  dayType: dayTypeType.isRequired,

  /** Headers prop for a day cell */
  headers: PropTypes.string.isRequired,

  /** A function that is called on day cell click */
  onClick: PropTypes.func,

  /** A function that is called on day cell hover */
  onHover: PropTypes.func,

  /** A function that is called on day cell key down */
  onKeyDown: PropTypes.func,
};

const isDay = (typeName) => (dayType) =>
  (dayType.appliedTypes || []).includes(typeName);

const isDayUnavailable = isDay("unavailable");
const isDaySelected = isDay("selected");
const isDayFocused = isDay("focused");

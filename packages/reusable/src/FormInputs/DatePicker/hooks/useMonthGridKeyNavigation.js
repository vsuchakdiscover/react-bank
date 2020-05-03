import { useEffect, useRef, useState } from "react";

import { formatDate, isSameYear } from "../../../utils/dateUtils";
import { getNextDateFromKeyCode } from "../utils";

import { KEY } from "../data";

/**
 * React on keyDown events, selects dates and moves through month grid.
 */
export default function useMonthGridKeyNavigation({
  initialFocusDate,
  switchToNextMonth,
  switchToPreviousMonth,
  onDaySelection,
  onDayKeyDown,
}) {
  const monthGridRef = useRef();
  const [focusDate, setFocusDate] = useState(initialFocusDate);
  useEffect(() => {
    focusOnDayCell(focusDate);
  }, [focusDate]);

  function focusOnDayCell(date) {
    const dayCell =
      monthGridRef.current &&
      monthGridRef.current.querySelector(`[data-date="${formatDate(date)}"]`);
    if (dayCell) {
      dayCell.focus();
    }
  }

  function handleDayKeyDown(date, e) {
    e.persist();
    onDayKeyDown && onDayKeyDown(e);
    if ([KEY.ENTER, KEY.SPACE].includes(e.keyCode)) {
      onDaySelection(date);
    } else if ([KEY.LEFT, KEY.RIGHT, KEY.UP, KEY.DOWN].includes(e.keyCode)) {
      const nextDate = getNextDateFromKeyCode(date, e.keyCode);
      attemptToSwitchMonth(date, nextDate);
      setFocusDate(nextDate);
    }
  }

  function attemptToSwitchMonth(previousDate, nextDate) {
    if (nextDateIsNextMonthOrNextYear(previousDate, nextDate)) {
      switchToNextMonth();
    } else if (nextDateIsPreviousMonthOrPreviousYear(previousDate, nextDate)) {
      switchToPreviousMonth();
    }
  }

  return [monthGridRef, handleDayKeyDown, focusDate, setFocusDate];
}

const nextDateIsNextMonthOrNextYear = (initialDate, nextDate) =>
  (nextDate.getMonth() > initialDate.getMonth() &&
    isSameYear(nextDate, initialDate)) ||
  nextDate.getFullYear() > initialDate.getFullYear();

const nextDateIsPreviousMonthOrPreviousYear = (initialDate, nextDate) =>
  (nextDate.getMonth() < initialDate.getMonth() &&
    isSameYear(nextDate, initialDate)) ||
  nextDate.getFullYear() < initialDate.getFullYear();

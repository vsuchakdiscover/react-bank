/**
  Day types are used to define the style and behavior of a single day cell in the calendar.

  Thanks to dayTypes any day cell style can be easily customized outside of DatePicker component.

  Under the hood, a dayType is just an object properties:

  const defaultDayType = {
      showInLegend: true,
	  legendLabel: "I'm a default label",
	  legendWeight: 3,
      className: "default",
      handler: ({date}) => true,
      Component: DefaultDayComponent
  },
 where
   showInLegend - a flag that shows/hides day type on the calendar legend
   legendLabel - a text shown with a day type in the calendar legend
   legendWeight - order of a day type in a legend
   className - classname for day content and legend icon
   handler -  a callback, if it returns true, current dayType gets applied to a date
   Component - a component used to render a day content in calendar

 There are several standard day types: today, available, selected, inRange,
 focused, due, startDate, endDate, and unavailable.

 When a calendar is displayed, we try to apply every default type against every date
 in the calendar. If dayTypes's handler returns true, we apply that type to the date.
 If any consequent dayType handler also returns true, we merge that type with previously
 applied type. This approach allows us to combine several dayTypes into one.

 The order in which types are applied is defined via `DEFAULT_DAY_TYPES.`
 Any custom dayTypes are applied after `DEFAULT_DAY_TYPES`.

 You can add custom dayTypes or modify default types via `dayTypes` property of
 DatePicker/DateRangePicker components.

 See storybook for more examples:
 http://localhost:9009/?path=/story/forminputs-datepicker--has-a-legend-with-custom-item-added
 */
import {
  formatDate,
  isDateInArray,
  isDateInRange,
  isSameDay,
  isToday,
} from "../../utils/dateUtils";
import styles from "./components/Day.module.scss";
import { DueDateContent } from "./components/DayContent";
import mergeDeep from "../../utils/mergeDeep";

const today = {
  legendLabel: "Today",
  showInLegend: false,
  handler: ({ date }) => isToday(date),
};

const inRange = {
  showInLegend: false,
  className: styles.range,
  handler: ({ date, startDate, endDate }) =>
    startDate &&
    endDate &&
    (isDateInRange(date, startDate, endDate) ||
      isDateInRange(date, endDate, startDate)),
};

const startDate = {
  showInLegend: false,
  className: styles.startDate,
  handler: ({ date, startDate }) => startDate && isSameDay(date, startDate),
};

const endDate = {
  showInLegend: false,
  className: styles.endDate,
  handler: ({ date, endDate }) => endDate && isSameDay(date, endDate),
};

const selected = {
  legendLabel: "Selected Date",
  showInLegend: true,
  legendWeight: 1,
  className: styles.selected,
  handler: ({ date, value }) => value && isSameDay(date, value),
};

const available = {
  legendLabel: "Available Date",
  showInLegend: true,
  legendWeight: 0,
  className: styles.available,
  handler: () => true,
};

const focused = {
  showInLegend: false,
  className: styles.focused,
  handler: ({ date, focusDate }) => focusDate && isSameDay(date, focusDate),
};

const highlighted = {
  showInLegend: false,
  className: styles.range,
  handler: ({ date, hoverDate, startDate, endDate }) => {
    return (
      hoverDate &&
      ((startDate && isDateInRange(date, startDate, hoverDate)) ||
        (endDate && isDateInRange(date, endDate, hoverDate)))
    );
  },
};

const due = {
  legendLabel: "Payment Due Date",
  showInLegend: true,
  legendWeight: 3,
  className: styles.due,
  handler: ({ date, dueDate }) => dueDate && isSameDay(date, dueDate),
  Component: DueDateContent,
};

const unavailable = {
  legendLabel: "Unavailable Date",
  showInLegend: true,
  legendWeight: 2,
  className: styles.unavailable,
  handler: ({ date, unavailableDates, unavailableDays, minDate, maxDate }) => {
    const checks = [
      () =>
        unavailableDates &&
        unavailableDates.length > 0 &&
        isDateInArray(date, unavailableDates),
      () =>
        unavailableDays &&
        unavailableDays.length > 0 &&
        unavailableDays.includes(date.getDay()),
      () => (minDate || maxDate) && !isDateInRange(date, minDate, maxDate),
    ];
    return checks.some((check) => check());
  },
};

export function assignDayTypes(dates, dayTypes, calendarData) {
  return dates.reduce(
    (styles, date) => ({
      ...styles,
      [date]: assignDayType(date, dayTypes, calendarData),
    }),
    {}
  );
}

const assignDayType = (date, dayTypes, calendarData) =>
  Object.entries(dayTypes).reduce((dayType, [typeName, style]) => {
    if (
      style.handler &&
      style.handler({
        date,
        dateString: formatDate(date),
        ...calendarData,
        currentType: dayType,
      })
    ) {
      return mergeDeep(dayType, {
        ...style,
        className: [style.className],
        appliedTypes: [typeName],
      });
    }

    // Replace available style with unavailable.
    if (
      dayType.appliedTypes.includes("unavailable") &&
      dayType.appliedTypes.includes("available")
    ) {
      dayType.appliedTypes.splice(dayType.appliedTypes.indexOf("available"), 1);
    }

    return dayType;
  }, {});

export const DEFAULT_DAY_TYPES = {
  available,
  selected,
  inRange,
  focused,
  highlighted,
  due,
  startDate,
  endDate,
  unavailable,
  today,
};

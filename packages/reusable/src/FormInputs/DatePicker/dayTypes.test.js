import { assignDayTypes, DEFAULT_DAY_TYPES } from "./dayTypes";
import { getMonthDates, isSameDay } from "../../utils/dateUtils";
import mergeDeep from "../../utils/mergeDeep";

describe("assignDayTypes", () => {
  it("should set available dayType for all cells by default", () => {
    const today = new Date(2019, 3, 20);
    const dates = getMonthDates(today);
    const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {});

    Object.values(types).forEach((dayType) => {
      expect(dayType.appliedTypes).toEqual(["available"]);
    });
  });

  it.each`
    parameterName  | value                    | expectedType
    ${"value"}     | ${new Date(2019, 3, 21)} | ${"selected"}
    ${"dueDate"}   | ${new Date(2019, 3, 25)} | ${"due"}
    ${"focusDate"} | ${new Date(2019, 3, 15)} | ${"focused"}
    ${"startDate"} | ${new Date(2019, 3, 10)} | ${"startDate"}
    ${"endDate"}   | ${new Date(2019, 3, 30)} | ${"endDate"}
  `(
    "should set $expectedType dayType for day cell that's $parameterName",
    ({ parameterName, value, expectedType }) => {
      const today = new Date(2019, 3, 20);
      const dates = getMonthDates(today);
      const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
        [parameterName]: value,
      });

      expect(types[value].appliedTypes).toEqual(["available", expectedType]);
    }
  );

  it("should set inRange dayType for all cells that match date range", () => {
    const today = new Date(2019, 3, 20);
    const dates = getMonthDates(today);
    const dayTypes = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
      startDate: new Date(2019, 3, 5),
      endDate: new Date(2019, 3, 10),
    });

    [
      new Date(2019, 3, 6),
      new Date(2019, 3, 7),
      new Date(2019, 3, 8),
      new Date(2019, 3, 9),
    ].forEach((dateInRange) => {
      expect(dayTypes[dateInRange].appliedTypes).toEqual([
        "available",
        "inRange",
      ]);
    });
  });

  it("should set unavailable dayType for day cell that's in unavailableDates", () => {
    const today = new Date(2019, 3, 20);
    const unavailableDates = [new Date(2019, 3, 17), new Date(2019, 3, 1)];
    const dates = getMonthDates(today);
    const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
      unavailableDates,
    });

    unavailableDates.forEach((unavailableDate) => {
      expect(types[unavailableDate].appliedTypes).toEqual(["unavailable"]);
    });
  });

  it("should set unavailable dayType for day cell that's in unavailableDays", () => {
    const today = new Date(2019, 3, 20);
    const unavailableDays = [0, 6];

    const dates = getMonthDates(today);
    const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
      unavailableDays,
    });

    [
      new Date(2019, 3, 6),
      new Date(2019, 3, 7),
      new Date(2019, 3, 13),
      new Date(2019, 3, 14),
      new Date(2019, 3, 20),
      new Date(2019, 3, 21),
      new Date(2019, 3, 27),
      new Date(2019, 3, 28),
    ].forEach((date) => {
      expect(types[date].appliedTypes).toEqual(["unavailable"]);
    });
  });

  it("should set unavailable dayType for day cell that's less than minDate", () => {
    const today = new Date(2019, 3, 20);
    const minDate = new Date(2019, 3, 4);
    const dates = getMonthDates(today);
    const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
      minDate,
    });

    [new Date(2019, 3, 1), new Date(2019, 3, 2), new Date(2019, 3, 3)].forEach(
      (dateLessThanMindate) => {
        expect(types[dateLessThanMindate].appliedTypes).toEqual([
          "unavailable",
        ]);
      }
    );
  });

  it("should set unavailable dayType for day cell that's greater than maxDate", () => {
    const today = new Date(2019, 3, 20);
    const maxDate = new Date(2019, 3, 27);
    const dates = getMonthDates(today);
    const types = assignDayTypes(dates, DEFAULT_DAY_TYPES, {
      maxDate,
    });

    [
      new Date(2019, 3, 28),
      new Date(2019, 3, 29),
      new Date(2019, 3, 30),
    ].forEach((dateGreaterThanMaxdate) => {
      expect(types[dateGreaterThanMaxdate].appliedTypes).toEqual([
        "unavailable",
      ]);
    });
  });

  it("should override dayType properties with custom type", () => {
    const today = new Date(2019, 3, 20);
    const dates = getMonthDates(today);
    const customDate = new Date(2019, 3, 10);
    const CUSTOM_DAY_TYPES = {
      customName: {
        showInLegend: false,
        legendLabel: "Custom type",
        legendWeight: -100,
        className: "customGreen",
        handler: ({ date }) => isSameDay(date, customDate),
      },
    };

    const types = assignDayTypes(
      dates,
      mergeDeep(DEFAULT_DAY_TYPES, CUSTOM_DAY_TYPES),
      {
        value: customDate,
      }
    );

    const customDayType = types[customDate];

    expect(customDayType.showInLegend).toBe(false);
    expect(customDayType.legendLabel).toBe("Custom type");
    expect(customDayType.legendWeight).toBe(-100);
    expect(customDayType.className).toEqual([
      "available",
      "selected",
      "customGreen",
    ]);
  });
});

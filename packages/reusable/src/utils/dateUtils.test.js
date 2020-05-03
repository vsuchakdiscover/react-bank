import {
  convertToDateObjects,
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  getFirstWeekDayOfMonth,
  getNextMonthFirstDay,
  getPreviousMonthFirstDay,
  isDateInRange,
  isDateStringInRange,
  isSameDay,
  isToday,
  isValidDateObject,
  isValidDateString,
  parseDateString,
  getNextBusinessDay,
  getNextNonHoliday,
} from "./dateUtils";

describe("getNextBusinessDay", () => {
  it("should return Dec 9 when passed JS date of 12/7/2019 (since 12/7 is a Saturday)", () => {
    const date = new Date(2019, 11, 7);
    const businessHolidays = ["2020-01-01"];
    const nextBizDay = getNextBusinessDay(businessHolidays, date);
    expect(nextBizDay).toEqual("2019-12-09");
  });

  it("should return Dec 9 when passed JS date of 12/8/2019 (since 12/8 is a Sunday)", () => {
    const date = new Date(2019, 11, 8);
    const businessHolidays = ["2020-01-01"];
    const nextBizDay = getNextBusinessDay(businessHolidays, date);
    expect(nextBizDay).toEqual("2019-12-09");
  });

  it("should return Jan 2 when passed JS date of 1/1/2020", () => {
    const date = new Date(2020, 0, 1);
    const businessHolidays = ["2020-01-01"];
    const nextBizDay = getNextBusinessDay(businessHolidays, date);
    expect(nextBizDay).toEqual("2020-01-02");
  });
});

describe("getNextNonBankHoliday", () => {
  it("should return Jan 2 when passed JS date of 1/1/2020", () => {
    const date = new Date(2020, 0, 1);
    const businessHolidays = [
      "2020-01-01",
      "2020-01-20",
      "2020-02-17",
      "2020-05-25",
      "2020-07-03",
    ];
    const nextNonHoliday = getNextNonHoliday(businessHolidays, date);
    expect(nextNonHoliday).toEqual("2020-01-02");
  });
});

describe("isValidDateObject", () => {
  it("should detect if passed object is Date", () => {
    expect(isValidDateObject("asd")).toBe(false);
    expect(isValidDateObject("11/01/2019")).toBe(false);
    expect(isValidDateObject(new Date())).toBe(true);
    expect(isValidDateObject(new Date("11/01/2019"))).toBe(true);
  });
});

describe("getMonthNumberOfDays", () => {
  it("should return days in a month", () => {
    expect(getDaysInMonth(new Date(2019, 0))).toBe(31);
    expect(getDaysInMonth(new Date(2019, 1))).toBe(28);
    expect(getDaysInMonth(new Date(2019, 2))).toBe(31);
    expect(getDaysInMonth(new Date(2019, 3))).toBe(30);
    expect(getDaysInMonth(new Date(2019, 4))).toBe(31);
    expect(getDaysInMonth(new Date(2019, 5))).toBe(30);
    expect(getDaysInMonth(new Date(2019, 6))).toBe(31);
    expect(getDaysInMonth(new Date(2019, 7))).toBe(31);
    expect(getDaysInMonth(new Date(2019, 8))).toBe(30);
    expect(getDaysInMonth(new Date(2019, 9), 2019)).toBe(31);
    expect(getDaysInMonth(new Date(2019, 10))).toBe(30);
    expect(getDaysInMonth(new Date(2019, 11), 2019)).toBe(31);
    expect(getDaysInMonth(new Date(2020, 1))).toBe(29);
    expect(getDaysInMonth(new Date(2021, 1))).toBe(28);
    expect(getDaysInMonth(new Date(2024, 1))).toBe(29);
    expect(getDaysInMonth(new Date(2028, 1))).toBe(29);
  });
});

describe("getMonthFirstWeekDay", () => {
  it("should return first week day index of a month", () => {
    expect(getFirstWeekDayOfMonth(new Date(2019, 7, 1))).toBe(5); // 5 == Thursday
    expect(getFirstWeekDayOfMonth(new Date(2019, 0, 1))).toBe(3); // 3 == Tuesday
    expect(getFirstWeekDayOfMonth(new Date(2020, 2, 5))).toBe(1); // 1 == Sunday
  });
});

it("getPreviousMonthFirstDay", () => {
  expect(getPreviousMonthFirstDay(new Date(2019, 0, 15))).toStrictEqual(
    new Date(2018, 11, 1)
  );
  expect(getPreviousMonthFirstDay(new Date(2019, 7, 10))).toStrictEqual(
    new Date(2019, 6, 1)
  );
  expect(getPreviousMonthFirstDay(new Date(2019, 11, 5))).toStrictEqual(
    new Date(2019, 10, 1)
  );
});

describe("getNextMonthFirstDay", () => {
  it("should return next day of month when date is provided", () => {
    expect(getNextMonthFirstDay(new Date(2019, 0, 4))).toStrictEqual(
      new Date(2019, 1, 1)
    );
    expect(getNextMonthFirstDay(new Date(2019, 7, 1))).toStrictEqual(
      new Date(2019, 8, 1)
    );
    expect(getNextMonthFirstDay(new Date(2019, 11, 10))).toStrictEqual(
      new Date(2020, 0, 1)
    );
  });
});

describe("isSameDay", () => {
  it("should return false when two dates aren't same day", () => {
    expect(isSameDay(new Date("2015-01-12"), new Date("2015-01-11"))).toBe(
      false
    );
  });
  it("should return true when two dates are same day", () => {
    expect(isSameDay(new Date("2105-02-23"), new Date("2105-02-23"))).toBe(
      true
    );
  });
});

describe("isToday", () => {
  it("should return false when date is not today", () => {
    expect(isToday(new Date("2015-01-12"))).toBe(false);
    expect(isToday(new Date("2105-02-23"))).toBe(false);
  });
  it("should return true when date is today", () => {
    expect(isToday(new Date())).toBe(true);
  });
});

describe("getFirstDayOfMonth", () => {
  it("should return first day of month when date is not today", () => {
    expect(getFirstDayOfMonth(new Date(2019, 3, 20))).toStrictEqual(
      new Date(2019, 3, 1)
    );
  });
});

describe("isDateInRange", () => {
  it("should return true when date fits a range of two dates", () => {
    expect(
      isDateInRange(
        new Date("2019-04-20"),
        new Date("2000-01-15"),
        new Date("2020-05-20")
      )
    ).toBe(true);
  });

  it("should return true when date is less or equal than minDate", () => {
    expect(isDateInRange(new Date("2003-05-15"), new Date("2000-01-15"))).toBe(
      true
    );
    expect(isDateInRange(new Date("2003-05-15"), new Date("2003-05-15"))).toBe(
      true
    );
  });

  it("should return true when date is greater or equal to maxDate", () => {
    expect(
      isDateInRange(new Date("2003-05-15"), null, new Date("2003-05-16"))
    ).toBe(true);
    expect(
      isDateInRange(new Date("2003-05-15"), null, new Date("2003-05-15"))
    ).toBe(true);
  });

  it("should return false when date doesn't fit range of two dates", () => {
    expect(
      isDateInRange(
        new Date("2008-04-20"),
        new Date("2010-01-15"),
        new Date("2020-05-20")
      )
    ).toBe(false);
  });

  it("should return false when date is greater than minDate", () => {
    expect(isDateInRange(new Date("1990-05-15"), new Date("2000-01-15"))).toBe(
      false
    );
  });

  it("should return false when date is greater than maxDate", () => {
    expect(
      isDateInRange(new Date("2005-05-15"), null, new Date("2003-05-16"))
    ).toBe(false);
  });
});

describe("isDateStringInRange", () => {
  it("should return true when date fits a range of two dates", () => {
    expect(isDateStringInRange("2019-04-20", "2000-01-15", "2020-05-20")).toBe(
      true
    );
  });

  it("should return true when date is less or equal than minDate", () => {
    expect(isDateStringInRange("2003-05-15", "2000-01-15")).toBe(true);
    expect(isDateStringInRange("2003-05-15", "2003-05-15")).toBe(true);
  });

  it("should return true when date is greater or equal to maxDate", () => {
    expect(isDateStringInRange("2003-05-15", null, "2003-05-16")).toBe(true);
    expect(isDateStringInRange("2003-05-15", null, "2003-05-15")).toBe(true);
  });

  it("should return false when date doesn't fit range of two dates", () => {
    expect(isDateStringInRange("2008-04-20", "2010-01-15", "2020-05-20")).toBe(
      false
    );
  });

  it("should return false when date is greater than minDate", () => {
    expect(isDateStringInRange("1990-05-15", "2000-01-15")).toBe(false);
  });

  it("should return false when date is greater than maxDate", () => {
    expect(isDateStringInRange("2005-05-15", null, "2003-05-16")).toBe(false);
  });
});

describe("formatDate", () => {
  it.each`
    date                      | dateString
    ${new Date(2019, 3, 20)}  | ${"04/20/2019"}
    ${new Date(2010, 11, 10)} | ${"12/10/2010"}
    ${new Date(2000, 1, 29)}  | ${"02/29/2000"}
  `("should convert date to MM/DD/YYYY", ({ date, dateString }) => {
    expect(formatDate(date, "MM/DD/YYYY")).toBe(dateString);
  });

  it.each`
    date                      | dateString
    ${new Date(2019, 3, 20)}  | ${"20/04/2019"}
    ${new Date(2010, 11, 10)} | ${"10/12/2010"}
    ${new Date(2000, 1, 29)}  | ${"29/02/2000"}
  `("should convert date to DD/MM/YYYY", ({ date, dateString }) => {
    expect(formatDate(date, "DD/MM/YYYY")).toBe(dateString);
  });

  it.each`
    date                      | dateString
    ${new Date(2019, 3, 20)}  | ${"2019-04-20"}
    ${new Date(2010, 11, 10)} | ${"2010-12-10"}
    ${new Date(2000, 1, 29)}  | ${"2000-02-29"}
  `("should convert date to YYYY-MM-DD", ({ date, dateString }) => {
    expect(formatDate(date, "YYYY-MM-DD")).toBe(dateString);
  });
});

describe("parseDate", () => {
  it.each`
    dateString      | date
    ${"04/20/2019"} | ${new Date(2019, 3, 20)}
    ${"12/10/2010"} | ${new Date(2010, 11, 10)}
    ${"02/29/2000"} | ${new Date(2000, 1, 29)}
  `("should parse date from MM/DD/YYYY string", ({ dateString, date }) => {
    expect(parseDateString(dateString, "MM/DD/YYYY")).toStrictEqual(date);
  });

  it.each`
    dateString      | date
    ${"20/04/2019"} | ${new Date(2019, 3, 20)}
    ${"10/12/2010"} | ${new Date(2010, 11, 10)}
    ${"29/02/2000"} | ${new Date(2000, 1, 29)}
  `("should parse date from DD/MM/YYYY string", ({ dateString, date }) => {
    expect(parseDateString(dateString, "DD/MM/YYYY")).toStrictEqual(date);
  });

  it.each`
    dateString      | date
    ${"2019-04-20"} | ${new Date(2019, 3, 20)}
    ${"2010-12-10"} | ${new Date(2010, 11, 10)}
    ${"2000-02-29"} | ${new Date(2000, 1, 29)}
  `("should parse date from YYYY-MM-DD string", ({ dateString, date }) => {
    expect(parseDateString(dateString, "YYYY-MM-DD")).toStrictEqual(date);
  });
});

describe("convertToDateObjects", () => {
  it("should convert arrays of date strings into arrays of Date objects", () => {
    expect(
      convertToDateObjects(
        ["2019-04-20", "2010-01-01", "2015-03-15"],
        ["2010-10-15"]
      )
    ).toStrictEqual([
      [new Date(2019, 3, 20), new Date(2010, 0, 1), new Date(2015, 2, 15)],
      [new Date(2010, 9, 15)],
    ]);
  });
});

describe("isValidDateString", () => {
  it.each`
    dateString       | dateFormat      | validationResult
    ${"2019-04-20"}  | ${"YYYY-MM-DD"} | ${true}
    ${"201-04-20"}   | ${"YYYY-MM-DD"} | ${true}
    ${"19-04-20"}    | ${"YYYY-MM-DD"} | ${true}
    ${"2019-4-12"}   | ${"YYYY-MM-DD"} | ${false}
    ${"2019-4-"}     | ${"YYYY-MM-DD"} | ${false}
    ${"random text"} | ${"YYYY-MM-DD"} | ${false}
    ${"04/20/2019"}  | ${"DD/MM/YYYY"} | ${true}
    ${"4/20/2019"}   | ${"DD/MM/YYYY"} | ${true}
    ${"3/5/2019"}    | ${"DD/MM/YYYY"} | ${true}
    ${"3/5/201"}     | ${"DD/MM/YYYY"} | ${true}
    ${"3/5/20"}      | ${"DD/MM/YYYY"} | ${true}
    ${"random text"} | ${"MM/DD/YYYY"} | ${false}
    ${"20/04/2019"}  | ${"MM/DD/YYYY"} | ${true}
    ${"20/4/2019"}   | ${"MM/DD/YYYY"} | ${true}
    ${"5/3/2019"}    | ${"MM/DD/YYYY"} | ${true}
    ${"5/3/201"}     | ${"MM/DD/YYYY"} | ${true}
    ${"5/3/20"}      | ${"MM/DD/YYYY"} | ${true}
    ${"random text"} | ${"MM/DD/YYYY"} | ${false}
  `(
    "should parse $dateString from $dateFormat string",
    ({ dateString, dateFormat, validationResult }) => {
      expect(isValidDateString(dateString, dateFormat)).toBe(validationResult);
    }
  );
});

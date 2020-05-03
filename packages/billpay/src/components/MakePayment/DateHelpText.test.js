import { getFrequencyHelpText } from "./DateHelpText";

describe("DateHelpText", () => {
  describe("Monthly", () => {
    it("should return 'Payments will be delivered each month by the 4th' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_A_MONTH", "2020-01-28")).toEqual(
        "Payments will be delivered each month by the 28th."
      );
    });

    it("should return 'Payments will be delivered each month by the 1st' when passed 2020-01-01", () => {
      expect(getFrequencyHelpText("ONCE_A_MONTH", "2020-01-01")).toEqual(
        "Payments will be delivered each month by the 1st."
      );
    });
  });

  describe("Weekly", () => {
    it("should return 'Payments will be delivered each week by Tuesday' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_A_WEEK", "2020-01-28")).toEqual(
        "Payments will be delivered each week by Tuesday."
      );
    });
  });

  describe("Every 2 Weeks", () => {
    it("should return 'Payments will be delivered every other week by Tuesday' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_IN_2_WEEKS", "2020-01-28")).toEqual(
        "Payments will be delivered every other week by Tuesday."
      );
    });
  });

  describe("Every 2 Months", () => {
    it("should return 'Payments will be delivered every 2 months by the 28th' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_IN_2_MONTHS", "2020-01-28")).toEqual(
        "Payments will be delivered every 2 months by the 28th."
      );
    });
  });

  describe("Every 3 Months", () => {
    it("should return 'Payments will be delivered every 3 months by the 28th' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_IN_3_MONTHS", "2020-01-28")).toEqual(
        "Payments will be delivered every 3 months by the 28th."
      );
    });
  });

  describe("Every 6 Months", () => {
    it("should return 'Payments will be delivered every 6 months by the 28th' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_IN_6_MONTHS", "2020-01-28")).toEqual(
        "Payments will be delivered every 6 months by the 28th."
      );
    });
  });

  describe("Twice Every Month", () => {
    it("should return empty string", () => {
      expect(getFrequencyHelpText("TWICE_A_MONTH", "2020-01-28")).toEqual("");
    });
  });

  describe("Yearly", () => {
    it("should return 'Payments will be delivered every year by January 28th' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_A_YEAR", "2020-01-28")).toEqual(
        "Payments will be delivered every year by January 28th."
      );
    });
  });

  describe("Every 4 Weeks", () => {
    it("should return 'Payments will be delivered every 4 weeks by Tuesday' when passed 2020-01-28", () => {
      expect(getFrequencyHelpText("ONCE_IN_4_WEEKS", "2020-01-28")).toEqual(
        "Payments will be delivered every 4 weeks by Tuesday."
      );
    });
  });
});

import {
  lastFour,
  sentenceCase,
  nickNameWithLastFour,
  formatZip,
} from "./formattingUtils";

describe("lastFour", () => {
  it("should accept a number and return last 4 digits as a string", () => {
    expect(lastFour(12345678)).toEqual("5678");
  });

  it("should accept a string and return last 4 digits as a string", () => {
    expect(lastFour("12345678")).toEqual("5678");
  });

  it("should return 3 digits if only passed 3 digits", () => {
    expect(lastFour("123")).toEqual("123");
  });
});

describe("sentenceCase", () => {
  it("should convert firstName to First Name", () => {
    expect(sentenceCase("firstName")).toEqual("First Name");
  });
});

describe("nickNameWithLastFour", () => {
  it("should return AT&T (1234) when passed account.nickName as AT&T and account.accountNumber as 12345678", () => {
    const account = {
      nickName: "AT&T",
      accountNumber: 12345678,
    };

    expect(nickNameWithLastFour(account)).toEqual("AT&T (5678)");
  });

  it("should omit the account number and parens when account number is empty", () => {
    const account = {
      nickName: "AT&T",
      accountNumber: null,
    };

    expect(nickNameWithLastFour(account)).toEqual("AT&T");
  });
});

describe("formatZip", () => {
  it("should return a 5 digit string untouched", () => {
    expect(formatZip("12345")).toEqual("12345");
  });

  it("should return a formatted 9-digit string when passed a 9-digit string", () => {
    expect(formatZip("123456789")).toEqual("12345-6789");
  });

  it("should return a 5 digit number unchanged, as a string", () => {
    expect(formatZip(12345)).toEqual("12345");
  });

  it("should return a 9-digit number as a formatted string", () => {
    expect(formatZip(123456789)).toEqual("12345-6789");
  });
});

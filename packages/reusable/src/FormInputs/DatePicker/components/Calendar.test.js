import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Calendar from "./Month";

import { formatDate } from "../../../utils/dateUtils";
import { fireEvent, render } from "@testing-library/react";
import { KEY } from "../data";

describe("Header", () => {
  it("should hide header when headerIsHidden prop set to true", () => {
    const { queryByTestId } = render(<Calendar headerIsHidden />);
    expect(queryByTestId(/header/i)).toBeNull();
  });

  it("should hide month pagination when monthPaginationIsHidden prop is set to true", () => {
    const { queryByTestId } = render(<Calendar monthPaginationIsHidden />);
    expect(queryByTestId(/previous/i)).toBeNull();
    expect(queryByTestId(/next/i)).toBeNull();
  });

  it("should switch to next month when next arrow is clicked", () => {
    const { getByLabelText, getByText } = render(
      <Calendar value={new Date(2019, 3, 20)} />
    );

    fireEvent.click(getByLabelText("next month"));
    getByText("May 2019");
  });

  it("should switch to previous month when previous arrow is clicked", () => {
    const { getByLabelText, getByText } = render(
      <Calendar value={new Date(2019, 3, 20)} />
    );

    fireEvent.click(getByLabelText("previous month"));
    getByText("March 2019");
  });
});

describe("Month", () => {
  it("should open calendar on a month of the provided value", () => {
    const { getByTestId } = render(<Calendar value={new Date(2019, 3, 20)} />);
    expect(getByTestId(/monthname/i).textContent).toBe("April 2019");
  });

  it("should open calendar on a month of the initialMonth prop value", () => {
    const { getByTestId } = render(
      <Calendar
        initialMonth={new Date(2019, 3, 20)}
        value={new Date(2020, 1, 1)}
      />
    );

    expect(getByTestId(/monthname/i).textContent).toBe("April 2019");
  });

  it("should open calendar on a current month when no value and initial month are set", () => {
    const date = new Date();
    const { getByTestId } = render(<Calendar />);

    expect(getByTestId(/monthname/i).textContent).toBe(
      `${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`
    );
  });
});

describe("Calendar -> grid", () => {
  it("should highlight current day as today when no value is provided", () => {
    const date = new Date();
    const { getByTestId } = render(<Calendar />);
    expect(getByTestId(/today/).textContent).toBe(date.getDate().toString());
  });

  it("should highlight day as current when value is provided", () => {
    const { getByTestId } = render(<Calendar value={new Date(2019, 3, 20)} />);
    expect(getByTestId(/selected/).textContent).toBe("20");
  });

  it("should show days as unavailable when unavailableDates are provided", () => {
    const { getByTestId } = render(
      <Calendar
        unavailableDates={[new Date(2019, 3, 25)]}
        value={new Date(2019, 3, 20)}
      />
    );

    expect(getByTestId(/unavailable/).textContent).toBe("25");
  });
});

describe("Day clicks", () => {
  it("should highlight day as current when it's clicked", () => {
    const { getByTestId, getByText } = render(
      <ValueTestWrapper value={new Date(2019, 3, 20)}>
        {(props) => <Calendar {...props} />}
      </ValueTestWrapper>
    );

    fireEvent.click(getByText("25"));
    expect(getByTestId(/selected/).textContent).toBe("25");
  });

  it("should not change current day when unavailable day is clicked", () => {
    let value;
    const onChange = (v) => (value = v);

    const unavailableDates = [new Date(2019, 3, 19), new Date(2019, 3, 25)];

    const { getByTestId, getByText } = render(
      <ValueTestWrapper onChange={onChange} value={new Date(2019, 3, 20)}>
        {(props) => <Calendar {...props} unavailableDates={unavailableDates} />}
      </ValueTestWrapper>
    );

    fireEvent.click(getByText("25"));
    expect(getByTestId(/selected/).textContent).toBe("20");

    expect(formatDate(value)).toBe("2019-04-20");
  });
});

describe("Ranges", () => {
  it("should display correct range when two new dates selected", () => {
    let state = {};
    const onChange = (args) => {
      state = { ...args };
    };

    const { getByTestId, getByText } = render(
      <RangeValueTestWrapper
        {...state}
        onChange={onChange}
        value={new Date(2019, 3, 3)}
      >
        {(props) => <Calendar {...props} />}
      </RangeValueTestWrapper>
    );

    fireEvent.click(getByText("4"));
    fireEvent.click(getByText("20"));

    expect(getByTestId(/startDate/i).textContent).toBe("4");
    expect(getByTestId(/endDate/i).textContent).toBe("20");
  });

  it("should display correct range when start and end date selected", () => {
    let state = {};
    const onChange = (args) => {
      state = { ...args };
    };

    const { getByTestId, getByText } = render(
      <RangeValueTestWrapper
        {...state}
        onChange={onChange}
        value={new Date(2019, 3, 3)}
      >
        {(props) => <Calendar {...props} />}
      </RangeValueTestWrapper>
    );

    fireEvent.click(getByText("3"));
    fireEvent.click(getByText("20"));

    expect(getByTestId(/startDate/i).textContent).toBe("3");
    expect(getByTestId(/endDate/i).textContent).toBe("20");
  });

  it("should display correct range when end date is earlier than start date", () => {
    let state = {};
    const onChange = (args) => {
      state = { ...args };
    };

    const { getByTestId, getByText } = render(
      <RangeValueTestWrapper
        {...state}
        onChange={onChange}
        value={new Date(2019, 3, 3)}
      >
        {(props) => <Calendar {...props} />}
      </RangeValueTestWrapper>
    );

    fireEvent.click(getByText("25"));
    fireEvent.click(getByText("1"));

    expect(getByTestId(/startDate/i).textContent).toBe("25");
    expect(getByTestId(/endDate/i).textContent).toBe("1");
  });

  it("should be able to pick end date from another calendar month", () => {
    let state = {};
    const onChange = (args) => {
      state = { ...args };
    };

    const { getByTestId, getByLabelText, getByText } = render(
      <RangeValueTestWrapper
        {...state}
        onChange={onChange}
        value={new Date(2019, 3, 3)}
      >
        {(props) => <Calendar {...props} />}
      </RangeValueTestWrapper>
    );

    fireEvent.click(getByText("3"));
    fireEvent.click(getByLabelText("next month"));
    fireEvent.click(getByLabelText("next month"));
    fireEvent.click(getByText("19"));

    expect(getByTestId(/endDate/i).textContent).toBe("19");
  });
});

describe("Keys", () => {
  it.each`
    keyCode      | date                      | expectedDay
    ${KEY.RIGHT} | ${new Date(2019, 7, 20)}  | ${"21"}
    ${KEY.RIGHT} | ${new Date(2019, 7, 31)}  | ${"1"}
    ${KEY.RIGHT} | ${new Date(2020, 11, 31)} | ${"1"}
    ${KEY.RIGHT} | ${new Date(2024, 1, 28)}  | ${"29"}
    ${KEY.RIGHT} | ${new Date(2024, 1, 29)}  | ${"1"}
    ${KEY.LEFT}  | ${new Date(2019, 7, 20)}  | ${"19"}
    ${KEY.LEFT}  | ${new Date(2019, 7, 1)}   | ${"31"}
    ${KEY.LEFT}  | ${new Date(2020, 0, 1)}   | ${"31"}
    ${KEY.LEFT}  | ${new Date(2024, 1, 29)}  | ${"28"}
    ${KEY.LEFT}  | ${new Date(2020, 2, 1)}   | ${"29"}
    ${KEY.UP}    | ${new Date(2019, 7, 20)}  | ${"13"}
    ${KEY.UP}    | ${new Date(2019, 7, 1)}   | ${"25"}
    ${KEY.UP}    | ${new Date(2021, 0, 1)}   | ${"25"}
    ${KEY.UP}    | ${new Date(2024, 1, 29)}  | ${"22"}
    ${KEY.UP}    | ${new Date(2024, 2, 1)}   | ${"23"}
    ${KEY.DOWN}  | ${new Date(2019, 7, 20)}  | ${"27"}
    ${KEY.DOWN}  | ${new Date(2019, 2, 25)}  | ${"1"}
    ${KEY.DOWN}  | ${new Date(2019, 11, 25)} | ${"1"}
    ${KEY.DOWN}  | ${new Date(2024, 1, 22)}  | ${"29"}
    ${KEY.DOWN}  | ${new Date(2024, 1, 23)}  | ${"1"}
  `(
    "should navigate to $expectedDay when pressing key '$keyCode'",
    ({ keyCode, date, expectedDay }) => {
      const { getByTestId } = render(<Calendar value={date} />);
      fireEvent.keyDown(getByTestId(/focused/), {
        keyCode,
      });
      expect(getByTestId(/focused/).textContent).toBe(expectedDay);
    }
  );

  it("should call onChange handler when presssing ENTER", () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <Calendar onChange={onChange} value={new Date(2019, 7, 5)} />
    );

    fireEvent.keyDown(getByTestId(/focused/), {
      keyCode: KEY.RIGHT,
    });

    fireEvent.keyDown(getByTestId(/focused/), { keyCode: KEY.ENTER });

    expect(onChange).toHaveBeenCalledWith(new Date(2019, 7, 6));
  });

  it("should call onChange handler when presssing SPACE", () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <Calendar onChange={onChange} value={new Date(2019, 7, 10)} />
    );

    fireEvent.keyDown(getByTestId(/focused/), {
      keyCode: KEY.RIGHT,
    });

    fireEvent.keyDown(getByTestId(/focused/), { keyCode: KEY.SPACE });

    expect(onChange).toHaveBeenCalledWith(new Date(2019, 7, 11));
  });
});

const ValueTestWrapper = ({ value, onChange, children }) => {
  const [inputValue, setInputValue] = useState(value);

  function handleChange(value) {
    if (inputValue && value === inputValue) {
      value = null;
    }
    setInputValue(value);
  }

  useEffect(() => {
    onChange && onChange(inputValue);
  }, [inputValue, onChange]);

  return <>{children({ value: inputValue, onChange: handleChange })}</>;
};

ValueTestWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date),
};

const RangeValueTestWrapper = ({
  value,
  startDate,
  endDate,
  onChange,
  children,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [startDateValue, setStartDateValue] = useState(startDate);
  const [endDateValue, setEndDateValue] = useState(endDate);
  const [valueSetter, setNextValueSetter] = useState(() => setStartDateValue);

  function handleChange(value) {
    valueSetter(value);

    setNextValueSetter(() =>
      valueSetter === setStartDateValue ? setEndDateValue : setStartDateValue
    );

    setInputValue(value);
  }

  useEffect(() => {
    onChange &&
      onChange({
        value: inputValue,
        startDate: startDateValue,
        endDate: endDateValue,
      });
  }, [inputValue, startDateValue, endDateValue, onChange]);

  return (
    <>
      {children({
        value: inputValue,
        startDate: startDateValue,
        endDate: endDateValue,
        onChange: handleChange,
      })}
    </>
  );
};

RangeValueTestWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  endDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  value: PropTypes.instanceOf(Date),
};

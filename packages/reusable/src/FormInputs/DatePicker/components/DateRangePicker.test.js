import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DateRangePicker from "./DateRangePicker";

describe("DateRangePicker", () => {
  it("should render without any props provided", () => {
    render(<DateRangePicker id="date" name="date" />);
  });

  it("should display custom start and end labels when provided", () => {
    const { getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
      />
    );

    getByLabelText(/^start/i);
    getByLabelText(/^end/i);
  });

  it("should show overlay when start date is clicked", () => {
    const { getByLabelText, getByText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
      />
    );

    fireEvent.click(getByLabelText(/open start input calendar/i));

    expect(getByText("Su")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
  });

  it("should show overlay when end date is clicked", () => {
    const { getByText, getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
      />
    );

    fireEvent.click(getByLabelText(/open end input calendar/i));

    expect(getByText("Su")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
  });

  it("should show overlay when start date and end date are clicked sequentially", () => {
    const { getByText, getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
      />
    );

    fireEvent.click(getByLabelText(/open start input calendar/i));
    fireEvent.click(getByLabelText(/open end input calendar/i));

    expect(getByText("Su")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
  });

  it("show overlay when start date is selected", () => {
    const { getByLabelText, getByText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
        value="2019-08-20"
      />
    );

    fireEvent.click(getByLabelText(/open start input calendar/i));
    fireEvent.click(getByText("23"));

    expect(getByText("Su")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
  });

  it("should hide overlay when end date is selected", () => {
    const { getByText, queryByText, getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        startLabel="Start"
        value="2019-08-20"
      />
    );

    fireEvent.click(getByLabelText(/open end input calendar/i));
    expect(getByText("Su")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();

    fireEvent.click(getByText("23"));

    expect(queryByText("Su")).toBeNull();
    expect(queryByText("25")).toBeNull();
  });

  it("should call onChange and onChange2 when values are selected via calendar", () => {
    const handleStartChange = jest.fn();
    const handleEndChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        onChange={handleStartChange}
        onChange2={handleEndChange}
        startLabel="Start"
        value="2019-08-20"
      />
    );

    fireEvent.click(getByLabelText(/open start input calendar/i));
    fireEvent.click(getByText("15"));
    fireEvent.click(getByText("23"));

    expect(handleStartChange).toHaveBeenCalledWith({
      target: { name: "date", value: "2019-08-15" },
    });
    expect(handleEndChange).toHaveBeenCalledWith({
      target: { name: "date", value: "2019-08-23" },
    });
  });

  it("should call onChange and onChange2 when values are provided via input", () => {
    const handleStartChange = jest.fn();
    const handleEndChange = jest.fn();
    const { getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        onChange={handleStartChange}
        onChange2={handleEndChange}
        startLabel="Start"
        value="2019-08-20"
      />
    );

    fireEvent.change(getByLabelText(/^start/i), {
      target: { value: "08/15/2019" },
    });
    fireEvent.blur(getByLabelText(/^start/i));

    fireEvent.change(getByLabelText(/^end/i), {
      target: { value: "08/23/2019" },
    });
    fireEvent.blur(getByLabelText(/^end/i));

    expect(handleStartChange).toHaveBeenCalledWith({
      target: { name: "date", value: "2019-08-15" },
    });
    expect(handleEndChange).toHaveBeenCalledWith({
      target: { name: "date", value: "2019-08-23" },
    });
  });

  it("should call onBlur when a user leaves the first input field", () => {
    const onBlur = jest.fn();
    const { getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        onBlur={onBlur}
        startLabel="Start"
      />
    );

    fireEvent.blur(getByLabelText(/^start/i));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("should call onBlur when a user leaves the second input field", () => {
    const onBlur = jest.fn();
    const { getByLabelText } = render(
      <DateRangePicker
        endLabel="End"
        id="date"
        name="date"
        onBlur2={onBlur}
        startLabel="Start"
      />
    );

    fireEvent.blur(getByLabelText(/^end/i));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

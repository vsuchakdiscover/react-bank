import React from "react";
import { fireEvent, render, wait } from "@testing-library/react";
import DatePicker from "./DatePicker";
import BankHolidaysProvider from "./BankHolidaysProvider";

async function getBankHolidays(year) {
  return {
    data: [
      "2020-01-01",
      "2020-01-20",
      "2020-02-17",
      "2020-05-25",
      "2020-07-04",
      "2020-09-07",
      "2020-10-12",
      "2020-11-11",
      "2020-11-26",
      "2020-12-25",
    ].map((d) => d.replace("2020", year)),
  };
}

describe("DatePicker", () => {
  it("should render without any props provided", () => {
    render(<DatePicker id="date" name="date" />);
  });

  describe("Input", () => {
    it("should set focus correctly", () => {
      const onFocusSpy = jest.fn();
      render(
        <DatePicker id="date" isFocused name="date" onFocus={onFocusSpy} />
      );
      expect(onFocusSpy).toHaveBeenCalled();
    });

    it("should display date in MM/DD/YYYY format by default", () => {
      const { getByLabelText } = render(
        <DatePicker id="date" label="Date" name="date" value="2019-04-20" />
      );
      expect(getByLabelText(/^date/i).value).toBe("04/20/2019");
    });

    it.each`
      format          | expectedValue
      ${"MM/DD/YYYY"} | ${"04/20/2019"}
      ${"DD/MM/YYYY"} | ${"20/04/2019"}
      ${"YYYY-MM-DD"} | ${"2019-04-20"}
    `(
      "should display date as $expectedValue when format is $format",
      ({ format, expectedValue }) => {
        const { getByLabelText } = render(
          <DatePicker
            dateFormat={format}
            id="date"
            label="Date"
            name="date"
            value="2019-04-20"
          />
        );
        expect(getByLabelText(/^date/i).value).toBe(expectedValue);
      }
    );

    it("should call onBlur when a user leaves the input field", () => {
      const onBlur = jest.fn();
      const { getByLabelText } = render(
        <DatePicker id="date" name="date" onBlur={onBlur} />
      );

      fireEvent.blur(getByLabelText(/^date/i));

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("should display help text below input when helpText prop is set", () => {
      const helpText = "An example help text";
      const { getByText } = render(
        <DatePicker helpText={helpText} id="date" name="date" />
      );

      expect(getByText(helpText)).toBeTruthy();
    });
  });

  describe("Calendars", () => {
    it.each`
      monthNumber
      ${2}
      ${4}
    `(
      "should show $monthNumber calendars when monthNumber prop is set to $monthNumber",
      ({ monthNumber }) => {
        const { queryAllByText } = render(
          <DatePicker
            id="date"
            label="Date"
            monthNumber={monthNumber}
            name="date"
            showOverlay
          />
        );

        expect(queryAllByText("25").length).toBe(monthNumber);
      }
    );
  });

  describe("Calendar", () => {
    it("should display days as unavailable in calendar when unavailableDates prop is set", () => {
      const { getAllByTestId } = render(
        <DatePicker
          id="date"
          name="date"
          showOverlay
          unavailableDates={["2019-04-25", "2019-04-27"]}
          value="2019-04-20"
        />
      );
      expect(getAllByTestId(/unavailable/)[0].textContent).toBe("25");
    });

    it("should display bank holidays as unavailable when disableBankHolidays is set", async () => {
      const { getByTestId } = render(
        <BankHolidaysProvider getBankHolidays={getBankHolidays}>
          <DatePicker
            disableBankHolidays
            getBankHolidays={() => Promise.resolve(["2019-12-25"])}
            id="date"
            name="date"
            showOverlay
            value="2019-12-20"
          />
        </BankHolidaysProvider>
      );
      await wait(() => getByTestId(/unavailable/));
      expect(getByTestId(/unavailable/).textContent).toBe("25");
    });

    it("should display help text below calendar when calendarHelpText prop is set", () => {
      const calendarHelpText = "An example calendar help text";
      const { getByText } = render(
        <DatePicker
          calendarHelpText={calendarHelpText}
          id="date"
          name="date"
          showOverlay
        />
      );

      expect(getByText(calendarHelpText)).toBeTruthy();
    });
  });

  describe("Overlay", () => {
    it("should show calendar when calendar icon is clicked", () => {
      const { getByText, getByLabelText } = render(
        <DatePicker id="date" name="date" />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));

      expect(getByText("Su")).toBeTruthy();
      expect(getByText("25")).toBeTruthy();
    });

    it("should hide calendar, when overlay close button is clicked ", () => {
      const { queryByText, getByLabelText, getByText } = render(
        <DatePicker id="date" label="Date" name="date" />
      );

      // Show overlay
      fireEvent.click(getByLabelText(/open date input calendar/i));
      expect(getByText("Su")).toBeTruthy();
      expect(getByText("25")).toBeTruthy();

      // Hide overlay
      fireEvent.click(getByLabelText("Close"));

      expect(queryByText("Su")).toBeNull();
      expect(queryByText("25")).toBeNull();
    });

    it("should close overlay when date is picked", () => {
      const { queryByText, getByText, getByLabelText } = render(
        <DatePicker id="date" label="Date" name="date" value="2010-05-10" />
      );
      fireEvent.click(getByLabelText(/open date input calendar/i));

      fireEvent.click(getByText("15"));

      expect(queryByText("Su")).toBeNull();
      expect(queryByText("25")).toBeNull();
    });

    it("should show calendar by default when showOverlay is set to true", () => {
      const { getByText } = render(
        <DatePicker id="date" name="date" showOverlay />
      );

      expect(getByText("Su")).toBeTruthy();
      expect(getByText("25")).toBeTruthy();
    });

    it("should close calendar when input is clicked", () => {
      const { getByText, getByLabelText, queryByText } = render(
        <DatePicker id="date" name="date" />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));

      // Ensure calendar is open.
      expect(getByText("Su")).toBeTruthy();
      expect(getByText("25")).toBeTruthy();

      fireEvent.click(getByLabelText(/^date/i));
      // Ensure calendar is closed.
      expect(queryByText("Su")).toBeNull();
      expect(queryByText("25")).toBeNull();
    });

    it("should call onShowOverlay with 'true' when calendar is open", () => {
      const onShowOverlay = jest.fn();
      const { getByLabelText } = render(
        <DatePicker
          id="date"
          name="date"
          onShowOverlay={onShowOverlay}
          showOverlay
        />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));

      expect(onShowOverlay).toHaveBeenCalledWith(true);
    });

    it("should call onShowOverlay with 'false' when calendar is closed", () => {
      const onShowOverlay = jest.fn();
      const { getByLabelText } = render(
        <DatePicker
          id="date"
          name="date"
          onShowOverlay={onShowOverlay}
          showOverlay
        />
      );
      const input = getByLabelText(/^date/i);
      const closeButton = getByLabelText("Close");
      fireEvent.click(input);

      fireEvent.click(closeButton);

      expect(onShowOverlay).toHaveBeenCalledWith(false);
    });

    it("should set focus on a day when overlay is open", () => {
      const { getByLabelText } = render(
        <DatePicker id="date" name="date" value="2019-08-01" />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));

      const focusedElement = document.activeElement;
      expect(focusedElement.tagName).toBe("BUTTON");
      expect(focusedElement.textContent).toBe("1");
    });

    it("should set focus on the input when overlay is closed", () => {
      const { getByLabelText } = render(
        <DatePicker id="date" name="date" value="2019-08-01" />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));
      fireEvent.click(getByLabelText(/close/i));

      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(getByLabelText(/^date/i));
    });

    it("should set focus on minDay when no value is provided and overlay is open", () => {
      const { getByText, getByLabelText } = render(
        <DatePicker
          id="date"
          name="date"
          minDate="2019-10-05"
          maxDate="2019-10-12"
        />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));
      expect(getByText("October 2019"));

      const focusedElement = document.activeElement;
      expect(focusedElement.tagName).toBe("BUTTON");
      expect(focusedElement.textContent).toBe("5");
    });

    it("should set focus on value is when value and minDay are provided and overlay is open", () => {
      const { getByText, getByLabelText } = render(
        <DatePicker
          id="date"
          name="date"
          minDate="2019-10-05"
          maxDate="2019-10-12"
          value="2019-10-07"
        />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));
      expect(getByText("October 2019"));

      const focusedElement = document.activeElement;
      expect(focusedElement.tagName).toBe("BUTTON");
      expect(focusedElement.textContent).toBe("7");
    });

    it("should show correct date in calendar when a date is manually entered", () => {
      const { getByText, getByTestId, getByLabelText } = render(
        <DatePicker id="date" name="date" />
      );
      const input = getByLabelText(/^date/i);

      fireEvent.change(input, { target: { value: "04/20/2019" } });
      fireEvent.blur(input);

      fireEvent.click(getByLabelText(/open date input calendar/i));

      expect(getByText("April 2019")).toBeTruthy();
      expect(getByTestId(/selected/i).textContent).toBe("20");
    });

    it("should show unavailable date as selected in calendar when unavailable date is entered and overlay is open", () => {
      const { getByText, getByLabelText, getByTestId } = render(
        <DatePicker id="date" name="date" unavailableDates={["2025-01-05"]} />
      );

      const input = getByLabelText(/^date/i);
      fireEvent.change(input, {
        target: { value: "01/05/2025" },
      });
      fireEvent.blur(input);

      fireEvent.click(getByLabelText(/open date input calendar/i));
      expect(getByText("January 2025"));

      expect(getByTestId(/selected/).textContent).toBe("5");
    });
  });

  describe("onChange calls", () => {
    it("should call onChange with correct value when day is clicked in calendar", () => {
      const onChange = jest.fn();

      const { getByLabelText, getByText } = render(
        <DatePicker
          id="date"
          label="Date"
          name="date"
          onChange={onChange}
          value="2010-05-10"
        />
      );

      fireEvent.click(getByLabelText(/open date input calendar/i));
      fireEvent.click(getByText("15"));

      expect(onChange).toHaveBeenCalledWith({
        target: { name: "date", value: "2010-05-15" },
      });
    });

    it("should call onChange with correct value when value is inserted directly into an input", () => {
      const onChange = jest.fn();
      const { getByLabelText } = render(
        <DatePicker
          id="date"
          label="Date"
          name="date"
          onChange={onChange}
          value="2010-05-10"
        />
      );

      fireEvent.change(getByLabelText(/^date/i), {
        target: { value: "05/15/2010" },
      });
      fireEvent.blur(getByLabelText(/^date/i));

      expect(onChange).toHaveBeenCalledWith({
        target: { name: "date", value: "2010-05-15" },
      });
    });
  });

  describe("validation messages", () => {
    it.each`
      props                                   | input           | description   | error
      ${{ unavailableDates: ["2010-04-12"] }} | ${"04/12/2010"} | ${"disabled"} | ${"Date is disabled"}
      ${{
  unavailableDays: [0, 4],
}} | ${"04/08/2010"} | ${"in disabled weekdays"} | ${"This day cannot be selected"}
      ${{
  minDate: "2010-04-10",
}} | ${"04/08/2010"} | ${"less than min date"} | ${"Value doesn't fit allowed range of dates"}
      ${{
  maxDate: "2010-04-10",
}} | ${"04/11/2010"} | ${"more than max date"} | ${"Value doesn't fit allowed range of dates"}
      ${{
  minDate: "2010-04-10",
  maxDate: "2010-04-20",
}} | ${"04/21/2010"} | ${"doesn't fit a range"} | ${"Value doesn't fit allowed range of dates"}
    `(
      "should display validation message when selected date is $description",
      ({ props, input, error }) => {
        const onChange = jest.fn();
        const { getByLabelText, queryByText, getByText } = render(
          <DatePicker
            id="date"
            label="Date"
            name="date"
            onChange={onChange}
            value="2010-04-10"
            {...props}
          />
        );
        expect(queryByText(error)).toBeNull();

        fireEvent.change(getByLabelText(/^date/i), {
          target: { value: input },
        });
        fireEvent.blur(getByLabelText(/^date/i));

        getByText(error);
      }
    );

    it.each`
      props | input | output | description | error
      ${{
  unavailableDates: ["2010-04-12"],
}} | ${"2010-04-12"} | ${"04/12/2010"} | ${"disabled"} | ${"Date is disabled"}
      ${{
  unavailableDays: [0, 4],
}} | ${"2010-04-08"} | ${"04/08/2010"} | ${"in disabled weekdays"} | ${"This day cannot be selected"}
      ${{
  minDate: "2010-04-10",
}} | ${"2010-04-08"} | ${"04/08/2010"} | ${"less than min date"} | ${"Value doesn't fit allowed range of dates"}
      ${{
  maxDate: "2010-04-10",
}} | ${"2010-04-11"} | ${"04/11/2010"} | ${"more than max date"} | ${"Value doesn't fit allowed range of dates"}
      ${{
  minDate: "2010-04-10",
  maxDate: "2010-04-20",
}} | ${"2010-04-21"} | ${"04/21/2010"} | ${"doesn't fit a range"} | ${"Value doesn't fit allowed range of dates"}
    `(
      "should display validation message and return properly formatted value back when default date value is $description",
      ({ props, input, output, error }) => {
        const onChange = jest.fn();
        const { container, getByText } = render(
          <DatePicker
            id="date"
            label="Date"
            name="date"
            onChange={onChange}
            value={input}
            {...props}
          />
        );

        getByText(error);
        expect(container.querySelector("input").value).toBe(output);
      }
    );

    it("should show validation message when a user provides an invalid value and leaves the input field", () => {
      const { getByText, getByLabelText } = render(
        <DatePicker id="date" name="date" />
      );

      fireEvent.change(getByLabelText(/^date/i), {
        target: { value: "invalid value" },
      });
      fireEvent.blur(getByLabelText(/^date/i));

      getByText("Enter a valid date in MM/DD/YYYY format");
    });

    it("should call onError when a user provides an invalid value and leaves the input field", () => {
      const onErrorSpy = jest.fn();
      const { getByLabelText } = render(
        <DatePicker id="date" name="date" onError={onErrorSpy} />
      );

      fireEvent.change(getByLabelText(/^date/i), {
        target: { value: "invalid value" },
      });
      fireEvent.blur(getByLabelText(/^date/i));

      expect(onErrorSpy).toHaveBeenCalledWith(
        "Enter a valid date in MM/DD/YYYY format"
      );
    });

    it("should show validation message when initial value is invalid", () => {
      const { getByText } = render(
        <DatePicker
          id="date"
          name="date"
          unavailableDates={["2012-01-01"]}
          value={"2012-01-01"}
        />
      );

      getByText("Date is disabled");
    });

    it("should call onError with a validation message when initial value is invalid", () => {
      const onErrorSpy = jest.fn();

      render(
        <DatePicker
          id="date"
          name="date"
          onError={onErrorSpy}
          unavailableDates={["2012-01-01"]}
          value={"2012-01-01"}
        />
      );

      expect(onErrorSpy).toHaveBeenCalledWith("Date is disabled");
    });
  });

  describe("Legend", () => {
    it("should show a legend when showLegend property is set true", () => {
      const { getByTestId } = render(
        <DatePicker id="date" name="date" showLegend showOverlay />
      );

      expect(getByTestId("legend"));
    });

    it("should show legend in horizontal by default", () => {
      const { getByTestId } = render(
        <DatePicker id="date" name="date" showLegend showOverlay />
      );
      expect(getByTestId("hasHorizontalLegend")).toBeTruthy();
    });

    test.each`
      orientation | testId                   | orientationLabel
      ${"h"}      | ${"hasHorizontalLegend"} | ${"horizontal"}
      ${"v"}      | ${"hasVerticalLegend"}   | ${"vertical"}
    `(
      "should show legend in $orientationLabel orientation when legendOrientation is set to $orientation",
      ({ orientation, testId }) => {
        const { getByTestId } = render(
          <DatePicker
            id="date"
            legendOrientation={orientation}
            name="date"
            showLegend
            showOverlay
          />
        );
        expect(getByTestId(testId)).toBeTruthy();
      }
    );

    it("should show custom label for available and unavailable legend items when legendLabel is provided", () => {
      const { getByText } = render(
        <DatePicker
          dayTypes={{
            available: {
              legendLabel: "Custom available date label",
            },
            unavailable: {
              legendLabel: "Custom unavailable date label",
            },
          }}
          id="date"
          name="date"
          showLegend
          showOverlay
        />
      );
      expect(getByText("Custom available date label"));
      expect(getByText("Custom unavailable date label"));
    });

    it("should hide payment due legend item when showInLegend is set to false", () => {
      const { queryByText } = render(
        <DatePicker
          dayTypes={{
            due: {
              showInLegend: false,
            },
          }}
          id="date"
          name="date"
          showLegend
          showOverlay
        />
      );
      expect(queryByText("Payment Due Date")).toBeNull();
    });
  });
});

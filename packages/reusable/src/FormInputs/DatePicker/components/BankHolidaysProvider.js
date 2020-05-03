/** 
 This provides bank holidays and a function to request bank holidays.
 This is currently only used by the datepicker.
 This provider assures each year's bank holidays are only requested once for a given app.
 Place this provider at the app's entry point so that all child components can consume it.  
 **/
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import BankHolidaysContext from "./BankHolidaysContext";
import { convertToDateObjects } from "../../../utils/dateUtils";

function BankHolidaysProvider({ getBankHolidays, children }) {
  // Date object array consumed and managed by DatePicker.
  const [bankHolidays, setBankHolidays] = useState([]);
  // Object with keys for each requested year. Used to avoid making duplicate requests. Using ref since not used in JSX. No need to re-render when it changes.
  const requestedYears = useRef({});

  async function getCachedBankHolidays(year) {
    // Scenario 1 - Year has already been requested by some other datepicker. Nothing to do, so return.
    if (requestedYears.current[year]) return;

    // Scenario 2 - Year hasn't been requested yet. Request it, and note that it has been requested via the requestedYears object.
    try {
      requestedYears.current[year] = true;
      // Assume we're calling an async function that returns results wrapped in a data object (In other words, Axios).
      const { data: holidaysForYear } = await getBankHolidays(year);
      // Set the array of bank holidays in state as date objects. These are used by datepicker.
      setBankHolidays((existingHolidays) => [
        ...existingHolidays,
        ...convertToDateObjects(...holidaysForYear),
      ]);
    } catch (err) {
      console.error(err);
      throw new Error(
        "Unable to retrieve bank holidays in BankHolidaysProvider"
      );
    }
  }

  return (
    <BankHolidaysContext.Provider
      value={{
        bankHolidays,
        getBankHolidays: getCachedBankHolidays,
      }}
    >
      {children}
    </BankHolidaysContext.Provider>
  );
}

BankHolidaysProvider.propTypes = {
  /** Async function to call to retrieve an array of bank holidays for a given year */
  getBankHolidays: PropTypes.func.isRequired,

  /** Child components to render - Typically, you wrap your entire app with this component so any child components can consume this context. */
  children: PropTypes.any.isRequired,
};

export default BankHolidaysProvider;

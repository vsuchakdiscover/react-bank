/** 
 This context provides bank holidays for the datepicker.
 This context assures each year's bank holidays are only requested once for a given app.
 See BankHolidaysProvider for a handy provider component for this context.
 **/
import React from "react";
const BankHolidaysContext = React.createContext({
  bankHolidays: [],
  getBankHolidays: async () => {
    throw new Error(
      "To support disabling bank holidays, wrap the app in BankHolidayProvider."
    );
  },
});
export default BankHolidaysContext;

/// <reference types="Cypress" />

import {
  dateRange,
  futureDate,
  formatDate,
} from "../../src/components/ReviewPayments/paymentSliderDateUtils";

import { daysInFuture } from "../../src/mockData/mockDataUtils";

function setFilter(text) {
  cy.findAllByLabelText("Filter selected payments").eq(0).click();
  // Since the requested filter may already be set, there may
  // be 2 records found with the requested text(because the selected filter
  // is displayed as the dropdown label too) So this assures the set doesn't
  // fail if the filter is already set to the requested value.
  cy.findAllByText(new RegExp(text)).eq(0).click();
}

describe("Review Payments Slider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/review-payments?slider");
  });

  it("should default to next 30 days", () => {
    const range = dateRange(futureDate(0), futureDate(30));
    cy.findByText(`Next 30 days: ${range}`);
  });

  it("should display page 1 of slider results when the filter changes", () => {
    setFilter("Next 30 days");

    // Go to page 2 of results in slider
    cy.findByLabelText("View next payments page").click();

    // Change filter
    setFilter("Current Week");

    // Now confirm that the "Make a Payment" card is visible again to prove we're back on page 1.
    cy.findByLabelText("Scheduled Payments").within(() => {
      cy.findByText("Make a Payment").should("be.visible");
    });
  });

  it("should show completed payment overlay text, past tense copy and no edit or delete buttons in overlay", () => {
    const paymentDate = formatDate(daysInFuture(0));
    setFilter("Current Week");
    cy.findByLabelText("View next payments page").click();
    cy.findByLabelText(
      `View ${paymentDate} payment details for $22.51 payment to DiscoverCard (4065)`
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText(/was delivered by/); //past tense
      cy.contains("Edit").should("not.exist"); //edit button should not show
      cy.contains("Delete").should("not.exist"); //Delete should not show
    });
    cy.findByLabelText("Close Modal").click();
  });

  it("should return user to view payments overlay when user chooses go back for repeating payments", () => {
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $122.05 payment to My Checking`
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText("Delete").click();
    });
    cy.findByText("Go Back").click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText("Edit").click();
    });
    cy.findByText("Go Back").click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText(/Next repeating payment by check to/); //confirm we're back on the view payment details modal
    });
  });

  it("should return user to view payments overlay when user chooses cancel from delete prompt for one time payments", () => {
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $1.30 payment to DiscoverCard (4065)`
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText("Delete").click();
    });
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Cancel").click();
    });

    cy.findByLabelText("Payment details").within(() => {
      //back to the modal
      cy.findByText(/Electronic Payment to/);
    });
  });

  it("should return user to view payments overlay when user chooses cancel from delete prompt for repeating payment out 30 days", () => {
    setFilter("Repeating Payments after 30 days");
    cy.findByLabelText(
      "View scheduled payment details for $22.51 payment to DiscoverCard (4065)"
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText("Delete").click();
    });
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Cancel").click();
    });
    cy.findByLabelText("Payment details");
  });

  it("should support deleting a simple one time payment", () => {
    const paymentDate = formatDate(daysInFuture(0));
    setFilter("Current Week");
    cy.findByLabelText(
      `View ${paymentDate} payment details for $1.30 payment to DiscoverCard (4065)`
    );
    setFilter("Next 30 days");
    cy.findByLabelText(
      `View ${paymentDate} payment details for $1.30 payment to DiscoverCard (4065)`
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText(/Electronic Payment to/); //the following confirm pertinent text fragments display in the overlay
      cy.findByText(/will be delivered by/);
      cy.findByText("Status");
      cy.findByText("Scheduled");
      cy.findByText("Pay From");
      cy.findAllByText("My Money Market (9811)");
      cy.findByText("Scheduled On");
      cy.findByText("09/10/2019");
      cy.findByText("Frequency");
      cy.findByText("One Time");
      cy.findByText("Delivery Method");
      cy.contains("Ends").should("not.exist"); //don't show ends for one time payments
      cy.findByText("Delete").click();
    });

    cy.findByText("Are you sure you want to delete this payment?");
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete Payment").click();
    });
    cy.findByText(/has been deleted/);
    cy.contains(
      `View ${paymentDate} payment details for $1.30 payment to DiscoverCard (4065)`
    ).should("not.exist");
    // confirm that payment was removed in the current week array by switching the sort
    setFilter("Current Week");
    cy.contains(
      `View ${paymentDate} payment details for $1.30 payment to DiscoverCard (4065)`
    ).should("not.exist");

    //now check that the payment is logged as canceled in the activity table
    cy.findByText("Search").click();
    cy.findByText("Select all").click();
    cy.findByText("Unselect all").click();
    // Just check the canceled payments
    cy.findByText("Canceled").click();
    cy.findByText("Filter").click();
    cy.findByLabelText(
      "Expand Electronic Payment to DiscoverCard (4065)"
    ).click();
    cy.findByLabelText("DiscoverCard (4065) payment details").within(() => {
      cy.findAllByText("Canceled").should("have.length", 2); //payment is marked canceled
    });
    cy.resetDb();
  });

  it("should support deleting a repeating payment as a one time payment", () => {
    //view the repeating payment rule
    setFilter("Repeating Payments after 30 days");
    cy.findByLabelText("View next payments page").click();
    cy.findByLabelText(
      `View scheduled payment details for $122.05 payment to My Checking (2374)`
    ).should("have.length", 1); //repeating payment rule shows one tile
    cy.findByLabelText("View previous payments page").click();
    setFilter("Next 30 days");
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $122.05 payment to My Checking`
    ).click();
    cy.findByLabelText("Payment details").within(() => {
      cy.findByText(/Next repeating payment by check/); //the following confirm pertinent text fragments display in the overlay
      cy.findByText(/will be delivered by/);
      cy.findByText("Status");
      cy.findByText("Frequency");
      cy.findByText("Repeating");
      cy.findByText("Deliver By");
      cy.findByText("Delivery Method");
      cy.findByText("Check by Mail");
      cy.findByText(/4840 Wright Terr/); //address is available so display it
      cy.findByText("Ends"); //don't show ends for one time payments
      cy.findByText("After 12 Payments");
    });
    cy.findByLabelText(
      "Delete payment of $122.05 to My Checking (2374)"
    ).click();
    cy.findByText("Delete Entire Series"); //fragment that signifies series choice
    cy.findByText("Delete This Payment").click();

    cy.findByText("Are you sure you want to delete this payment?");
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete Payment").click();
    });
    cy.findByText(/has been deleted/);
    cy.contains(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $122.05 payment to My Checking`
    ).should("not.exist");
    setFilter("Current Week");
    cy.contains(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $122.05 payment to My Checking`
    ).should("not.exist");

    //now confirm again that the repeating payment rule still exists
    //view the repeating payment rule
    setFilter("Repeating Payments after 30 days");
    cy.findByLabelText("View next payments page").click();
    cy.findAllByLabelText(
      "View scheduled payment details for $122.05 payment to My Checking (2374)"
    ).should("have.length", 1); //repeating payment rule shows one tile
    cy.resetDb();
  });

  it("should support deleting a repeating payment as a series", () => {
    const paymentDate = formatDate(daysInFuture(0));
    setFilter("Repeating Payments after 30 days"); //view the repeating payment rule
    cy.findByLabelText("View next payments page").click();
    cy.findAllByLabelText(
      "View scheduled payment details for $122.05 payment to My Checking (2374)"
    ).should("have.length", 1); //repeating payment rule shows one tile
    cy.findByLabelText("View previous payments page").click();
    setFilter("Next 30 days");
    cy.findByLabelText(
      `View ${paymentDate} payment details for $122.05 payment to My Checking`
    ).click(); // confirm the payment associated with the series is listed and click to delete

    cy.findByLabelText("Payment details").within(() => {
      cy.findByText(/Next repeating payment by check/); //the following confirm pertinent text fragments display in the overlay
      cy.findByText(/will be delivered by/);
      cy.findByText("Status");
      cy.findByText("Frequency");
      cy.findByText("Repeating");
      cy.findByText("Deliver By");
      cy.findByText("Delivery Method");
      cy.findByText("Check by Mail");
      cy.findByText(/4840 Wright Terr/); //address is available so display it
      cy.findByText("Ends"); //don't show ends for one time payments
      cy.findByText("After 12 Payments");
    });
    cy.findByLabelText(
      "Delete payment of $122.05 to My Checking (2374)"
    ).click();
    cy.findByText("Delete This Payment");
    cy.findByText("Delete Entire Series").click(); //fragment that signifies series choice

    cy.findByText("Are you sure you want to delete all payments?");
    cy.findByText(/Delete Payment/).click();
    cy.findByText(/Your repeating payments/);
    cy.findByText(/have been deleted/);
    cy.contains(
      `View ${paymentDate} payment details for $122.05 payment to My Checking`
    ).should("not.exist"); //confirm payment was removed

    //confirm we have removed the repeaing payment rule
    setFilter("Repeating Payments after 30 days");
    cy.contains("View next payments page").should("not.exist");
    cy.contains(
      "View scheduled payment details for $122.05 payment to My Checking (2374)"
    ).should("not.exist"); //repeaing payment rule is removed from the array and no longer displayed
    cy.resetDb();
  });

  it("should support viewing repeating payment history and editing a repeating payment", () => {
    setFilter("Repeating Payments after 30 days");
    cy.findByLabelText(
      "View scheduled payment details for $22.51 payment to DiscoverCard (4065)"
    ).click();
    cy.findByText("View Repeating Payment History").click();
    cy.findAllByText("Repeating Payment History to DiscoverCard (4065)"); //confirm it's a repeating payment
    cy.findByText("Repeating Payment History to DiscoverCard (4065)");
    cy.findByLabelText("Close Modal").click();

    //Now, try to edit a payment
    cy.findByLabelText("Edit scheduled payment").click();
    cy.findByText("Edit Payments for DiscoverCard (4065)"); //confirm header
    cy.findByText("Personal Checking");
    cy.findByLabelText("Amount").should("have.value", "$22.51");
    cy.findByText("Every 4 Weeks");
    cy.findByText("After Set Number of Payments");
    cy.findByLabelText("Number of Payments").should("have.value", "20");
  });

  it("should display message if there are no payments for the selected period, and not display any banner below", () => {
    cy.setScenario("Get Payments Response", "No payments");
    cy.findByText("You don't have any payments scheduled in this time period.");
  });

  it("should show one-time scheduled payments when filter is set to 'Show One-Time Payments'", () => {
    setFilter("One Time Payments after 30 days");

    cy.findAllByLabelText(
      "View September 25 payment details for $1,967.70 payment to Discover CC available ebill"
    ).click();

    cy.findAllByText("One Time");

    // Now reset filter back for use in other tests
    cy.findByLabelText("Close Modal").click();
    cy.findAllByLabelText("Filter selected payments").first().click();
    cy.findByText(/Current Week/).click();
  });

  it("should not display repeating payments in the after 30 days set if they are ending", () => {
    //confirm that repeating payment shows in the 30 days list
    setFilter("Next 30 days");
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $990.00 payment to Ending Repeating Payment`
    );

    // Change filter
    setFilter("Repeating Payments after 30 days");
    //payment should not display here
    cy.findByLabelText(
      `View scheduled payment details for $990.00 payment to Ending Repeating Payment (7788)`
    ).should("not.exist");
  });
});

describe("Review Payments", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/review-payments");
  });

  describe("Interactions with Make a Payment Page", () => {
    it("should not show the frequency field when editing a repeating payment as one-time", () => {
      cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
      cy.findByText("Edit This Payment").click();
      cy.contains("One Time").should("not.exist");
    });

    it("should show the frequency dropdown (minus 'One Time') when editing a repeating payment as a series", () => {
      cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
      cy.findByText("Edit Entire Series").click();
      cy.findByText("Every 4 Weeks");
      cy.findAllByLabelText("Frequency").first().click();
      cy.contains("One Time").should("not.exist");
    });

    it("should return the user back to review payments when they started the edit flow there", () => {
      cy.findByLabelText(
        "Edit payment of $1.30 to DiscoverCard (4065)"
      ).click();
      cy.findByText("Edit Payment for DiscoverCard (4065)");
      cy.findByText("Back").click();
      cy.findByText("Scheduled Payments");
    });

    it("should allow user to delete a one time payment from the edit flow", () => {
      cy.findByLabelText(
        "Edit payment of $1.30 to DiscoverCard (4065)"
      ).click();
      cy.findByText("Edit Payment for DiscoverCard (4065)");
      cy.findByText("Delete Payment").click();
      cy.findByText("Are you sure you want to delete this payment?");
      cy.findByText("RETAIL PERSONAL TEST"); // confirm pay from account
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete Payment").click();
      });
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText(/has been deleted./);
    });

    it("should allow user to delete a repeating payment as a one time edit and then delete from the edit flow", () => {
      cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
      cy.findByText(
        "Do you want to edit this payment or all payments in the series?"
      );
      cy.findByText("Edit This Payment").click();
      cy.findByText("Edit Payment for My Checking (2374)");
      cy.findByText("Delete Payment").click();
      cy.findByText("Are you sure you want to delete this payment?");
      cy.findByText("My Checking (2374)"); //confirm pay to account
      cy.findByText("RETAIL PERSONAL CHECKING"); //confirm pay from account
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete Payment").click();
      });
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText(/has been deleted./);
      cy.resetDb();
    });

    it("should allow user to delete a one time payment from the edit as a series flow", () => {
      cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
      cy.findByText(
        "Do you want to edit this payment or all payments in the series?"
      );
      cy.findByText("Edit Entire Series").click();
      cy.findByText("Edit Payments for My Checking (2374)");
      cy.findByText("Delete Payment").click();
      cy.findByText(
        "Do you want to delete this check by mail payment to My Checking (2374) or the entire series?"
      );
      cy.findByText("Delete This Payment").click();
      cy.findByText("Are you sure you want to delete this payment?");
      cy.findByText("RETAIL PERSONAL CHECKING"); //confirm pay from account
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete Payment").click();
      });
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText(/has been deleted./);
      cy.resetDb();
    });

    it("should allow user to delete a repeating payment as series from the edit as a series flow", () => {
      cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
      cy.findByText(
        "Do you want to edit this payment or all payments in the series?"
      );
      cy.findByText("Edit Entire Series").click();
      cy.findByText("Edit Payments for My Checking (2374)");
      cy.findByText("Delete Payment").click();
      cy.findByText(
        "Do you want to delete this check by mail payment to My Checking (2374) or the entire series?"
      );
      cy.findByText("Delete Entire Series").click();
      cy.findByText("Are you sure you want to delete all payments?");
      cy.findByText(/and all subsequent payments/);
      cy.findByText("RETAIL PERSONAL CHECKING"); //confirm pay from account
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete Payments").click();
      });
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText(/have been deleted./);
      cy.resetDb();
    });

    it("should allow user to delete an automatic payment as a one time payment from a series via the edit flow", () => {
      cy.findByLabelText(
        `View ${formatDate(
          daysInFuture(0)
        )} payment details for $55.05 payment to Chase Bank has Autopay (9999)`
      ).click();
      cy.findByLabelText("Edit scheduled payment").click();
      cy.findByText(
        "Do you want to edit this payment or your eBill AutoPay settings?"
      );
      cy.findByText("Edit This Payment").click();
      cy.findByText("Edit Payment for Chase Bank has Autopay (9999)");
      cy.findByText("Delete Payment").click();
      cy.findByText("Are you sure you want to delete this payment?");
      cy.findByText("RETAIL PERSONAL CHECKING"); //confirm pay from account
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete Payment").click();
      });
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText(/has been deleted./);
      cy.resetDb();
    });

    it("should allow user to delete an automatic payment as a series via the edit flow", () => {
      cy.findByLabelText(
        "Edit payment of $55.05 to Chase Bank has Autopay (9999)"
      ).click();
      cy.findByText(
        "Do you want to edit this payment or your eBill AutoPay settings?"
      );
      cy.findByText("Edit AutoPay Settings").click();
      cy.findByText(
        "Edit eBill AutoPay Payment for Chase Bank has Autopay (9999)"
      );
      cy.findByText("Delete eBill AutoPay").click();
      cy.findByText(
        "Do you want to delete this payment or your eBill AutoPay settings?"
      );
      cy.findByLabelText("Delete Scheduled Payment").within(() => {
        cy.findByText("Delete AutoPay Settings").click();
      });
      cy.findByText(
        "Are you sure you want to delete your eBill AutoPay settings?"
      );
      cy.findByText("Delete eBill AutoPay Settings").click();
      cy.findByText("See your scheduled and delivered payments"); //confirm the user was redirected to review payments
      cy.findByText("Your eBill AutoPay settings have been deleted");
      cy.resetDb();
    });
  });

  it("should show error message when scheduled payments api returns error", (done) => {
    // via https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
    cy.on("uncaught:exception", (err, runnable) => {
      // This section only applies to development mode.
      expect(err.message).to.include("Internal Server Error");
      done();
      return false; // return false to prevent the error from failing this test
    });
    cy.setScenario("Get Payments Response", "Scheduled payments return error");
    cy.findByText("Looks like something went wrong");
    done(); // necessary since exception is only uncaught in development since ErrorBoundary catches in prod build.
  });

  it("should allow the user to delete a repeating payment as a one time payment", () => {
    cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
    cy.findByText(
      "Do you want to edit this payment or all payments in the series?"
    );
    cy.findByText("Edit This Payment").click();
    cy.findByText("Delete Payment").click();
    cy.findByText("Are you sure you want to delete this payment?");
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete Payment").click();
    });
    cy.findByText(/has been deleted/);
    cy.contains("Delete payment of $122.05 to My Checking").should("not.exist");
    cy.resetDb();
  });

  it("should allow the user to delete a repeating payment as a series", () => {
    cy.findByLabelText("Edit payment of $122.05 to My Checking").click();
    cy.findByText(
      "Do you want to edit this payment or all payments in the series?"
    );
    cy.findByText("Edit Entire Series").click();
    cy.findByText("Delete Payment").click();
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText(
        "Do you want to delete this check by mail payment to My Checking (2374) or the entire series?"
      );
      cy.findByText("Delete Entire Series").click();
    });
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText(/all subsequent payments will be deleted/);
      cy.findByText("Delete Payments").click();
    });
    cy.findByText(/been deleted/);
    cy.contains("Edit payment of $122.05 to My Checking").should("not.exist");
    cy.resetDb();
  });

  it("should allow the user to delete an automatic payment as a one time delete", () => {
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $55.05 payment to Chase Bank has Autopay (9999)`
    ).click();
    cy.findByLabelText(
      "Delete payment of $55.05 to Chase Bank has Autopay (9999)"
    ).click();
    cy.findByText(
      "Do you want to delete this payment or your eBill AutoPay settings?"
    );
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete This Payment").click();
    });
    cy.findByText("Are you sure you want to delete this payment?");
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete Payment").click();
    });
    cy.findByText(/has been deleted/);
    cy.contains(
      "View scheduled payment details for $55.05 payment to Chase Bank has Autopay (9999)"
    ).should("not.exist");
    cy.resetDb();
  });

  it("should allow the user to delete an automatic payment as a series delete", () => {
    cy.findByLabelText(
      `View ${formatDate(
        daysInFuture(0)
      )} payment details for $55.05 payment to Chase Bank has Autopay (9999)`
    ).click();
    cy.findByText("Delete").click();
    cy.findByText(
      "Do you want to delete this payment or your eBill AutoPay settings?"
    );
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete AutoPay Settings").click();
    });
    cy.findByText(
      "Are you sure you want to delete your eBill AutoPay settings?"
    );
    cy.findByLabelText("Delete Scheduled Payment").within(() => {
      cy.findByText("Delete eBill AutoPay Settings").click();
    });
    cy.findByText(/Your eBill AutoPay settings have been deleted/);
    cy.contains(
      "Delete payment of $55.05 to Chase Bank has Autopay (9999)"
    ).should("not.exist");
    cy.resetDb();
  });

  describe("Payment history table", () => {
    it("should display 'There are no payments found' message when there is no payment data", () => {
      cy.setScenario("Get Payments Response", "No payments");

      cy.findByText(
        /There are no payments found. Please modify your search criteria and try again./
      );
    });

    it("should filter payment history data when filter is applied", () => {
      // Default number of rows: 5
      cy.get("table tbody tr").should("have.length", 5);

      cy.findByText("Search").click();

      cy.get("#search").within(() => {
        // Filter by Pay To
        cy.findAllByLabelText("Pay To (Optional)").first().click();
        cy.findByText(/DiscoverCard \(4065\)/).click({ force: true });

        // Filter by Pay From
        cy.findAllByLabelText("Pay From (Optional)").first().click();
        cy.findAllByText(/RETAIL PERSONAL CHECKING \(9815\)/)
          .first()
          .click({ force: true });

        // Uncheck "Other" status checkbox
        cy.findByText("Other").click();

        // Set date filter
        cy.findByText("All Dates").click();
        cy.findByText("Enter Date Range").click();

        cy.findByLabelText("From (Optional)")
          .click()
          .type(daysInFuture(0, "MM/DD/YYYY"))
          .blur();

        cy.findByLabelText("To (Optional)")
          .click()
          .type(daysInFuture(0, "MM/DD/YYYY"))
          .blur();

        // Submit form
        cy.findByText("Filter").click();
      });
      cy.get("table tbody tr").should("have.length", 1);

      // Reset filters
      cy.findByLabelText("Reset table filters").click();

      // Shows all elements again
      cy.get("table tbody tr").should("have.length", 5);
    });
  });

  it("should close search when reset is submitted", () => {
    // Default number of rows: 5
    cy.get("table tbody tr").should("have.length", 5);

    // Search is collapsed
    cy.findByLabelText("open search");

    // Expand search
    cy.findByText("Search").click();
    cy.findByLabelText("close search");
    // Reset search
    cy.findByLabelText("Cancel table filter").click();

    // Search is collapsed
    cy.findByLabelText("open search");
  });

  it("should show error message when payments api returns error", (done) => {
    // via https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
    cy.on("uncaught:exception", (err, runnable) => {
      // This section only applies to development mode.
      expect(err.message).to.include("Internal Server Error");
      done();
      return false; // return false to prevent the error from failing this test
    });
    cy.setScenario("Get Payments Response", "Payments history with error");
    cy.findByText("Looks like something went wrong");
    done(); // necessary since exception is only uncaught in development since ErrorBoundary catches in prod build.
  });
});

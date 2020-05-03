/// <reference types="Cypress" />

import { formatDate, getFirstWeekDayOfMonth } from "reusable/lib/dateUtils";
import { daysInFuture } from "../../src/mockData/mockDataUtils";

// Return the first weekday in February. Necessary since make a payment datepicker requires entering a future, non-holiday weekday.
function getNonHolidayWeekday() {
  const nextYear = new Date().getFullYear() + 1;
  // Choosing a future weekday that also won't be a holiday to assure it's a valid date to enter.
  const firstWeekdayInFeb = getFirstWeekDayOfMonth(new Date(nextYear, 1, 1));
  return formatDate(new Date(nextYear, 1, firstWeekdayInFeb), "MM/DD/YYYY");
}

// Helper to fill out step 1 for a single payee
function completeStep1({
  payee,
  amount,
  frequencyType,
  frequency,
  payFrom,
  memo,
  deliverBy,
  note,
  ends,
  ebill,
  amountType,
}) {
  cy.findByLabelText("Select " + payee).click({
    force: true,
  });
  // Fill out the form for payee
  cy.findByTestId(payee + " fieldset").within(() => {
    if (ebill) {
      cy.findByLabelText(frequencyType).click({ force: true });
      if (frequency) {
        cy.findAllByLabelText("Frequency").first().click();
        cy.findByText(frequency).click();
      }

      if (amount) {
        if (frequencyType === "One Time Payment") {
          cy.findAllByLabelText("Please Select Amount")
            .first()
            .click({ force: true });
          cy.findByText(amountType).click();
          if (amount) {
            cy.findByLabelText("Other Amount").type(amount);
          }
        } else {
          cy.findAllByLabelText("Amount").type(amount, {
            force: true,
          });
        }
      }
    } else {
      if (frequency) {
        cy.findAllByLabelText("Frequency").first().click();
        cy.findByText(frequency).click();
      }
      if (amount) {
        cy.findAllByLabelText("Amount").type(amount, {
          force: true,
        });
      }
    }

    if (payFrom) {
      cy.findAllByLabelText("Pay From").first().click();
      cy.findByText(payFrom).click();
    }

    if (ends) {
      cy.findAllByLabelText("Ends").first().click();
      cy.findByText(ends).click();
    }

    if (memo) {
      cy.findByLabelText("Memo (Optional)").type(memo);
    }

    if (deliverBy) {
      cy.findByLabelText("Deliver By").clear().type(deliverBy);
    }

    if (note) {
      cy.findByLabelText("Notes (Optional)").type(note);
    }

    cy.findByLabelText("Deliver By").type(getNonHolidayWeekday());
  });
}

function submitCompletedForm(data) {
  completeStep1(data);
  cy.findByText("Continue").click(); // Proceed to step 2
  cy.findByText("Submit").click(); // Submit step 3
}

// Helper to delete a payment
function deleteScheduledPayment({
  payee,
  number,
  amount,
  date,
  isSeries,
  isAutoPay,
}) {
  cy.findByTestId(payee + " fieldset").within(() => {
    cy.findByText("View Payments").click();
  });

  cy.findByLabelText("Review your upcoming payments").within(() => {
    cy.findByText(
      `You have ${number} upcoming payment${number > 1 ? "s" : ""} to ${payee}`
    );
    cy.findByLabelText(
      "Expand details for $" + amount + " payment on " + date
    ).click();
    cy.findByText("Delete").click();
  });
  if (isSeries) {
    if (isAutoPay) {
      cy.findByText(
        "Do you want to delete this payment or your eBill AutoPay settings?"
      );
    } else {
      cy.findByText(
        "Do you want to delete this electronic payment to " +
          payee +
          " or the entire series?"
      );
    }
    if (isSeries === "oneTime") {
      cy.findByText("Delete This Payment").click();
      cy.findByText("Are you sure you want to delete this payment?");
      cy.findByText("Delete Payment").click();
      cy.findByText("Your payment has been deleted");
      cy.findByText("Got It").click();
    } else if (isSeries === "series") {
      if (isAutoPay) {
        cy.findByText("Delete AutoPay Settings").click();
        cy.findByText(
          "Are you sure you want to delete your eBill AutoPay settings?"
        );
        cy.findByText(/all subsequent payments/);
        cy.findByText("Delete eBill AutoPay Settings").click();
        cy.findByText("Your eBill AutoPay settings have been deleted");
      } else {
        cy.findByText("Delete Entire Series").click();
        cy.findByText("Are you sure you want to delete all payments?");
        cy.findByText(/all subsequent payments will be/);
        cy.findByText("Delete Payments").click();
        cy.findByText("Your repeating payments have been deleted");
      }
      cy.findByText("Got It").click();
    }
  } else {
    cy.findByText("Are you sure you want to delete this payment?");
    cy.findByText("Delete Payment").click();
    cy.findByText("Your payment has been deleted");
    cy.findByText("Got It").click();
  }
}

describe("Make a Payment", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.setScenario(
      "Get Accounts Response",
      "Personal Checking and Money Market"
    );
  });

  describe("eBill", () => {
    it("should clear child form fields when the frequencyType changes", () => {
      completeStep1({
        payee: "Wachovia Bank active ebill (**3C)",
        payFrom: "My Money Market (9811)",
        frequencyType: "One Time Payment",
        amountType: "Other",
        deliverBy: "01/15/2021",
        amount: 2100.42,
        ebill: true,
      });

      cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(
        () => {
          // Now change the frequency type
          cy.findAllByLabelText("Repeating Payment").click({ force: true });

          // Now the child form fields should be reset
          cy.findByLabelText("Amount").should("have.value", "");
        }
      );
    });

    it("should support saving Discover Credit Card one time payment", () => {
      cy.findByLabelText("Select Discover CC available ebill (1576)").click({
        force: true,
      });
      cy.findByTestId("Discover CC available ebill (1576) fieldset").within(
        () => {
          cy.findAllByText("One Time Payment").last().click({ force: true });

          // Should show the amount textbox if "Other" amount is selected
          cy.findAllByLabelText("Please Select Amount")
            .first()
            .click({ force: true });
          cy.findByText("Last Statement Balance"); // this field only shows for Discover credit card type payments
          cy.findByText("Other").click();
          cy.findByLabelText("Other Amount");

          // Now switch to selecting a specific amount
          cy.findAllByLabelText("Please Select Amount")
            .first()
            .click({ force: true });

          // Now select Amount due instead
          cy.findByText("Amount Due").click();

          // The amount text field shouldn't show anymore since selected a predetermined value
          cy.contains("Other Amount").should("not.exist");
        }
      );
      cy.findByText("Continue").click();
      cy.findByText("Submit").click();
      cy.findByTestId("Discover CC available ebill (1576) success");
    });

    it("should support saving Ebill enrolled one time payment", () => {
      cy.findByLabelText("Select Wachovia Bank active ebill (**3C)").click({
        force: true,
      });
      cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(
        () => {
          cy.findAllByText("One Time Payment").last().click({ force: true });

          // Should show the amount textbox if "Other" amount is selected
          cy.findAllByLabelText("Please Select Amount")
            .first()
            .click({ force: true });
          cy.contains("Last Statement Balance").should("not.exist"); // this field only shows for Discover credit card type payments, not regulary ebills
          cy.findByText("Other").click();
          cy.findByLabelText("Other Amount");

          // Now switch to selecting a specific amount
          cy.findAllByLabelText("Please Select Amount")
            .first()
            .click({ force: true });

          // Now select Amount due instead
          cy.findByText("Amount Due").click();

          // The amount text field shouldn't show anymore since selected a predetermined value
          cy.findByLabelText("Other Amount").should("not.exist");
        }
      );
      cy.findByText("Continue").click();
      cy.findByText("Submit").click();
      cy.findByTestId("Wachovia Bank active ebill (**3C) success");
    });

    it("should support ebill repeating payment", () => {
      cy.findByLabelText("Select Wachovia Bank active ebill (**3C)").click({
        force: true,
      });
      cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(
        () => {
          cy.findAllByText("Repeating Payment").last().click({ force: true });
          cy.contains("Please Select Amount").should("not.exist"); //amount dropdown should not exist for non-autopay ebill repeating payment
          cy.findByLabelText("Amount").type(30);
          cy.findAllByLabelText("Frequency").first().click();
          cy.findByText("Weekly").click();
        }
      );
      cy.findByText("Continue").click();
      cy.findByText("Submit").click();
      cy.findByTestId("Wachovia Bank active ebill (**3C) success");
    });
  });

  describe("autoPay", () => {
    it("should allow user to set up an autopay payment for ebill users", () => {
      cy.findByLabelText("Select Wachovia Bank active ebill (**3C)").click({
        force: true,
      });
      cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(
        () => {
          // find the autopay radio selection displaying and select it
          cy.findAllByLabelText("eBill AutoPay").click({ force: true });
          cy.findAllByLabelText("Please Select Amount")
            .eq(0)
            .click({ force: true });
          cy.findByText("Amount Due");
          cy.findByText("As of 11/04/2019: $42.51");
          cy.findByText("Minimum Payment");
          cy.findByText("As of 11/04/2019: $22.51");
          cy.findByText("Amount Due").click({ force: true });
          cy.findAllByText("As of 11/04/2019: $42.51");
          cy.findByText("Due Date");
          cy.findByText("Due Date: 02/25/2020");
          cy.findAllByLabelText("Deliver By").eq(0).click({ force: true });
          cy.findByText("Date eBill Arrives").click({ force: true });
          cy.findByText("Date eBill Arrives: 11/25/2019");
        }
      );
      cy.findByText("Continue").click();
      cy.findByText("Amount Due ($42.51)"); //autopay gets extra amount label and dollar amount in parentheses
      cy.findByText("Date eBill Arrives"); //autopay get a string here rather than a date
      cy.findByText("Electronic Payment"); // it will always be electronic payment
      cy.findByText("Submit").click();
      cy.findByTestId("Wachovia Bank active ebill (**3C) success").contains(
        "Congratulations! Your eBill AutoPay payment to Wachovia Bank active ebill (**3C) has been scheduled."
      );
    });

    it("should show autopay 'ON' and AutoPay edit banner if user is enrolled", () => {
      cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
        force: true,
      });
      cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
        cy.findByText("eBill AutoPay ON");
        cy.findByText("You have eBill AutoPay set up for this payee");
        cy.findByText("One Time"); //one time is the only frequency available
      });
    });

    it("should submit a one time payment (not autopay) if user is enrolled", () => {
      cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
        force: true,
      });
      cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
        cy.findAllByLabelText("Please Select Amount") //autopay will always see the dropdown
          .eq(0)
          .click({ force: true });
        cy.findByText("Amount Due").click({ force: true });
      });
      cy.findByText("Continue").click();
      cy.contains("As of 11/04/2019:").should("not.exist"); //just a one time payment
      cy.findByText("One Time"); //Its a forced one time payment because user is enrolled in autopay
    });

    it("should dismiss the autopay banner when the X is clicked", () => {
      cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
        force: true,
      });
      cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
        //click the close x on the banner
        cy.findByLabelText("Close alert dialog").click();
      });
      //user should see the helper text
      cy.findByText("Edit eBill AutoPay");
      cy.contains("You have eBill AutoPay set up for this payee").should(
        "not.exist"
      );

      //toggle the payee
      cy.findByLabelText("Deselect Chase Bank has Autopay (9999)").click({
        force: true,
      });
      cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
        force: true,
      });
      //the autobanner should stay hidden
      cy.contains("You have eBill AutoPay set up for this payee").should(
        "not.exist"
      );
    });

    it("should allow the user to edit their autopay", () => {
      cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
        force: true,
      });
      cy.findByText("Edit eBill AutoPay").click();
      cy.findByText(
        "Edit eBill AutoPay Payment for Chase Bank has Autopay (9999)"
      );
      cy.findByText("Amount Due");
      cy.findAllByText("As of 11/04/2019: $42.51");
      cy.findAllByLabelText("Please Select Amount")
        .eq(0)
        .click({ force: true });
      cy.findByText("Minimum Payment").click({ force: true });
      cy.findAllByLabelText("Deliver By").within(() => {
        cy.findByText("Due Date");
      });
      cy.findByText("Due Date: 12/30/2019");
      cy.findAllByLabelText("Deliver By").eq(0).click({ force: true });
      cy.findByText("Date eBill Arrives").click();
      cy.findByText("Continue").click();
      cy.findByText("Date eBill Arrives");
      cy.findByText("Minimum Payment Due ($22.51)");
      cy.findByText("Submit").click();
      cy.findByTestId("Chase Bank has Autopay (9999) success").contains(
        "Congratulations! Your eBill AutoPay payment to Chase Bank has Autopay (9999) has been updated."
      );
    });

    it("should display the switch to autopay banner for ebill enrolled users with repeating payments set up", () => {
      cy.findByLabelText(
        "Select Happy Bank Ebills Repeating Payment (9998)"
      ).click({
        force: true,
      });
      cy.findByText("Set up eBill AutoPay for the easiest way to pay");
      cy.findByTestId(
        "Happy Bank Ebills Repeating Payment (9998) fieldset"
      ).within(() => {
        //click the close x on the banner
        cy.findByLabelText("Close alert dialog").click();
      });
      cy.findByText("Switch to eBill AutoPay").click();
      cy.findByText(
        "Edit Payments for Happy Bank Ebills Repeating Payment (9998)"
      );
      cy.contains("Delete").should("not.exist"); //can't delete a switch to autopay
      cy.findAllByLabelText("Please Select Amount")
        .eq(0)
        .click({ force: true });
      cy.findByText("Amount Due").click({ force: true });
      cy.findByText("Continue").click();
      cy.findByText("Due Date");
      cy.findByText("Submit").click();
      cy.findByText("Amount Due ($235.05)");
      cy.findByTestId(
        "Happy Bank Ebills Repeating Payment (9998) success"
      ).contains(
        "Congratulations! Your eBill AutoPay payment to Happy Bank Ebills Repeating Payment (9998) has been updated."
      );
    });

    it("should allow user to set up an autopay payment for ebill users when they don't have an ebill yet", () => {
      cy.findByLabelText(
        "Select Vampire Bank ebill enrolled but no ebill yet (**66)"
      ).click({
        force: true,
      });
      cy.findByTestId(
        "Vampire Bank ebill enrolled but no ebill yet (**66) fieldset"
      ).within(() => {
        // find the autopay radio selection displaying and select it
        cy.findByLabelText("eBill AutoPay").click({ force: true });
        cy.findAllByLabelText("Please Select Amount")
          .eq(0)
          .click({ force: true });
        cy.findByText("Amount Due").click({ force: true });
        cy.contains("As of 11/04/2019: $42.51").should("not.exist"); //there won't be dollar amounts yet since there isnt an ebill yet
        cy.findByText("Due Date");
        cy.contains("Due Date: 02/25/2020").should("not.exist"); //there won't be dates yet since there isnt an ebill yet
        cy.findAllByLabelText("Deliver By").eq(0).click({ force: true });
        cy.findByText("Date eBill Arrives").click({ force: true });
      });
      cy.findByText("Continue").click();
      cy.findByText("Amount Due"); //autopay gets extra amount label and dollar amount in parentheses
      cy.findByText("Date eBill Arrives"); //autopay get a string here rather than a date
      cy.findByText("Electronic Payment"); // it will always be electronic payment
      cy.findByText("Submit").click();
      cy.findByTestId(
        "Vampire Bank ebill enrolled but no ebill yet (**66) success"
      ).contains(
        "Congratulations! Your eBill AutoPay payment to Vampire Bank ebill enrolled but no ebill yet (**66) has been scheduled."
      );
    });

    it("should allow user to edit an existing repeating payment", () => {
      cy.findByLabelText("Select DiscoverCard (4065)").click({
        force: true,
      });
      cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
        // find the autopay radio selection displaying and select it
        cy.findByText("Edit your repeating payment").click({
          force: true,
        });
      });
      cy.findByText("Edit Payments for DiscoverCard (4065)");
      cy.contains("Please Select Amount").should("not.exist"); //repeating payments show plain amount field
      cy.findAllByLabelText("Frequency")
        .eq(0)
        .within(() => {
          cy.findByText("Every 4 Weeks");
        });
      cy.findByLabelText("Deliver Next Payment By").should(
        "have.value",
        daysInFuture(20, "MM/DD/YYYY")
      );
    });
  });

  // Only 5 payees can be scheduled at once. So assure an error dialog shows when the user tries to select the 6th.
  it("should display an error message when the user tries to select the 6th payee", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({ force: true });
    cy.findByLabelText("Select Wachovia Bank active ebill (**3C)").click({
      force: true,
    });
    cy.findByLabelText("Select My Checking (2374)").click({ force: true });
    cy.findByLabelText("Select Test Payee 4 (1574)").click({ force: true });
    cy.findByLabelText("Select Test Payee 5 (1575)").click({ force: true });
    cy.findByLabelText(
      "Select Test Payee with Only Postal Code in address (1576)"
    ).click({ force: true });

    // Warning should now display
    cy.findByText("You've reached the limit");

    // Dismiss the warning
    cy.findByText("Got It").click();

    // Now try to check it again to assure I still can't select the 6th:
    cy.findByLabelText(
      "Select Test Payee with Only Postal Code in address (1576)"
    ).click({
      force: true,
    });

    // Warning should now display again
    cy.findByText("You've reached the limit");
  });

  it("should display error alert on the final step if a server-side error occurs", () => {
    cy.setScenario(
      "Schedule Payment Response",
      "Fail Only DiscoverCard (4065)"
    );
    submitCompletedForm({
      payee: "DiscoverCard (4065)",
      amount: 31.25,
    });
    // This displays at the top of the page
    cy.findByText(
      "There was an error processing your payment to DiscoverCard (4065)."
    );

    // This displays under "Payment Details". Leaving out the middle since it's in bold and confuses findByText.
    cy.findByText(/could not be completed. Please try again./);
  });

  it("should display a warning when a scheduled payment exceeds an account's current balance", () => {
    completeStep1({
      payee: "DiscoverCard (4065)",
      amount: 150,
    });

    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      payFrom: "My Money Market (9811)",
      frequencyType: "One Time Payment",
      amountType: "Other",
      amount: 2100.42,
      ebill: true,
    });

    cy.findByText(
      /You'll need to make a deposit to cover your scheduled payments/
    );

    cy.findByText(
      "$150.00 exceeds your available balance for Personal Checking (9815) of $123.45."
    );

    cy.findByText(
      "$2,100.42 exceeds your available balance for My Money Market (9811) of $1,131.51."
    );
  });

  it("should reset the payee and clear existing errors when it is deselected", () => {
    // Select both a plain and ebill accounts to test reset on deselect for both scenarios.
    completeStep1({
      payee: "DiscoverCard (4065)",
      amount: 150,
      deliverBy: "01/15/2021",
      note: "&",
    });

    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      payFrom: "My Money Market (9811)",
      frequencyType: "One Time Payment",
      deliverBy: "01/15/2021",
      amountType: "Other",
      amount: 2100.42,
      ebill: true,
    });

    cy.findByLabelText("Deselect DiscoverCard (4065)").click({
      force: true,
    });
    cy.findByLabelText("Deselect Wachovia Bank active ebill (**3C)").click({
      force: true,
    });

    // Now, reselect each and assure form is empty
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });

    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByLabelText("Amount").should("have.value", "");
      cy.findByLabelText("Notes (Optional)").should("have.value", "");
      // The validation error from setting a bogus note should no longer display.
      cy.contains(
        'The following characters are not allowed in note: <>()&;"[]{}'
      ).should("not.exist");
    });

    cy.findByLabelText("Select Wachovia Bank active ebill (**3C)").click({
      force: true,
    });

    cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(() => {
      // child fields should not be visible since the initial unselected ebill radio buttons should only be visible
      cy.contains("Pay From").should("not.exist");
    });
  });

  it("should reset the form when reset is clicked", () => {
    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      payFrom: "My Money Market (9811)",
      frequencyType: "One Time Payment",
      amountType: "Other",
      amount: 2100.42,
      ebill: true,
    });

    // Now, reset the form
    cy.findByText("Reset").click();

    // Now ebill child fields shouldn't render since form was reset
    cy.findByTestId("Wachovia Bank active ebill (**3C) fieldset").within(() => {
      cy.contains("Pay From").should("not.exist");
    });
  });

  describe("Server-side Validation", () => {
    it("should display when the form is submitted with invalid values", () => {
      cy.setScenario("Schedule Payment Response", "");

      // Need to submit 2 payees to fully test server-side validation since each has different fields.
      completeStep1({
        payee: "DiscoverCard (4065)",
        deliverBy: "12/25/2021",
        note: "[",
      });

      completeStep1({
        payee: "My Checking (2374)",
        memo: "[",
      });

      cy.findByText("Continue").click();

      cy.findByText(
        'The following characters are not allowed in note: <>()&;"[]{} for DiscoverCard (4065)'
      );

      cy.findByText("This day cannot be selected for DiscoverCard (4065)");

      cy.findByText(
        'The following characters are not allowed in memo: <>()&;"[]{} for My Checking (2374)'
      );
    });
    it("should show custom message for duplicate payment error", () => {
      cy.setScenario("Schedule Payment Response", "Payment.Duplicate");

      completeStep1({
        payee: "DiscoverCard (4065)",
        amount: 31.25,
      });

      // Now submit to proceed to step 2
      cy.findByText("Continue").click();

      // Now submit to proceed to final step
      cy.findByText("Submit").click();

      // Using this style because there's markup around parts of the text.
      // More here: https://stackoverflow.com/questions/55509875/how-to-query-by-text-string-which-contains-html-tags-using-react-testing-library
      cy.findByTestId("DiscoverCard (4065) error").contains(
        "Looks like you've already scheduled a payment to"
      );
    });
  });

  describe("Client-side Validation", () => {
    it("should display on blur of empty required fields", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
      );
      // Select first payee, then blur on each field
      cy.findByLabelText("Select Test Payee 4 (1574)").click({
        force: true,
      });
      cy.findByTestId("Test Payee 4 (1574) fieldset").within(() => {
        cy.findAllByLabelText("Amount").focus().blur();
        /*cy.findAllByLabelText("Deliver By")
          .focus()
          .clear() // must clear since it has a default value
          .blur();*/
        cy.findAllByLabelText("Frequency").first().focus().blur();
        cy.findByLabelText("Deliver By").clear().blur();

        // Now confirm empty fields display an error after blur above
        cy.findByText("Enter a valid Amount");
        cy.findByText("Enter a valid Frequency");
        //cy.findByText("Enter a valid Date format (MM/DD/YYYY).");
      });
    });

    it("should display onBlur of fields with invalid values", () => {
      cy.findByLabelText("Select Test Payee 4 (1574)").click({
        force: true,
      });
      cy.findByTestId("Test Payee 4 (1574) fieldset").within(() => {
        cy.findAllByLabelText("Amount").type(10001).blur();

        // Now assure errors display
        cy.findByText(
          "Your bill payment exceeds the maximum allowable amount of $10,000.00"
        );
      });

      cy.findByLabelText("My Checking (2374)").click({ force: true });
      cy.findByTestId("My Checking (2374) fieldset").within(() => {
        // next: write test for memo validation of special chars
        cy.findByLabelText("Memo (Optional)").type("&").blur();
        cy.findByLabelText("Notes (Optional)").type("[").blur();

        // Now assure errors display
        cy.findByText(
          'The following characters are not allowed in memo: <>()&;"[]{}'
        );
        cy.findByText(
          'The following characters are not allowed in note: <>()&;"[]{}'
        );
      });
    });

    it('should require "Number of Payments" when "Ends" is set to "After Set Number of Payments"', () => {
      cy.findByLabelText("Select Test Payee 4 (1574)").click({
        force: true,
      });
      cy.findByTestId("Test Payee 4 (1574) fieldset").within(() => {
        cy.findAllByLabelText("Frequency").first().click();
        cy.findByText("Weekly").click();
        cy.findAllByLabelText("Ends").first().click();
        cy.findAllByText("After Set Number of Payments").click();
        cy.findAllByLabelText("Number of Payments").focus().blur();
        cy.findByText(/Enter a valid Number of Payments/);
      });
    });

    it("should display when step 1 is submitted with invalid values", () => {
      // First, submit empty
      cy.findByText("Continue").click();
      cy.findByText("Select at least one Payee");

      // Select a payee and submit empty
      cy.findByLabelText("Select Test Payee 4 (1574)").click({
        force: true,
      });
      cy.findByText("Continue").click();

      // Confirm validation errors display in Error Summary
      cy.findByText("Enter a valid Frequency for Test Payee 4 (1574)");
      cy.findByText("Enter a valid Amount for Test Payee 4 (1574)");

      // Confirm shorter validation errors display below the inputs
      cy.findByText("Enter a valid Amount");
      cy.findByText("Enter a valid Frequency");
    });
  });

  it("should display the limited withdrawal copy when a savings account is the payee", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findAllByLabelText("Pay From").first().click();
      cy.findAllByText("My Money Market (9811)").first().click();
    });
    cy.findByText(
      "Certain types of transactions from this account are limited to 6 per calendar month. Additional limited transactions may lead to account closure."
    );
  });

  it("should not display the limited withdrawal copy when a checking account is the payee", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findAllByLabelText("Pay From").first().click();
      cy.findAllByText("Personal Checking (9815)").first().click();
    });
    cy.findAllByText(
      "Certain types of transactions from this account are limited to 6 per calendar month. Additional limited transactions may lead to account closure."
    ).should("not.be.visible");
  });

  it("should only display memo field for TRUST_CHECK AND DIRECT_CHECK deliveryMethods", () => {
    // First, confirm it's hidden for an electronic payee
    cy.findByLabelText("Select DiscoverCard (4065)").click({ force: true });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.contains("Memo (Optional)", { timeout: 100 }).should("not.exist");
    });

    // Now confirm it's displayed for a mail payee
    cy.findByLabelText("My Checking (2374)").click({
      force: true,
    });
    cy.findByTestId("My Checking (2374) fieldset").within(() => {
      cy.findByLabelText("Memo (Optional)");
    });
  });

  it("should not display the address for payees with only a postal code", () => {
    completeStep1({
      payee: "Test Payee with Only Postal Code in address (1576)",
      payFrom: "My Money Market (9811)",
      frequency: "One Time",
      amountType: "Other",
      amount: 2100.42,
      ebill: false,
    });
    cy.findByText("Continue").click();
    cy.contains("Address").should("not.exist");
  });

  it("should successfully submit", () => {
    cy.setScenario("Schedule Payment Response", "Success");

    completeStep1({
      payee: "DiscoverCard (4065)",
      amount: 31.25,
    });

    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      amountType: "Other",
      amount: 828.29,
      frequencyType: "Repeating Payment",
      frequency: "Monthly",
      ebill: true,
    });

    // Now submit to proceed to step 2
    cy.findByText("Continue").click();

    // Now submit to proceed to final step
    cy.findByText("Submit").click();

    cy.findByTestId("DiscoverCard (4065) success");
    cy.findByTestId("Wachovia Bank active ebill (**3C) success");

    // Now should be able to return to step 1 and see an empty form by clicking on "Make a Payment" under "What would you like to do next?"
    cy.findByTestId("do-next-links").within(() => {
      cy.findByText("Make a Bill Payment").click();
    });

    // Look for the Continue button on Step 1 to confirm we're back on Step 1.
    cy.findByText("Continue");
  });

  it("should handle partial success", () => {
    cy.setScenario(
      "Schedule Payment Response",
      "Fail Only DiscoverCard (4065)"
    );

    completeStep1({
      payee: "DiscoverCard (4065)",
      amount: 31.25,
    });
    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      amount: 828.29,
      frequencyType: "Repeating Payment",
      frequency: "Monthly",
      ebill: true,
    });

    // Now submit to proceed to step 2
    cy.findByText("Continue").click();

    // Now submit to proceed to final step
    cy.findByText("Submit").click();

    // Using this style because there's markup around parts of the text.
    // More here: https://stackoverflow.com/questions/55509875/how-to-query-by-text-string-which-contains-html-tags-using-react-testing-library
    cy.findByTestId("DiscoverCard (4065) error").contains(
      "Your payment to DiscoverCard (4065) could not be completed. Please try again."
    );

    cy.findByTestId("Wachovia Bank active ebill (**3C) success").contains(
      "Congratulations! Your repeating payment to Wachovia Bank active ebill (**3C) has been scheduled."
    );

    // It should only display the successful payments in GraySummaryBox.
    // So this successful payment should display the amount for only the one payment
    cy.findByLabelText("Total Payment Amount").within(() => {
      cy.findByText("$828.29");
    });
  });

  it("should set the default payment account and set the default 'pay from' account for unselected payees", () => {
    cy.findByText("Update").click();
    cy.findAllByLabelText("Default Payment Account").first().click();
    cy.findAllByText("My Money Market (9811)").first().click({ force: true });
    cy.findByText("Save Changes").click();

    cy.findByLabelText(
      "Your default payment account is My Money Market (9811)."
    );

    // Now assure the first payee reflects the newly selected default
    cy.findByLabelText("Select DiscoverCard (4065)").click({ force: true });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      // Since no good way to read selected value from combobox,
      // just looking for text within to confirm selection.
      cy.findByTestId("combobox-truncated-value").contains(
        "My Money Market (9811)"
      );
    });
  });

  it("should show aggregate payment total and number of selected payees", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
    );

    completeStep1({
      payee: "DiscoverCard (4065)",
      // Deliberately putting in a large number with multiple commas to assure that's handled.
      amount: 3235201,
    });

    completeStep1({
      payee: "Wachovia Bank active ebill (**3C)",
      amount: 151.05,
      frequencyType: "Repeating Payment",
      frequency: "Monthly",
      ebill: true,
    });

    cy.findByLabelText("Number of Payees Selected").should("have.text", "2");
    cy.findByLabelText("Total Payment Amount").should(
      "have.text",
      "$3,235,352.05"
    );
  });

  it("should show payees when enrolled and has payees", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
    );
    cy.findByText("Let\u2019s pay some bills, Vishal");
  });

  it("should support enrollment when eligible", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "Unenrolled: Eligible - Brand New Customer (BAU)"
    );
    cy.findByText("Welcome to Discover Bank Online Bill Pay");
  });

  it("should show migrate customer from FIS screen when eligible", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "Unenrolled: Eligible - Migrate Customer from FIS"
    );
    cy.findByText("Discover Bill Pay is better than ever");
  });

  it("should show no funds available screen when no funds", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "Unenrolled: Eligible - No Funds Available"
    );
    cy.findByText("Add funds to start paying your bills");
  });

  it("should show error page when unenrolled and not eligible", (done) => {
    // via https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
    cy.on("uncaught:exception", (err, runnable) => {
      // This section only applies to development mode.
      done();
      return false; // return false to prevent the error from failing this test
    });
    cy.setScenario("Customer Enrollment Status", "Unenrolled: Not eligible");
    cy.findByText("Looks like something went wrong");
    done(); // necessary since exception is only uncaught in development since ErrorBoundary catches in prod build.
  });

  it("should show add a payee message when enrolled with no payees and redirect to manage-payees when 'Add a Payee' is clicked", () => {
    cy.setScenario("Customer Enrollment Status", "No Payees");
    cy.findByText("Add a Payee to get started with Bill Pay");
    cy.findByText("Add a Payee").click();
    cy.url("http://localhost:3000/manage-payees/");
  });

  it("should show a default payment account as the first account if one is not defined", () => {
    cy.setScenario("Get Accounts Response", "Personal Checking");
    cy.findByLabelText(
      "Your default payment account is Personal Checking (9815)."
    );
    cy.findByLabelText("Select DiscoverCard (4065)").click({ force: true });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByText("Personal Checking (9815)");
    });
  });

  it("should only display the Update Now link for users with more than one account", () => {
    cy.setScenario("Get Accounts Response", "Personal Checking");
    cy.contains("Update default payment account").should("not.exist");
    cy.setScenario(
      "Get Accounts Response",
      "Personal Checking and Money Market"
    );
    cy.findByLabelText("Update default payment account");
  });

  it("should show 'Add your Discover credit card to your payees' banner when user has Discover Cards to enroll, and enroll these users", () => {
    cy.setScenario(
      "Customer Enrollment Status",
      "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
    );
    cy.findByText("Add Now").click();
    cy.findByLabelText("Add your Discover Credit Card to your payees.").within(
      () => {
        cy.findByText("Aaron's Discover Credit Card (8941)").click();
        cy.findByText("Cory's Discover Credit Card (1590)").click();
        cy.findByText("Dana's Discover Credit Card (9171)");
        cy.findByText("Add Now").click();
      }
    );
    cy.findByLabelText("Select Dana's Discover Credit Card (9171)").click({
      force: true,
    });
    cy.findByTestId("Dana's Discover Credit Card (9171) fieldset");
    //then open the overlay again and you should see 2 Cards listed
    cy.findByText("Add Now").click();
    cy.findByLabelText("Add your Discover Credit Card to your payees.").within(
      () => {
        cy.findByText("Aaron's Discover Credit Card (8941)");
        cy.findByText("Cory's Discover Credit Card (1590)");
        cy.findByText("Add Now").click();
      }
    );
    //confirm they have both been added to the list
    cy.findByLabelText("Select Aaron's Discover Credit Card (8941)").click({
      force: true,
    });
    cy.findByTestId("Aaron's Discover Credit Card (8941) fieldset");
    cy.findByLabelText("Select Cory's Discover Credit Card (1590)").click({
      force: true,
    });
    cy.findByTestId("Cory's Discover Credit Card (1590) fieldset");
    //confirm that the Add Now Button no longer displays as user has no more credit card payees to add
    cy.contains("Add Now").should("not.exist");

    // Must reset DB and reload page after this test since there's no way to "undo" adding cards via the UI. This way the test can be re-run reliably without needing to restart the app to regen the db.
    cy.resetDb();
  });
});

describe("Edit a Payment", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.setScenario(
      "Get Accounts Response",
      "Personal Checking and Money Market"
    );
  });

  it("should show the scheduled payment as a single one time payment in the make a payment flow", () => {
    cy.visit("http://localhost:3000/review-payments");
    cy.findByLabelText("Edit payment of $1.30 to DiscoverCard (4065)").click({
      force: true,
    });
    cy.findByText("Edit Payment for DiscoverCard (4065)");
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByTestId("combobox-truncated-value").contains(
        "My Money Market (9811)"
      );
      cy.findByLabelText("Amount").should("have.value", "$1.30");
      cy.findByLabelText("Deliver By").should(
        "have.value",
        daysInFuture(0, "MM/DD/YYYY")
      );
      cy.findByText("One Time");
      cy.findByLabelText("Notes (Optional)").should(
        "have.value",
        "Have a nice day"
      );
      cy.findAllByLabelText("Amount").clear().type(74.0, {
        force: true,
      });
    });
    cy.findByText("Delete Payment");
    cy.findByText("Payment Updated");
    //proceed to verify screen and check that values are correct
    cy.findByText("Continue").click();
    cy.findByText("Verify Payment Details");
    cy.findByText("My Money Market (9811)");
    cy.findAllByText("$74.00");
    cy.findByText("One Time");
    cy.findByText(daysInFuture(0, "MM/DD/YYYY"));
    cy.findByText("Electronic Payment");
    cy.findByText("Have a nice day");
    cy.findByText("Back");
    //proceed to step 3
    cy.findByText("Submit").click();
    cy.findByTestId("DiscoverCard (4065) success");
  });

  it("should redirect to page not found if payment id passed in the url is not found", () => {
    cy.visit("http://localhost:3000/edit-payment/87605");
    cy.findByText("Page Not Found");
  });
});

describe("View/Delete Scheduled Payments", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.setScenario(
      "Get Accounts Response",
      "Personal Checking and Money Market"
    );
    cy.setScenario(
      "Customer Enrollment Status",
      "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
    );
  });

  it("should allow user to view their scheduled payments and delete a one time payment and a repeating as one time payment", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });
    deleteScheduledPayment({
      payee: "DiscoverCard (4065)",
      number: 4,
      amount: "1.30",
      date: daysInFuture(0, "MM/DD/YYYY"),
    });
    deleteScheduledPayment({
      payee: "DiscoverCard (4065)",
      number: 3,
      amount: "22.51",
      date: "09/24/2020",
      isSeries: "oneTime",
    });

    //now confirm there are 2 payments left
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByText("View Payments").click();
    });

    cy.findByLabelText("Review your upcoming payments").within(() => {
      cy.findByText("You have 2 upcoming payments to DiscoverCard (4065)");
    });
    cy.resetDb();
  });

  it("should allow user to view their scheduled payments and delete their series of scheduled repeating payments", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });
    deleteScheduledPayment({
      payee: "DiscoverCard (4065)",
      number: 4,
      amount: "22.51",
      date: "09/24/2020",
      isSeries: "series",
    });

    //now confirm there are 2 payments left
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByText("View Payments").click();
    });

    cy.findByLabelText("Review your upcoming payments").within(() => {
      cy.findByText("You have 2 upcoming payments to DiscoverCard (4065)");
    });
    cy.resetDb();
  });

  it("should allow user to view their scheduled payments and delete them all", () => {
    cy.findByLabelText("Select DiscoverCard (4065)").click({
      force: true,
    });
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.findByText("View Payments").click();
    });
    cy.findByLabelText("Review your upcoming payments").within(() => {
      cy.findByText("You have 4 upcoming payments to DiscoverCard (4065)");
    });
    cy.findByText("Delete All").click();
    cy.findByText("Are you sure you want to delete all payments?");
    cy.findByText("Delete All Payments").click();
    cy.findByText("Your payments have been deleted");
    cy.findByText("Got It").click();
    //now confirm there are 2 payments left
    cy.findByTestId("DiscoverCard (4065) fieldset").within(() => {
      cy.contains("View Payments").should("not.exist");
    });
    cy.resetDb();
  });

  it("should allow user to view their scheduled payments and delete a one time automatic payment", () => {
    cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
      force: true,
    });
    deleteScheduledPayment({
      payee: "Chase Bank has Autopay (9999)",
      number: 1,
      amount: "55.05",
      date: daysInFuture(0, "MM/DD/YYYY"),
      isSeries: "oneTime",
      isAutoPay: true,
    });
    cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
      cy.contains("View Payments").should("not.exist");
    });
    cy.resetDb();
  });

  it("should allow user to view their scheduled payments and delete their automatic payment settings", () => {
    cy.findByLabelText("Select Chase Bank has Autopay (9999)").click({
      force: true,
    });
    cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
      cy.findByText("eBill AutoPay ON");
    });
    deleteScheduledPayment({
      payee: "Chase Bank has Autopay (9999)",
      number: 1,
      amount: "55.05",
      date: daysInFuture(0, "MM/DD/YYYY"),
      isSeries: "series",
      isAutoPay: true,
    });
    cy.findByTestId("Chase Bank has Autopay (9999) fieldset").within(() => {
      cy.contains("eBill AutoPay ON").should("not.exist");
      cy.contains("View Payments").should("not.exist");
    });
    cy.resetDb();
  });
});

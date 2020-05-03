/// <reference types="Cypress" />

describe("Ebills", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/manage-ebills");
  });

  describe("Enroll Box", () => {
    it("should not show 'Enroll Eligible Payees' section when there are no eligible payees", () => {
      cy.setScenario("Customer Enrollment Status", "No Payees");
      cy.findByTestId("enrollBox").within(() => {
        cy.findByText("Enroll Eligible Payees").should("not.exist");
        cy.findByText("Manage Payees").click();
      });
      cy.url("http://localhost:3000/manage-payees/");
    });
    it("should show both 'Enroll' and 'Don't see a Payee' sections when there is 1 eligible ebill payee", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 1 eligible ebill payee"
      );
      cy.findByTestId("enrollBox").within(() => {
        cy.findByText("Enroll Eligible Payees");
        cy.findByText("Don't see a Payee?");
      });
    });
    it("should show 'Manage Payees' button and redirect to manage-payees on click", () => {
      cy.setScenario("Customer Enrollment Status", "No Payees");
      cy.findByTestId("enrollBox").within(() => {
        cy.findByText("Enroll Eligible Payees").should("not.exist");
        cy.findByText("Manage Payees").click();
      });
      cy.url("http://localhost:3000/manage-payees/");
    });
    it("should show 'Manage Payees' button and 'Enroll' button when there is 1 eligible ebill payee", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 1 eligible ebill payee"
      );
      cy.findByTestId("enrollBox").within(() => {
        cy.findByText("Enroll");
        cy.findByText("Manage Payees");
      });
    });
    it("should show 'Select an Eligible Payee' dropdown when there is at least 2 eligible ebill payees", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
      );
      cy.findByTestId("enrollBox").within(() => {
        cy.findAllByLabelText("Select an Eligible Payee").first().click();
      });
    });
  });

  describe("Enrolled Payees Table", () => {
    it("should display 'You don't have any payees enrolled in eBills' message when there are no enrolled payees", () => {
      cy.setScenario("Customer Enrollment Status", "No Payees");
      cy.findByText("You don't have any payees enrolled in eBills");
    });
    it("should not display 'You don't have any payees enrolled in eBills' message when there are enrolled payees", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
      );
      cy.findByText("You don't have any payees enrolled in eBills").should(
        "not.exist"
      );
    });
    it("should display payees in table", () => {
      cy.setScenario(
        "Customer Enrollment Status",
        "4 payees, 2 reminders, 1 unverified, 1 not reminder eligible"
      );
      cy.findByTestId("enrolled-payees-bluebox").within(() => {
        cy.findByText("Wachovia Bank active ebill (**3C)");
        cy.findByText("Test Payee 4 (1574)");
      });
    });
  });
});

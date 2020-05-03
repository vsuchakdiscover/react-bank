/// <reference types="Cypress" />

describe("Manage Payees", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should add and delete a verified payee", () => {
    cy.findByText("Manage Payees").click();
    cy.get("#downshift-1-input").type("Abe");
    cy.findAllByText("Abercrombie & Fitch").first().click();
    cy.findByLabelText("Account Number").type(12345678);
    cy.findByLabelText("Confirm Account Number").type(12345678, {
      force: true,
    });
    cy.findByText("Continue").click(); // move to confirm page
    cy.findByText("Submit").click(); // final submit
    cy.findByText("Your payee has been added");

    // This is inhibited by Datatable rendering duplicate delete buttons due to expandableRows rendering at all times.
    // See issue #460 for request to change
    cy.findAllByText("Manage Payees").first().click();
    cy.findAllByLabelText("Delete Abercrombie & Fitch").first().click({
      force: true,
    });
    cy.findByText("Delete").click();
    cy.findByText("Abercrombie & Fitch (5678) has been deleted");
    cy.findByText("Any future payments have been cancelled.");
  });

  it("should enter a payee manually", () => {
    cy.findByText("Manage Payees").click();
    cy.findByText("Enter Payee Details").click();
    cy.findByLabelText("Name").type("Manual payee");
    cy.findByLabelText("Nickname").type("nick");
    cy.findByLabelText("Phone Number").type(1234567890);
    cy.findByLabelText("Street Address").type("100 Main St.");
    cy.findByLabelText("City").type("New York");
    cy.findByLabelText("State").select("New York");
    cy.findByLabelText("ZIP Code").type(12345);
    cy.findByText("Continue").click(); // move to confirm page
    cy.findByText("Submit").click(); // final submit
    cy.findByText("Your payee has been added");
  });

  it("should edit a payee", () => {
    cy.findByText("Manage Payees").click();
    cy.findAllByLabelText("Edit DiscoverCard").click();
    cy.findByLabelText("Nickname").clear().type("Discover Credit 1234");
    cy.findByLabelText("Account Number")
      .clear({ force: true })
      .type("123451234");
    cy.findByLabelText("Confirm Account Number")
      .clear({ force: true })
      .type("123451234");
    cy.findByText("Continue").click(); // move to confirm page
    cy.findByText("Submit").click(); // final submit
    cy.findByText("Your payee details have been updated");

    // Great, proved edit works. Now undo to keep this test atomic.
    cy.findAllByText("Manage Payees").first().click();
    cy.findAllByLabelText("Edit Discover Credit 1234").click();
    cy.findByLabelText("Nickname").clear().type("DiscoverCard");
    cy.findByLabelText("Account Number")
      .clear({ force: true })
      .type("123454065");
    cy.findByLabelText("Confirm Account Number")
      .clear({ force: true })
      .type("123454065");
    cy.findByText("Continue").click(); // move to confirm page
    cy.findByText("Submit").click(); // final submit
    cy.findByText("Your payee details have been updated");
  });
});

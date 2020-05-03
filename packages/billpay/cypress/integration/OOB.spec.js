/// <reference types="Cypress" />

describe("Make a Payment", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should prompt user to redirect to Discover login page when a http request returns '401 Basic Login' error", () => {
    cy.setScenario("Customer Enrollment Status", "OOB error (Basic login)");
    cy.on("window:confirm", (confirmMessage) => {
      expect(confirmMessage).to.contain(
        "https://portal.discover.com/customersvcs/universalLogin/logoff?accounttype=none"
      );
      return false;
    });
  });

  it("should prompt user to redirect to OOB login page when a http request returns '401 Basic oob-bank' error", () => {
    cy.setScenario("Customer Enrollment Status", "OOB error (Basic oob-bank)");
    cy.on("window:confirm", (confirmMessage) => {
      expect(confirmMessage).to.contain(
        "https://bank.discover.com/bankac/static/oob/index.html"
      );
      return false;
    });
  });
});

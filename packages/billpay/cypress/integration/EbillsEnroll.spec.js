/// <reference types="Cypress" />

const MANAGE_EBILLS_HEADER = "Receive your bills the easy way";

describe("Ebills", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/manage-ebills");
  });

  describe("Successful Enrollment", () => {
    it("should fill and submit account verification form for cox com payee", () => {
      enrollAsPayee("cox com (7980)");
      cy.findByText("eBill Enrollment for cox com");
      cy.findByText(
        `By selecting "Enroll", you acknowledge that you have received, are able to view and agree to the biller's`
      );
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText("cox com (7980) has been enrolled in eBills");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for DiscoverCard payee", () => {
      enrollAsPayee("DiscoverCard (4065)");
      cy.findByText("eBill Enrollment for DiscoverCard");
      cy.findByLabelText("User ID or Acct Number").type("username", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText(/has been enrolled in eBills/i);
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for mid com payee", () => {
      enrollAsPayee("mid com (7898)");
      cy.findByText("eBill Enrollment for mid com");
      cy.findByLabelText("Your Account Number as listed on bill").type(
        "12345678",
        {
          force: true,
        }
      );
      cy.findByLabelText(/enter your zip code/i).type(11001, { force: true });
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText("mid com (7898) has been enrolled in eBills");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Nissan Motor Acceptance payee", () => {
      enrollAsPayee("Nissan Motor Acceptance (0001)");
      cy.findByText("eBill Enrollment for Nissan Motor Acceptance");
      cy.findByLabelText("User ID").type("12345678", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText(
        "Nissan Motor Acceptance (0001) has been enrolled in eBills"
      );
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Salem Five Bank payee", () => {
      enrollAsPayee("Salem Five Bank (0001)");
      cy.findByText("eBill Enrollment for Salem Five Bank");
      cy.findByLabelText("Up to 11 Digit Loan Account Number").type(
        "12345678",
        {
          force: true,
        }
      );
      cy.findByLabelText("Up to 5 Digit Loan Note Number").type("12345", {
        force: true,
      });
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText("Salem Five Bank (0001) has been enrolled in eBills");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Verizon Wireless payee", () => {
      enrollAsPayee("Verizon Wireless (7898)");
      cy.findByText("eBill Enrollment for Verizon Wireless");
      cy.findByLabelText(/10-digit mobile/i).type("1234567890", {
        force: true,
      });
      cy.findByLabelText("5-digit zip code where you receive your bill").type(
        "12345",
        {
          force: true,
        }
      );
      cy.findByLabelText(
        "Last 4 digits of Social Security number or Tax ID"
      ).type("6789", {
        force: true,
      });
      cy.findByText(
        `By selecting "Enroll", you acknowledge that you have received, are able to view and agree to the biller's`
      );
      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText("Verizon Wireless (7898) has been enrolled in eBills");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Wells Fargo Home Mortgage payee", () => {
      enrollAsPayee("Wells Fargo Home Mortgage (4789)");
      cy.findByText("eBill Enrollment for Wells Fargo Home Mortgage");

      cy.findByLabelText("User ID").type("12345678", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");

      cy.findByLabelText("1.").select(
        "In what city did your spouse attend college?"
      );
      cy.findAllByLabelText("Answer").eq(0).type("Antananarivo");

      cy.findByLabelText("2.").select("In what city did you meet your spouse?");
      cy.findAllByLabelText("Answer").eq(1).type("Gozo");

      cy.findByLabelText("3.").select("In what city did your parents meet?");
      cy.findAllByLabelText("Answer").eq(2).type("Fiji");

      cy.findByText("Enroll").click();
      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText(
        "Wells Fargo Home Mortgage (4789) has been enrolled in eBills"
      );
      cy.resetDb(); // reset since no way to undo via UI
    });
  });

  describe("Another set of tokens Enrollment", () => {
    it("should fill and submit account verification form under 'Another set of tokens' scenario", () => {
      enrollAsPayee("DiscoverCard (4065)");
      cy.setScenario("Enrollment response", "Another set of tokens");

      cy.findByText("eBill Enrollment for DiscoverCard");
      cy.findByLabelText("User ID or Acct Number").type("username", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");
      cy.findByText("Enroll").click();

      cy.findByLabelText(/in what city was your high school/i).type(
        "Abu Dhabi"
      );
      cy.findByText("Enroll").click();

      cy.findByText(MANAGE_EBILLS_HEADER);
      cy.findByText(/has been enrolled in eBills/i);
      cy.resetDb(); // reset since no way to undo via UI
    });
  });

  describe("Failed Enrollment: Enroll Not Eligible", () => {
    it("should fill and submit account verification form for cox com payee", () => {
      enrollAsPayeeNotEligible("cox com (7980)");
      cy.findByText("eBill Enrollment for cox com");
      cy.findByText(
        `By selecting "Enroll", you acknowledge that you have received, are able to view and agree to the biller's`
      );
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for cox com");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for DiscoverCard payee", () => {
      enrollAsPayeeNotEligible("DiscoverCard (4065)");
      cy.findByText("eBill Enrollment for DiscoverCard");
      cy.findByLabelText("User ID or Acct Number").type("username", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for DiscoverCard");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for mid com payee", () => {
      enrollAsPayeeNotEligible("mid com (7898)");
      cy.findByText("eBill Enrollment for mid com");
      cy.findByLabelText("Your Account Number as listed on bill").type(
        "12345678",
        {
          force: true,
        }
      );
      cy.findByLabelText(/enter your zip code/i).type(11001, { force: true });
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for mid com");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Nissan Motor Acceptance payee", () => {
      enrollAsPayeeNotEligible("Nissan Motor Acceptance (0001)");
      cy.findByText("eBill Enrollment for Nissan Motor Acceptance");
      cy.findByLabelText("User ID").type("12345678", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for Nissan Motor Acceptance");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Salem Five Bank payee", () => {
      enrollAsPayeeNotEligible("Salem Five Bank (0001)");
      cy.findByText("eBill Enrollment for Salem Five Bank");
      cy.findByLabelText("Up to 11 Digit Loan Account Number").type(
        "12345678",
        {
          force: true,
        }
      );
      cy.findByLabelText("Up to 5 Digit Loan Note Number").type("12345", {
        force: true,
      });
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for Salem Five Bank");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Verizon Wireless payee", () => {
      enrollAsPayeeNotEligible("Verizon Wireless (7898)");
      cy.findByText("eBill Enrollment for Verizon Wireless");
      cy.findByLabelText(/10-digit mobile/i).type("1234567890", {
        force: true,
      });
      cy.findByLabelText("5-digit zip code where you receive your bill").type(
        "12345",
        {
          force: true,
        }
      );
      cy.findByLabelText(
        "Last 4 digits of Social Security number or Tax ID"
      ).type("6789", {
        force: true,
      });
      cy.findByText(
        `By selecting "Enroll", you acknowledge that you have received, are able to view and agree to the biller's`
      );
      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for Verizon Wireless");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });

    it("should fill and submit account verification form for Wells Fargo Home Mortgage payee", () => {
      enrollAsPayeeNotEligible("Wells Fargo Home Mortgage (4789)");
      cy.findByText("eBill Enrollment for Wells Fargo Home Mortgage");

      cy.findByLabelText("User ID").type("12345678", {
        force: true,
      });
      cy.findByLabelText("Password").type("password");
      cy.findByLabelText("Confirm Password").type("password");

      cy.findByLabelText("1.").select(
        "In what city did your spouse attend college?"
      );
      cy.findAllByLabelText("Answer").eq(0).type("Antananarivo");

      cy.findByLabelText("2.").select("In what city did you meet your spouse?");
      cy.findAllByLabelText("Answer").eq(1).type("Gozo");

      cy.findByLabelText("3.").select("In what city did your parents meet?");
      cy.findAllByLabelText("Answer").eq(2).type("Fiji");

      cy.findByText("Enroll").click();
      cy.findByText("eBill Enrollment for Wells Fargo Home Mortgage");
      cy.findByText("We could not validate your information.");
      cy.resetDb(); // reset since no way to undo via UI
    });
  });
});

function enrollAsPayee(payeeName) {
  cy.setScenario(
    "Customer Enrollment Status",
    "Enrolled: 10 payees, 10 eligible ebill payees"
  );
  cy.setScenario("Enrollment response", "Success");
  cy.get("#enrollPayee-label").click({ force: true });
  cy.findAllByText(payeeName).first().click({ force: true });
  cy.findByText("Enroll").click({ force: true });
}

function enrollAsPayeeNotEligible(payeeName) {
  cy.setScenario(
    "Customer Enrollment Status",
    "Enrolled: 10 payees, 10 eligible ebill payees"
  );
  cy.setScenario("Enrollment response", "Ebill.Enroll.NotEligible");
  cy.get("#enrollPayee-label").click({ force: true });
  cy.findAllByText(payeeName).first().click({ force: true });
  cy.findByText("Enroll").click({
    force: true,
  });
}

describe("Edit Profile", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3002");
  });

  it("should display profile when unenrolled", () => {
    cy.setScenario("Enrollment Status", "unenrolled");

    // Home phone should display
    cy.findByText("Home Phone");
    cy.findByText("630-134-8855");
  });

  it("should hide empty values on profile", () => {
    cy.setScenario("Enrollment Status", "unenrolled");
    cy.setScenario("Profile", "2");

    cy.findByText("Work Phone");

    // This user only has a work number, so home phone shouldn't display
    cy.findByText("Home Phone").should("not.exist");
  });

  it("should support editing profile", () => {
    cy.setScenario("Enrollment Status", "unenrolled");
    cy.setScenario("Profile", "2");

    cy.findByText("Edit Profile Information").click();
    cy.findByLabelText("Ext. (Optional)").clear().type("12345");
    cy.findByText("Agree & Save Changes").click();

    // Now confirm the new data is reflected on the screen
    cy.findByText("224-405-5133 Ext 12345");
  });

  it("should require accepting terms before enrollment", () => {
    cy.setScenario("Enrollment Status", "unenrolled");
    cy.setScenario("Profile", "2");

    cy.findByText("Continue").click();
    cy.findByText("Accepting terms & conditions is required."); // Error should display
  });
});

describe("wide screen", () => {
  beforeEach(() => {
    cy.visit("http://localhost:9009/iframe.html?id=secondarynav--responsive");
  });

  it("should render 5 links", () => {
    cy.findByText("Make a Bill Payment");
    cy.findByText("Repeating Payments");
    cy.findByText("Payment Activity");
    cy.findByText("Manage Payees");
    cy.findByText("Manage eBills");
  });

  it("should show repeating payments as initially active", () => {
    cy.get(".SecondaryNav_active__F5h76");
  });
});

describe("mid-size screen", () => {
  beforeEach(() => {
    cy.viewport(850, 700);
    cy.visit("http://localhost:9009/iframe.html?id=secondarynav--responsive");
  });

  it("should hide the last link that doesn't fit because it's placed in the flyout", () => {
    // Hack: Have to use getAll query since there are two instances of each link rendered in mobile mode
    cy.findAllByText("Repeating Payments").should("be.visible");
    cy.findAllByText("Make a Bill Payment").should("be.visible");
    cy.findAllByText("Payment Activity").should("be.visible");
    cy.findAllByText("Manage Payees").should("be.visible");
    cy.get(":nth-child(5) > a").should("be.hidden"); // Have to select this way since there are two instances of each link rendered to the page

    // Should show 5th link in menu, so open menu and find it
    cy.findByLabelText("Open Payments Menu").click();
    cy.get(".SecondaryNav_flyoutMenu__1tqGu > li > a").should(
      "have.text",
      "Manage eBills"
    );
  });

  it("should show flyout menu button and toggle the menu when the flyout button is clicked", () => {
    cy.findByLabelText("Open Payments Menu").click();
    // Link in flyout should now display
    // Using getAll query for now since it's rendered twice when the flyout is open
    cy.findAllByText("Manage eBills");

    // Now close it
    cy.findByLabelText("Close Payments Menu").click();

    // And confirm there's only on Manage eBills, (which should be hidden), so use findByText instead
    cy.findByText("Manage eBills");
  });
});

describe("mobile screen", () => {
  beforeEach(() => {
    cy.visit("http://localhost:9009/iframe.html?id=secondarynav--mobile");
    cy.viewport(350, 700);
  });

  it("should render only the active page link", () => {
    // Hack: Have to use findAll query since there are two instances of each link rendered in mobile mode
    cy.findAllByText("Make a Bill Payment").should("be.visible"); // only this should be visible, since it's initially active
    cy.findAllByText("Repeating Payments").should("be.hidden");
    cy.findAllByText("Payment Activity").should("be.hidden");
    cy.findAllByText("Manage Payees").should("be.hidden");
    cy.findAllByText("Manage eBills").should("be.hidden");
  });

  it("should show flyout menu button in mobile mode", () => {
    cy.findByLabelText("Open Payments Menu");
  });

  it("should open and close the menu when the toggle menu button is clicked and show the anchors", () => {
    cy.findByLabelText("Open Payments Menu").click();
    cy.get(":nth-child(1) > a").should("have.text", "Make a Bill Payment");
    cy.get(":nth-child(2) > a").should("have.text", "Repeating Payments");
    cy.findByLabelText("Close Payments Menu").click();
    cy.get(":nth-child(1) > a").should("be.hidden");
  });

  it("should open and close the menu when the mobile header is clicked and show the anchors", () => {
    cy.get(".SecondaryNav_mobileHeader__2oyu2").click();
    cy.get(":nth-child(1) > a").should("have.text", "Make a Bill Payment");
    cy.get(":nth-child(2) > a").should("have.text", "Repeating Payments");
    cy.get(".SecondaryNav_mobileHeader__2oyu2").click();
    cy.get(":nth-child(1) > a").should("be.hidden");
  });
});

describe("SelectTypeahead", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:9009/iframe.html?id=forminputs-selecttypeahead--simple-typeahead"
    );
  });

  it("should change selection via arrows and enter key", () => {
    cy.findAllByLabelText("Label placeholder")
      .first()
      .click()
      .type("apple{downArrow}{enter}")
      .blur()
      .should("have.value", "apple");
  });
});

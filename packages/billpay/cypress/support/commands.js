// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

// Set a scenario
Cypress.Commands.add("setScenario", (inputLabel, value) => {
  cy.findByLabelText("Open Scenario Selector").click({ force: true });
  cy.findByLabelText(inputLabel).select(value);
  cy.findByLabelText("Close Scenario Selector").click({ force: true });
});

// Reset mock DB and reload the page
Cypress.Commands.add("resetDb", () => {
  cy.findByLabelText("Open Scenario Selector").click({ force: true });
  cy.findByText("Reset DB").click();
  cy.findByLabelText("Close Scenario Selector").click({ force: true });
  cy.reload();
});

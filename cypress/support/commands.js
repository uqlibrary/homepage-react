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

Cypress.Commands.add('killWindowUnloadHandler', () => {
    cy.window().then(win => {
        win.onbeforeunload = undefined;
    });
});

/**
 * Enables access to redux store via cy.store().
 * Can dispatch actions like example:
 *   cy.store()
 *      .dispatch({
 *          type: 'SOMETHING_FAILED',
 *          payload: 'Simulated Error',
 *      });
 */
Cypress.Commands.add('store', () => {
    return cy.window().its('__store__');
});

// from https://github.com/cypress-io/cypress/issues/877#issuecomment-490504922
Cypress.Commands.add('isNotInViewport', element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add('isInViewport', element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
    });
});

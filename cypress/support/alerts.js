export function clickButton(selector) {
    // hacky call to jquery as fix for occasional error:
    // "This DOM element likely became detached somewhere between the previous and current command.'
    // Try this function when that error occurs occasionally in tests when clicking a button
    // per https://github.com/cypress-io/cypress/issues/7306#issuecomment-639828954
    cy.get(selector).scrollIntoView();
    cy.get(selector).should('exist');
    cy.get(selector).should('be.visible');
    cy.get(selector).then(e => {
        Cypress.$(e).click();
    });

    /*
    for a input field problem clearing, first try adding a .focus(), if that isnt sufficient add eg
        .should('have.value', 'Example alert:')
    */
}

export function hasAWorkingHelpButton() {
    cy.wait(100);
    cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
    clickButton('[data-testid="admin-alerts-help-button"]');
    cy.get('[data-testid="admin-alerts-help-example"]').should('be.visible');
    cy.get('button:contains("Close")').click();
    cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
}

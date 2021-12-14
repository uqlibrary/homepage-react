/**
 * hacky call to jquery as fix for occasional error:
 * "This DOM element likely became detached somewhere between the previous and current command.'
 * Try this function when that error occurs occasionally in tests when clicking a button
 * per https://github.com/cypress-io/cypress/issues/7306#issuecomment-639828954
 * and sometimes its not enough - supply an integer wait time, eg 100, to really make it work (mostly)
 *
 * @param string selector
 * @param int waitRequired
 */
export function clickButton(selector, waitRequired = 0) {
    cy.get(selector).scrollIntoView();
    cy.get(selector).should('exist');
    cy.get(selector).should('be.visible');
    cy.get(selector).then(e => {
        // and when we really get stuck, we add a wait anyway :(
        if (waitRequired > 0) {
            cy.wait(waitRequired);
        }
        Cypress.$(e).click();
    });

    /*
    for a input field problem clearing, first try adding a .focus(), if that isnt sufficient add eg
        .should('have.value', 'Example alert:')
    */
}

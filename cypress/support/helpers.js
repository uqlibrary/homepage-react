/**
 * hacky call to jquery as fix for occasional error:
 * "This DOM element likely became detached somewhere between the previous and current command.'
 * Try this function when that error occurs occasionally in tests when clicking a button
 * per https://github.com/cypress-io/cypress/issues/7306#issuecomment-639828954
 *
 * @param string selector
 * @param string expectedButtonLabel
 */
export function clickButton(selector, expectedButtonLabel) {
    cy.get(selector).scrollIntoView();
    cy.get(`${selector} span:first-child`) // standard MUI button
        .should('exist')
        .should('be.visible')
        // .should('not.be.disabled')
        .should('have.text', expectedButtonLabel) // force reget
        .parent()
        .then(e => {
            Cypress.$(e).trigger('click');
        });
}

/**
 * some buttons have eg svg content - too hard to check
 * @param selector
 * @param expectedButtonLabel
 */
export function clickSVGButton(selector) {
    cy.get(selector).scrollIntoView();
    cy.get(`${selector}`)
        .should('exist')
        .should('be.visible')
        .then(e => {
            Cypress.$(e).trigger('click');
        });
}

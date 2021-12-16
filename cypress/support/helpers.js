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
    cy.get(selector)
        .should('exist')
        .should('be.visible')
        .then(e => {
            // and when we really get stuck, we add a wait anyway :(
            if (waitRequired > 0) {
                cy.wait(waitRequired);
            }
            Cypress.$(e).trigger('click');
        });
    cy.wait(waitRequired);
    // .should($btn => {
    //     expect($btn).to.exist;
    //     expect($btn).to.be.visible;
    //     if (waitRequired > 0) {
    //         cy.wait(waitRequired);
    //     }
    //     Cypress.$($btn).trigger('click');
    // });
}

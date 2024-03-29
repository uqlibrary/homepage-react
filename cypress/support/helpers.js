/**
 * hacky call to jquery as fix for occasional error:
 * "This DOM element likely became detached somewhere between the previous and current command.'
 * Try this function when that error occurs occasionally in tests when clicking a button
 * per https://github.com/cypress-io/cypress/issues/7306#issuecomment-639828954
 */

export function clickButton(selector) {
    cy.waitUntil(() => cy.get(selector).should('exist'));
    cy.get(selector).scrollIntoView();
    cy.get(selector).click();
    // cy.get(`${selector} span:first-child`) // standard MUI button
    //     .should('exist')
    //     .should('be.visible')
    //     // .should('not.be.disabled')
    //     .should('have.text', expectedButtonLabel) // force reget
    //     .parent()
    //     .then(e => {
    //         Cypress.$(e).trigger('click');
    //     });
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

/**
 * @param courseReadingList
 * @return {number}
 */
export function readingListLength(courseReadingList) {
    return (
        (!!courseReadingList.reading_lists &&
            courseReadingList.reading_lists.length > 0 &&
            !!courseReadingList.reading_lists[0] &&
            !!courseReadingList.reading_lists[0].totalCount &&
            courseReadingList.reading_lists[0].totalCount) ||
        0
    );
}

export function waitUntilSpotlightListPageHasLoaded() {
    cy.waitUntil(() =>
        cy.get('[data-testid="spotlight-list-row-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').should('exist'),
    );
    cy.waitUntil(() => {
        const numberOfRowsPerPageOptions = 4; // currently the list is: 5, 10, 25, 100, ie 4 options
        return cy
            .get('[data-testid="admin-spotlights-list-paginator-select"]')
            .children()
            .its('length')
            .should('eq', numberOfRowsPerPageOptions);
    });
}

export function dateHasValue(dateField, expectedDate) {
    // dev uses minutes only, AWS pipelines uses minutes and seconds - check it starts with minutes
    cy.get(dateField)
        .should('have.attr', 'value')
        .then(dateValue => {
            expect(dateValue.startsWith(expectedDate)).to.be.true;
        });
}

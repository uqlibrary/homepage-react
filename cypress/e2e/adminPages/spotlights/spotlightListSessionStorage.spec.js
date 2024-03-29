import { FILTER_STORAGE_NAME, getFooterLabel, totalCountPastRecords } from '../../../support/spotlights';
import { waitUntilSpotlightListPageHasLoaded, clickButton } from '../../../support/helpers';

const numRowsHiddenAsNoDatainfo = 1;

describe('Spotlight Admin: past list filter session storage', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
        cy.viewport(1300, 1000);
    });

    it('the filter text is maintained when the user visits a View page', () => {
        // the list page loads
        cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
        waitUntilSpotlightListPageHasLoaded();
        // initally, all 5 records show
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));

        // we reduce the number of rows displayed by typing into the filter input field
        cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
        });

        // we load the view page, then click the cancel button to come back to the list page
        clickButton('[data-testid="spotlight-list-past"] tbody tr:first-child button:first-child', 'View');
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469',
        );
        cy.waitUntil(() =>
            cy
                .get('h2')
                .should('be.visible')
                .contains('View spotlight'),
        );
        // ideally we would just click cancel here
        // but for reasons that are completely unclear, cypress often can't find the cancel button.
        // All other buttons are fine, it's just the cancel button
        // However, for purposes of the test, we just want to return to the view page. So do that:
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');

        // the filter text field still has the previously typed word and only 3 rows are present
        cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
        cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
        });
        // the current and scheduled lists aren't filtered
        cy.get('[data-testid="admin-spotlights-list-current-list"] tbody')
            .children()
            .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
        cy.get('[data-testid="admin-spotlights-list-scheduled-list"] tbody')
            .children()
            .should('have.length', 9 + numRowsHiddenAsNoDatainfo);

        // we use the 'x' button to clear the text field which restores the rows to 5
        cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
            .should('exist')
            .click();
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
    });
    it('the filter text is maintained when the user visits a Clone page', () => {
        // the list page loads
        cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
        waitUntilSpotlightListPageHasLoaded();
        // initally, all 5 records show
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));

        // we reduce the number of rows displayed by typing into the filter input field
        cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
        });

        // we load the Clone page, then click the cancel button to come back to the List page
        cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child button:nth-child(2)')
            .should('exist')
            .click();
        cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child ul li:first-child')
            .should('exist')
            .should('contain', 'Clone')
            .click();
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/spotlights/clone/1e1b0e10-c400-11e6-a8f0-47525a49f469',
        );
        cy.waitUntil(() =>
            cy
                .get('[data-testid="standard-card-clone-spotlight-header"]')
                .should('exist')
                .contains('Clone spotlight'),
        );
        // see comment above about cancel button
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');

        // the filter text field still has the previously typed word and only 4 rows are present
        cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
        cy.get('[data-testid="admin-spotlights-list-past-list"] h3').should('be.visible');
        cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
        });

        // we use the 'x' button to clear the text field and restore the rows to 5
        cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
            .should('exist')
            .click();
        cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
        cy.waitUntil(() => {
            return cy
                .get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
    });
});

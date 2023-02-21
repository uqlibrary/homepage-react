import { assertImageWarningIsPresent, FILTER_STORAGE_NAME, hasAWorkingHelpButton } from '../../../support/spotlights';
import { clickButton } from '../../../support/helpers';

describe('Spotlights Admin: the view-by-history lightbox works', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
        cy.viewport(1300, 1000);
    });

    function loadTheHistoryLightbox(spotlightid, listType = 'current') {
        // open the split button
        cy.get(`[data-testid="admin-spotlights-list-${listType}-list"]`).scrollIntoView();
        cy.get(`[data-testid="spotlight-list-arrowicon-${spotlightid}"]`)
            .should('exist')
            .click();

        // click the 'view by history' action
        cy.get('[data-testid="' + spotlightid + '-viewbyhistory-button"]')
            .should('exist')
            .click();

        // view-by-history lightbox loads
        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('exist');
    }

    it('the view-by-history lightbox can be closed with the close button', () => {
        loadTheHistoryLightbox('298288b0-605c-11eb-ad87-357f112348ef', 'scheduled');

        // confirm random piece of content
        assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
            .children()
            .should('have.length', 2);

        // use the close button
        clickButton('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]', 'Close');
        cy.location('href').should('eq', `${Cypress.config('baseUrl')}/admin/spotlights?user=uqstaff`);
        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
    });
    it('the view-by-history can open the clone form for a spotlight', () => {
        loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

        // confirm random piece of content
        assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
            .children()
            .should('have.length', 23);

        clickButton('[data-testid="spotlight-list-item-clone-9eab3aa0-82c1-11eb-8896-eb36601837f5"]', 'Clone');
        cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/clone`);
    });
    it('the view-by-history can open the edit form for a spotlight', () => {
        loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

        // confirm random piece of content
        assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
            .children()
            .should('have.length', 23);

        clickButton('[data-testid="spotlight-viewhistory-button-edit-9eab3aa0-82c1-11eb-8896-eb36601837f5"]', 'Edit');
        cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/edit`);
    });
    it('the view-by-history can open the view page for a spotlight', () => {
        loadTheHistoryLightbox('1e1b0e10-c400-11e6-a8f0-47525a49f469');

        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
            .children()
            .should('have.length', 20);

        clickButton('[data-testid="spotlight-viewhistory-button-view-1e1b0e10-c400-11e6-a8f0-47525a49f469"]', 'View');
        cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/view`);
    });
    it('the spotlight that had its view-by-history button clicked is highlighted', () => {
        const theSpotlightThatWasClickedOnID = '9eab3aa0-82c1-11eb-8896-eb36601837f5';
        const editButton = `[data-testid="spotlight-viewhistory-button-edit-${theSpotlightThatWasClickedOnID}"]`;
        loadTheHistoryLightbox(theSpotlightThatWasClickedOnID);

        cy.get(editButton).scrollIntoView();
        cy.get(editButton)
            .parent()
            .parent()
            .should('exist')
            .and('have.css', 'background-color', 'rgba(0, 0, 0, 0.65)');

        // a random different one is not hlighlighted
        cy.get('[data-testid="spotlight-viewhistory-button-view-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]')
            .parent()
            .parent()
            .should('exist')
            .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
    });
    it('the view-by-history has a working Help button', () => {
        loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');
        hasAWorkingHelpButton('spotlights-viewbyhistory-lightbox-help-button');
    });
});

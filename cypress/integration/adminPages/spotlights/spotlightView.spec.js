import { FILTER_STORAGE_NAME, numberCurrentPublishedSpotlights } from '../../../support/spotlights';
import { clickButton } from '../../../support/helpers';

describe('Spotlight Admin View page', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    const numRowsHiddenAsNoDatainfo = 1;
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469?user=uqstaff');
        cy.viewport(1300, 1000);
    });

    it('can visit the clone page from the spotlight view page', () => {
        clickButton('button[data-testid="admin-spotlights-form-button-save"]', 'Clone');
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/spotlights/clone/1e1b0e10-c400-11e6-a8f0-47525a49f469',
        );
    });

    it('view page is accessible', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('View spotlight');
        cy.wait(1000);
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Spotlights Admin View',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('the cancel button on the view page returns to the list page', () => {
        clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
        cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
        cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
        cy.get('[data-testid="spotlight-list-current"] tbody')
            .children()
            .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
    });
    it('has a Help button on the spotlight View page', () => {
        cy.get('[data-testid="admin-spotlights-help-button"]').should('exist');
    });
    it('the view page displays the correct data', () => {
        cy.waitUntil(() => cy.get('[data-testid="admin-spotlights-form-button-cancel"]').should('exist'));
        cy.get('[data-testid="admin-spotlights-form-admin-note"] textarea')
            .should('exist')
            .should('have.value', 'sample admin note 2');
        cy.get('[data-testid="admin-spotlights-form-title"] textarea')
            .should('exist')
            .should('have.value', 'Can be viewed or deleted past #1');
        cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
            .should('exist')
            .should('have.value', 'Feedback on library services');
        cy.get('[data-testid="admin-spotlights-form-start-date"] input')
            .should('exist')
            .should('have.value', '2016-12-17T12:24:00');
        cy.get('[data-testid="admin-spotlights-form-end-date"] input')
            .should('exist')
            .should('have.value', '2021-02-28T23:59:00');
        cy.get('img[data-testid="admin-spotlights-view-img"]')
            .should('exist')
            .and(
                'have.attr',
                'src',
                'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            );
    });
});

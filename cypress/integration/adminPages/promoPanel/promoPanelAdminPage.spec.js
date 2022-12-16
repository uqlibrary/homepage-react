import { testId } from '../../../support/promopanel';

describe('Promopanel Admin Form Pages', () => {
    context('Promopanel Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1400);
        });

        it('Admin page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Promopanel List page',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('Help page functions', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('admin-promopanel-help-button').click();
            testId('help-drawer-title')
                .should('exist')

                .should('be.visible');
            testId('promopanel-helpdrawer-close-button').click();
            testId('admin-promopanel-add-display-button').click();
            cy.waitUntil(() => testId('standard-card-create-a-promo-header').should('exist'));
        });
    });
});

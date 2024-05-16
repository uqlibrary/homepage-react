import { DLOR_ADMIN_USER } from '../../../support/constants';

describe('Digital learning hub admin Teams management', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Teams management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub - Team Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor teams management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        // it('has a working "add a team" button', () => {
        //     cy.get('[data-testid="admin-dlor-visit-add-button"]')
        //         .should('exist')
        //         .should('contain', 'Add object')
        //         .click();
        //     cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/team/manage/add?user=dloradmn');
        // });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/manage?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/manage?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital learning hub - Team Management');
        });
    });
});

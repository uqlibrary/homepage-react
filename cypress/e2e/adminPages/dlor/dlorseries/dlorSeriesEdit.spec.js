import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Series management - edit item', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Series management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Series');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor series management edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('loads as expected', () => {
            // series name shows correctly
            cy.get('[data-testid="series_name"] input')
                .should('exist')
                .should('have.value', 'Advanced literature searching');
        });
        it('has a working "view a dlor" button', () => {
            // can open a list and click edit
            cy.get('[data-testid="dlor-series-edit-view-2"]')
                .should('exist')
                .click();
            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/edit/1?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/edit/1?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Series');
        });
    });
});

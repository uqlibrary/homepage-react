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
        it('loads as expected', () => {
            // series name shows correctly
            cy.get('[data-testid="object_series_name"] input')
                .should('exist')
                .should('have.value', 'Advanced literature searching');
            // linked
            cy.get('[data-testid="object_series_order-98s0_dy5k3_98h4"] input')
                .should('exist')
                .should('have.value', 1);
            cy.get('[data-testid="object_series_order-9bc1894a-8b0d-46da-a25e-02d26e2e056c"] input')
                .should('exist')
                .should('have.value', 2);
            // unaffiliated
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-01"] input')
                .should('exist')
                .should('have.value', '');
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-02"] input')
                .should('exist')
                .should('have.value', '');
            // there are more, but thats probably enough
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
        it('has a working "view a dlor" button', () => {
            cy.get('a[target="_blank"][data-testid="dlor-series-edit-view-2"]')
                .should('be.visible')
                .then($a => {
                    // Change the target attribute to _self for testing
                    $a.attr('target', '_self');
                })
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

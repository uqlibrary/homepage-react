import { DLOR_ADMIN_USER } from '../../../../support/constants';

function TypeCKEditor(content, keepExisting = false) {
    return cy
        .get('.ck-content')
        .should('exist')
        .then(el => {
            const editor = el[0].ckeditorInstance;
            editor.setData(keepExisting ? editor.getData() + content : content);
        });
    // cy.get('.ck-content')
    //     .parent.should('exist')
    //     .setData(content);
    // // .type(content);
}
describe('Digital Learning Hub admin Series management - add item', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Series management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/series/add?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('loads as expected', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Add Series');

            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('a[data-testid="dlor-breadcrumb-series-management-link-0"]')
                .contains('Series management')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);

            // series name input shows correctly
            cy.get('[data-testid="series-name"] input').should('exist');
            // CKEditor should show
            cy.get('[class="ck ck-editor__main"]').should('exist');
            // should have no current objects already in the series
            cy.get('#dragLandingAarea').should('contain', '(None yet)');
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Add Series');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor series management edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can add a series with objects', () => {});
        it('can add a series without objects', () => {
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="admin-dlor-series-form-button-cancel"]')
                    .should('exist')
                    .contains('Cancel'),
            );
            cy.get('[data-testid="series-name"] input').type('Series without objects');
            TypeCKEditor('This is a series without any objects');
            // should have no current objects already in the series
            cy.get('#dragLandingAarea').should('contain', '(None yet)');

            cy.get('[data-testid="admin-dlor-series-form-save-button"]').click();

            cy.get('[data-testid="message-title"]').should('contain', 'Series has been created');
        });
        it('can navigate to and from the add series page', () => {
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="admin-dlor-series-form-button-cancel"]')
                    .should('exist')
                    .contains('Cancel'),
            );
            cy.get('[data-testid="dlor-breadcrumb-admin-homelink"]').click();
            cy.get('[data-testid="admin-dlor-menu-button"]').click();
            cy.get('[data-testid="admin-dlor-visit-add-series-button"]').click();

            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Add Series');
        });
    });
});

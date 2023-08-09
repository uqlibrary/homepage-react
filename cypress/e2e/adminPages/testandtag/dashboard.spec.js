import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Dashboard', () => {
    const getFieldValue = (dataField, rowIndex, colIndex) =>
        cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    const changeRowsPerPage = rows => {
        cy.get('.MuiTablePagination-input').click();
        cy.get(`.MuiTablePagination-menuItem[data-value="${rows}"]`).click();
    };
    it('page is accessible and renders base', () => {
        cy.visit('http://localhost:2020/admin/testntag?user=uqtesttag');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.dashboard.header.pageSubtitle('Library'));
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag Manage Assets Form',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('page triggers errors if unable to load onLoad', () => {
        cy.visit('http://localhost:2020/admin/testntag?user=uqpf');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.dashboard.header.pageSubtitle('Library'));
        cy.visit('http://localhost:2020/admin/testntag?user=uqpf');
        cy.data('confirmation_alert-error-alert').should('exist');
        cy.data('confirmation_alert-error-alert')
            .find('button')
            .click();
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag Manage Assets Form',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
});

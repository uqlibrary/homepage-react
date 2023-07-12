import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Report - Asset inspection by filters', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/report/assetsbyfilter?user=uqtesttag');
    });
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const getFieldValue = (dataField, rowIndex, colIndex) =>
        cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    it('page is accessible and renders base', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000003'));
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag AssetsByFilters Report',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it.only('UI Dropdown for Status and building function correctly', () => {
        cy.intercept('/*').as('getSearch');
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000003'));
        // Status Dropdown.
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'All');
        cy.data('asset_status_selector-assets-inspected-input').click();
        cy.get('#asset_status_selector-assets-inspected-option-1').click();
        cy.wait('@getSearch')
            .its('request.url')
            .should('include', '/test?a');
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'Out for repair');
        cy.data('asset_status_selector-assets-inspected-input').click();
        cy.get('#asset_status_selector-assets-inspected-option-0').click();
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'All');
    });
});

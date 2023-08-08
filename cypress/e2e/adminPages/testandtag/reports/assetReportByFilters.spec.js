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
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag AssetsByFilters Report',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('UI Dropdown for Status and building function correctly', () => {
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // Status Dropdown.
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'All');
        cy.data('asset_status_selector-assets-inspected-input').click();
        cy.get('#asset_status_selector-assets-inspected-option-1').click();
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'Out for repair');
        cy.data('asset_status_selector-assets-inspected-input').click();
        cy.get('#asset_status_selector-assets-inspected-option-0').click();
        cy.data('asset_status_selector-assets-inspected-input').should('have.value', 'All');
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // Building Dropdown - all
        cy.wait(1500);
        cy.data('location_picker-assets_inspected-building-input').should('have.value', 'All - All buildings');
        cy.data('location_picker-assets_inspected-building-input').click();
        cy.get('#location_picker-assets_inspected-building-option-5').click();
        cy.wait(1500);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // // Building Dropdown - selected
        cy.data('location_picker-assets_inspected-building-input').should(
            'have.value',
            '0050 - Hawken Engineering Building',
        );
        cy.data('location_picker-assets_inspected-building-input').click();
        cy.get('#location_picker-assets_inspected-building-option-0').click();
        cy.data('location_picker-assets_inspected-building-input').should('have.value', 'All - All buildings');
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
    });
    it('UI for date pickers function correctly', () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = zeroPad(new Date().getMonth() + 1, 2);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // Select a Tagged from Date.
        cy.get('[data-testid="assets_inspected-tagged-start"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('11')
            .click();
        cy.get('body').type('{esc}');
        cy.wait(1000);
        cy.data('assets_inspected-tagged-start-input').should('have.value', `${currentYear}-${currentMonth}-11`);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        // Select a Tagged to Date.
        cy.get('[data-testid="assets_inspected-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('12')
            .click();
        cy.get('body').type('{esc}');
        cy.wait(1000);
        cy.data('assets_inspected-tagged-end-input').should('have.value', `${currentYear}-${currentMonth}-12`);
        // Select invalid end date.
        cy.get('[data-testid="assets_inspected-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('10')
            .click();
        cy.get('body').type('{esc}');
        cy.wait(1000);
        cy.data('assets_inspected-tagged-start')
            .find('label')
            .should('have.class', 'Mui-error');
        // select a valid date.
        cy.get('[data-testid="assets_inspected-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('12')
            .click();
        cy.get('body').type('{esc}');
        cy.wait(1000);
        cy.data('assets_inspected-tagged-start')
            .find('label')
            .should('not.have.class', 'Mui-error');
        // Clear both dates.
        cy.data('assets_inspected-tagged-start-input').clear();
        cy.get('body').type('{esc}');
        cy.data('assets_inspected-tagged-end-input').clear();
        cy.get('body').type('{esc}');
        cy.data('assets_inspected-tagged-start')
            .find('label')
            .should('not.have.class', 'Mui-error');
        cy.data('assets_inspected-tagged-end')
            .find('label')
            .should('not.have.class', 'Mui-error');
    });
    it('Sorting should work correctly', () => {
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
        cy.get('.MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer button').click();
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL001993'));
        cy.get('.MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer button').click();
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000001'));
    });
});

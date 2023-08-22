import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Report - RecalibrationsDue due', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/report/recalibrationsdue?user=uqtesttag');
    });

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
        cy.get('h2').contains(locale.pages.report.recalibrationsDue.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('device_model_name', 0, 0).should('contain', 'AV 025'));
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag recalibrationsDue Report',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('sorting works as expected, and indicates overdue', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.recalibrationsDue.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('device_model_name', 0, 0).should('contain', 'AV 025'));
        // Change the sort order
        cy.get('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        cy.waitUntil(() => getFieldValue('device_model_name', 0, 0).should('contain', 'Visual inspection'));
        cy.get('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        cy.waitUntil(() => getFieldValue('device_model_name', 0, 0).should('contain', 'AV 025'));
        // Check for overdue icon
        getFieldValue('device_calibration_due_date', 2, 2)
            .find('svg')
            .should('exist');
    });
});

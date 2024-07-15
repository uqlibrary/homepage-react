import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Report - Inspections due', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/report/inspectionsdue?user=uqtesttag');
    });

    const getFieldValue = (dataField, rowIndex, colIndex) =>
        // cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);
        cy.get(`div[data-rowindex='${rowIndex}'] > div[data-field='${dataField}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    it('page is accessible and renders base', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.inspectionsDue.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000007'));
        cy.data('location_picker-inspections-due-site-input').should('have.value', 'All sites');
        cy.data('months_selector-inspections-due-select').should('contain', '3 months');
        // Default states of other selectors.
        cy.data('location_picker-inspections-due-building-input').should('have.attr', 'disabled');
        cy.data('location_picker-inspections-due-floor-input').should('have.attr', 'disabled');
        cy.data('location_picker-inspections-due-room-input').should('have.attr', 'disabled');
        cy.wait(1000);
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Inspections due report',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        cy.get('uq-site-header')
            .shadow()
            .within(() => {
                cy.get('[data-testid="subsite-title"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('Test and tag');
            });
    });
    it('page UI elements function as expected', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.inspectionsDue.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 0).should('contain', 'UQL000007'));
        cy.data('location_picker-inspections-due-site-input').should('have.value', 'All sites');
        cy.data('months_selector-inspections-due-select').should('contain', '3 months');
        // Change Site.
        cy.data('location_picker-inspections-due-site-input').click();
        cy.get('#location_picker-inspections-due-site-option-1').click();
        // Check if number of results are correct
        cy.get('.MuiTablePagination-displayedRows').should('contain', '1–8 of 8');
        cy.data('location_picker-inspections-due-building-input').should('not.have.attr', 'disabled');
        // Change Building
        cy.data('location_picker-inspections-due-building-input').click();
        cy.get('#location_picker-inspections-due-building-option-1').click();
        // Check if number of results are correct
        cy.get('.MuiTablePagination-displayedRows').should('contain', '1–6 of 6');
        cy.data('location_picker-inspections-due-floor-input').should('not.have.attr', 'disabled');
        // Change Floor.
        cy.data('location_picker-inspections-due-floor-input').click();
        cy.get('#location_picker-inspections-due-floor-option-1').click();
        // Check if number of results are correct
        cy.get('.MuiTablePagination-displayedRows').should('contain', '1–4 of 4');
        cy.data('location_picker-inspections-due-room-input').should('not.have.attr', 'disabled');
        // Change Root.
        cy.data('location_picker-inspections-due-room-input').click();
        cy.get('#location_picker-inspections-due-room-option-1').click();
        // Check if number of results are correct
        cy.get('.MuiTablePagination-displayedRows').should('contain', '1–2 of 2');
        // does it change relevant pending/overdue colors?
        getFieldValue('asset_next_test_due_date', 1, 2)
            .invoke('attr', 'class')
            .then(className => {
                const pattern = /inspectionOverdue/;
                expect(className).to.match(pattern);
            });
        getFieldValue('asset_next_test_due_date', 0, 2)
            .invoke('attr', 'class')
            .then(className => {
                const pattern = /inspectionOverdue/;
                expect(className).not.to.match(pattern);
            });
        // Change Date (currently throws error on mock)
        cy.data('months_selector-inspections-due-select').click();
        cy.data('months_selector-inspections-due-option-1').click();
        cy.data('confirmation_alert-error-alert').should('be.visible');
        cy.data('confirmation_alert-error-alert')
            .find('button')
            .click();
    });
});

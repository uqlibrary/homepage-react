import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Manage Inspection Notes', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/manage/inspectiondetails?user=uqtesttag');
    });
    const getFieldValue = (dataField, rowIndex, colIndex) =>
        cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    const checkBaseline = () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'));
        forcePageRefresh();
    };

    it('page is accessible and renders base', () => {
        checkBaseline();
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag Manage Inspections',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('allows wildcard searching of assets', () => {
        checkBaseline();
        // Enter search criteria
        cy.get('[data-testid="asset_selector-inspection-details-input"]').type('UQL00001');
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 0, 0).should('contain', 'UQL000010'));
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 9, 0).should('contain', 'UQL000019'));
        cy.get('.MuiTablePagination-caption').should('contain', '1-10 of 10');
    });
    it('allows searching and editing of discard assets', () => {
        checkBaseline();
        // Enter search criteria
        cy.get('[data-testid="asset_selector-inspection-details-input"]').type('1');
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 0, 0).should('contain', 'UQL000001'));

        // Edit details
        cy.data('action_cell-UQL000001-edit-button').click();
        cy.data('update_dialog-inspection-details-content')
            .should('contain', 'UQL000001')
            .should('contain', 'No defects detected');
        cy.data('inspect_notes-input')
            .clear()
            .type('Cypress test notes');
        cy.data('inspect_fail_reason-input').should('have.attr', 'disabled');
        cy.data('discard_reason-input').should('have.attr', 'required');
        cy.data('update_dialog-action-button').should('have.attr', 'disabled');
        cy.data('discard_reason-input').type('Cypress discard reason');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success').should('be.visible');
        // Test cancel of dialog
        cy.data('action_cell-UQL000001-edit-button').click();
        cy.data('update_dialog-cancel-button').click();
        cy.data('confirmation_alert-success').should('not.exist');
    });
    it('allows searching and editing of current assets', () => {
        checkBaseline();
        // Enter search criteria
        cy.get('[data-testid="asset_selector-inspection-details-input"]').type('UQL000010');
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 0, 0).should('contain', 'UQL000010'));

        // Edit details
        cy.data('action_cell-UQL000010-edit-button').click();
        cy.data('update_dialog-inspection-details-content').should('contain', 'UQL000010');
        cy.data('inspect_notes-input')
            .clear()
            .type('Cypress test notes');
        cy.data('inspect_fail_reason-input').should('have.attr', 'disabled');
        cy.data('discard_reason-input').should('have.attr', 'disabled');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success').should('be.visible');
        cy.get('#confirmation_alert-success-alert button').click();
        cy.data('confirmation_alert-success').should('not.exist');
    });
});

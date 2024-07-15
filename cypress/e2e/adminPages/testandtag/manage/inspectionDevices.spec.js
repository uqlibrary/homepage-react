import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag manage inspection devices', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/manage/inspectiondevices?user=uqtesttag');
    });
    const getFieldValue = (dataField, rowIndex, colIndex) =>
        // cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);
        cy.get(`div[data-rowindex='${rowIndex}'] > div[data-field='${dataField}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    const checkBaseline = () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('device_model_name', 0, 0).should('contain', 'AV 025'));
    };

    it('page is accessible and renders base', () => {
        cy.injectAxe();
        checkBaseline();
        cy.waitUntil(() =>
            getFieldValue('device_calibration_due_date', 2, 2)
                .find('svg')
                .should('exist'),
        );
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Inspection devices',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
    });
    it('Add and Edit Inspection Device functions correctly', () => {
        cy.get('uq-site-header')
            .shadow()
            .within(() => {
                cy.get('[data-testid="subsite-title"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('Test and tag');
            });
        cy.injectAxe();
        checkBaseline();
        // Adding an Inspection Device
        cy.data('add_toolbar-inspection-devices-add-button').click();
        cy.wait(1000);

        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Inspection devices',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        cy.data('device_model_name-input').type('Test Device');
        cy.data('device_serial_number-input').type('Test Serial No');
        cy.data('device_calibrated_by_last-input').type('Calibration Person');
        cy.data('update_dialog-action-button').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // // Editing an asset type
        cy.data('action_cell-2-edit-button').click();

        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Inspection devices',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        cy.data('device_model_name-input').type('Edited');
        cy.data('device_serial_number-input').type('Edited');
        cy.data('device_calibrated_by_last-input').type('Edited');
        cy.data('update_dialog-action-button').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // //Cancel button - Add.
        cy.data('add_toolbar-inspection-devices-add-button').click();
        cy.data('update_dialog-cancel-button').click();
        cy.get('.MuiAlert-message').should('not.exist');
        // Cancel button - Edit.
        cy.data('action_cell-2-edit-button').click();
        cy.data('update_dialog-cancel-button').click();
        cy.get('.MuiAlert-message').should('not.exist');
        // Delete Button - Confirm.
        cy.data('action_cell-2-delete-button').click();
        cy.data('confirm-inspection-devices').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Delete Button - Cancel.
        cy.data('action_cell-2-delete-button').click();
        cy.data('cancel-inspection-devices').click();
        cy.get('.MuiAlert-message').should('not.exist');
    });
});

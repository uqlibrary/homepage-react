import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag bulk asset update', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/manage/bulkassetupdate?user=uqtesttag');
    });
    const getFieldValue = (dataField, rowIndex, colIndex) =>
        cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    const selectAllRows = () => {
        cy.data('bulk_asset_update-feature-button').click();
        cy.data('filter_dialog-bulk-asset-update-title').should(
            'contain',
            locale.pages.manage.bulkassetupdate.form.filterDialog.title,
        );
        cy.waitUntil(() => getFieldValue('asset_barcode', 0, 1).should('contain', 'UQL000001'));
        cy.get('input[aria-label="Select All Rows checkbox"]').click();
        cy.data('filter_dialog-bulk-asset-update-action-button').click();
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 0, 0).should('contain', 'UQL000001'));
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 4, 0).should('contain', 'UQL001993'));
        cy.data('footer_bar-bulk-asset-update-action-button').click();
        cy.data('bulk_asset_update-summary-alert').should('exist');
    };

    const checkBaseline = () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.bulkassetupdate.header.pageSubtitle('Library'));
        forcePageRefresh();
    };

    it('page is accessible and renders base', () => {
        checkBaseline();
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag Manage Inspection devices',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('asset id search functions correctly', () => {
        checkBaseline();
        // Search for an asset
        cy.data('asset_selector-bulk-asset-update-input').type('5');
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 0, 0).should('contain', 'UQL000005'));
        // Search for an additional asset
        cy.data('asset_selector-bulk-asset-update-input')
            .clear()
            .type('6');
        cy.waitUntil(() => getFieldValue('asset_id_displayed', 1, 0).should('contain', 'UQL000006'));
        cy.data('bulk_asset_update-count-alert').should('exist');
        // Clear the first asset
        cy.data('action_cell-5-delete-button').click();
        // Clear the second asset
        cy.data('action_cell-6-delete-button').click();
        cy.data('bulk_asset_update-count-alert').should('not.exist');
    });
    it('asset search by feature works correctly', () => {
        checkBaseline();
        // Search for an asset by feature (default)
        selectAllRows();
    });
    it('updates locations of assets', () => {
        checkBaseline();
        // Select all rows.
        selectAllRows();
        // Update location
        cy.get('#bulk_asset_update-location-checkbox').click();
        cy.data('location_picker-bulk-asset-update-site-input').should('have.attr', 'required');
        cy.data('location_picker-bulk-asset-update-site-input').click();
        cy.get('#location_picker-bulk-asset-update-site-option-0').click();
        cy.data('location_picker-bulk-asset-update-building-input').should('have.attr', 'required');
        cy.data('location_picker-bulk-asset-update-building-input').click();
        cy.get('#location_picker-bulk-asset-update-building-option-0').click();
        cy.data('location_picker-bulk-asset-update-floor-input').should('have.attr', 'required');
        cy.data('location_picker-bulk-asset-update-floor-input').click();
        cy.get('#location_picker-bulk-asset-update-floor-option-0').click();
        cy.data('location_picker-bulk-asset-update-room-input').should('have.attr', 'required');
        cy.data('location_picker-bulk-asset-update-room-input').click();
        cy.get('#location_picker-bulk-asset-update-room-option-0').click();
        // Commit the change.
        cy.data('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        cy.data('dialogbox-bulk-asset-update')
            .should('exist')
            .should('be.visible');
        // Commit
        cy.data('confirm-bulk-asset-update').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
    });
});

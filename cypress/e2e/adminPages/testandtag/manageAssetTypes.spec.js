import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Manage Asset Types', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/manage/assettypes?user=uqtesttag');
    });
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
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_type_name', 0, 0).should('contain', 'Power Cord - C13'));
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag Manage Assets Form',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
    it('Page Pagination functions correctly', () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_type_name', 0, 0).should('contain', 'Power Cord - C13'));
        // Change Rows to 25
        changeRowsPerPage(25);
        cy.get('.MuiTablePagination-caption').should('contain', '1-25 of 60');
        // next page
        cy.get('.MuiTablePagination-actions button[title="Next page"]').click();
        cy.get('.MuiTablePagination-caption').should('contain', '26-50 of 60');
        // previous page
        cy.get('.MuiTablePagination-actions button[title="Previous page"]').click();
        cy.get('.MuiTablePagination-caption').should('contain', '1-25 of 60');
    });
    it('Add and Edit Asset type functions correctly', () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_type_name', 0, 0).should('contain', 'Power Cord - C13'));
        // Adding an asset type
        cy.data('add_toolbar-asset-types-add-button').click();
        cy.data('asset_type_name-input').type('Test Asset');
        cy.data('asset_type_class-input').type('Test Class');
        cy.data('asset_type_power_rating-input').type('240V');
        cy.data('asset_type-input').type('Generic');
        cy.data('asset_type_notes-input').type('Notes for asset type');
        cy.data('update_dialog-asset-types-action-button').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Editing an asset type
        cy.data('action_cell-1-edit-button').click();
        cy.data('asset_type_name-input').type('Test Asset');
        cy.data('asset_type_class-input').type('Test Class');
        cy.data('asset_type_power_rating-input').type('240V');
        cy.data('asset_type-input').type('Generic');
        cy.data('asset_type_notes-input').type('Notes for asset type');
        cy.data('update_dialog-asset-types-action-button').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Cancel button - Add.
        cy.data('add_toolbar-asset-types-add-button').click();
        cy.data('update_dialog-asset-types-cancel-button').click();
        cy.get('.MuiAlert-message').should('not.exist');
        // Cancel button - Edit.
        cy.data('action_cell-1-edit-button').click();
        cy.data('update_dialog-asset-types-cancel-button').click();
        cy.get('.MuiAlert-message').should('not.exist');
    });
    it.only('Delete and Reassign work correctly', () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('asset_type_name', 0, 0).should('contain', 'Power Cord - C13'));
        // Delete an asset type - contains assets.
        cy.data('action_cell-1-delete-button').click();
        cy.data('action_dialogue-asset-types-title').should('contain', 'Delete and Reassign');
        cy.get('.MuiAlert-message').should('contain', 'This will effect 76 assets');
        // Fire cancel
        cy.data('action_dialogue-asset-types-cancel-button').click();
        // Reopen and confirm
        cy.data('action_cell-1-delete-button').click();
        cy.data('action_dialogue-asset-types-title').should('contain', 'Delete and Reassign');
        cy.get('.MuiAlert-message').should('contain', 'This will effect 76 assets');
        cy.get('#action_dialogue-asset-types-reassign-select').click();
        cy.data('action_dialogue-asset-types-reassign-option-6').click();
        cy.data('action_dialogue-asset-types-action-button').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Test standard delete
        cy.data('action_cell-10-delete-button').click();
        // Fire Cancel
        cy.data('cancel-asset-types').click();
        cy.get('.MuiAlert-message').should('not.exist');
        // Reopen and confirm
        cy.data('action_cell-10-delete-button').click();
        cy.data('confirm-asset-types').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Test a fail delete
        cy.data('action_cell-52-delete-button').click();
        cy.data('confirm-asset-types').click();
        cy.get('.MuiAlert-message').should('contain', 'Operation failed');
    });
});

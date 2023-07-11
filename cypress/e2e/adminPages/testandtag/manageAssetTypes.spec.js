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
        cy.get('[data-testid="add_toolbar-asset-types-add-button"]').click();
        cy.get('[data-testid="asset_type_name-input"]').type('Test Asset');
        cy.get('[data-testid="asset_type_class-input"]').type('Test Class');
        cy.get('[data-testid="asset_type_power_rating-input"]').type('240V');
        cy.get('[data-testid="asset_type-input"]').type('Generic');
        cy.get('[data-testid="asset_type_notes-input"]').type('Notes for asset type');
        cy.get('[data-testid="update_dialog-asset-types-action-button"]').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
        // Editing an asset type
        cy.get('[data-testid="action_cell-1-edit-button"]').click();
        cy.get('[data-testid="asset_type_name-input"]').type('Test Asset');
        cy.get('[data-testid="asset_type_class-input"]').type('Test Class');
        cy.get('[data-testid="asset_type_power_rating-input"]').type('240V');
        cy.get('[data-testid="asset_type-input"]').type('Generic');
        cy.get('[data-testid="asset_type_notes-input"]').type('Notes for asset type');
        cy.get('[data-testid="update_dialog-asset-types-action-button"]').click();
        cy.get('.MuiAlert-message').should('contain', 'Request successfully completed');
    });
});

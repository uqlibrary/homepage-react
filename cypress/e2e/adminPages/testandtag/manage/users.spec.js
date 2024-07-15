import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Manage Users', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/manage/users?user=uqtesttag');
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
        cy.get('h2').contains(locale.pages.manage.users.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqjsmit'));
        cy.wait(1000);
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Users',
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
    it('base page edit controls function correctly', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.users.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqjsmit'));
        cy.get('#action_cell-1-edit-button[data-value="uqjsmit"]').should('not.have.attr', 'disabled');
        // Click the first edit button.
        cy.get('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Users',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        // Field for licence should be disabled
        cy.data('user_licence_number-input').should('have.attr', 'disabled');
        // Enabling "Inspect" should keep licence (pre-existing) disabled.
        cy.data('can_inspect_cb-input').click();
        // Checkbox enabled, but input still disabled
        cy.data('can_inspect_cb-input').should('have.value', 'true');
        cy.data('user_licence_number-input').should('have.attr', 'disabled');
        cy.data('can_inspect_cb-input').click();
        cy.data('can_inspect_cb-input').should('have.value', 'false');
        cy.data('user_licence_number-input').should('have.attr', 'disabled');
        // Click Cancel
        cy.get('[data-testid="update_dialog-cancel-button"]').click();
        // Reopen
        cy.get('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        // Check all Checkboxes
        cy.data('can_inspect_cb-input').click();
        cy.data('can_admin_cb-input').click();
        cy.data('can_see_reports_cb-input').click();
        cy.data('update_dialog-action-button').click();
        // Clear all Checkboxes
        cy.get('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        cy.data('can_alter_cb-input').click();
        cy.data('user_current_flag_cb-input').click();
        cy.data('update_dialog-action-button').click();
        cy.get('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        cy.data('user_uid-input')
            .clear()
            .type('test');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
    });
    it('base page add controls function correctly', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.users.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqjsmit'));
        // Add.
        cy.data('add_toolbar-user-management-add-button').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Users',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        // Check default helper texts are in required state
        cy.get('#user_uid-input-helper-text').should('have.class', 'Mui-error');
        cy.get('#user_name-input-helper-text').should('have.class', 'Mui-error');
        // Check default state of Licence field (disabled)
        cy.data('user_licence_number-input').should('have.attr', 'disabled');
        // Enter content, uid no longer error
        cy.data('user_uid-input').type('cypresstest');
        cy.get('#user_uid-input-helper-text').should('not.have.class', 'Mui-error');
        // Enter content, name no longer error
        cy.data('user_name-input').type('Cypress Test');
        cy.get('#user_name-input-helper-text').should('not.exist');
        // Allow Inspect - field should enable
        cy.data('can_inspect_cb-input').click();
        cy.data('user_licence_number-input').should('not.have.attr', 'disabled');
        cy.data('user_licence_number-input').type('LICENCE001');
        // toggle inspect - field should disable / enable
        cy.data('can_inspect_cb-input').click();
        cy.data('user_licence_number-input').should('have.attr', 'disabled');
        cy.data('can_inspect_cb-input').click();
        cy.data('user_licence_number-input').should('not.have.attr', 'disabled');
        // commit the change
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');
        // Fire an open and close on the edit - no change should occur.
        cy.data('add_toolbar-user-management-add-button').click();
        cy.data('update_dialog-cancel-button').click();
        cy.wait(500);
        cy.data('confirmation_alert-success-alert').should('not.exist');
    });
    it('base page delete controls function correctly', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.users.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqjsmit'));
        // Delete
        cy.data('action_cell-1-delete-button').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Users',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        // Accept the deletion
        cy.data('confirm-user-management').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
        // Delete
        cy.data('action_cell-1-delete-button').click();
        // Cancel the deletion
        cy.data('cancel-user-management').click();
        cy.data('confirmation_alert-success-alert').should('not.exist');
        // Test error case
        cy.data('action_cell-5-delete-button').click();
        cy.data('confirm-user-management').click();
        cy.data('confirmation_alert-error-alert').should('be.visible');
    });
});

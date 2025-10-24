import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage Users', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/users?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.users.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'user_uid', 0)).getByText('uqjsmit')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('base page edit controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.users.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'user_uid', 0)).getByText('uqjsmit')).toBeVisible();

        await expect(page.locator('#action_cell-1-edit-button[data-value="uqjsmit"]')).not.toBeDisabled();
        // Click the first edit button
        await page.locator('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        // Field for licence should be disabled
        await expect(page.getByTestId('user_licence_number-input')).toBeDisabled();
        // Enabling "Inspect" should keep licence (pre-existing) disabled
        await page.getByTestId('can_inspect_cb-input').click();
        // Checkbox enabled, but input still disabled
        await expect(page.getByTestId('can_inspect_cb-input')).toHaveValue('true');
        await expect(page.getByTestId('user_licence_number-input')).toBeDisabled();
        await page.getByTestId('can_inspect_cb-input').click();
        await expect(page.getByTestId('can_inspect_cb-input')).toHaveValue('false');
        await expect(page.getByTestId('user_licence_number-input')).toBeDisabled();
        // Click Cancel
        await page.getByTestId('update_dialog-cancel-button').click();
        // Reopen
        await page.locator('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        // Check all Checkboxes
        await page.getByTestId('can_inspect_cb-input').click();
        await page.getByTestId('can_admin_cb-input').click();
        await page.getByTestId('can_see_reports_cb-input').click();
        await page.getByTestId('update_dialog-action-button').click();
        // Clear all Checkboxes
        await page.locator('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        await page.getByTestId('can_alter_cb-input').click();
        await page.getByTestId('user_current_flag_cb-input').click();
        await page.getByTestId('update_dialog-action-button').click();
        await page.locator('#action_cell-1-edit-button[data-value="uqjsmit"]').click();
        await page.getByTestId('user_uid-input').clear();
        await page.getByTestId('user_uid-input').fill('test');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('base page add controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.users.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'user_uid', 0)).getByText('uqjsmit')).toBeVisible();
        // Add.
        await page.getByTestId('add_toolbar-user-management-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        // Check default helper texts are in required state
        await expect(page.locator('#user_uid-input-helper-text')).toHaveClass(/Mui-error/);
        await expect(page.locator('#user_name-input-helper-text')).toHaveClass(/Mui-error/);
        // Check default state of Licence field (disabled)
        await expect(page.getByTestId('user_licence_number-input')).toBeDisabled();
        // Enter content, uid no longer error
        await page.getByTestId('user_uid-input').fill('cypresstest');
        await expect(page.locator('#user_uid-input-helper-text')).not.toHaveClass(/Mui-error/);
        // Enter content, name no longer error
        await page.getByTestId('user_name-input').fill('Cypress Test');
        await expect(page.locator('#user_name-input-helper-text')).not.toBeVisible();
        // Allow Inspect - field should enable
        await page.getByTestId('can_inspect_cb-input').click();
        await expect(page.getByTestId('user_licence_number-input')).not.toBeDisabled();
        await page.getByTestId('user_licence_number-input').fill('LICENCE001');
        // toggle inspect - field should disable / enable
        await page.getByTestId('can_inspect_cb-input').click();
        await expect(page.getByTestId('user_licence_number-input')).toBeDisabled();
        await page.getByTestId('can_inspect_cb-input').click();
        await expect(page.getByTestId('user_licence_number-input')).not.toBeDisabled();
        // commit the change
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        // Fire an open and close on the edit - no change should occur
        await page.getByTestId('add_toolbar-user-management-add-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
    });

    test('base page delete controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.users.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'user_uid', 0)).getByText('uqjsmit')).toBeVisible();
        // Delete
        await page.getByTestId('action_cell-1-delete-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        // Accept the deletion
        await page.getByTestId('confirm-user-management').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        // Delete
        await page.getByTestId('action_cell-1-delete-button').click();
        // Cancel the deletion
        await page.getByTestId('cancel-user-management').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
        // Test error case
        await page.getByTestId('action_cell-5-delete-button').click();
        await page.getByTestId('confirm-user-management').click();
        await expect(page.getByTestId('confirmation_alert-error-alert')).toBeVisible();
    });
});

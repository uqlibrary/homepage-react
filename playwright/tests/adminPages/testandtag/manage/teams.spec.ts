import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage teams', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/teams?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.teams.header.pageSubtitle('', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'team_display_name', 0)).getByText('Spaces')).toBeVisible();
        await expect(
            (await getFieldValue(page, 'team_display_name', 1)).getByText('Work Station Support'),
        ).toBeVisible();
        await expect(
            (await getFieldValue(page, 'team_display_name', 2)).getByText('Team to test deletion'),
        ).toBeVisible();
        await expect(
            (await getFieldValue(page, 'team_display_name', 3)).getByText('Team to test failure'),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('base page edit controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.teams.header.pageSubtitle('', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'team_display_name', 0)).getByText('Spaces')).toBeVisible();

        await expect(page.locator('#action_cell-WSS-edit-button[data-value="WSS"]')).not.toBeDisabled();
        // Click the first edit button
        await page.locator('#action_cell-WSS-edit-button[data-value="WSS"]').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await expect(
            page
                .getByTestId('update_dialog-team-management')
                .locator('h2')
                .getByText('Edit Team'),
        ).toBeVisible();
        await expect(page.getByTestId('team_display_name-input')).toHaveValue('Work Station Support');
        await expect(page.getByTestId('team_current_flag_cb-input')).toBeEnabled();
        // Click Cancel
        await page.getByTestId('update_dialog-cancel-button').click();

        await page.locator('#action_cell-WSS-edit-button[data-value="WSS"]').click();

        await page.getByTestId('team_display_name-input').fill('Work Station Support updated');
        await expect(page.getByTestId('team_display_name-input')).toHaveValue('Work Station Support updated');
        await page.getByTestId('team_current_flag_cb-input').click();
        await expect(page.getByTestId('team_current_flag_cb-input')).toHaveValue('false');

        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('base page add controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.teams.header.pageSubtitle('', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'team_display_name', 0)).getByText('Spaces')).toBeVisible();
        // Add.
        await page.getByTestId('team-management-data-table-toolbar-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await expect(
            page
                .getByTestId('update_dialog-team-management')
                .locator('h2')
                .getByText('Add new team'),
        ).toBeVisible();

        // Check default helper texts are in required state
        await expect(page.locator('#team_slug-input-helper-text')).toHaveClass(/Mui-error/);
        await expect(page.locator('#team_display_name-input-helper-text')).toHaveClass(/Mui-error/);
        await expect(page.getByTestId('team_current_flag_cb-input')).toBeEnabled();
        await expect(page.getByTestId('team_current_flag_cb-input')).toHaveValue('true');
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();

        // Enter content, slug no longer error
        await page.getByTestId('team_slug-input').fill('cypresstest');
        await expect(page.locator('#team_slug-input-helper-text')).not.toHaveClass(/Mui-error/);
        // Enter content, name no longer error
        await page.getByTestId('team_display_name-input').fill('Cypress Test');
        await expect(page.locator('#team_display_name-input-helper-text')).not.toHaveClass(/Mui-error/);
        await expect(page.getByTestId('update_dialog-action-button')).toBeEnabled();

        // toggle active - field should disable / enable
        await page.getByTestId('team_current_flag_cb-input').click();
        await expect(page.getByTestId('team_current_flag_cb-input')).toHaveValue('false');
        await page.getByTestId('team_current_flag_cb-input').click();
        await expect(page.getByTestId('team_current_flag_cb-input')).toHaveValue('true');

        // commit the change
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        // Fire an open and close on the edit - no change should occur
        await page.getByTestId('team-management-data-table-toolbar-add-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
    });

    test('base page delete controls function correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.teams.header.pageSubtitle('', 'Library'));
        await forcePageRefresh(page);
        await expect(
            (await getFieldValue(page, 'team_display_name', 2)).getByText('Team to test deletion'),
        ).toBeVisible();
        await expect(page.getByTestId('action_cell-TESTDEL-delete-button')).toBeEnabled();
        await expect(page.getByTestId('action_cell-WSS-delete-button')).toBeDisabled();
        await expect(page.getByTestId('action_cell-SPACES-delete-button')).toBeDisabled();

        // Delete
        await page.getByTestId('action_cell-TESTDEL-delete-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        // Accept the deletion
        await page.getByTestId('confirm-team-management').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        // Delete
        await page.getByTestId('action_cell-TESTDEL-delete-button').click();
        // Cancel the deletion
        await page.getByTestId('cancel-team-management').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
        // Test error case
        await page.getByTestId('action_cell-TESTFAIL-delete-button').click();
        await page.getByTestId('confirm-team-management').click();
        await expect(page.getByTestId('confirmation_alert-error-alert')).toBeVisible();
    });
});

import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage Locations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/locations?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(
            page
                .locator('uq-site-header')
                .getByTestId('subsite-title')
                .getByText('Test and tag'),
        ).toBeVisible();
    });

    test('Add location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();

        // Adding a site
        await page.getByTestId('add_toolbar-locations-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('site_id_displayed-input')).toHaveAttribute('required');
        await expect(page.getByTestId('site_name-input')).toHaveAttribute('required');
        await page.getByTestId('site_id_displayed-input').fill('cypresstest');
        await page.getByTestId('site_name-input').fill('Cypress Test');
        // Limit size to 10
        await expect(page.getByTestId('site_id_displayed-input')).toHaveValue('cypresstes');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Add a building
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await expect((await getFieldValue(page, 'building_id_displayed', 0)).getByText('0001')).toBeVisible();
        await page.getByTestId('add_toolbar-locations-add-button').click();
        await expect(page.getByTestId('building_id_displayed-input')).toHaveAttribute('required');
        await expect(page.getByTestId('building_name-input')).toHaveAttribute('required');
        await expect(page.getByTestId('update_dialog-locations-content').getByText('St Lucia')).toBeVisible();
        await page.getByTestId('building_id_displayed-input').fill('buildingtest');
        await page.getByTestId('building_name-input').fill('Cypress Test');
        // Limit size to 10
        await expect(page.getByTestId('building_id_displayed-input')).toHaveValue('buildingte');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Add a floor
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-1').click();
        await expect((await getFieldValue(page, 'floor_id_displayed', 0)).getByText('2')).toBeVisible();
        await page.getByTestId('add_toolbar-locations-add-button').click();
        await expect(page.getByTestId('floor_id_displayed-input')).toHaveAttribute('required');
        await expect(
            page.getByTestId('update_dialog-locations-content').getByText('Forgan Smith Building, St Lucia'),
        ).toBeVisible();
        await page.getByTestId('floor_id_displayed-input').fill('cypresstest');
        // Limit size to 10
        await expect(page.getByTestId('floor_id_displayed-input')).toHaveValue('cypresstes');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Add a room
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-1').click();
        await page.getByTestId('location_picker-locations-floor-input').click();
        await page.locator('#location_picker-locations-floor-option-1').click();
        await expect((await getFieldValue(page, 'room_id_displayed', 0)).getByText('W212')).toBeVisible();
        await page.getByTestId('add_toolbar-locations-add-button').click();
        await expect(page.getByTestId('room_id_displayed-input')).toHaveAttribute('required');
        // description not required
        await expect(page.getByTestId('room_description-input')).not.toHaveAttribute('required');
        await expect(
            page.getByTestId('update_dialog-locations-content').getByText('Floor 2 Forgan Smith Building'),
        ).toBeVisible();
        await page.getByTestId('room_id_displayed-input').fill('cypresstest');
        await page.getByTestId('room_description-input').fill('Room Description');
        // Limit size to 10
        await expect(page.getByTestId('room_id_displayed-input')).toHaveValue('cypresstes');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Edit location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();

        // Editing a site
        await page.getByTestId('action_cell-1-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        // clear a required field - update button should disable
        await page.getByTestId('site_id_displayed-input').clear();
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
        // fill with data
        await page.getByTestId('site_id_displayed-input').fill('testing');
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Editing a building
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await expect((await getFieldValue(page, 'building_id_displayed', 0)).getByText('0001')).toBeVisible();
        await page.getByTestId('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        await page.getByTestId('building_id_displayed-input').clear();
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
        // fill with data
        await page.getByTestId('building_id_displayed-input').fill('testing');
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Editing a Floor
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-1').click();
        await expect((await getFieldValue(page, 'floor_id_displayed', 0)).getByText('2')).toBeVisible();
        await page.getByTestId('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        await page.getByTestId('floor_id_displayed-input').clear();
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
        // fill with data
        await page.getByTestId('floor_id_displayed-input').fill('testing');
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Editing a Room
        await page.getByTestId('location_picker-locations-floor-input').click();
        await page.locator('#location_picker-locations-floor-option-1').click();
        await expect((await getFieldValue(page, 'room_id_displayed', 0)).getByText('W212')).toBeVisible();
        await page.getByTestId('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        await page.getByTestId('room_id_displayed-input').clear();
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
        // fill with data
        await page.getByTestId('room_id_displayed-input').fill('testing');
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Delete location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();
        // Check if populated sites are disabled
        await expect(page.getByTestId('action_cell-1-delete-button')).toBeDisabled();
        await expect(page.getByTestId('action_cell-2-delete-button')).not.toBeDisabled();
        // delete non populated site
        await page.getByTestId('action_cell-3-delete-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(
            page
                .getByTestId('message-title')
                .getByText(locale.pages.manage.locations.dialogDeleteConfirm.confirmationTitle),
        ).toBeVisible();
        await page.getByTestId('confirm-locations').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-3-delete-button').click();
        await page.getByTestId('cancel-locations').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();

        // Delete a building
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        // First should be disabled
        await expect(page.getByTestId('action_cell-1-delete-button')).toBeDisabled();
        // Delete active site
        await page.getByTestId('action_cell-2-delete-button').click();
        await page.getByTestId('confirm-locations').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Delete a floor
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-2').click();
        await expect(page.getByTestId('action_cell-1-delete-button')).toBeDisabled();
        await page.getByTestId('action_cell-2-delete-button').click();
        await page.getByTestId('confirm-locations').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Delete a room
        await page.getByTestId('location_picker-locations-floor-input').click();
        await page.locator('#location_picker-locations-floor-option-1').click();
        await expect(page.getByTestId('action_cell-21-delete-button')).toBeDisabled();
        await page.getByTestId('action_cell-48-delete-button').click();
        await page.getByTestId('confirm-locations').click();
    });
});

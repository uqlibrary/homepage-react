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
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('Add location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();

        // Adding a site
        await page.getByTestId('locations-data-table-toolbar-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('site_id_displayed-input')).toHaveAttribute('required');
        await expect(page.getByTestId('site_name-input')).toHaveAttribute('required');
        await page.getByTestId('site_id_displayed-input').fill('cypresstest');
        await page.getByTestId('site_name-input').fill('Cypress Test');
        await page.getByTestId('site_excluded_cb-input').click();
        // Limit size to 10
        await expect(page.getByTestId('site_id_displayed-input')).toHaveValue('cypresstes');
        await expect(page.getByTestId('site_excluded_cb-input')).toBeChecked();

        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Add a building
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await expect((await getFieldValue(page, 'building_id_displayed', 0)).getByText('0001')).toBeVisible();
        await page.getByTestId('locations-data-table-toolbar-add-button').click();
        await expect(page.getByTestId('building_id_displayed-input')).toHaveAttribute('required');
        await expect(page.getByTestId('building_name-input')).toHaveAttribute('required');
        await expect(page.getByTestId('update_dialog-locations-content').getByText('St Lucia')).toBeVisible();
        await page.getByTestId('building_id_displayed-input').fill('buildingtest');
        await page.getByTestId('building_name-input').fill('Cypress Test');
        await page.getByTestId('building_excluded_cb-input').click();
        // Limit size to 10
        await expect(page.getByTestId('building_id_displayed-input')).toHaveValue('buildingte');
        await expect(page.getByTestId('building_excluded_cb-input')).toBeChecked();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Add a floor
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-1').click();
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-1').click();
        await expect((await getFieldValue(page, 'floor_id_displayed', 0)).getByText('2')).toBeVisible();
        await page.getByTestId('locations-data-table-toolbar-add-button').click();
        await expect(page.getByTestId('floor_id_displayed-input')).toHaveAttribute('required');
        await expect(
            page.getByTestId('update_dialog-locations-content').getByText('Forgan Smith Building, St Lucia'),
        ).toBeVisible();
        await page.getByTestId('floor_id_displayed-input').fill('cypresstest');
        await page.getByTestId('floor_excluded_cb-input').click();
        // Limit size to 10
        await expect(page.getByTestId('floor_id_displayed-input')).toHaveValue('cypresstes');
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeChecked();
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
        await page.getByTestId('locations-data-table-toolbar-add-button').click();
        await expect(page.getByTestId('room_id_displayed-input')).toHaveAttribute('required');
        // description not required
        await expect(page.getByTestId('room_description-input')).not.toHaveAttribute('required');
        await expect(
            page.getByTestId('update_dialog-locations-content').getByText('Floor 2 Forgan Smith Building'),
        ).toBeVisible();
        await page.getByTestId('room_id_displayed-input').fill('cypresstest');
        await page.getByTestId('room_description-input').fill('Room Description');
        await page.getByTestId('room_excluded_cb-input').click();
        // Limit size to 10
        await expect(page.getByTestId('room_id_displayed-input')).toHaveValue('cypresstes');
        await expect(page.getByTestId('room_excluded_cb-input')).toBeChecked();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Edit location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
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
        await page.getByTestId('site_excluded_cb-input').click();
        await expect(page.getByTestId('site_excluded_cb-input')).toBeChecked();
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
        await page.getByTestId('building_excluded_cb-input').click();
        await expect(page.getByTestId('building_excluded_cb-input')).toBeChecked();
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
        await page.getByTestId('floor_excluded_cb-input').click();
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeChecked();
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
        await page.getByTestId('room_excluded_cb-input').click();
        await expect(page.getByTestId('room_excluded_cb-input')).toBeChecked();
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Excluded locations', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
        /** edit excluded locations */
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 1)).getByText('100')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 1)).getByText('Excluded Site')).toBeVisible();

        // Editing am excluded site, checkbox should be checked and clickable
        await page.getByTestId('action_cell-4-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('site_excluded_cb-input')).toBeChecked(); // site excluded
        await expect(page.getByTestId('site_excluded_cb-input')).not.toBeDisabled(); // have to be able to include sites
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Edit a building under an excluded site
        await page.getByTestId('location_picker-locations-site-input').click();
        await page.locator('#location_picker-locations-site-option-4').click();
        await expect((await getFieldValue(page, 'building_id_displayed', 0)).getByText('100')).toBeVisible();
        await expect((await getFieldValue(page, 'building_excluded', 0)).getByText('Yes')).toBeVisible();
        await expect((await getFieldValue(page, 'building_id_displayed', 1)).getByText('101')).toBeVisible();
        await expect((await getFieldValue(page, 'building_excluded', 1)).getByText('Yes')).toBeVisible();
        await page.getByTestId('action_cell-100-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('building_excluded_cb-input')).not.toBeChecked(); // building not excluded
        await expect(page.getByTestId('building_excluded_cb-input')).toBeDisabled(); // site excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-101-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('building_excluded_cb-input')).toBeChecked(); // building excluded
        await expect(page.getByTestId('building_excluded_cb-input')).toBeDisabled(); // site and building excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Floors under an implicitly excluded building should be excluded
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-1').click();
        await expect((await getFieldValue(page, 'floor_id_displayed', 0)).getByText('Excluded floor')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_excluded', 0)).getByText('Yes')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_id_displayed', 1)).getByText('Included floor')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_excluded', 1)).getByText('Yes')).toBeVisible();
        await page.getByTestId('action_cell-100-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('floor_excluded_cb-input')).not.toBeChecked(); // floor not excluded
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeDisabled(); // building excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-101-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeChecked(); // floor excluded
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeDisabled(); // building and floor excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Rooms under an implicitly excluded floor should be excluded
        await page.getByTestId('location_picker-locations-floor-input').click();
        await page.locator('#location_picker-locations-floor-option-1').click();
        await expect((await getFieldValue(page, 'room_description', 0)).getByText('Included room')).toBeVisible();
        await expect((await getFieldValue(page, 'room_excluded', 0)).getByText('Yes')).toBeVisible();
        await expect((await getFieldValue(page, 'room_description', 1)).getByText('Excluded room')).toBeVisible();
        await expect((await getFieldValue(page, 'room_excluded', 1)).getByText('Yes')).toBeVisible();
        await page.getByTestId('action_cell-100-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('room_excluded_cb-input')).not.toBeChecked(); // room not excluded
        await expect(page.getByTestId('room_excluded_cb-input')).toBeDisabled(); // floor excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-101-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('room_excluded_cb-input')).toBeChecked(); // room excluded
        await expect(page.getByTestId('room_excluded_cb-input')).toBeDisabled(); // floor and room excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Floors under an explicitly excluded building should be excluded
        await page.getByTestId('location_picker-locations-building-input').click();
        await page.locator('#location_picker-locations-building-option-2').click();
        await expect((await getFieldValue(page, 'floor_id_displayed', 0)).getByText('Excluded floor')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_excluded', 0)).getByText('Yes')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_id_displayed', 1)).getByText('Included floor')).toBeVisible();
        await expect((await getFieldValue(page, 'floor_excluded', 1)).getByText('Yes')).toBeVisible();
        await page.getByTestId('action_cell-102-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('floor_excluded_cb-input')).not.toBeChecked(); // floor not excluded
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeDisabled(); // building excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-103-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeChecked(); // floor excluded
        await expect(page.getByTestId('floor_excluded_cb-input')).toBeDisabled(); // building and floor excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

        // Rooms under an explicitly excluded floor should be excluded
        await page.getByTestId('location_picker-locations-floor-input').click();
        await page.locator('#location_picker-locations-floor-option-2').click();
        await expect((await getFieldValue(page, 'room_description', 0)).getByText('Included room')).toBeVisible();
        await expect((await getFieldValue(page, 'room_excluded', 0)).getByText('Yes')).toBeVisible();
        await expect((await getFieldValue(page, 'room_description', 1)).getByText('Excluded room')).toBeVisible();
        await expect((await getFieldValue(page, 'room_excluded', 1)).getByText('Yes')).toBeVisible();
        await page.getByTestId('action_cell-106-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('room_excluded_cb-input')).not.toBeChecked(); // room not excluded
        await expect(page.getByTestId('room_excluded_cb-input')).toBeDisabled(); // floor excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        await page.getByTestId('action_cell-107-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('room_excluded_cb-input')).toBeChecked(); // room excluded
        await expect(page.getByTestId('room_excluded_cb-input')).toBeDisabled(); // floor and room excluded
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Delete location functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
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

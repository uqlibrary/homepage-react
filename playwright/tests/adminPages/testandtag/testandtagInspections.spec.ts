import { test, expect, Page } from '@uq/pw/test';
import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';
import moment from 'moment';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Test and Tag Admin Inspection page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/inspect?user=uqtesttag');
        await expect.poll(async () => await page.locator(':focus').getAttribute('value')).toBe('St Lucia');
    });

    const selectListBox = async (page: Page, pattern: string) =>
        await page
            .locator('[role=listbox]')
            .locator('li')
            .getByText(pattern)
            .first()
            .click({ timeout: 1000 });

    const selectAssetId = async (page: Page, pattern: string) => {
        await page.getByTestId('asset_selector-asset-panel-input').click();
        await selectListBox(page, pattern);
        await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue(pattern);
    };

    const selectTestingDevice = async (page: Page, pattern: string) => {
        await page.getByTestId('inspection_panel-inspection-device-select').click();
        await selectListBox(page, pattern);
        await expect(page.getByTestId('inspection_panel-inspection-device-select').getByText(pattern)).toBeVisible();
    };

    const selectAssetType = async (page: Page, pattern: string) => {
        await page.getByTestId('asset_type_selector-asset-panel-input').click();
        await selectListBox(page, pattern);
        await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toHaveValue(pattern);
    };

    interface Location {
        site?: string;
        building?: string;
        floor?: string;
        room?: string;
    }

    const selectLocation = async (page: Page, { site, building, floor, room }: Location) => {
        // Site
        if (!!site) {
            await expect(async () => {
                await page.getByTestId('location_picker-event-panel-site').click({ timeout: 1000 });
                await selectListBox(page, site);
            }).toPass();
        }
        if (!!building) {
            // Building
            await expect(async () => {
                await page.getByTestId('location_picker-event-panel-building').click({ timeout: 1000 });
                await selectListBox(page, building);
            }).toPass();
        }

        // Floor
        if (!!floor) {
            await expect(async () => {
                await page.getByTestId('location_picker-event-panel-floor').click({ timeout: 1000 });
                await selectListBox(page, floor);
            }).toPass();
        }

        // Room
        if (!!room) {
            await expect(async () => {
                await page.getByTestId('location_picker-event-panel-room').click({ timeout: 1000 });
                await selectListBox(page, room);
            }).toPass();
        }
    };

    const runAllTests = () => {
        test('page is accessible', async ({ page }) => {
            await expect(page.locator('h1').getByText('UQ Asset Test and Tag')).toBeVisible();
            await expect(page.locator('h2').getByText('Testing assets for Library')).toBeVisible();
            await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });

        test('has breadcrumb', async ({ page }) =>
            await expect(
                page
                    .locator('uq-site-header')
                    .getByTestId('subsite-title')
                    .getByText('Test and tag'),
            ).toBeVisible());

        test.describe('Event panel functionality', () => {
            const today = moment();
            test('should show correct dates', async ({ page }) => {
                await expect(page.getByTestId('event_panel-event-date-input')).toHaveValue(
                    today.format(locale.pages.inspect.config.dateFormatDisplay),
                );
            });

            test('should allow entry of new date', async ({ page }) => {
                const invalidDate = today.add(1, 'day').format(locale.pages.inspect.config.dateFormatDisplay);
                const validDate = today.subtract(1, 'day').format(locale.pages.inspect.config.dateFormatDisplay);
                await page.getByTestId('event_panel-event-date-button').click();
                await expect(page.locator('[role="dialog"]')).toBeVisible();
                await page.keyboard.press('Escape');
                await expect(page.locator('[role="dialog"]')).not.toBeVisible();

                await page.getByTestId('event_panel-event-date-input').clear();
                await page.getByTestId('event_panel-event-date-input').fill(invalidDate);
                await expect(
                    page
                        .locator('#event_panel-event-date-input-helper-text')
                        .getByText(locale.pages.inspect.form.event.date.maxDateMessage),
                ).toBeVisible();
                await page.getByTestId('event_panel-event-date-input').clear();
                // make sure if starts typing from day
                await page.getByTestId('event_panel-event-date-input').press('ArrowLeft');
                await page.getByTestId('event_panel-event-date-input').press('ArrowLeft');
                await page.getByTestId('event_panel-event-date-input').fill(validDate);
                await expect(page.locator('#event_panel-event-date-input-helper-text')).not.toBeVisible();
            });

            test('should allow selection of location', async ({ page }) => {
                // Site
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await page.getByTestId('location_picker-event-panel-site').click();
                await expect(
                    async () => await page.locator('#location_picker-event-panel-site-option-1').click(),
                ).toPass();
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('Gatton');

                // Building
                await page.getByTestId('location_picker-event-panel-building').click();
                await expect(
                    async () => await page.locator('#location_picker-event-panel-building-option-0').click(),
                ).toPass();
                await expect(page.getByTestId('location_picker-event-panel-building-input')).toHaveValue(
                    '8102 - J.K. Murray Library',
                );

                // Floor
                await expect(async () => {
                    await page.getByTestId('location_picker-event-panel-floor').click({ timeout: 1000 });
                    await page.locator('#location_picker-event-panel-floor-option-0').click({ timeout: 1000 });
                    await expect(page.getByTestId('location_picker-event-panel-floor-input')).toHaveValue('1');
                }).toPass();

                // Room
                await expect(async () => {
                    await page.getByTestId('location_picker-event-panel-room').click({ timeout: 1000 });
                    await page.locator('#location_picker-event-panel-room-option-0').click({ timeout: 1000 });
                    await expect(page.getByTestId('location_picker-event-panel-room-input')).toHaveValue('101');
                }).toPass();

                // Reset by changing site
                await page.getByTestId('location_picker-event-panel-site').click();
                await page.locator('#location_picker-event-panel-site-option-0').click();
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await expect(page.getByTestId('location_picker-event-panel-building-input')).not.toHaveValue(
                    '8102 - J.K. Murray Library',
                );
                await expect(page.getByTestId('location_picker-event-panel-floor-input')).not.toHaveValue('1');
                await expect(page.getByTestId('location_picker-event-panel-room-input')).not.toHaveValue('101');
            });

            test('should reset location when fields change', async ({ page }) => {
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                // set location so that we can test it clears later
                await selectLocation(page, { building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await expect(page.getByTestId('location_picker-event-panel-building-input')).toHaveValue(
                    '0001 - Forgan Smith Building',
                );
                await expect(page.getByTestId('location_picker-event-panel-floor-input')).toHaveValue('2');
                await expect(page.getByTestId('location_picker-event-panel-room-input')).toHaveValue('W212');
                await selectLocation(page, { floor: '3' });
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await expect(page.getByTestId('location_picker-event-panel-building-input')).toHaveValue(
                    '0001 - Forgan Smith Building',
                );
                await expect(page.getByTestId('location_picker-event-panel-floor-input')).toHaveValue('3');
                await expect(page.getByTestId('location_picker-event-panel-room-input')).toHaveValue('');
                await selectLocation(page, { building: 'Duhig' });
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await expect(page.getByTestId('location_picker-event-panel-building-input')).toHaveValue(
                    '0002 - Duhig Tower',
                );
                await expect(page.getByTestId('location_picker-event-panel-floor-input')).toHaveValue('');
                await expect(page.getByTestId('location_picker-event-panel-room-input')).toHaveValue('');
                await selectLocation(page, { site: 'Gatton' });
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('Gatton');
                await expect(page.getByTestId('location_picker-event-panel-building-input')).toHaveValue('');
                await expect(page.getByTestId('location_picker-event-panel-floor-input')).toHaveValue('');
                await expect(page.getByTestId('location_picker-event-panel-room-input')).toHaveValue('');
            });
        });

        test.describe('Asset panel functionality', () => {
            test('should allow auto complete of asset ID as mask', async ({ page }) => {
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                // Enter partial asset ID for mask search
                await page.getByTestId('asset_selector-asset-panel-input').click();
                await page.getByTestId('asset_selector-asset-panel-input').fill('123');
                // Asset found
                await expect(page.getByTestId('last_inspection_panel-header-fail-chip')).toBeVisible();
            });

            test('should restrict length of asset IDs', async ({ page }) => {
                const initialText = 'ABCDEFGHIJKLMNOP'; // not a long enough text
                const croppedText = 'ABCDEFGHIJKL';
                // this is for code coverage. Will be removed post MVP
                await page.getByTestId('asset_selector-asset-panel-input').click();
                await page.getByTestId('asset_selector-asset-panel-input').fill(`${initialText}{Enter}`);
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue(croppedText);
            });

            test('should allow selection of new asset and type', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').click();
                await page.locator('#asset_selector-asset-panel-option-0').click();
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('NEW ASSET');
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).not.toBeDisabled();
                // select asset type
                await selectAssetType(page, 'PowerBoard');
            });

            test('should allow creation of new asset type', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').click();
                await page.locator('#asset_selector-asset-panel-option-0').click();
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('NEW ASSET');
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).not.toBeDisabled();
                await page.getByTestId('asset_type_selector-asset-panel-input').click();
                await selectListBox(page, 'ADD NEW ASSET TYPE');
                // popup has loaded as it has header
                await expect(page.getByTestId('asset_type_name-label').getByText('Asset type name')).toBeVisible();
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
                await page.getByTestId('asset_type_name-input').fill('an asset type');

                // the popup is accessible
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                await expect(page.getByTestId('update_dialog-action-button').getByText('Add')).toBeVisible();
                await page.getByTestId('update_dialog-action-button').click();
                await page
                    .getByTestId('confirmation_alert-success')
                    .locator('[type=button]')
                    .click();
                await expect(page.getByTestId('confirmation_alert-success')).not.toBeVisible();
            });

            test('should allow selection of existing asset', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL3100');
                await expect(page.locator('#asset_selector-asset-panel-option-0').getByText('UQL31000')).toBeVisible();
                await page.locator('#asset_selector-asset-panel-option-0').click();
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL310000');
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).not.toBeDisabled();
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toHaveValue('Power Cord - C13');
            });

            test('should show passed Previous Inspection panel', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL310000');
                await page.locator('#asset_selector-asset-panel-option-0').click();
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL310000');
                const lastInspectionPanel = page.getByTestId('last_inspection_panel');
                await expect(lastInspectionPanel).not.toBeDisabled();
                await expect(lastInspectionPanel).toHaveCSS('border-color', 'rgb(0, 114, 0)');
                await expect(page.getByTestId('last_inspection_panel-header-pass-chip')).toBeVisible();
                await expect(page.getByTestId('last_inspection_panel-header-mismatch-icon')).toBeVisible();
                const expandButton = page.getByTestId('last_inspection_panel-expand-button');
                await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
                await expandButton.click();
                await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
                await expect(page.getByTestId('last_inspection_panel').getByText('CURRENT')).toBeVisible();
                await expect(
                    page.getByTestId('last_inspection_panel').getByText('Locations do not match'),
                ).toBeVisible();
                // make locations match
                await selectLocation(page, {
                    site: 'St Lucia',
                    building: 'Forgan Smith Building',
                    floor: '2',
                    room: 'W212',
                });
                await expect(page.getByTestId('last_inspection_panel-header-mismatch-icon')).not.toBeVisible();
                await expect(page.getByTestId('last_inspection_panel')).not.toContainText('Locations do not match');
            });

            test('should show failed Previous Inspection panel', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL20000');
                // only 1 item should match and should be auto selected
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL200000');
                const lastInspectionPanel = page.getByTestId('last_inspection_panel');
                await expect(lastInspectionPanel).not.toBeDisabled();
                await expect(lastInspectionPanel).toHaveCSS('border-color', 'rgb(149, 17, 38)');
                await expect(page.getByTestId('last_inspection_panel-header-fail-chip')).toBeVisible();
                await expect(page.getByTestId('last_inspection_panel-header-mismatch-icon')).toBeVisible();
                const expandButton = page.getByTestId('last_inspection_panel-expand-button');
                await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
                await expandButton.click();
                await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
                await expect(page.getByTestId('last_inspection_panel').getByText('OUTFORREPAIR')).toBeVisible();
                await expect(
                    page.getByTestId('last_inspection_panel').getByText('Locations do not match'),
                ).toBeVisible();
                // make locations match
                await selectLocation(page, {
                    site: 'St Lucia',
                    building: 'Forgan Smith Building',
                    floor: '2',
                    room: 'W212',
                });
                await expect(page.getByTestId('last_inspection_panel-header-mismatch-icon')).not.toBeVisible();
                await expect(page.getByTestId('last_inspection_panel')).not.toContainText('Locations do not match');
            });

            test('should show DISCARDED Previous Inspection panel', async ({ page }) => {
                await expect(page.getByTestId('asset_type_selector-asset-panel-input')).toBeDisabled();
                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL300000');
                // only 1 item should match and should be auto selected
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL300000');
                const lastInspectionPanel = page.getByTestId('last_inspection_panel');
                await expect(lastInspectionPanel).not.toBeDisabled();
                await expect(lastInspectionPanel).toHaveCSS('border-color', 'rgb(0, 114, 0)');
                await expect(page.getByTestId('last_inspection_panel-header-pass-chip')).toBeVisible();
                const expandButton = page.getByTestId('last_inspection_panel-expand-button');
                await expect(expandButton).toHaveAttribute('aria-expanded', 'true'); // inspection auto expands
                await expect(page.getByTestId('last_inspection_panel').getByText('DISCARDED')).toBeVisible();
                await expect(
                    page.getByTestId('last_inspection_panel').getByText('Locations do not match'),
                ).toBeVisible();
                await expect(page.getByTestId('inspection_panel')).not.toBeVisible();
                await expect(page.getByTestId('inspection-save-button')).toBeDisabled();
                await page.getByTestId('inspection-reset-button').click(); // reset form
                await expect(page.getByTestId('inspection_panel')).toBeVisible();
                await expect(page.getByTestId('last_inspection_panel-expand-button')).toHaveAttribute(
                    'aria-expanded',
                    'false',
                );
            });
        });

        test.describe('Inspection panel functionality', () => {
            test('should allow entry of inspection details', async ({ page }) => {
                await expect(page.getByTestId('inspection_panel-inspection-result-passed-button')).toBeDisabled();
                await expect(page.getByTestId('inspection_panel-inspection-result-failed-button')).toBeDisabled();
                await selectAssetId(page, 'NEW ASSET');
                await selectAssetType(page, 'PowerBoard');

                await expect(page.getByTestId('inspection_panel-inspection-result-passed-button')).not.toBeDisabled();
                await expect(page.getByTestId('inspection_panel-inspection-result-failed-button')).not.toBeDisabled();
                await page.getByTestId('inspection_panel-inspection-device-select').click();
                await selectListBox(page, 'AV 025');
                await expect(
                    page.getByTestId('inspection_panel-inspection-device-select').getByText('AV 025'),
                ).toBeVisible();
                await page.getByTestId('inspection_panel-inspection-result-passed-button').click();

                const today = moment();

                const plus3months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(3, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus6months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(6, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus12months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(12, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus60months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(60, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );

                await expect(page.getByTestId('months_selector-inspection-panel-select')).toBeVisible();
                await expect(
                    page.getByTestId('months_selector-inspection-panel-next-date-label').getByText(plus12months),
                ).toBeVisible();
                // 3 months
                await page.getByTestId('months_selector-inspection-panel-select').click();
                await selectListBox(page, '3 months');
                await expect(
                    page.getByTestId('months_selector-inspection-panel-next-date-label').getByText(plus3months),
                ).toBeVisible();
                // 6 months
                await page.getByTestId('months_selector-inspection-panel-select').click();
                await selectListBox(page, '6 months');
                await expect(
                    page.getByTestId('months_selector-inspection-panel-next-date-label').getByText(plus6months),
                ).toBeVisible();
                // 5 years
                await page.getByTestId('months_selector-inspection-panel-select').click();
                await selectListBox(page, '5 years');
                await expect(
                    page.getByTestId('months_selector-inspection-panel-next-date-label').getByText(plus60months),
                ).toBeVisible();

                await page.getByTestId('inspection_panel-inspection-notes-input').fill('Test notes');

                await page.getByTestId('inspection_panel-inspection-result-failed-button').click();
                await expect(page.getByTestId('months_selector-inspection-panel-select')).not.toBeVisible();
                await page.getByTestId('inspection_panel-fail-reason-input').fill('failed reason');

                await page.getByTestId('inspection-reset-button').click();
                await expect(page.getByTestId('inspection_panel-inspection-result-passed-button')).toBeDisabled();
                await expect(page.getByTestId('inspection_panel-inspection-result-failed-button')).toBeDisabled();
            });

            test('should show error for a PASS inspection if visual device is selected', async ({ page }) => {
                await expect(page.getByTestId('inspection_panel-inspection-result-passed-button')).toBeDisabled();
                await expect(page.getByTestId('inspection_panel-inspection-result-failed-button')).toBeDisabled();
                await selectAssetId(page, 'NEW ASSET');
                await selectAssetType(page, 'PowerBoard');

                await expect(page.getByTestId('inspection_panel-inspection-result-passed-button')).not.toBeDisabled();
                await expect(page.getByTestId('inspection_panel-inspection-result-failed-button')).not.toBeDisabled();
                await page.getByTestId('inspection_panel-inspection-device-select').click();
                await selectListBox(page, 'Visual Inspection');
                await expect(
                    page.getByTestId('inspection_panel-inspection-device-select').getByText('Visual Inspection'),
                ).toBeVisible();
                await expect(page.getByTestId('inspection_panel-inspection-device-validation-text')).not.toBeVisible();
                await page.getByTestId('inspection_panel-inspection-result-passed-button').click();
                await expect(
                    page
                        .getByTestId('inspection_panel-inspection-device-validation-text')
                        .getByText('Visual Inspection can not be used for a PASS test'),
                ).toBeVisible();
                await page.getByTestId('inspection_panel-inspection-result-failed-button').click();
                await expect(page.getByTestId('inspection_panel-inspection-device-validation-text')).not.toBeVisible();
                await page.getByTestId('inspection_panel-inspection-result-passed-button').click();
                await expect(
                    page
                        .getByTestId('inspection_panel-inspection-device-validation-text')
                        .getByText('Visual Inspection can not be used for a PASS test'),
                ).toBeVisible();
                await page.getByTestId('inspection_panel-inspection-device-select').click();
                await selectListBox(page, 'AV 025');
                await expect(page.getByTestId('inspection_panel-inspection-device-validation-text')).not.toBeVisible();
            });
        });

        test.describe('Action panel functionality', () => {
            test('should allow enter of repair/discard details', async ({ page }) => {
                await selectAssetId(page, 'NEW ASSET');
                await selectAssetType(page, 'PowerBoard');
                await page.getByTestId('inspection_panel-inspection-result-passed-button').click();
                await expect(page.getByTestId('action_panel-repair-tab-button')).toBeDisabled();
                await expect(page.getByTestId('action_panel-discard-tab-button')).not.toBeDisabled();
                await page.getByTestId('inspection_panel-inspection-result-failed-button').click();
                await expect(page.getByTestId('action_panel-repair-tab-button')).not.toBeDisabled();
                await expect(page.getByTestId('action_panel-discard-tab-button')).not.toBeDisabled();

                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL310000'); // last inspection = passed
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL310000');
                await expect(page.getByTestId('action_panel-repair-tab-button')).toBeDisabled(); // shouldnt be able to send for repair
                await expect(page.getByTestId('action_panel-discard-tab-button')).not.toBeDisabled();

                await page.getByTestId('asset_selector-asset-panel-input').clear();
                await page.getByTestId('asset_selector-asset-panel-input').fill('UQL20000'); // last inspection = failed
                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('UQL200000');
                await expect(page.getByTestId('action_panel-repair-tab-button')).not.toBeDisabled(); // failed should be able send for repair
                await expect(page.getByTestId('action_panel-discard-tab-button')).not.toBeDisabled();

                await expect(page.getByTestId('action_panel-discard-reason-input')).toBeDisabled();
                await page.getByTestId('action_panel-is-discard-select').click();
                await selectListBox(page, 'YES');
                await expect(page.getByTestId('action_panel-repair-tab-button')).toBeDisabled(); // can only enter details for one tab at a time
                await expect(page.getByTestId('action_panel-discard-reason-input')).not.toBeDisabled();
                await page.getByTestId('action_panel-discard-reason-input').fill('Discard reason');
                await page.getByTestId('action_panel-is-discard-select').click();
                await selectListBox(page, 'NO');
                await expect(page.getByTestId('action_panel-repair-tab-button')).not.toBeDisabled(); // can only enter details for one tab at a time

                await page.getByTestId('action_panel-repair-tab-button').click();
                await page.getByTestId('action_panel-is-repair-select').click();
                await selectListBox(page, 'YES');
                await expect(page.getByTestId('action_panel-discard-tab-button')).toBeDisabled(); // can only enter details for one tab at a time
                await expect(page.getByTestId('action_panel-repairer-details-input')).not.toBeDisabled();
                await page.getByTestId('action_panel-repairer-details-input').fill('Repair reason');

                await page.getByTestId('inspection_panel-inspection-result-passed-button').click(); // can't allow repair option if test passes
                await expect(page.getByTestId('action_panel-repair-tab-button')).toBeDisabled(); // make sure repair tab disables
                await expect(page.getByTestId('action_panel-discard-tab-button')).not.toBeDisabled(); // discard tab should be enabled and auto selected
                await expect(page.getByTestId('action_panel-discard-tab-button')).toHaveClass(/Mui-selected/); // check it is selected

                await page.getByTestId('inspection-reset-button').click();
                await expect(page.getByTestId('action_panel-repair-tab-button')).toBeDisabled();
                await expect(page.getByTestId('action_panel-discard-tab-button')).toBeDisabled();
            });
        });

        test.describe('saving values', () => {
            test('should enable save button and show active saved message', async ({ page }) => {
                await expect(page.getByTestId('inspection-save-button')).toBeDisabled();
                await expect(page.getByTestId('location_picker-event-panel-site-input')).toHaveValue('St Lucia');
                await selectLocation(page, { building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                await selectAssetId(page, 'NEW ASSET');
                await selectAssetType(page, 'PowerBoard');
                await selectTestingDevice(page, 'ITS-PAT-06');
                await page.getByTestId('inspection_panel-inspection-result-passed-button').click();
                await page.getByTestId('inspection_panel-inspection-notes-input').fill('Test notes');
                await expect(page.getByTestId('inspection-save-button')).not.toBeDisabled();
                await page.getByTestId('inspection-save-button').click();
                await expect(page.getByTestId('message-title').getByText('Asset saved')).toBeVisible();
                await expect(
                    page
                        .getByTestId('saved-asset-id')
                        .first()
                        .getByText('UQL000298'),
                ).toBeVisible();
                await page.getByTestId('confirm-inspection-save-success').click();

                await expect(page.getByTestId('asset_selector-asset-panel-input')).toHaveValue('');
            });
        });
    };

    test.describe('Desktop', () => {
        test.beforeEach(async ({ page }) => await page.setViewportSize({ width: 1300, height: 1000 }));
        runAllTests();
    });
});

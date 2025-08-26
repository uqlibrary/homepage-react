import { test, expect } from '@uq/pw/test';
import { assertAccessibility, defaultDisabledRules } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Report - Inspections by Licenced User', () => {
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/report/inspectionsbylicenceduser?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'user_uid', 0)).toContainText('uqtest1');
        await assertAccessibility(page, '[data-testid="StandardPage"]', {
            disabledRules: [...defaultDisabledRules, 'color-contrast'],
        });
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(page.locator('uq-site-header').getByTestId('subsite-title')).toContainText('Test and tag');
    });

    test('Inspector selection works as intended', async ({ page }) => {
        const showDropdown = async (testId: string) => {
            await expect(async () => {
                await page.getByTestId(testId).click({ timeout: 500 });
                await expect(page.getByRole('listbox')).toBeVisible({ timeout: 1000 });
            }).toPass();
        };

        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'user_uid', 0)).toContainText('uqtest1');
        await showDropdown('user_inspections-user-name');
        // Select user with no records
        await page.getByTestId('user_inspections-user-name-option-2').click();
        await page.locator('body').click();
        await expect(page.getByTestId('user_inspections-user-name-select')).toBeEnabled();
        // Check the value of the dropdown
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('Third Testing user');
        // Select a second user
        await showDropdown('user_inspections-user-name');
        await page.getByTestId('user_inspections-user-name-option-1').click();
        await page.locator('body').click();
        await expect(page.getByTestId('user_inspections-user-name-select')).toBeEnabled();
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('Second Testing user');
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('Third Testing user');

        // Select third user
        await showDropdown('user_inspections-user-name-select');
        await page.getByTestId('user_inspections-user-name-option-0').click();
        await page.locator('body').click();
        await expect(page.getByTestId('user_inspections-user-name-select')).toBeEnabled();
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('JTest User');
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('Second Testing user');
        await expect(page.getByTestId('user_inspections-user-name-select')).toContainText('(and 1 more)');
    });

    test('Date selectors work as intended', async ({ page }) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = zeroPad(new Date().getMonth() + 1, 2);
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'user_uid', 0)).toContainText('uqtest1');
        // Add a start date
        await page.getByTestId('user_inspections-tagged-start-button').click();
        await page.locator('.MuiPickersDay-root:has-text("11")').click();
        await page.locator('body').click();
        // Should require an end date here
        await expect(page.locator('#user_inspections-tagged-end-input-helper-text')).toContainText(
            'An end date is required',
        );
        // Add an end date
        await expect(page.getByTestId('user_inspections-tagged-start-input')).toHaveValue(
            `${currentYear}-${currentMonth}-11`,
        );
        await page.getByTestId('user_inspections-tagged-end-button').click();
        await page.locator('.MuiPaper-root[style*="opacity: 1"] .MuiPickersDay-root:has-text("12")').click();
        await page.locator('body').click();
        await expect(page.getByTestId('user_inspections-tagged-end-input')).toHaveValue(
            `${currentYear}-${currentMonth}-12`,
        );
        // Set up an incorrect date for the end
        await page.getByTestId('user_inspections-tagged-end-button').click();
        await page.locator('.MuiPaper-root[style*="opacity: 1"] .MuiPickersDay-root:has-text("10")').click();
        await page.locator('body').click();
        await expect(page.locator('#user_inspections-tagged-end-input-helper-text')).toContainText(
            'End date must be after start date',
        );
        await expect(page.locator('#user_inspections-tagged-start-input-helper-text')).toContainText(
            'Start date must be before end date',
        );

        // Now clear the inspection start date, showing error on end date
        await page.getByTestId('user_inspections-tagged-start-input').clear();
        await page.keyboard.press('ArrowRight');
        await page.getByTestId('user_inspections-tagged-start-input').clear();
        await page.keyboard.press('ArrowRight');
        await page.getByTestId('user_inspections-tagged-start-input').clear();
        await page.locator('body').click();
        await expect(page.locator('#user_inspections-tagged-start-input-helper-text')).toContainText(
            'A start date is required',
        );
        // Clear the end date
        await page.getByTestId('user_inspections-tagged-end-input').clear();
        await page.locator('body').click();
        await expect(page.getByTestId('user_inspections-tagged-end-input')).not.toHaveValue(
            `${currentYear}-${currentMonth}-12`,
        );
        await expect(page.getByTestId('user_inspections-tagged-start-input')).not.toHaveValue(
            `${currentYear}-${currentMonth}-12`,
        );
    });
});

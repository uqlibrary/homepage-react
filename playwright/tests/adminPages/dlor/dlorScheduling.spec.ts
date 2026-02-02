import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

import moment from 'moment-timezone';

function getTomorrowDate() {
    const tomorrow = new Date();
    // Move the date forward by 1 day
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get the day number (e.g., '9', '15')
    const dayOfMonth = tomorrow.getDate().toString();

    // Format the date string as DD/MM/YYYY for assertion (e.g., '09/12/2025')
    const day = dayOfMonth.padStart(2, '0');
    // JavaScript months are 0-indexed, so add 1
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const year = tomorrow.getFullYear();
    const expectedDateString = `${day}/${month}/${year}`;

    return { dayOfMonth, expectedDateString, tomorrow };
}

function getPastDate(daysInPast: moment.DurationInputArg1) {
    const timezone = 'Australia/Brisbane';
    const pastDate = moment()
        .tz(timezone)
        .subtract(daysInPast, 'days');

    // The format that your input field expects (e.g., "23/11/2025")
    const expectedDateString = pastDate.format('DD/MM/YYYY');

    return { expectedDateString };
}

test.describe('Digital Learning Hub', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    test.describe('scheduling', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/schedule?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub - Bulk Scheduling Management'),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
        });
        test('should set the schedule end date to tomorrow', async ({ page }) => {
            // --- 1. Setup ---
            const { dayOfMonth, expectedDateString, tomorrow } = getTomorrowDate();

            // Your working locator for the input element
            const endDateInput = page.locator('[data-testid="schedule-end-date"] input');
            const endDateInputButton = page.locator('[data-testid="schedule-end-date"] button');

            await page.getByTestId('schedule_name').fill('Test Schedule for Tomorrow Date');
            // --- 2. Action: Open the Picker and Select the Day ---

            // Click the input field to open the calendar dialog
            await endDateInputButton.click();

            // Use a robust selector for the day button within the MUI picker.
            // It targets an element with the class MuiPickersDay-root that contains the day number as text.
            //
            const tomorrowButton = page.locator(`.MuiPickersDay-root >> text=\"${dayOfMonth}\"`);

            // Wait for the calendar to be visible and click the calculated day
            await tomorrowButton.waitFor({ state: 'visible' });
            await tomorrowButton.click();

            // --- 3. Assertion: Verify the input value is correct ---

            // The value of the input field should now match the expected formatted string (DD/MM/YYYY)
            await expect(endDateInput).toHaveValue(expectedDateString);
            await page.getByTestId('schedule-add-items').click();
            await page.getByTestId('add-schedule-item-0').click();
            await page.getByTestId('add-schedule-item-1').click();
            await page.getByTestId('schedule-close-button').click();
            await page.getByTestId('schedule-confirm-items').click();
            await page.getByTestId('dlor-schedule-alert').waitFor({ state: 'visible' });
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'Schedule saved successfully',
            );
        });

        test('can view a running schedule', async ({ page }) => {
            await page.locator('[data-testid="running-schedule-expand"] > svg').click();
            await page.getByTestId('running-schedule-edit-button-0').click();
            await expect(page.getByTestId('Schedule-title')).toHaveText('Test Number 0');
            await page.getByTestId('schedule-close-button').click();
        });
        test('can edit existing schedule', async ({ page }) => {
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-edit-button-0').click();
            await expect(page.getByTestId('add-schedule-item-0')).toHaveAttribute(
                'aria-label',
                'Add Advanced literature searching to schedule',
            );
            await page.getByTestId('dlor-search-input').fill('Blak');
            await expect(page.getByTestId('add-schedule-item-0')).toHaveAttribute(
                'aria-label',
                'Add UQ has a Blak History to schedule',
            );
            await page.getByTestId('schedule-close-button').click();
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-edit-button-0').click();
            await page.getByTestId('add-schedule-item-0').click();
            await page.getByTestId('modal-save-button').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'Schedule saved successfully',
            );
        });
        test('can remove existing item from a schedule', async ({ page }) => {
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-edit-button-0').click();
            await page.getByTestId('remove-selected-item-0').click();
            await page.getByTestId('add-schedule-item-0').click();
            await page.getByTestId('modal-save-button').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'Schedule saved successfully',
            );
        });
        test('should fail if the end date is before the start date', async ({ page }) => {
            const daysToLookBack = 16;
            const { expectedDateString } = getPastDate(daysToLookBack);

            const endDateInput = page.locator('[data-testid="schedule-end-date"] input');

            await endDateInput.fill(expectedDateString);

            await expect(endDateInput).toHaveValue(expectedDateString);

            await page.getByTestId('schedule_name').fill('Test Schedule for Tomorrow Date');
            await page.getByTestId('schedule-add-items').click();
            await page.getByTestId('add-schedule-item-0').click();
            await page.getByTestId('add-schedule-item-1').click();
            await page.getByTestId('schedule-close-button').click();
            let alertMessage = '';
            page.once('dialog', async dialog => {
                expect(dialog.type()).toBe('alert');

                alertMessage = dialog.message();

                await dialog.accept();
            });
            await page.getByTestId('schedule-confirm-items').click();
            const expectedErrorMessage = 'End date must be after the start date (cannot be the same).';
            await page.waitForTimeout(500);

            expect(alertMessage).toBe(expectedErrorMessage);
        });

        test('displays Data store error', async ({ page }) => {
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-edit-button-1').click();
            await page.getByTestId('modal-save-button').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
            );
        });

        test('can delete existing schedule', async ({ page }) => {
            page.on('dialog', dialog => {
                dialog.accept();
            });
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-delete-button-0').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'Schedule deleted successfully',
            );
            await page.locator('[data-testid="dlor-schedule-alert-info"] button').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"]')).not.toBeVisible();
        });
        test('captures error on delete', async ({ page }) => {
            page.on('dialog', dialog => {
                dialog.accept();
            });
            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();
            await page.getByTestId('pending-schedule-delete-button-1').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"] .MuiAlert-message')).toHaveText(
                'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
            );
            await page.locator('[data-testid="dlor-schedule-alert-info"] button').click();
            await expect(page.locator('[data-testid="dlor-schedule-alert-info"]')).not.toBeVisible();
        });
        test('can cancel schedule deletion dialog', async ({ page }) => {
            page.on('dialog', dialog => {
                expect(dialog.message()).toContain('Are you sure you want to delete this schedule?');

                dialog.dismiss();
            });

            await page.locator('[data-testid="pending-schedule-expand"] > svg').click();

            await page.getByTestId('pending-schedule-delete-button-0').click();

            await expect(page.locator('[data-testid="pending-schedule-delete-button-0"]')).toBeVisible();

            await expect(page.locator('[data-testid="dlor-schedule-alert-info"]')).not.toBeVisible();
        });
    });
});

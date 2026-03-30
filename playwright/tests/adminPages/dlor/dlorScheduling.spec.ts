import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

import moment from 'moment-timezone';

const TEST_TIMEZONE = 'Australia/Brisbane';

function getTomorrowDate() {
    const tomorrow = moment()
        .tz(TEST_TIMEZONE)
        .add(1, 'day');
    const expectedDateString = tomorrow.format('DD/MM/YYYY');

    return { expectedDateString, tomorrow };
}

function getPastDate(daysInPast: moment.DurationInputArg1) {
    const pastDate = moment()
        .tz(TEST_TIMEZONE)
        .subtract(daysInPast, 'days');

    const expectedDateString = pastDate.format('DD/MM/YYYY');

    return { expectedDateString };
}

test.describe('Digital Learning Hub', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    test.describe('scheduling', () => {
        test.use({ timezoneId: TEST_TIMEZONE });

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
            const { expectedDateString, tomorrow } = getTomorrowDate();

            const endDateInput = page.locator('[data-testid="schedule-end-date"] input');
            const endDateInputButton = page.locator('[data-testid="schedule-end-date"] button');

            await page.getByTestId('schedule_name').fill('Test Schedule for Tomorrow Date');

            await endDateInputButton.click();

            const now = moment().tz(TEST_TIMEZONE);
            if (tomorrow.month() !== now.month() || tomorrow.year() !== now.year()) {
                await page.getByRole('button', { name: 'Next month' }).click();
            }

            const tomorrowTimestamp = tomorrow
                .clone()
                .startOf('day')
                .valueOf();
            const tomorrowButton = page.locator(`.MuiPickersDay-root[data-timestamp="${tomorrowTimestamp}"]`);

            await tomorrowButton.waitFor({ state: 'visible' });
            await tomorrowButton.click();

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

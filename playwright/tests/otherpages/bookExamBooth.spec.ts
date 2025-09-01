import { test, expect, Page } from '@uq/pw/test';

import { assertAccessibility } from '@uq/pw/lib/axe';
import locale from '../../../src/modules/Pages/BookExamBooth/bookExamBooth.locale';
import moment from 'moment';
import { mockReusable, mockXHRResponse, removeVpnNeededToast } from '@uq/pw/lib/helpers';

async function selectFirstLocation(page: Page) {
    const firstLocation = locale.locationDecider.locations[0];
    await page.locator(`[data-testid="display-location-option-${firstLocation.value}"]`).click();
}

async function selectProctoredExam(page: Page) {
    await page.getByTestId('display-decider-option-yes').click();
}

async function selectNONProctoredExam(page: Page) {
    await page.getByTestId('display-decider-option-no').click();
}

test.describe('Book Exam Booth Accessibility', () => {
    test('Book Exam Booth', async ({ page }) => {
        await page.goto('/book-exam-booth');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await assertAccessibility(page, '[data-testid="standard-card-booking-options"]');

        await selectNONProctoredExam(page);
        await assertAccessibility(page, '[data-testid="no-booking-necessary"]');

        await selectProctoredExam(page);
        await assertAccessibility(page, '[data-testid="standard-card-booking-options"]');

        await selectFirstLocation(page);
        await assertAccessibility(page, '[data-testid="booking-details"]');
    });
});

test.describe('Book Exam Booth page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/book-exam-booth');
        await removeVpnNeededToast(page);
    });

    test('should show initial view', async ({ page }) => {
        await expect(page.getByTestId('StandardPage-title')).toHaveText(locale.pageTitle);
        await expect(page.getByTestId('subsite-title')).toHaveText(/Book an Exam booth/);
    });

    test('should show message on selecting "am not sitting a ProctorU exam"', async ({ page }) => {
        await selectNONProctoredExam(page);
        await expect(page.getByTestId('no-booking-necessary')).toBeVisible();
    });

    test('should display location selector on selecting "am sitting a ProctorU exam"', async ({ page }) => {
        await selectProctoredExam(page);
        await expect(
            page
                .getByTestId('standard-card-where-would-you-like-to-sit-your-exam?')
                .getByText(locale.locationDecider.heading, { exact: false }),
        ).toBeVisible();
    });

    test('should display form for booking details on selecting a location', async ({ page }) => {
        await selectProctoredExam(page);
        await selectFirstLocation(page);
        const bookingDetails = page.getByTestId('booking-details');
        await expect(bookingDetails).toContainText(locale.examType.label);
        await expect(bookingDetails).toContainText(locale.sessionLength.label);
        await expect(bookingDetails).toContainText(locale.startDate.label);
        await expect(bookingDetails).toContainText(locale.startTimeHours.label);
    });

    test('should redirect to expected url on submit without changing values', async ({ page }) => {
        await selectProctoredExam(page);
        await selectFirstLocation(page);
        await page.getByTestId('booth-search-submit-button').click();

        const selectedDate = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD');

        await expect(page).toHaveURL(
            new RegExp(
                `app/booking-types/f30fe4d2-bb58-4426-9c38-843c40b2cd3c.*firstDay=${selectedDate}.*fromTime=07%3A45.*toTime=09%3A15`,
                'i',
            ),
        );
    });

    test('should redirect to expected url on submit with updated values', async ({ page }) => {
        await mockReusable(page);
        await mockXHRResponse(page, /uqbookit/, 200, 'done');
        await selectProctoredExam(page);
        await selectFirstLocation(page);

        // Opt to BYOD
        await page.getByTestId('exam-type-option-byod').click();

        // Choose 90 minute session length
        await page.getByTestId('session-length-select').click();
        await page.getByTestId('session-length-option-90').click();

        // Choose a custom date
        const intendedDate = '12';
        const bookingDate = moment()
            .add(1, 'month')
            // @ts-expect-error
            .date(intendedDate);
        const dateInput = page.locator('input[data-testid="start-date"]');

        const defaultDate = moment(await dateInput.inputValue(), 'DD/MM/YYYY');
        const yesterday = moment().subtract(1, 'day');
        expect(defaultDate.format('DD/MM/YYYY')).toBe(yesterday.format('DD/MM/YYYY'));

        const selectNextMonth = async (date: moment.Moment): Promise<moment.Moment> => {
            await expect(page.getByText(date.format('MMMM'))).toBeVisible({ timeout: 2000 });
            await page.getByTestId('ArrowRightIcon').click({ timeout: 2000 });
            await expect(page.getByTestId('ArrowRightIcon')).toBeVisible({ timeout: 2000 });
            await expect(page.getByText(date.format('MMMM'))).not.toBeVisible({ timeout: 2000 });
            return date.clone().add(1, 'month');
        };

        await expect(async () => {
            await page.locator('body').click();
            await page.getByTestId('start-date-button').click();

            let selectedDate = await selectNextMonth(defaultDate);
            // The field defaults to the previous day, which can be in the previous month.
            if (moment().date() === 1) {
                selectedDate = await selectNextMonth(selectedDate);
            }
            await expect(page.getByText(selectedDate.format('MMMM'))).toBeVisible({ timeout: 2000 });

            await page
                .locator('.MuiPickersDay-root')
                .getByText(intendedDate)
                .first()
                .dispatchEvent('click', undefined, { timeout: 2000 });
            await page.locator('body').click();
            expect(await dateInput.inputValue()).toBe(bookingDate.format('DD/MM/YYYY'));
        }).toPass();

        // Choose a custom time
        await page.getByTestId('start-time-hours').click();
        await page.getByTestId('start-time-hours-option-10').click();
        await page.getByTestId('start-time-minutes').click();
        await page.getByTestId('start-time-minutes-option-30').click();
        await page.getByTestId('booth-search-submit-button').click();

        await expect(page).toHaveURL(
            new RegExp(
                `app/booking-types/ae12d42e-faae-4553-8c6a-be2fcddb4b26.*firstDay=${bookingDate.format(
                    'YYYY-MM-DD',
                )}.*fromTime=10%3A00.*toTime=12%3A30`,
                'i',
            ),
        );
    });
});

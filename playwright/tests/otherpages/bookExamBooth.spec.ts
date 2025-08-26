import { test, expect, Page } from '@playwright/test';

import { assertAccessibility } from '../../lib/axe';
import locale from '../../../src/modules/Pages/BookExamBooth/bookExamBooth.locale';
import moment from 'moment';

async function selectFirstLocation(page: Page) {
    const firstLocation = locale.locationDecider.locations[0];
    await page.locator(`[data-testid="display-location-option-${firstLocation.value}"]`).click();
}

async function selectProctoredExam(page: Page) {
    await page.locator('[data-testid="display-decider-option-yes"]').click();
}

async function selectNONProctoredExam(page: Page) {
    await page.locator('[data-testid="display-decider-option-no"]').click();
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
    });

    test('should show initial view', async ({ page }) => {
        await expect(page.locator('[data-testid="StandardPage-title"]')).toHaveText(locale.pageTitle);
        await expect(page.locator('[data-testid="subsite-title"]')).toHaveText(/Book an Exam booth/);
    });

    test('should show message on selecting "am not sitting a ProctorU exam"', async ({ page }) => {
        await selectNONProctoredExam(page);
        await expect(page.locator('[data-testid="no-booking-necessary"]')).toBeVisible();
    });

    test('should display location selector on selecting "am sitting a ProctorU exam"', async ({ page }) => {
        await selectProctoredExam(page);
        await expect(
            page
                .locator('[data-testid="standard-card-where-would-you-like-to-sit-your-exam?"]')
                .getByText(locale.locationDecider.heading, { exact: false }),
        ).toBeVisible();
    });

    test('should display form for booking details on selecting a location', async ({ page }) => {
        await selectProctoredExam(page);
        await selectFirstLocation(page);
        const bookingDetails = page.locator('[data-testid="booking-details"]');
        await expect(bookingDetails).toContainText(locale.examType.label);
        await expect(bookingDetails).toContainText(locale.sessionLength.label);
        await expect(bookingDetails).toContainText(locale.startDate.label);
        await expect(bookingDetails).toContainText(locale.startTimeHours.label);
    });

    test('should redirect to expected url on submit without changing values', async ({ page }) => {
        // Playwright allows for easier URL inspection without needing to stub.
        await selectProctoredExam(page);
        await selectFirstLocation(page);
        await page.locator('[data-testid="booth-search-submit-button"]').click();

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
        await selectProctoredExam(page);
        await selectFirstLocation(page);

        // Opt to BYOD
        await page.locator('[data-testid="exam-type-option-byod"]').click();

        // Choose 90 minute session length
        await page.locator('[data-testid="session-length-select"]').click();
        await page.locator('[data-testid="session-length-option-90"]').click();

        // Choose a custom date
        const intendedDate = '12';
        const bookingDate = moment()
            .add(1, 'month')
            // @ts-expect-error
            .date(intendedDate);
        const dateInput = page.locator('input[data-testid="start-date"]');

        const defaultDateValue = await dateInput.inputValue();
        const yesterday = moment().subtract(1, 'day');
        expect(defaultDateValue).toBe(yesterday.format('DD/MM/YYYY'));

        await page.locator('[data-testid="start-date-button"]').click();

        const nextMonthButton = page.locator('[data-testid="ArrowRightIcon"]');
        await nextMonthButton.click();
        if (moment().date() === 1) {
            // The field defaults to the previous day, which can be in the previous month.
            await nextMonthButton.click();
        }
        await page
            .locator('.MuiPickersDay-root')
            .getByText(intendedDate)
            .first()
            .click();
        await page.keyboard.press('Escape');
        const text = await dateInput.inputValue();
        expect(text).toBe(bookingDate.format('DD/MM/YYYY'));

        // Choose a custom time
        await page.locator('[data-testid="start-time-hours"]').click();
        await page.locator('[data-testid="start-time-hours-option-10"]').click();
        await page.locator('[data-testid="start-time-minutes"]').click();
        await page.locator('[data-testid="start-time-minutes-option-30"]').click();
        await page.locator('[data-testid="booth-search-submit-button"]').click();

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

import { test, expect } from '@playwright/test';

const PAGE_URL = '/digital-learning-hub/dashboard?user=dloradmn';

test.describe('UsageAnalytics Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL);
    });

    test('renders UsageAnalytics main elements', async ({ page }) => {
        await expect(page.getByText('Usage Summary')).toBeVisible();
        await expect(page.getByLabel('Start Date')).toBeVisible();
        await expect(page.getByLabel('End Date')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
    });

    test('can select a single dates, and date ranges, and see updates', async ({ page }) => {
        const startDate = page.getByLabel('Start Date');
        const endDate = page.getByLabel('End Date');
        // Helper to format date as YYYY-MM-DD and DD/MM/YYYY
        function formatDates(date: Date) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return {
                iso: `${yyyy}-${mm}-${dd}`,
                au: `${dd}/${mm}/${yyyy}`,
            };
        }

        // Today
        const today = new Date();
        const todayFmt = formatDates(today);
        await startDate.fill(todayFmt.iso);
        await endDate.fill(todayFmt.iso);
        await expect(page.getByText(`Date Range: ${todayFmt.au} to ${todayFmt.au}`)).toBeVisible();

        // Yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestFmt = formatDates(yesterday);
        await startDate.fill(yestFmt.iso);
        await endDate.fill(yestFmt.iso);
        await expect(page.getByText(`Date Range: ${yestFmt.au} to ${yestFmt.au}`)).toBeVisible();

        // Day before yesterday
        const dayBefore = new Date();
        dayBefore.setDate(dayBefore.getDate() - 2);
        const dayBeforeFmt = formatDates(dayBefore);
        await startDate.fill(dayBeforeFmt.iso);
        await endDate.fill(dayBeforeFmt.iso);
        await expect(page.getByText(`Date Range: ${dayBeforeFmt.au} to ${dayBeforeFmt.au}`)).toBeVisible();

        // Yesterday to Today
        await startDate.fill(yestFmt.iso);
        await endDate.fill(todayFmt.iso);
        await expect(page.getByText(`Date Range: ${yestFmt.au} to ${todayFmt.au}`)).toBeVisible();
    });

    test('can toggle user group visibility', async ({ page }) => {
        // Find a group label (adjust as needed)
        const groupCheckbox = page.getByRole('checkbox').first();
        await groupCheckbox.check();
        // Optionally, assert that the chart or summary updates
        await expect(groupCheckbox).toBeChecked();
    });

    test('shows correct summary stats', async ({ page }) => {
        // Find the Usage Summary section
        const summarySection = await page
            .getByRole('heading', { name: 'Usage Summary' })
            .locator('..')
            .locator('..');
        await expect(summarySection.getByText(/Total:/)).toBeVisible();
        await expect(summarySection.getByText(/Selected:/)).toBeVisible();
        // Only match the main summary's peak line, not group peaks
        await expect(summarySection.getByText(/^Peak - \d{2}\/\d{2}\/\d{4} \(\d+ views\)$/)).toBeVisible();
    });
});

import { test, expect } from '@playwright/test';

test.describe('GenericBreakdownChart', () => {
    test('renders all charts, toggles legends, and checks edge cases', async ({ page }) => {
        // Mock dashboard API response
        await page.route('**/api/dlor/dashboard', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    team_breakdown: [
                        { team_name: 'Team A', total_objects: 10 },
                        { team_name: 'Team B', total_objects: 5 },
                    ],
                    object_type_breakdown: [
                        { object_type_name: 'Type X', object_count: 7 },
                        { object_type_name: 'Type Y', object_count: 8 },
                    ],
                    keyword_breakdown: [
                        { keyword: 'Keyword1', object_count: 4 },
                        { keyword: 'Keyword2', object_count: 6 },
                    ],
                    review_status: {
                        upcoming: 3,
                        due: 2,
                        overdue: 1,
                    },
                    total_objects: 15,
                }),
            });
        });

        await page.goto('/digital-learning-hub/dashboard?user=dloradmn');

        // Wait for dashboard to finish loading
        await page.waitForSelector('[data-testid="generic-breakdown-chart-title"]', { timeout: 10000 });

        // Check all chart titles
        const chartTitles = await page.getByTestId('generic-breakdown-chart-title').all();
        expect(chartTitles.length).toBeGreaterThan(0);
        for (const title of chartTitles) {
            await expect(title).toBeVisible({ timeout: 5000 });
        }

        // Check all doughnut charts
        const doughnutCharts = await page.locator('[aria-label^="Doughnut chart showing"]').all();
        expect(doughnutCharts.length).toBeGreaterThan(0);
        for (const chart of doughnutCharts) {
            await expect(chart).toBeVisible({ timeout: 5000 });
        }

        // Toggle legends for charts with a visible button
        const legendButtons = await page.locator('text=Show Legend').all();

        // chartTitles already declared above, reuse it
        for (let i = 0; i < legendButtons.length; i++) {
            const button = legendButtons[i];
            if (!button) continue;
            const isVisible = await button.isVisible();
            if (!isVisible) continue;
            await button.click();
            // Get chart title text
            const chartTitleText = await chartTitles[i].innerText();
            // Find the Hide Legend button by accessible name
            const hideLegend = await page.getByRole('button', { name: `Hide ${chartTitleText} legend` });
            await expect(hideLegend).toBeVisible({ timeout: 1000 });
            // Toggle back if possible
            const hideVisible = await hideLegend.isVisible();
            if (hideVisible) {
                await hideLegend.click();
                await expect(button).toBeVisible({ timeout: 1000 });
            }
        }

        // Edge case: Toggle legend multiple times for first chart with legend

        if (legendButtons.length > 0) {
            const firstButton = legendButtons[0];
            const isVisible = await firstButton.isVisible();
            if (isVisible) {
                for (let j = 0; j < 3; j++) {
                    await firstButton.click();
                    await page.waitForTimeout(200);
                }
                const chartTitleText = await chartTitles[0].innerText();
                const hideLegend = await page.getByRole('button', { name: `Hide ${chartTitleText} legend` });
                await expect(hideLegend).toBeVisible({ timeout: 1000 });
            }
        }

        // Check chart labels and values in legend for charts with legend

        for (let i = 0; i < legendButtons.length; i++) {
            const button = legendButtons[i];
            const isVisible = await button.isVisible();
            if (!isVisible) continue;
            await button.click();
            const legendItems = await page
                .locator('.MuiBox-root')
                .filter({ hasText: '(' })
                .all();
            expect(legendItems.length).toBeGreaterThan(0);
            for (const item of legendItems) {
                await expect(item).toBeVisible();
            }
            // Hide legend again
            const chartTitleText = await chartTitles[i].innerText();
            const hideLegend = await page.getByRole('button', { name: `Hide ${chartTitleText} legend` });
            const hideVisible = await hideLegend.isVisible();
            if (hideVisible) {
                await hideLegend.click();
            }
        }

        // Simulate navigation to related dashboard features
        await expect(page.locator('text=Site Statistics')).toBeVisible();
        await expect(page.locator('text=Object Breakdown')).toBeVisible();
        await expect(page.locator('text=Keywords')).toBeVisible();
        await expect(page.locator('text=Review Status')).toBeVisible();
    });
});

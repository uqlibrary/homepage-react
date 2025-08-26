import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';
test.describe('Digital Learning Hub Series page.', () => {
    test.describe('series page', () => {
        test('appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/series/1');
            await expect(page.locator('[data-testid="dlor-seriespage"] h1')).toContainText('Series Name');
            await page.goto('digital-learning-hub/series/2');
            await expect(page.locator('[data-testid="dlor-seriespage"] h1')).toContainText('Series Name');
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toContainText(
                'Accessibility - Digital Essentials (has Youtube link)',
            );
            await page.goto('digital-learning-hub/series/2');
            await expect(page.locator('[data-testid="dlor-seriespage"] h1')).toContainText('Series Name');
            await page.goto('digital-learning-hub/series/9');
            await expect(page.getByTestId('dlor-seriespage-description')).toContainText(
                'This series does not have a detailed description at this time.',
            );
            await page.goto('digital-learning-hub/series/5');
            await expect(page.getByTestId('dlor-seriespage-description')).not.toBeVisible();
            await expect(page.getByTestId('dlor-seriespage-loadError')).toHaveText(
                /An error has occurred during the request and this request cannot be processed/,
            );
        });
        test('navigates to the correct location', async ({ page }) => {
            await page.goto('digital-learning-hub/series/1');
            await expect(page.locator('[data-testid="dlor-seriespage"] h1')).toContainText('Series Name');
            await page.locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] button').click();
            await expect(page.getByTestId('dlor-detailpage')).toContainText('Advanced literature searching');
        });
        test('is accessible', async ({ page }) => {
            await page.goto('digital-learning-hub/series/1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-seriespage"] h1')).toContainText('Series Name');
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('shows correct object definitions for a series', async ({ page }) => {
            await page.goto('digital-learning-hub/series/9?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByText(/Staff Restricted Object/)
                    .locator('../../..')
                    .getByText(/You need to be UQ staff to view this object/),
            ).toBeVisible();
            await expect(
                page
                    .getByText(/Staff \(library\) Restricted Object/)
                    .locator('../../..')
                    .getByText(/You need to be UQ Library staff to view this object/),
            ).toBeVisible();
            await expect(
                page
                    .getByText(/UQ Only Restricted Object/)
                    .locator('../../..')
                    .getByText(/You need to be a UQ staff or student to view this object/),
            ).toBeVisible();

            await page.goto('digital-learning-hub/series/9?user=dloradmn');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByText(/Staff Restricted Object/)
                    .locator('../../..')
                    .getByText(/Staff Only/),
            ).toBeVisible();
            await expect(
                page
                    .getByText(/Staff \(library\) Restricted Object/)
                    .locator('../../..')
                    .getByText(/Staff \(library\) Only/),
            ).toBeVisible();
            await expect(page.getByText(/UQ Only Restricted Object/).locator('../../..')).toContainText('UQ Only');
        });
    });
});

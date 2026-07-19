import { expect, test } from '@uq/pw/test';

test.describe('Spaces Detail page', () => {
    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });
    test('spaces detail page can UNfavourite', async ({ page }) => {
        await page.goto('/spaces/detail/a00de3d4-7e11-47eb-8079-532bdef80def');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // page has loaded
        await expect(page.getByTestId('spaces-1-details-name')).toBeVisible();
        await expect(page.getByTestId('spaces-1-details-name')).toContainText('354');

        // the space is currently favourited
        await expect(page.getByTestId('spaces-detail-1-unfavourite')).toBeVisible();
        await expect(page.getByTestId('spaces-detail-1-favourite')).not.toBeVisible();

        // unfavourite it
        await page.getByTestId('spaces-detail-1-unfavourite').click();

        // the space is now UNfavourited
        await expect(page.getByTestId('spaces-detail-1-favourite')).toBeVisible();
        await expect(page.getByTestId('spaces-detail-1-unfavourite')).not.toBeVisible();
    });
    test('spaces detail page can unfavourite', async ({ page }) => {
        await page.goto('/spaces/detail/97fd5_nm39_gh29');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // page has loaded
        await expect(page.getByTestId('spaces-43534-details-name')).toBeVisible();
        await expect(page.getByTestId('spaces-43534-details-name')).toContainText('46-342/343');

        // the space is currently UNfavourited
        await expect(page.getByTestId('spaces-detail-43534-favourite')).toBeVisible();
        await expect(page.getByTestId('spaces-detail-43534-unfavourite')).not.toBeVisible();

        // favourite it
        await page.getByTestId('spaces-detail-43534-favourite').click();

        // the space is now favourited
        await expect(page.getByTestId('spaces-detail-43534-unfavourite')).toBeVisible();
        await expect(page.getByTestId('spaces-detail-43534-favourite')).not.toBeVisible();
    });
});

import { expect, Page, test } from '@uq/pw/test';

const NUMBER_SPACES_DEFAULT = 10;

// // Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
// // which would otherwise cause BookableSpacesList to re-render and destabilise the filter
// // group toggles and count assertions enough for Playwright to time out in CI.
// const disableMazeMapAssets = async (page: Page) => {
//     await page.route('**/vendor/mazemap/**', route => route.abort());
// };

test.describe('Spaces Journey Result page', () => {
    test.beforeEach(async ({ page, context }) => {
        // await disableMazeMapAssets(page);
        await context.clearCookies();
    });
    test('spaces result page has the correct parts', async ({ page }) => {
        const firstSpacePane = page.getByTestId('spaces-result-list-item-1');

        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('sidebarCheckboxes')).toBeVisible();
        await expect(page.getByRole('heading', { level: 2, name: 'Search results' })).toBeVisible();
        await expect(page.getByText('Showing 10 of 15 spaces')).toBeVisible(); // first page of spaces are showing
        await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(NUMBER_SPACES_DEFAULT); // a page load of spaces are present

        // show the first panel has the correct contents
        await expect(firstSpacePane).toContainText('354');
        await expect(firstSpacePane).toContainText('Architecture and Music Library');
        await expect(firstSpacePane).toContainText('Individual study');
        await expect(firstSpacePane.getByTestId('spaces-journey-open-status-chip-open')).toContainText('Open now');
        await expect(firstSpacePane).toContainText('Designed for individual study');
        await expect(firstSpacePane).toContainText('Space desciption field being used to report the mock data');

        await expect(page.getByTestId('space-1-detail-unfavourite')).toBeVisible();
    });
    test('results page can book a room', async ({ page }) => {
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // panel has loaded
        await expect(page.getByTestId('spaces-2-name')).toBeVisible();
        await expect(page.getByTestId('spaces-2-name')).toContainText('339');

        // the booking link appears
        await expect(page.locator('a[data-testid="space-2-booking-link"]')).toBeVisible();
        await expect(page.locator('a[data-testid="space-2-booking-link"]')).toContainText('Book this space');
        await expect(page.getByTestId('space-2-booking-icon')).toBeVisible();
    });
    test.describe('Favourites', () => {
        test('can UNfavourite a space on the result page', async ({ page }) => {
            // load the spaces results page
            await page.goto('/spaces/results');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // the page has loaded
            await expect(page.getByTestId('spaces-2-name')).toBeVisible();
            await expect(page.getByTestId('spaces-2-name')).toContainText('339');

            // the space is currently favourited
            await expect(page.getByTestId('space-2-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-2-detail-favourite')).not.toBeVisible();

            // unfavourite it
            await page.getByTestId('space-2-detail-unfavourite').click();

            // the space is now UNfavourited
            await expect(page.getByTestId('space-2-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-2-detail-unfavourite')).not.toBeVisible();
        });
        test('can favourite a space on the result page', async ({ page }) => {
            // load the spaces results page
            await page.goto('/spaces/results');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // the page has loaded
            await expect(page.getByTestId('spaces-5-name')).toBeVisible();
            await expect(page.getByTestId('spaces-5-name')).toContainText('342');

            // the space is currently favourited
            await expect(page.getByTestId('space-5-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-5-detail-unfavourite')).not.toBeVisible();

            // unfavourite it
            await page.getByTestId('space-5-detail-favourite').click();

            // the space is now UNfavourited
            await expect(page.getByTestId('space-5-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-5-detail-favourite')).not.toBeVisible();
        });
    });
});

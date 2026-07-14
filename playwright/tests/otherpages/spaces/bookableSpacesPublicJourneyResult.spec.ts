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

        // load the spaces homepage
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // show the favourites block has the correct contents
        await expect(page.getByTestId('sidebarCheckboxes')).toBeVisible();
        await expect(page.getByRole('heading', { level: 2, name: 'Search results' })).toBeVisible();
        await expect(page.getByText('Showing 10 of 15 spaces')).toBeVisible(); // first page of spaces are showing
        await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(NUMBER_SPACES_DEFAULT); // a page load of spaces are present
        await expect(firstSpacePane).toContainText('354');
        await expect(firstSpacePane).toContainText('Architecture and Music Library');
        await expect(firstSpacePane).toContainText('Individual study');
        await expect(firstSpacePane.getByTestId('spaces-journey-favourite-chip-1')).toContainText('Favourite');
        await expect(firstSpacePane.getByTestId('spaces-journey-open-status-chip-open')).toContainText('Open now');
        await expect(firstSpacePane).toContainText('Designed for individual study');
        await expect(firstSpacePane).toContainText('Space desciption field being used to report the mock data');
    });
});

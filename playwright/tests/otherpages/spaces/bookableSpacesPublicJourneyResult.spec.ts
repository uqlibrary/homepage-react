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
        const firstSpacePane = page.getByTestId('spaces-result-list').locator('li:first-child');

        // load the spaces homepage
        await page.goto('/spaces?journeyStep=results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // show the favourites block has the correct contents
        await expect(page.getByTestId('sidebarCheckboxes')).toBeVisible();
        await expect(page.getByTestId('spaces-journey-results-heading')).toBeVisible();
        await expect(page.getByTestId('spaces-journey-results-heading')).toContainText('Matching spaces');
        await expect(page.getByTestId('spaces-journey-result-count')).toContainText('Showing 10 of 15 spaces'); // first page of spaces are showing
        await expect(page.getByTestId('spaces-result-list').locator(':scope > *')).toHaveCount(NUMBER_SPACES_DEFAULT); // a page load of spaces are present
        await expect(page.getByTestId('spaces-result-list').locator(':scope > *')).toHaveCount(NUMBER_SPACES_DEFAULT);
        await expect(firstSpacePane.locator('a')).toHaveAttribute('href', '/spaces?journeyStep=results');
        await expect(firstSpacePane.getByTestId('space-journey-result-item-1-name')).toContainText('354');
        await expect(firstSpacePane.getByTestId('space-journey-result-item-1-library-name')).toContainText(
            'Architecture and Music Library',
        );
        await expect(firstSpacePane.getByTestId('space-journey-result-item-1-space-type')).toContainText(
            'Individual study',
        );
        await expect(firstSpacePane.getByTestId('spaces-journey-result-item-1-favourite-chip')).toContainText(
            'Favourite',
        );
        await expect(firstSpacePane.getByTestId('spaces-journey-open-status-chip-open')).toContainText('Open now');
        await expect(firstSpacePane.getByTestId('spaces-journey-result-item-1-space-type-description')).toContainText(
            'Designed for individual study',
        );
        await expect(firstSpacePane.getByTestId('spaces-journey-result-item-1-description')).toContainText(
            'Space desciption field being used to report the mock data',
        );
    });
});

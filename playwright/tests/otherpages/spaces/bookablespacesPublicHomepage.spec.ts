import { expect, Page, test } from '@uq/pw/test';

const VANILLA_USER_FAVOURITE_COUNT = 2;

// Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
// which would otherwise cause BookableSpacesList to re-render and destabilise the filter
// group toggles and count assertions enough for Playwright to time out in CI.
const disableMazeMapAssets = async (page: Page) => {
    await page.route('**/vendor/mazemap/**', route => route.abort());
};

test.describe('Spaces Homepage', () => {
    test.beforeEach(async ({ page, context }) => {
        await disableMazeMapAssets(page);
        await context.clearCookies();
    });
    test('library homepage can navigate to Spaces public page', async ({ page }) => {
        await page.goto('/?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('homepage-hours-bookit-link')).toHaveText(/Book a room/);
        await page.getByTestId('homepage-hours-bookit-link').click();
        await expect(page).toHaveURL('http://localhost:2020/spaces?user=s1111111');
        await page.getByTestId('spaces-journey-landing-browse-all').click();
        await expect(page).toHaveURL(/advanced=1/);
        await expect(page.getByTestId('topOfSidebar')).toHaveText('Filter Spaces');
    });
    test('spaces homepage has correct favourites', async ({ page }) => {
        const favBlock = page.getByTestId('spaces-homepage-favourites-block');

        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // show the favourites block has the correct contents
        await expect(favBlock).toBeVisible();
        await expect(favBlock.locator(':scope > *')).toHaveCount(VANILLA_USER_FAVOURITE_COUNT);
        await expect(favBlock.locator('li:first-child a')).toHaveAttribute(
            'href',
            '/spaces?journeyStep=details&journeySpace=a00de3d4-7e11-47eb-8079-532bdef80def',
        );
        await expect(favBlock.locator('li:first-child a')).toContainText('354');
        await expect(favBlock.locator('li:first-child a')).toContainText('Architecture and Music Library');
    });
    test('clicking all Favourites link lands on the Results page', async ({ page }) => {
        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // click the all favourites link
        await expect(page.getByTestId('spaces-homepage-favourites-all-link')).toBeVisible();
        await page.getByTestId('spaces-homepage-favourites-all-link').click();

        // the results page has loaded, with favourites loaded
        await expect(page.getByTestId('spaces-homepage-favourites-all-link')).not.toBeVisible();
        await expect(page.getByTestId('spaces-journey-results-heading')).toBeVisible(); // heading present
        await expect(page.getByTestId('spaces-journey-results-heading')).toContainText('Search results'); // heading present
        await expect(page.getByTestId('spaces-result-list').locator(':scope > *')).toHaveCount(
            VANILLA_USER_FAVOURITE_COUNT,
        );
        await expect(page.getByTestId('spaces-journey-result-count')).toContainText('Showing 2 of 15 spaces');
        // a block is present
        await expect(page.getByTestId('space-journey-result-item-1-name')).toContainText('354');

        // back button works
        await page.goBack();
        await expect(page.getByTestId('spaces-homepage-favourites-all-link')).toBeVisible();
    });
    test('clicking a Favourites link lands on the Details page', async ({ page }) => {
        const firstFavouritesLink = page.getByTestId('spaces-homepage-favourites-block').locator('li:first-child a');

        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // click the first favourite link
        await expect(firstFavouritesLink).toBeVisible();
        await firstFavouritesLink.click();

        // the correct space displays
        await expect(firstFavouritesLink).not.toBeVisible();
        await expect(page.getByTestId('spaces-1-details-name')).toContainText('354');
        await expect(page.getByTestId('space-1-friendly-location')).toContainText('Architecture and Music Library');

        // back button works
        await page.goBack();
        await expect(firstFavouritesLink).toBeVisible();
    });

    test('spaces homepage can navigate to list view without filters', async ({ page }) => {
        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // click the "View all spaces" link (to load the results page without anything selected
        await expect(page.getByTestId('spaces-journey-showall')).toBeVisible();
        await page.getByTestId('spaces-journey-showall').click();

        // result page appears as expected
        await expect(page.getByTestId('spaces-journey-showall')).not.toBeVisible();
        await expect(page.getByTestId('space-journey-result-item-1-name')).toBeVisible();
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0); // no filters are selected
        await expect(page.getByTestId('spaces-journey-result-count')).toContainText('Showing 10 of 15 spaces'); // all spaces are showing
        await expect(page.getByTestId('spaces-result-list').locator(':scope > *')).toHaveCount(10); // a page load of spaces are present

        // back button works
        await page.goBack();
        await expect(page.getByTestId('spaces-journey-showall')).toBeVisible();
    });
});

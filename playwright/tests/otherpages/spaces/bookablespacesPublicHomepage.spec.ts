import { expect, Page, test } from '@uq/pw/test';

const VANILLA_USER_FAVOURITE_COUNT = 4;

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
        await expect(page).toHaveURL(/\/spaces\/mapresults(?:\?|$)/);
        await expect(page).toHaveURL(/mapFilters=/);
        await expect(page).toHaveURL(/autoSelectFirstSpace=1/);
        await expect(page.getByTestId('topOfSidebar')).toHaveText('Filter Spaces');
    });
    test('spaces homepage has correct favourites', async ({ page }) => {
        const favBlock = page.getByTestId('spaces-homepage-favourites-block');

        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // show the favourites block has the correct contents
        await expect(favBlock).toBeVisible();
        const numberDisplayed = VANILLA_USER_FAVOURITE_COUNT > 3 ? 3 : VANILLA_USER_FAVOURITE_COUNT;
        await expect(favBlock.locator(':scope > *')).toHaveCount(numberDisplayed);
        await expect(favBlock.locator('li:first-child a')).toHaveAttribute(
            'href',
            '/spaces/detail/a00de3d4-7e11-47eb-8079-532bdef80def',
        );
        await expect(favBlock.locator('li:first-child a')).toContainText('354');
        await expect(favBlock.locator('li:first-child a')).toContainText('Architecture and Music Library');
    });
    test('logged out user does not see favourites', async ({ page }) => {
        // load the spaces homepage, for the logged out user
        await page.goto('/spaces?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('spaces-homepage-favourites-all-link')).not.toBeVisible();
        await expect(page.getByTestId('spaces-homepage-favourites-block')).not.toBeVisible();
        await expect(page.getByTestId('space-1-detail-unfavourite')).not.toBeVisible();
    });
    test.describe('Favourites', () => {
        test.beforeEach(async ({ page }) => {
            // load the spaces homepage
            await page.goto('/spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('clicking all Favourites link lands on the Results page', async ({ page }) => {
            // click the all favourites link
            await expect(page.getByTestId('spaces-homepage-favourites-all-link')).toBeVisible();
            await page.getByTestId('spaces-homepage-favourites-all-link').click();

            // the results page has loaded, with favourites loaded
            await expect(page.getByTestId('spaces-homepage-favourites-all-link')).not.toBeVisible();
            await expect(page.getByTestId('bookable-spaces-journey-results-view')).toBeVisible();
            await expect(page.getByRole('heading', { level: 2, name: 'Search results' })).toBeVisible();
            await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(
                VANILLA_USER_FAVOURITE_COUNT,
            );
            await expect(page.getByText(`Showing ${VANILLA_USER_FAVOURITE_COUNT} of 15 spaces`)).toBeVisible();
            // a block is present
            await expect(page.getByTestId('spaces-result-list-item-1')).toContainText('354');

            // back button works
            await page.goBack();
            await expect(page.getByTestId('spaces-homepage-favourites-all-link')).toBeVisible();
        });
        test('clicking a Favourites link lands on the Details page', async ({ page }) => {
            const firstFavouritesLink = page
                .getByTestId('spaces-homepage-favourites-block')
                .locator('li:first-child a');

            // click the first favourite link
            await expect(firstFavouritesLink).toBeVisible();
            await firstFavouritesLink.click();

            // the correct space displays
            await expect(firstFavouritesLink).not.toBeVisible();
            await expect(page.getByTestId('space-1-details-name')).toContainText('354');
            await expect(page.getByTestId('space-1-friendly-location')).toContainText('Architecture and Music Library');

            // back button works
            await page.goBack();
            await expect(firstFavouritesLink).toBeVisible();
        });
        test('clicking a Favourites star unfavourites a Space', async ({ page }) => {
            const favSpace354 = 'a[href="/spaces/detail/a00de3d4-7e11-47eb-8079-532bdef80def"]';
            const favSpace339 = 'a[href="/spaces/detail/a00de509-570b-4acb-9ca1-89c4baebe2e6"]';
            const favSpace340 = 'a[href="/spaces/detail/a00df52a-2308-40e1-85ef-d3cf3421edd8"]';
            const favSpace341 = 'a[href="/spaces/detail/a029666f-16e1-4dea-968b-31440e6bfaee"]';

            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace354)).toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace339)).toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace340)).toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace341)).not.toBeVisible();

            // unfavourite the first space
            const firstFavouritesButton = page
                .getByTestId('spaces-homepage-favourites-block')
                .locator(`li:has(${favSpace354}) button`);
            await expect(firstFavouritesButton).toBeVisible();
            await firstFavouritesButton.click();

            // the correct spaces display as favourites
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace354)).not.toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace339)).toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace340)).toBeVisible();
            await expect(page.getByTestId('spaces-homepage-favourites-block').locator(favSpace341)).toBeVisible();
        });
    });

    test('spaces homepage can navigate to list view without filters', async ({ page }) => {
        // load the spaces homepage
        await page.goto('/spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // click the "See all spaces" link (to load the results page without anything selected)
        await expect(page.getByTestId('spaces-journey-showall')).toBeVisible();
        await page.getByTestId('spaces-journey-showall').click();

        // result page appears as expected
        await expect(page.getByTestId('spaces-journey-showall')).not.toBeVisible();
        await expect(page.getByTestId('spaces-result-list-item-1')).toBeVisible();
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0); // no filters are selected
        await expect(page.getByText('Showing 10 of 15 spaces')).toBeVisible(); // all spaces are showing
        await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(10); // a page load of spaces are present

        // back button works
        await page.goBack();
        await expect(page.getByTestId('spaces-journey-showall')).toBeVisible();
    });
});

import { expect, Page, test } from '@uq/pw/test';

const NUMBER_SPACES_DEFAULT = 10;

const FILTER_OPEN = '9';
const FILTER_BOOKABLE = '10';
const FILTER_EDIA = '8';
const FILTER_ON_FLOOR = '2';
const FILTER_LIGHTING = '8';
const FILTER_NOISE_LEVEL = '5';
const FILTER_ROOM = '6';
const FILTER_SPACE = '3';

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
        await expect(page.getByTestId('spaces-results-summary')).toContainText('10 of 15 spaces'); // first page of spaces are showing
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
    test('the correct notes appear', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_OPEN}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_BOOKABLE}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_EDIA}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_ON_FLOOR}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_LIGHTING}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_ROOM}`)).not.toBeVisible();

        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_NOISE_LEVEL}`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_SPACE}`)).toBeVisible();
    });
    test('the sidebar notes will open correctly', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('popover')).not.toBeVisible();
        await page.getByTestId(`facility-type-group-info-button-${FILTER_NOISE_LEVEL}`).click();
        await expect(page.getByTestId('popover')).toBeVisible();
        await expect(page.getByTestId('popover').locator('h4')).toContainText('Acceptable noise');
        await expect(page.getByTestId('popover').locator('p')).toContainText(
            'How much conversation and ambient sound is usually acceptable.',
        );
    });
    test('the sidebar notes can hide with escape key', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('popover')).not.toBeVisible();
        await page.getByTestId(`facility-type-group-info-button-${FILTER_NOISE_LEVEL}`).click();
        await expect(page.getByTestId('popover')).toBeVisible();

        // test the escape key closes the mini dialog
        await page.getByTestId('popover').press('Escape');

        await expect(page.getByTestId('popover')).not.toBeVisible();
    });
    test('the sidebar notes can hide with button press', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('popover')).not.toBeVisible();
        await page.getByTestId(`facility-type-group-info-button-${FILTER_NOISE_LEVEL}`).click();
        await expect(page.getByTestId('popover')).toBeVisible();

        // test the close button closes the mini dialog
        await page.getByTestId('close-popover-button').click();

        await expect(page.getByTestId('popover')).not.toBeVisible();
    });
    test('the filter sidebars load correctly collapsed or expanded, as defined in the admin', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId(`facility-type-group-${FILTER_OPEN}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_OPEN}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_OPEN}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_BOOKABLE}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_BOOKABLE}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_BOOKABLE}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_EDIA}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_EDIA}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_EDIA}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_ON_FLOOR}-collapsed`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_ON_FLOOR}-collapsed`)).toHaveClass(
            /collapsedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_ON_FLOOR}-open`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_LIGHTING}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_LIGHTING}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_LIGHTING}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_NOISE_LEVEL}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_NOISE_LEVEL}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_NOISE_LEVEL}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_ROOM}-collapsed`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_ROOM}-collapsed`)).toHaveClass(/collapsedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_ROOM}-open`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_SPACE}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_SPACE}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_SPACE}-collapsed`)).not.toBeVisible();
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

import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

const NUMBER_SPACES_DEFAULT = 10;

const FILTER_GROUP_AVAILABILITY = '9';
const FILTER_GROUP_EDIA = '8';
const FILTER_GROUP_ON_FLOOR = '2';
const FILTER_GROUP_LIGHTING = '8';
const FILTER_GROUP_NOISE_LEVEL = '5';
const FILTER_GROUP_ROOM = '6';
const FILTER_GROUP_SPACE = '3';

// // Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
// // which would otherwise cause BookableSpacesList to re-render and destabilise the filter
// // group toggles and count assertions enough for Playwright to time out in CI.
// const disableMazeMapAssets = async (page: Page) => {
//     await page.route('**/vendor/mazemap/**', route => route.abort());
// };

test.describe('Spaces Journey Result page', () => {
    test.beforeEach(async ({ context }) => {
        // await disableMazeMapAssets(page);
        await context.clearCookies();
    });
    test.describe('Spaces Journey Result page accessibility', () => {
        test('spaces result page is accessible', async ({ page }) => {
            // load the spaces results page
            await page.goto('/spaces/results');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.locator('body').getByText(/Search results/)).toBeVisible();

            await assertAccessibility(page, '[data-testid="bookable-spaces-journey-results-view"]');
        });
        test('the desktop skip to filters button works', async ({ page }) => {
            // load the spaces results page
            await page.goto('/spaces/results');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.locator('body').getByText(/Search results/)).toBeVisible();
            const campusDropdown = page
                .getByTestId('sidebarCheckboxes')
                .getByTestId('filter-by-campus')
                .locator('fieldset');

            // the first field in the filter sidebar is not focussed
            await expect(campusDropdown).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0.23)');
            await expect(campusDropdown).toHaveCSS('border-left-width', '0px');

            // tab through allll the links to give a realistic experience
            // (also because when we focus somewhere nearer, it does weird things - do it properly!)
            await page.keyboard.press('Tab'); // tab to uq home link
            await page.keyboard.press('Tab'); // tab to primary nav study link
            await page.keyboard.press('Tab'); // tab to primary nav research link
            await page.keyboard.press('Tab'); // tab to primary nav partners link
            await page.keyboard.press('Tab'); // tab to primary nav about link
            await page.keyboard.press('Tab'); // tab to search button
            await page.keyboard.press('Tab'); // tab to secondary nav uq home link
            await page.keyboard.press('Tab'); // tab to secondary nav news link
            await page.keyboard.press('Tab'); // tab to secondary nav events link
            await page.keyboard.press('Tab'); // tab to secondary nav give link
            await page.keyboard.press('Tab'); // tab to secondary nav contact link
            await page.keyboard.press('Tab'); // tab to breadcrumb uq home link
            await page.keyboard.press('Tab'); // tab to breadcrumb library local link
            await page.keyboard.press('Tab'); // tab to breadcrumb spaces link
            await page.keyboard.press('Tab'); // tab to login
            await page.keyboard.press('Tab'); // tab to collapsed proactive chat icon
            await page.keyboard.press('Tab'); // tab to CA link

            await page.keyboard.press('Tab'); // tab to skip to filters
            await page.keyboard.press('Enter'); // activate skip to filters link, lands on filter sidebar
            await page.keyboard.press('Tab'); // tab to choose a campus

            // show we have tabbed to the sidebar campus field: looknfeel has changed
            await expect(campusDropdown).toHaveCSS('border-left-color', COLOR_UQPURPLE);
            await expect(campusDropdown).toHaveCSS('border-left-width', '2px');
        });
    });
    // consider moving this test to jest
    test('spaces result page has the correct parts', async ({ page }) => {
        const firstSpacePane = page.getByTestId('spaces-result-list-item-1');

        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('sidebarCheckboxes')).toBeVisible();
        await expect(page.getByRole('heading', { level: 1, name: 'Search results' })).toBeVisible();
        await expect(page.getByTestId('spaces-results-summary')).toContainText('16 of 16 spaces'); // all spaces are showing
        await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(NUMBER_SPACES_DEFAULT); // a page load of spaces are present

        // show the first panel has the correct contents
        await expect(firstSpacePane).toContainText('354');
        await expect(firstSpacePane).toContainText('Architecture and Music Library');
        await expect(firstSpacePane).toContainText('Individual study');
        await expect(firstSpacePane).toContainText('Designed for individual study');
        await expect(firstSpacePane).toContainText('Space desciption field being used to report the mock data');

        await expect(page.getByTestId('space-1-detail-unfavourite')).toBeVisible();

        await expect(page.getByTestId('sidebarCheckboxes').getByTestId('filter-by-campus')).toBeVisible();
        await expect(page.getByTestId('filter-group-block-5').locator('h3')).toBeVisible();
        await expect(page.getByTestId('filter-group-block-5').locator('h3')).toContainText('Acceptable noise');
        await expect(page.getByTestId('filter-group-block-5').locator('p')).toContainText(
            'How much conversation and ambient sound is usually acceptable.',
        );
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
    test('the filter sidebars load correctly collapsed or expanded, as defined in the admin', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_AVAILABILITY}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_AVAILABILITY}-open`)).toHaveClass(
            /expandedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_AVAILABILITY}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_FLOOR}-collapsed`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_FLOOR}-collapsed`)).toHaveClass(
            /collapsedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_FLOOR}-open`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_LIGHTING}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_LIGHTING}-open`)).toHaveClass(
            /expandedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_LIGHTING}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-open`)).toHaveClass(
            /expandedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-collapsed`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ROOM}-collapsed`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ROOM}-collapsed`)).toHaveClass(
            /collapsedGroup/,
        );
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ROOM}-open`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_SPACE}-open`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_SPACE}-open`)).toHaveClass(/expandedGroup/);
        await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_SPACE}-collapsed`)).not.toBeVisible();
    });
    test('on mobile, filter block show-hides correctly', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 390, height: 736 });

        // on load, results on page, filter block hidden
        await expect(page.locator('body').getByText(/Search results/)).toBeVisible();
        const sidebarCampusDropdown = page.getByTestId('sidebarCheckboxes').getByTestId('filter-by-campus');
        await expect(sidebarCampusDropdown).not.toBeVisible();

        // because we are in mobile view, the "clear filters" button appears within the search results list
        await expect(page.getByTestId('reset-filters-button')).toBeVisible();

        // SHOW filters by toggling show-hide-filters button
        await expect(page.getByTestId('spaces-filter-show-hide-button')).toBeVisible();
        await page.getByTestId('spaces-filter-show-hide-button').click();

        // results off page, filter block visible
        await expect(page.locator('body').getByText(/Search results/)).toBeVisible(); // but below page viewport
        await expect(sidebarCampusDropdown).toBeVisible();

        // HIDE filters by toggling show-hide-filters button
        await expect(page.getByTestId('spaces-filter-show-hide-button')).toBeVisible();
        await page.getByTestId('spaces-filter-show-hide-button').click();

        // results on page again, filter block hidden again
        await expect(page.locator('body').getByText(/Search results/)).toBeVisible();
        await expect(sidebarCampusDropdown).not.toBeVisible();
    });
    test('on mobile, clear filters button works', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 390, height: 736 });
        await expect(page.locator('body').getByText(/Search results/)).toBeVisible();

        // initially the filter says "all spaces"
        await expect(page.getByTestId('spaces-results-summary')).toBeVisible();
        await expect(page.getByTestId('spaces-results-summary')).toContainText('16 of 16 spaces');

        // open filter sidebar
        await expect(page.getByTestId('spaces-filter-show-hide-button')).toBeVisible();
        await page.getByTestId('spaces-filter-show-hide-button').click();

        // choose a filter
        await expect(page.getByTestId('filter-show-favourite-spaces-only')).toBeVisible();
        await page.getByTestId('filter-show-favourite-spaces-only').check();

        // close filter sidebar
        await expect(page.getByTestId('spaces-filter-show-hide-button')).toBeVisible();
        await page.getByTestId('spaces-filter-show-hide-button').click();

        // filter label has updated
        await expect(page.getByTestId('spaces-results-summary')).toContainText('4 of 16 spaces');

        // click the 'clear filters' button
        await expect(page.getByTestId('reset-filters-button')).toBeVisible();
        await page.getByTestId('reset-filters-button').click();

        // filters have cleared
        await expect(page.getByTestId('spaces-results-summary')).toContainText('16 of 16 spaces');
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

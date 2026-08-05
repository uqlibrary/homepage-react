import { expect, Page, test } from '@uq/pw/test';
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
    test.beforeEach(async ({ page, context }) => {
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
        test('the skip to filters button works', async ({ page }) => {
            // load the spaces results page
            await page.goto('/spaces/results');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.locator('body').getByText(/Search results/)).toBeVisible();

            // the first field in the filter sidebar is not focussed
            await expect(page.getByTestId('filter-by-campus').locator('fieldset')).toHaveCSS(
                'border-left-color',
                'rgba(0, 0, 0, 0.23)',
            );
            await expect(page.getByTestId('filter-by-campus').locator('fieldset')).toHaveCSS(
                'border-left-width',
                '0px',
            );

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

            await expect(page.getByTestId('filter-by-campus').locator('fieldset')).toHaveCSS(
                'border-left-color',
                COLOR_UQPURPLE,
            );
            await expect(page.getByTestId('filter-by-campus').locator('fieldset')).toHaveCSS(
                'border-left-width',
                '2px',
            );
        });
    });
    test('spaces result page has the correct parts', async ({ page }) => {
        const firstSpacePane = page.getByTestId('spaces-result-list-item-1');

        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('sidebarCheckboxes')).toBeVisible();
        await expect(page.getByRole('heading', { level: 1, name: 'Search results' })).toBeVisible();
        await expect(page.getByTestId('spaces-results-summary')).toContainText('15 of 15 spaces'); // all spaces are showing
        await expect(page.locator('[data-testid^="spaces-result-list-item-"]')).toHaveCount(NUMBER_SPACES_DEFAULT); // a page load of spaces are present

        // show the first panel has the correct contents
        await expect(firstSpacePane).toContainText('354');
        await expect(firstSpacePane).toContainText('Architecture and Music Library');
        await expect(firstSpacePane).toContainText('Individual study');
        await expect(firstSpacePane).toContainText('Designed for individual study');
        await expect(firstSpacePane).toContainText('Space desciption field being used to report the mock data');

        await expect(firstSpacePane).toContainText(/Open now|Closing soon|Currently closed/i);

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

        await expect(
            page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_AVAILABILITY}`),
        ).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_EDIA}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_ON_FLOOR}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_LIGHTING}`)).not.toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_ROOM}`)).not.toBeVisible();

        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_NOISE_LEVEL}`)).toBeVisible();
        await expect(page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_SPACE}`)).toBeVisible();
    });
    test('the sidebar notes will open correctly', async ({ page }) => {
        // load the spaces results page
        await page.goto('/spaces/results');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('popover')).not.toBeVisible();
        await page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_NOISE_LEVEL}`).click();
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
        await page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_NOISE_LEVEL}`).click();
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
        await page.getByTestId(`facility-type-group-info-button-${FILTER_GROUP_NOISE_LEVEL}`).click();
        await expect(page.getByTestId('popover')).toBeVisible();

        // test the close button closes the mini dialog
        await page.getByTestId('close-popover-button').click();

        await expect(page.getByTestId('popover')).not.toBeVisible();
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

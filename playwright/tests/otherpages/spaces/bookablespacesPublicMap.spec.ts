import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

import { COLOUR_UQ_WARNING_50, COLOR_UQ_ERROR_50 } from '@uq/pw/lib/constants';

const ARCH_REFERENCE = 'space-1'; // a public Architecture and Music Library space with summary hours and description
const ARCH_BOOKABLE = 'space-2'; // a public Architecture and Music Library space with booking and rich facilities
const PACE = 'space-1234544'; // a space in dutton park (pace)
const LIV = 'space-43534'; // a space in liveris building (shows that we can , if we want, add spaces that aren't in our Libraries)
const ARCH_PANEL_4 = 'space-2';
const ARCH_PANEL_5 = 'space-3';
const ARCH_PANEL_6 = 'space-4';
const PANEL_UPCOMING_OUTAGE = 'space-5';
const ARCH_PANEL_8 = 'space-6';
const ARCH_PANEL_9 = 'space-7';
const GATTON_PANEL_ONE = 'space-8';
const CENTRAL_PANEL_ONE = 'space-13';
const CENTRAL_PANEL_TWO = 'space-14';

const NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST = 2; // 1 for skip button, 1 for acccessible heading
const VISIBLE_SPACES_ST_LUCIA_ALL = 10;

// Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
// which would otherwise cause BookableSpacesList to re-render and destabilise the filter
// group toggles and count assertions enough for Playwright to time out in CI.
const disableMazeMapAssets = async (page: Page) => {
    await page.route('**/vendor/mazemap/**', route => route.abort());
};

test.describe('Spaces', () => {
    test.beforeEach(async ({ page, context }) => {
        await disableMazeMapAssets(page);
        await context.clearCookies();
    });
    test.describe('Shows a basic map page for Spaces', () => {
        test.beforeEach(async ({ page }) => {
            // Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
            // which would otherwise cause BookableSpacesList to re-render and destabilise the toggle
            // buttons enough for Playwright's actionability check to time out in CI.
            await disableMazeMapAssets(page);
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.getByTestId('topOfSidebar')).toHaveText('Filter Spaces');

            // all space panels load visible (using filters changes which appear)
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
        });

        test('friendly location displays correctly on load', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-friendly-location-collapsed`)).toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location-collapsed`).locator('.location-library'),
            ).toContainText('Architecture and Music Library');
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-precise'),
            ).not.toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-floor'),
            ).not.toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-library'),
            ).not.toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-building'),
            ).not.toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-campus'),
            ).not.toBeVisible();

            // third panel
            await expect(page.getByTestId(`${LIV}-friendly-location-collapsed`)).toBeVisible();
            await expect(
                page.getByTestId(`${LIV}-friendly-location-collapsed`).locator('.location-library'),
            ).toContainText('imaginary Liveris Library');
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-precise')).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-floor')).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-library')).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-building')).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-campus')).not.toBeVisible();
        });

        // test('help me find a space opens journey at space type step', async ({ page }) => {
        //     await page.getByTestId('spaces-advanced-go-to-journey').click();

        //     await expect(page).toHaveURL(/journeyStep=intent/);
        //     await expect(page).not.toHaveURL(/advanced=1/);
        //     await expect(page.getByRole('heading', { name: 'What sort of space would you like to find?' })).toBeVisible();
        // });

        test('map page expands to show correct book a room links', async ({ page }) => {
            // ** panel WITH Booking Link has loaded
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-name`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-name`)).toContainText('Individual study');

            // the booking link appears
            await expect(page.locator(`a[data-testid="${ARCH_BOOKABLE}-booking-link"]`)).toBeVisible();
            await expect(page.locator(`a[data-testid="${ARCH_BOOKABLE}-booking-link"]`)).toContainText(
                'Book this space',
            );
            const hrefValue = await page.getByTestId(`${ARCH_BOOKABLE}-booking-link`).locator('a').getAttribute('href');
            expect(hrefValue).toMatch(new RegExp(`^https://uqbookit.uq.edu.au`)); // we have put the correct value in the page

            // expand the panel
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`)).toBeVisible();
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

            // the panel has expanded
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-details-name`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-details-name`)).toContainText('339');

            // the booking link appears
            // await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-link`)).toBeVisible();
            await expect(page.locator(`a[data-testid="${ARCH_BOOKABLE}-booking-link"]`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-not-bookable`)).not.toBeVisible();
            // await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-link`)).toContainText('Book this space');
            await expect(page.locator(`a[data-testid="${ARCH_BOOKABLE}-booking-link"]`)).toContainText(
                'Book this space',
            );

            // await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-icon`)).toBeVisible();

            // ** Panel WITHOUT Booking Link has loaded
            await page.getByTestId(`${LIV}-name`).scrollIntoViewIfNeeded();
            await expect(page.getByTestId(`${LIV}-name`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-name`)).toContainText('Meeting room');

            // NO booking link appears
            await expect(page.getByTestId(`${LIV}-booking-link`)).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-booking-icon`)).not.toBeVisible();

            // expand the panel
            await expect(page.getByTestId(`${LIV}-toggle-panel-button`)).toBeVisible();
            await page.getByTestId(`${LIV}-toggle-panel-button`).click();

            // the panel has expanded
            await expect(page.getByTestId(`${LIV}-details-name`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-details-name`)).toContainText('46-342/343');

            // "no booking required" prompt appears
            await expect(page.getByTestId(`${LIV}-booking-link`)).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-not-bookable`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-not-bookable`)).toContainText('No booking required.');
        });

        test('capacity loads correctly', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-capacity`)).not.toBeVisible();

            // second panel
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-capacity`)).toContainText('Space for 8 people.');

            await expect(page.getByTestId(`${LIV}-capacity`)).not.toBeVisible();

            await expect(page.getByTestId(`${ARCH_PANEL_5}-capacity`)).not.toBeVisible();
            await expect(page.getByTestId(`${ARCH_PANEL_6}-capacity`)).toContainText('Space for 20 people.');
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-capacity`)).toContainText('Space for 1 person.');
            await expect(page.getByTestId(`${ARCH_PANEL_8}-capacity`)).not.toBeVisible();
            await expect(page.getByTestId(`${ARCH_PANEL_9}-capacity`)).toContainText('Space for 22 people.');
        });

        test('description loads correctly', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveCount(1); // second line is hidden

            // third panel
            await expect(page.getByTestId(`${LIV}-description`)).toHaveCount(1);
        });

        test('outages shown collapsed and expanded', async ({ page }) => {
            await expect(page.getByTestId(`${ARCH_REFERENCE}-outage`)).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-outage`)).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-outage`)).not.toBeVisible();

            // test red current closure
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOR_UQ_ERROR_50,
            );
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage`).locator('h4')).toContainText('Current closure');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-message`)).toContainText(
                'Currently unavailable until',
            );
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-reason`)).not.toBeVisible();

            // expand the panel
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

            await page.getByTestId(`${ARCH_BOOKABLE}-outage`).scrollIntoViewIfNeeded();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOR_UQ_ERROR_50,
            );
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage`).locator('h4')).toContainText('Current closure');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-message`)).toContainText(
                'Currently unavailable until',
            );
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-reason`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-outage-reason`)).toContainText(
                'Reason: Lighting maintenance',
            );

            // collapse the space panel (makes it easier to get to the next outage section)
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

            // test amber upcoming closure
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`)).toBeVisible();
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOUR_UQ_WARNING_50,
            );
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`).locator('h4')).toContainText(
                'Upcoming closure',
            );
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-message`)).toContainText('Closed');
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-reason`)).not.toBeVisible();

            // expand the space panel to show the reason
            await page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-toggle-panel-button`).click();

            await page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`).scrollIntoViewIfNeeded();
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOUR_UQ_WARNING_50,
            );
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage`).locator('h4')).toContainText(
                'Upcoming closure',
            );
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-message`)).toContainText('Closed');
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-reason`)).toBeVisible();
            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-outage-reason`)).toContainText(
                'Reason: Air conditioning maintenance',
            );
        });

        test('opening hours appear correct on load', async ({ page }) => {
            const ARMUS_OPENING_HOURS = 'Opening hours Today: 7:30am - 7:30pm';
            const CENTRAL_OPENING_HOURS = 'Opening hours Today: 24 Hours';

            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toContainText('Opening hours');
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toContainText(ARMUS_OPENING_HOURS);

            // second panel
            await expect(page.getByTestId(`${LIV}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-summary-hours`)).toContainText(ARMUS_OPENING_HOURS);

            await expect(page.getByTestId(`${ARCH_PANEL_5}-summary-hours`)).not.toBeVisible();

            // the spaces below these have the correct details

            await expect(page.getByTestId(`${ARCH_PANEL_4}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_PANEL_4}-summary-hours`)).toContainText(ARMUS_OPENING_HOURS);

            await expect(page.getByTestId(`${ARCH_PANEL_5}-summary-hours`)).not.toBeVisible();

            await expect(page.getByTestId(`${ARCH_PANEL_6}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_PANEL_6}-summary-hours`)).toContainText(ARMUS_OPENING_HOURS);

            await expect(page.getByTestId(`${PANEL_UPCOMING_OUTAGE}-summary-hours`)).not.toBeVisible();

            await expect(page.getByTestId(`${ARCH_PANEL_8}-summary-hours`)).not.toBeVisible();

            await expect(page.getByTestId(`${ARCH_PANEL_9}-summary-hours`)).not.toBeVisible();

            await expect(page.getByTestId(`${CENTRAL_PANEL_ONE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${CENTRAL_PANEL_ONE}-summary-hours`)).toContainText(CENTRAL_OPENING_HOURS);

            await expect(page.getByTestId(`${CENTRAL_PANEL_TWO}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${CENTRAL_PANEL_TWO}-summary-hours`)).toContainText(CENTRAL_OPENING_HOURS);
        });

        test('facilities are hidden on opening', async ({ page }) => {
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).toBeDefined();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).not.toBeVisible();

            // third panel
            await expect(page.getByTestId(`${LIV}-facility`)).toBeDefined();
            await expect(page.getByTestId(`${LIV}-facility`)).not.toBeVisible();
        });

        test('friendly location appears correctly when panel expands', async ({ page }) => {
            await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).first()).toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-precise'),
            ).not.toBeVisible();
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-floor'),
            ).toContainText('Level 3');
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-library'),
            ).toContainText('Architecture and Music Library');
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-building'),
            ).toContainText('Zelman Cowen Building');
            await expect(
                page.getByTestId(`${ARCH_REFERENCE}-friendly-location`).locator('.location-campus'),
            ).toContainText('St Lucia');

            // third panel
            await page.getByTestId(`${LIV}-toggle-panel-button`).click();

            await expect(page.getByTestId(`${LIV}-friendly-location`).first()).toBeVisible();
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-precise')).toContainText(
                'Eastern corner',
            );
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-floor')).toContainText(
                'Level 2A',
            );
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-library')).toContainText(
                'imaginary Liveris Library',
            );
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-building')).toContainText(
                'Andrew N. Liveris (0046)',
            );
            await expect(page.getByTestId(`${LIV}-friendly-location`).locator('.location-campus')).toContainText(
                'St Lucia',
            );
        });

        test('opening hours appear correct when panel expands', async ({ page }) => {
            // expand panel 1
            await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-0`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-0`)).toContainText('Today');
            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-1`)).toContainText('Tomorrow');

            // expand panel 2
            await page.getByTestId(`${ARCH_PANEL_4}-toggle-panel-button`).click();

            await expect(page.getByTestId(`${ARCH_PANEL_4}-openingHours-0`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_PANEL_4}-openingHours-0`)).toContainText('Today');
            await expect(page.getByTestId(`${ARCH_PANEL_4}-openingHours-1`)).toContainText('Tomorrow');
        });

        test('facilities appear correctly when panel expands', async ({ page }) => {
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

            await page.getByTestId(`${ARCH_BOOKABLE}-facility`).scrollIntoViewIfNeeded();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`).locator('div > div')).toHaveCount(12);
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-23`)).toContainText('Toilets, female');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-22`)).toContainText('Toilets, male');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-29`)).toContainText('Recharge Station');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-31`)).toContainText('Self-printing & scanning');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-17`)).toContainText('Low noise level');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-5`)).toContainText('Computer');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-33`)).toContainText(
                'Client accessible power point',
            );
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-38`)).toContainText('Whiteboard');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-39`)).toContainText('Adjustable desks');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-8`)).toContainText('AV equipment');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-13`)).toContainText('Postgraduate spaces');
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-14`)).toContainText('Undergrad spaces');

            // close first panel
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).not.toBeVisible();

            // third panel
            await page.getByTestId(`${LIV}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${LIV}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-facility`).locator('div > div')).toHaveCount(9);
            await expect(page.getByTestId(`${LIV}-facility-23`)).toContainText('Toilets, female');
            await expect(page.getByTestId(`${LIV}-facility-22`)).toContainText('Toilets, male');
            await expect(page.getByTestId(`${LIV}-facility-29`)).toContainText('Recharge Station');
            await expect(page.getByTestId(`${LIV}-facility-31`)).toContainText('Self-printing & scanning');
            await expect(page.getByTestId(`${LIV}-facility-33`)).toContainText('Client accessible power point');
            await expect(page.getByTestId(`${LIV}-facility-8`)).toContainText('AV equipment');
            await expect(page.getByTestId(`${LIV}-facility-50`)).toContainText('Natural');
            await expect(page.getByTestId(`${LIV}-facility-13`)).toContainText('Postgraduate spaces');
            await expect(page.getByTestId(`${LIV}-facility-14`)).toContainText('Undergrad spaces');

            // close third panel
            await page.getByTestId(`${LIV}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${LIV}-facility`)).not.toBeVisible();
        });

        test('there is a gap either side of the Spaces widget so the user is able to scroll the page when needed', async ({
            page,
        }) => {
            const librarySpaces = page.getByTestId('library-spaces');

            const marginLeft = await librarySpaces.evaluate(el => {
                return window.getComputedStyle(el).marginLeft;
            });
            const marginRight = await librarySpaces.evaluate(el => {
                return window.getComputedStyle(el).marginRight;
            });

            const numericMargin = (marginString: string) => Number(marginString.replace('px', ''));
            // we don't care about the specific width (at the time of writing it was 2rem)
            // we just need to ensure there is a gap to left and right of the page for the user to be able to scroll the page around the page-filling Spaces widget
            expect(numericMargin(marginLeft)).toBeGreaterThan(16);
            expect(numericMargin(marginRight)).toBeGreaterThan(16);
        });
    });
    test.describe('accessibility', () => {
        test('homepage is accessible', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            await assertAccessibility(page, '[data-testid="library-spaces"]');
        });
        test('homepage with content panel open is accessible', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const panelOpenerButton = `${ARCH_REFERENCE}-toggle-panel-button`;
            await expect(page.getByTestId(panelOpenerButton)).toBeVisible();
            await page.getByTestId(panelOpenerButton).click();

            await assertAccessibility(page, '[data-testid="library-spaces"]');
        });
    });
    test('no spaces yet', async ({ page }) => {
        await page.goto('spaces?responseType=empty-spaces&advanced=1');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('no-spaces')).toBeVisible();
        await expect(page.getByTestId('no-spaces')).toContainText('No locations found yet - please try again soon.');
    });
    test('can expand-collapse sub-panels', async ({ page }) => {
        await page.goto('');
        await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
        await page.goto('spaces?advanced=1');
        await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

        await expect(page.getByTestId(`${ARCH_REFERENCE}`).locator('h3')).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).locator('svg.closePanel')).toBeVisible();
        await expect(
            page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).locator('svg.openPanel'),
        ).not.toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-expanded',
            'false',
        );
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-label',
            'Show more information about 354',
        );

        // initially the lower sub-panel is hidden
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${ARCH_PANEL_4}-facility`)).not.toBeVisible();

        // and the summary shows
        await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_PANEL_4}-summary-hours`)).toBeVisible();

        // and description is truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveClass(/truncated/);

        // expand the bottom sub-panel
        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

        // the lower sub-panel is visible
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).toBeVisible();
        // the other blocks have not appeared (are unaffected by this button click)
        await expect(page.getByTestId(`${ARCH_PANEL_4}-facility`)).not.toBeVisible();
        // and description is no longer truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-details-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-details-description`)).not.toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(
            page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).locator('svg.closePanel'),
        ).not.toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).locator('svg.openPanel')).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-expanded',
            'true',
        );
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-label',
            'Show fewer details for 354',
        );

        // the summary sub-panel is hidden for the single panel
        await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).not.toBeVisible();
        await expect(page.getByTestId(`${ARCH_PANEL_4}-summary-hours`)).toBeVisible();

        // collapse the bottom sub-panel
        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

        // and the lower sub-panel details are hidden again
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).not.toBeVisible();
        // the other blocks have not appeared (button only affects one space)
        await expect(page.getByTestId(`${ARCH_PANEL_4}-facility`)).not.toBeVisible();
        // and description is truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-collapse-button`)).not.toBeVisible();
    });
    test('expanding a different space collapses the previously expanded space', async ({ page }) => {
        await page.goto('');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await page.goto('spaces?advanced=1');
        await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-expanded',
            'true',
        );
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).toBeVisible();

        await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toHaveAttribute(
            'aria-expanded',
            'false',
        );
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toBeVisible();

        await expect(page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`)).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_BOOKABLE}-summary-hours`)).not.toBeVisible();
    });
    test.describe('filtering', () => {
        test.beforeEach(async ({ page }) => {
            // things don't redraw fast enough for playwright to work if we load the page then resize.
            // so instead, load the homepage, resize, then navigate to spaces
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();
        });

        test('can filter with sidebar checkboxes', async ({ page }) => {
            // setup Ids
            const bookableId = 9002;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const adjustableDeskCheckbox = page.getByTestId('facility-type-listitem-39');
            const naturalLightCheckbox = page.getByTestId('facility-type-listitem-50');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');
            const filterCount = page.getByTestId('space-filter-count').locator('span');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible(); // no filters selected

            // filter to show "Bookable" only
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // panels shown changes
            await expect(page.getByTestId('space-space-count')).toContainText('5');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('1');

            // add 'Adjustable desks'
            await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toContainText('Adjustable desks');
            await adjustableDeskCheckbox.locator('span input').check();

            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(page.getByTestId('space-space-count')).toContainText('2');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                2 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');

            // add 'Natural Light'
            await expect(naturalLightCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(naturalLightCheckbox.locator('label:first-of-type')).toContainText('Natural');
            await naturalLightCheckbox.locator('span input').check();

            // selecting "Adjustable desks" & "Natural light" & "Bookable" means none are visible, and the user is notified
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).toBeVisible(); // "no spaces" message
            await expect(architectureBookableSpace).not.toBeVisible();
            // await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('3');

            // uncheck "Adjustable desks"
            await adjustableDeskCheckbox.locator('span input').uncheck();
            await expect(page.getByTestId('space-space-count')).toContainText('1');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).not.toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');

            // uncheck other filters and all the Spaces appear
            await bookableCheckbox.locator('span input').uncheck();
            await naturalLightCheckbox.locator('span input').uncheck();

            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible();
        });
        test('can OR on filters in the same group', async ({ page }) => {
            // setup Ids
            const avEquipmentCheckbox = page.getByTestId('facility-type-listitem-8');
            const byodStationCheckbox = page.getByTestId('facility-type-listitem-32');
            const architectureReferenceSpace = page.getByTestId(ARCH_REFERENCE).locator('h3');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            // const duttonParkGroupStudyRoom = page.getByTestId(PACE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');
            const filterCount = page.getByTestId('space-filter-count').locator('span');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible(); // no filters selected

            // choose AV equipment
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
            await avEquipmentCheckbox.locator('span input').check();

            // display changes
            await expect(page.getByTestId('space-space-count')).toContainText('5');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('1');

            // add byod station, which is in the same group, and MORE appear (because it is an OR)
            await expect(byodStationCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(byodStationCheckbox.locator('label:first-of-type')).toContainText('BYOD station');
            await byodStationCheckbox.locator('span input').check();

            await expect(page.getByTestId('space-space-count')).toContainText('6');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                6 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');
        });
        test('can unfilter by cartouche', async ({ page }) => {
            // "cartouches" are the buttons that show at the top of the filter sidebar when a checkbox is checked. Clicking them unsets the filter (unchecks the checkbox)
            // they act as both a summary of the filters checked, and a quick way to unselect, without scrolling up and down
            const bookableId = 9002;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const bookableUnsetCartouche = page.getByTestId(`button-deselect-selected-${bookableId}`);
            const avEquipmentId = 8;
            const avEquipmentCheckbox = page.getByTestId(`facility-type-listitem-${avEquipmentId}`);
            const avEquipmentUnsetCartouche = page.getByTestId(`button-deselect-selected-${avEquipmentId}`);

            const architectureReferenceSpace = page.getByTestId(ARCH_REFERENCE).locator('h3');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            // const duttonParkGroupStudyRoom = page.getByTestId(PACE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');

            // there are initially all Spaces visible on the page
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();

            // filter to show "AV equipment" only
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
            await avEquipmentCheckbox.locator('span input').check();

            // only 5 Spaces visible on the page
            await expect(page.getByTestId('space-space-count')).toContainText('5');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).not.toBeVisible();

            // cartouche visible
            await expect(avEquipmentUnsetCartouche).toBeVisible();
            await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(1);

            // also filter on "bookable"
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // and we are down to 3 spaces showing
            await expect(page.getByTestId('space-space-count')).toContainText('3');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                3 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();

            // cartouche visible
            await expect(avEquipmentUnsetCartouche).toBeVisible();
            await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
            await expect(bookableUnsetCartouche).toBeVisible();
            await expect(bookableUnsetCartouche).toContainText('Bookable');
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);

            // now unfilter using the cartouches
            await avEquipmentUnsetCartouche.click();

            // spaces visible changes
            await expect(page.getByTestId('space-space-count')).toContainText('5');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(page.getByTestId(ARCH_REFERENCE).locator('h3')).not.toBeVisible();
            await expect(page.getByTestId(ARCH_PANEL_4).locator('h3')).toBeVisible();
            await expect(page.getByTestId(ARCH_PANEL_5).locator('h3')).not.toBeVisible();
            await expect(page.getByTestId(ARCH_PANEL_6).locator('h3')).toBeVisible();
            await expect(page.getByTestId(PANEL_UPCOMING_OUTAGE).locator('h3')).toBeVisible();
            await expect(page.getByTestId(ARCH_PANEL_8).locator('h3')).not.toBeVisible();
            await expect(page.getByTestId(ARCH_PANEL_9).locator('h3')).toBeVisible();

            await bookableUnsetCartouche.click();

            // back to all Spaces visible on the page
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            // await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();

            // no cartouches left
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
        });
        test('can clear all filters with one click', async ({ page }) => {
            const avEquipmentCheckbox = page.getByTestId('facility-type-listitem-8');
            const byodStationCheckbox = page.getByTestId('facility-type-listitem-32');

            // select some filters
            await avEquipmentCheckbox.locator('span input').check();
            await byodStationCheckbox.locator('span input').check();

            // correct number of cartouches showing
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);
            // correct number of panels showing
            await expect(page.getByTestId('space-space-count')).toContainText('6');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                6 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // click deselect-all-cartouches
            await expect(page.getByTestId('button-deselect-all-filters')).toBeVisible();
            await page.getByTestId('button-deselect-all-filters').click();

            // all panels visible
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            // all cartouches removed
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
            // no checkboxes checked
            await expect(
                page.getByTestId('sidebarCheckboxes').locator(':scope > *[type="checkbox"]:checked'),
            ).toHaveCount(0);
        });
        test('can use special filter: open spaces', async ({ page }) => {
            // note: the dates used are this weeks because mock/index.js overwrites the json data to be the current week - look for function resetWeeklyHourDatesToBeCurrent

            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const currentlyOpenCheckbox = page.getByTestId('facility-type-listitem-9001');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // show only 'currently open' spaces
            await expect(currentlyOpenCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(currentlyOpenCheckbox.locator('label:first-of-type')).toContainText('Currently open');
            await currentlyOpenCheckbox.locator('span input').check();

            // Filter should reduce the visible count (one location is marked as currently_open)
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).not.toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
        });
        test('can use special filter: capacity and clear checkbox', async ({ page }) => {
            const filterCount = page.getByTestId('space-filter-count').locator('span');
            const spacesCount = page.getByTestId('space-space-count');
            const cartoucheList = page.getByTestId('button-deselect-list'); // buttons at top of the filters to turn them off
            const deselectAllFiltersButton = page.getByTestId('button-deselect-all-filters');
            const minimumCapacityField = page.getByTestId('capacitySlider-inputRight');
            const maximumCapacityField = page.getByTestId('capacitySlider-inputLeft');

            // there are initially all Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible(); // 'no spaces' warning not present
            await expect(filterCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();

            // first, check the bookable checkbox - this makes the capacity widget visible
            const bookableId = 9002;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // update minimum to 'at least 8 people'
            await expect(minimumCapacityField).toBeVisible();
            await minimumCapacityField.click();
            await minimumCapacityField.clear();
            await minimumCapacityField.fill('8');

            // filter controls update
            await expect(filterCount).toContainText('2');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(2);
            await expect(deselectAllFiltersButton).toBeVisible();

            // spaces displayed changes
            await expect(spacesCount).toContainText('3');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                3 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // update maximum to "no more than 20 people"
            await maximumCapacityField.click();
            await maximumCapacityField.clear();
            await maximumCapacityField.fill('20');

            // filter controls update
            await expect(filterCount).toContainText('2');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(2);
            await expect(deselectAllFiltersButton).toBeVisible();

            // spaces displayed changes
            await expect(spacesCount).toContainText('2');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                2 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // clear the capacity filters by unchecking "is bookable"
            await bookableCheckbox.locator('input[type="checkbox"]').uncheck();

            // the page is reset
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(filterCount).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();

            // reopen the bookable checkbox and the capacity slider has cleared
            await bookableCheckbox.locator('input[type="checkbox"]').check();
            await expect(minimumCapacityField).toBeVisible();
            await expect(minimumCapacityField).toHaveValue('1');
            await expect(maximumCapacityField).toBeVisible();
            await expect(maximumCapacityField).toHaveValue('24');
        });
        test('can use special filter: capacity and clear all', async ({ page }) => {
            const filterCount = page.getByTestId('space-filter-count').locator('span');
            const spacesCount = page.getByTestId('space-space-count');
            const cartoucheList = page.getByTestId('button-deselect-list'); // buttons at top of the filters to turn them off
            const deselectAllFiltersButton = page.getByTestId('button-deselect-all-filters');
            const minimumCapacityField = page.getByTestId('capacitySlider-inputRight');
            const maximumCapacityField = page.getByTestId('capacitySlider-inputLeft');

            // there are initially all Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible(); // 'no spaces' warning not present
            await expect(filterCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();

            // first, check the bookable checkbox - this makes the capacity widget visible
            const bookableId = 9002;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // update minimum to 'at least 8 people'
            await expect(minimumCapacityField).toBeVisible();
            await minimumCapacityField.click();
            await minimumCapacityField.clear();
            await minimumCapacityField.fill('8');

            // filter controls update
            await expect(filterCount).toContainText('2');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(2);
            await expect(deselectAllFiltersButton).toBeVisible();

            // spaces displayed changes
            await expect(spacesCount).toContainText('3');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                3 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // update maximum to "no more than 20 people"
            await maximumCapacityField.click();
            await maximumCapacityField.clear();
            await maximumCapacityField.fill('20');

            // filter controls update
            await expect(filterCount).toContainText('2');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(2);
            await expect(deselectAllFiltersButton).toBeVisible();

            // spaces displayed changes
            await expect(spacesCount).toContainText('2');
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                2 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // clear the capacity filters
            await page.getByTestId('button-deselect-all-filters').click();

            // the page is reset
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(filterCount).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();
        });
    });
    test.describe('sidebar filter type group can open-collapse', () => {
        const FILTER_GROUP_ON_THIS_FLOOR = 2;
        const FILTER_GROUP_SPACE_FEATURES = 3;
        const FILTER_GROUP_LIGHTING = 4;
        const FILTER_GROUP_NOISE_LEVEL = 5;
        const FILTER_GROUP_ROOM_FEATURES = 6;

        const filterGroup = (groupId: string | number, page: Page) => page.getByTestId('filter-group-block-' + groupId);
        const filterGroupButton = (groupId: number, page: Page) => page.getByTestId(`facility-type-group-${groupId}`);
        const collapseIcon = (groupId: number, page: Page) =>
            page.getByTestId(`facility-type-group-${groupId}`).locator('svg.expandedGroup');
        const expandIcon = (groupId: number, page: Page) =>
            page.getByTestId(`facility-type-group-${groupId}`).locator('svg.collapsedGroup');

        test.beforeEach(async ({ page }) => {
            await disableMazeMapAssets(page);
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();
        });

        test('sidebar filter type group open-collapse loads correctly', async ({ page }) => {
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // ON THIS FLOOR LOADS CLOSED
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('h3')
                    .getByText(/On this floor/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).not.toBeVisible();
            await expect(expandIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_LIGHTING, page)
                    .locator('h3')
                    .getByText(/Lighting/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_LIGHTING, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_LIGHTING, page)).not.toBeVisible();

            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_NOISE_LEVEL, page)
                    .locator('h3')
                    .getByText(/Acceptable noise/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_NOISE_LEVEL, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_NOISE_LEVEL, page)).not.toBeVisible();

            // ROOM FEATURES LOADS CLOSED
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ROOM_FEATURES, page)
                    .locator('h3')
                    .getByText(/Room features/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_ROOM_FEATURES, page)).not.toBeVisible();
            await expect(expandIcon(FILTER_GROUP_ROOM_FEATURES, page)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_FEATURES, page)
                    .locator('h3')
                    .getByText(/Space features/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_SPACE_FEATURES, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_SPACE_FEATURES, page)).not.toBeVisible();
        });
        test('collapsing an open sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_LIGHTING, page)
                    .locator('h3')
                    .getByText(/Lighting/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_LIGHTING, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_LIGHTING, page)).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul').locator(':scope > *')).toHaveCount(2);

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            // await page.waitForTimeout(100000);
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul li').first()).toBeVisible();

            // the state of the other groups is known (and won't change after click)
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            await expect(filterGroupButton(FILTER_GROUP_LIGHTING, page)).toHaveAttribute('aria-expanded', 'true');
            await expect(filterGroupButton(FILTER_GROUP_LIGHTING, page)).toHaveAttribute(
                'aria-label',
                'Hide Lighting filter options',
            );

            // collapse the open Lighting group
            await filterGroupButton(FILTER_GROUP_LIGHTING, page).click();

            // visibility flips
            await expect(filterGroupButton(FILTER_GROUP_LIGHTING, page)).toHaveAttribute('aria-expanded', 'false');
            await expect(filterGroupButton(FILTER_GROUP_LIGHTING, page)).toHaveAttribute(
                'aria-label',
                'Show Lighting filter options',
            );
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul li')).not.toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_LIGHTING, page)).not.toBeVisible();
            await expect(expandIcon(FILTER_GROUP_LIGHTING, page)).toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('opening a collapsed sidebar filter type group shows correctly', async ({ page }) => {
            // "on this floor" loads collapsed. Confirm we can open it
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // the group loads collapsed, as expected
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('h3')
                    .getByText(/On this floor/),
            ).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul li:first-of-type'),
            ).not.toBeVisible();

            // the state of the other groups is known (and won't change after click)
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
            await expect(filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page)).toHaveAttribute(
                'aria-label',
                'Show On this floor filter options',
            );
            await expect(filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page)).toHaveAttribute('aria-expanded', 'false');

            // open "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            await expect(filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page)).toHaveAttribute('aria-expanded', 'true');
            await expect(filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page)).toHaveAttribute(
                'aria-label',
                'Hide On this floor filter options',
            );
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul').locator(':scope > *')).toHaveCount(
                4,
            );

            // the group we opened has completely changed - visibility flips
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul li:first-of-type')).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).not.toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('multiple open-collapse sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // sidebar filter types group load open-collapsedness as expected
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // open "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible(); // has changed

            // no change in others
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "space room type" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_LIGHTING, page).click();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).not.toBeVisible(); // changed
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "noise level" sidebar filter type roup
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();

            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible(); // changed
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-open "lighting" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_LIGHTING, page).click();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-collapse "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed', async ({ page }) => {
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-expanded-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // open "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            // filter to show "Recharge Station" only
            const rechargeStationId = 29;
            const rechargeStationCheckbox = page.getByTestId(`facility-type-listitem-${rechargeStationId}`);
            await expect(rechargeStationCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(rechargeStationCheckbox.locator('label:first-of-type')).toContainText('Recharge Station');
            await rechargeStationCheckbox.locator('span input').check();

            // still no counts show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // re-collapse "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            // NOW a count shows on that single collapsed group
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).toHaveText('(1 of 4)');

            // collapse a few more, to be sure
            await filterGroupButton(FILTER_GROUP_LIGHTING, page).click();
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();
            await filterGroupButton(FILTER_GROUP_SPACE_FEATURES, page).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed with single entry', async ({
            page,
        }) => {
            await page.goto('spaces?advanced=1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-expanded-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // filter to show "Bookable" only; this public group has a single entry
            const bookableId = 9002;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // while the single-entry group is still open, no collapsed-count is shown
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // collapse the single-entry public group
            const FILTER_GROUP_BOOKABLE_TYPE = 10;
            await filterGroupButton(FILTER_GROUP_BOOKABLE_TYPE, page).click();

            // now the collapsed group shows the selected-count summary
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_BOOKABLE_TYPE))).toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_BOOKABLE_TYPE))).toHaveText('(1 of 2)');

            // re-open it and the collapsed-count disappears again
            await filterGroupButton(FILTER_GROUP_BOOKABLE_TYPE, page).click();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_BOOKABLE_TYPE))).not.toBeVisible();

            // collapse a few more, to be sure
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();
            await filterGroupButton(FILTER_GROUP_SPACE_FEATURES, page).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
    });
    test.describe('Can change libraries', () => {
        test('it changes to a different library on prompt', async ({ page }) => {
            const librarySelectorButton = page.getByTestId('filter-by-library');
            const selectedLibraryButtonLabel = page.getByTestId('filter-by-library').locator('[tabindex="0"]');
            const libraryChooserButton = (buttonId: string) => page.getByTestId(`library-${buttonId}`);
            const spacePanelWrapper = page.getByTestId('space-wrapper').locator(':scope > *');
            const all = VISIBLE_SPACES_ST_LUCIA_ALL;
            const ALL_LIBRARIES_BUTTON_ID = '0';
            const ARMUS_BUTTON_ID = '3';

            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            // all space panels load visible (using filters changes which appear)
            await expect(spacePanelWrapper).toHaveCount(all + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
            await expect(page.getByTestId('filter-by-campus').locator('[tabindex="0"]')).toContainText('St Lucia');

            // change library
            await librarySelectorButton.click(); // open drop down
            await libraryChooserButton(ARMUS_BUTTON_ID).click(); // choose armus

            // the library filter selector label updates on change
            await expect(selectedLibraryButtonLabel).toContainText('Architecture and Music Library');

            // the panels show update on change of library
            await expect(spacePanelWrapper).toHaveCount(7 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);

            // change library
            await librarySelectorButton.click(); // open drop down
            await libraryChooserButton(ALL_LIBRARIES_BUTTON_ID).click(); // choose 'all libraries'

            // the library filter selector label updates on change
            await expect(selectedLibraryButtonLabel).toContainText('All libraries');

            // the panels show update on change of library
            await expect(spacePanelWrapper).toHaveCount(all + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
        });

        test('an invalid library cookie will not cause an error and the first campus+first library will be used', async ({
            page,
            context,
        }) => {
            const selectedCampusNameElement = page.getByTestId('filter-by-campus').locator('[tabindex="0"]');
            const selectLibraryNameElement = page.getByTestId('filter-by-library').locator('[tabindex="0"]');

            // on inital load, it honours the non-default campus cookie
            await page.goto('spaces?advanced=1');
            await expect(selectedCampusNameElement).toContainText('St Lucia');
            await expect(selectLibraryNameElement).toContainText('All libraries');

            // change library
            await page.getByTestId('filter-by-library').click(); // open drop down
            await page.getByTestId('library-3').click(); // choose armus

            // the library filter selector label updates on change
            await expect(selectLibraryNameElement).toContainText('Architecture and Music Library');

            // manually override the set cookie to an invalid value
            await context.addCookies([
                { name: 'UQLspacesPreferredLibrary', value: '999', domain: 'localhost', path: '/' },
            ]);

            // reload the page - now the library cookie has an invalid value, it ignores the cookie value and uses the default
            await page.goto('spaces?advanced=1');
            await expect(selectedCampusNameElement).toContainText('St Lucia');
            await expect(selectLibraryNameElement).toContainText('All libraries');
        });
    });
    test.describe('Can change campuses', () => {
        test.beforeEach(async ({ page }) => {
            // Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
            // which would otherwise cause BookableSpacesList to re-render and destabilise the toggle
            // buttons enough for Playwright's actionability check to time out in CI.
            await disableMazeMapAssets(page);
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            // all space panels load visible (using filters changes which appear)
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // change campus
            await page.getByTestId('filter-by-campus').click(); // open drop down
            await page.getByTestId('campus-3').click(); // choose dutton park
            await expect(page.getByTestId('space-1234544')).toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location-collapsed`)).toContainText(
                'Dutton Park Health Sciences',
            );
        });

        test('friendly location displays correctly on load on change of campus', async ({ page }) => {
            // non PACE spaces are not visible
            await expect(page.getByTestId(`${ARCH_REFERENCE}-friendly-location-collapsed`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-friendly-location-collapsed`)).toBeVisible();
            // await expect(
            //     page.getByTestId(`${PACE}-friendly-location-collapsed`).locator('.location-library'),
            // ).toContainText('Dutton Park Health Sciences');
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-precise')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-floor')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-library')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-building')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-campus')).not.toBeVisible();
        });

        test('it remembers the changed campus', async ({ page }) => {
            await page.goto('spaces?advanced=1'); // reload page after campus change in before
            await expect(page.getByTestId('filter-by-campus').locator('[tabindex="0"]')).toContainText('Dutton Park');
        });

        test('bookable links appear correct on load on change of campus', async ({ page }) => {
            // public bookable Architecture and Music example
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-not-bookable`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-not-bookable`)).not.toBeVisible();
            await expect(page.locator(`a[data-testid="${PACE}-booking-link"]`)).toBeVisible();
            // await expect(page.getByTestId(`${PACE}-booking-link`)).toBeVisible();
            // await expect(page.getByTestId(`${PACE}-booking-link`).locator('a')).toBeVisible();
            await expect(page.locator(`a[data-testid="${PACE}-booking-link"]`)).toHaveAttribute(
                'href',
                `https://uqbookit.uq.edu.au/#/app/booking-types/222`,
            );
        });

        test('capacity loads correctly on change of campus', async ({ page }) => {
            // non PACE spaces are not visible
            await expect(page.getByTestId(`${ARCH_REFERENCE}-capacity`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-capacity`)).toContainText('Space for 5 people.');
        });

        test('description loads correctly on change of campus', async ({ page }) => {
            // non PACE spaces are not visible
            await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-description`)).toHaveCount(1);
        });

        test('opening hours appear correct on load on change of campus', async ({ page }) => {
            // non PACE spaces are not visible
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-summary-hours`)).toContainText(
                'Opening hours Today: 10:15pm - 10:30pm',
            );
        });

        test('facilities are hidden on opening on change of campus', async ({ page }) => {
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).not.toBeVisible();

            await expect(page.getByTestId(`${PACE}-facility`)).toBeDefined();
            await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        });

        test('friendly location appears correctly when panel expands on change of campus', async ({ page }) => {
            // non PACE spaces are not visible
            await expect(page.getByTestId(`${ARCH_REFERENCE}-friendly-location`)).not.toBeVisible();

            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-friendly-location`).first()).toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-precise')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-floor')).toContainText(
                'Level 6',
            );
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-library')).toContainText(
                'Dutton Park Health Sciences',
            );
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-building')).toContainText(
                'Pharmacy Australia Centre of Excellence (870)',
            );
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-campus')).toContainText(
                'Dutton Park',
            );
        });

        test('opening hours appear correct when panel expands on change of campus', async ({ page }) => {
            await expect(page.getByTestId(`${PACE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-openingHours-0`)).not.toBeVisible();

            await page.getByTestId(`${PACE}-toggle-panel-button`).click();

            await expect(page.getByTestId(`${PACE}-summary-hours`)).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-openingHours-0`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-openingHours-0`)).toContainText('Today');
            await expect(page.getByTestId(`${PACE}-openingHours-1`)).toContainText('Tomorrow');
        });

        test('facilities appear correctly when panel expands on change of campus', async ({ page }) => {
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-facility`).locator('div > div')).toHaveCount(15);
            await expect(page.getByTestId(`${PACE}-facility-23`)).toContainText('Toilets, female');
            await expect(page.getByTestId(`${PACE}-facility-22`)).toContainText('Toilets, male');
            await expect(page.getByTestId(`${PACE}-facility-29`)).toContainText('Recharge Station');
            await expect(page.getByTestId(`${PACE}-facility-31`)).toContainText('Self-printing & scanning');
            await expect(page.getByTestId(`${PACE}-facility-5`)).toContainText('Computer');
            await expect(page.getByTestId(`${PACE}-facility-32`)).toContainText('BYOD station');
            await expect(page.getByTestId(`${PACE}-facility-33`)).toContainText('Client accessible power point');
            await expect(page.getByTestId(`${PACE}-facility-34`)).toContainText('on-desk USB-A');
            await expect(page.getByTestId(`${PACE}-facility-35`)).toContainText('Qi chargers');
            await expect(page.getByTestId(`${PACE}-facility-36`)).toContainText('On-desk USB-C, Low Power');
            await expect(page.getByTestId(`${PACE}-facility-42`)).toContainText('General Collections');
            await expect(page.getByTestId(`${PACE}-facility-44`)).toContainText('Requested items');
            await expect(page.getByTestId(`${PACE}-facility-45`)).toContainText('Lending');
            await expect(page.getByTestId(`${PACE}-facility-46`)).toContainText('Return station');
            await expect(page.getByTestId(`${PACE}-facility-10`)).toContainText('High noise level');

            // close second panel
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        });

        test('an invalid campus cookie will not cause an error and the first campus will be used', async ({
            page,
            context,
        }) => {
            // on inital load, it honours the non-default campus cookie
            await page.goto('spaces?advanced=1');
            await expect(page.getByTestId('filter-by-campus').locator('[tabindex="0"]')).toContainText('Dutton Park');

            await context.addCookies([
                { name: 'UQLspacesPreferredCampus', value: '999', domain: 'localhost', path: '/' },
            ]);

            // after resetting the cookie invalidly, it ignores campus cookie and uses the default
            await page.goto('spaces?advanced=1'); // reload page after campus change in before
            await expect(page.getByTestId('filter-by-campus').locator('[tabindex="0"]')).toContainText('St Lucia');
        });

        test('each campus loads correctly', async ({ page }) => {
            const spacePanelWrapper = page.getByTestId('space-wrapper').locator(':scope > *');
            const panelLabel = (panelId: string) =>
                page.getByTestId(`${panelId}-friendly-location-collapsed`).locator('div');
            const changeCampusButton = page.getByTestId('filter-by-campus');
            const librarySelector = page.getByTestId('filter-by-library').locator('[tabindex="0"]');
            const campusChooser = (campusId: string) => page.getByTestId(`campus-${campusId}`);

            const CAMPUS_ID_ST_LUCIA = '1';
            const CAMPUS_ID_GATTON = '2';
            const CAMPUS_ID_DUTTON_PARK = '3';

            // on inital load, it honours the non-default campus cookie
            await page.goto('spaces?advanced=1');
            await expect(changeCampusButton.locator('[tabindex="0"]')).toContainText('Dutton Park');

            await expect(panelLabel(PACE)).toContainText('Dutton Park Health Sciences');
            await expect(spacePanelWrapper).toHaveCount(1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
            await expect(librarySelector).not.toBeVisible();

            // CHANGE CAMPUS TO GATTON
            await changeCampusButton.click(); // open drop down
            await campusChooser(CAMPUS_ID_GATTON).click(); // choose gatton
            await expect(panelLabel(GATTON_PANEL_ONE)).toContainText('J.K. Murray Library');
            await expect(spacePanelWrapper).toHaveCount(4 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
            await expect(librarySelector).not.toBeVisible();

            // CHANGE CAMPUS TO ST LUCIA
            await changeCampusButton.click(); // open drop down
            await campusChooser(CAMPUS_ID_ST_LUCIA).click(); // choose st lucia
            await expect(panelLabel(ARCH_REFERENCE)).toContainText('Architecture and Music Library');
            await expect(spacePanelWrapper).toHaveCount(
                VISIBLE_SPACES_ST_LUCIA_ALL + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(librarySelector).toContainText('All libraries');

            // and circle around, to be sure!

            // CHANGE CAMPUS TO DUTTON PARK
            await changeCampusButton.click(); // open drop down
            await campusChooser(CAMPUS_ID_DUTTON_PARK).click(); // choose dutton park
            await expect(panelLabel(PACE)).toContainText('Dutton Park Health Sciences');
            await expect(spacePanelWrapper).toHaveCount(1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
            await expect(librarySelector).not.toBeVisible();

            // CHANGE CAMPUS TO GATTON
            await changeCampusButton.click(); // open drop down
            await campusChooser(CAMPUS_ID_GATTON).click(); // choose gatton
            await expect(panelLabel(GATTON_PANEL_ONE)).toContainText('J.K. Murray Library');
            await expect(spacePanelWrapper).toHaveCount(4 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST);
            await expect(librarySelector).not.toBeVisible();
        });
    });
    test.describe('Spaces favourites', () => {
        test('can UNfavourite a space on the map page', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');

            // the space is currently favourited
            await expect(page.getByTestId('space-1-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-1-detail-favourite')).not.toBeVisible();

            // unfavourite it
            await page.getByTestId('space-1-detail-unfavourite').click();

            // the space is now UNfavourited
            await expect(page.getByTestId('space-1-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-1-detail-unfavourite')).not.toBeVisible();
        });
        test('can favourite a space on the map page', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces?advanced=1');

            // the space is currently UNfavourited
            await expect(page.getByTestId('space-43534-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-43534-detail-unfavourite')).not.toBeVisible();

            // favourite it
            await page.getByTestId('space-43534-detail-favourite').click();

            // the space is now favourited
            await expect(page.getByTestId('space-43534-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-43534-detail-favourite')).not.toBeVisible();
        });
    });
});
test.describe('Spaces errors', () => {
    test.beforeEach(async ({ page }) => {
        await disableMazeMapAssets(page);
    });

    test('spaces list load error', async ({ page }) => {
        await page.goto('spaces?responseType=error-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-error')).toBeVisible();
        await expect(page.getByTestId('spaces-error')).toContainText('Something went wrong - please try again later.');
    });
    test('facilities list load error', async ({ page }) => {
        await page.goto('spaces?responseType=facilityTypesAllError');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-error')).toBeVisible();
        await expect(page.getByTestId('spaces-error')).toContainText('Something went wrong - please try again later.');
    });
    test('weekly hours list load error', async ({ page }) => {
        await page.goto('');
        await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
        await page.goto('spaces?responseType=weeklyHoursError&advanced=1');
        await expect(page.getByTestId('topOfSidebar')).toHaveText('Filter Spaces');

        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-weekly-hours-error`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-weekly-hours-error`)).toContainText(
            'General opening hours currently unavailable - please try again later.',
        );
    });
});

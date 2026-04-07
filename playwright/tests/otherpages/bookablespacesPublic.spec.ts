import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

const ARCH_REFERENCE = 'space-1'; // a public Architecture and Music Library space with summary hours and description
const ARCH_BOOKABLE = 'space-2'; // a public Architecture and Music Library space with booking and rich facilities
const PACE = 'space-1234544'; // a space in dutton park (pace)
const LIV = 'space-43534'; // a space in liveris building (used to show we can , if we want, add spaces that aren't in our Libraries)
const FOURTH_PANEL = 'space-1';
const FIFTH_PANEL = 'space-2';
const SIXTH_PANEL = 'space-3';
const SEVENTH_PANEL = 'space-4';
const EIGHTH_PANEL = 'space-5';
const NINTH_PANEL = 'space-6';
const TENTH_PANEL = 'space-7';

const NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST = 2; // 1 for skip button, 1 for acccessible heading
const VISIBLE_SPACES_COUNT = 9;

test.describe('Spaces', () => {
    test('can navigate to Spaces public page', async ({ page }) => {
        await page.goto('/?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('homepage-hours-bookit-link')).toHaveText(/Book a room/);
        await page.getByTestId('homepage-hours-bookit-link').click();
        await expect(page).toHaveURL('http://localhost:2020/spaces?user=s1111111');
        await expect(page.getByTestId('topOfSidebar')).toHaveText('Filter Spaces');
    });
    test.describe('Shows a basic page for Spaces', () => {
        test.beforeEach(async ({ page }) => {
            // Abort MazeMaps assets so the script never fires setIsMazeMapScriptReady(true) mid-test,
            // which would otherwise cause BookableSpacesList to re-render and destabilise the toggle
            // buttons enough for Playwright's actionability check to time out in CI.
            await page.route('**/vendor/mazemap/**', route => route.abort());
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            // all space panels load visible (using filters changes which appear)
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
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

            // second panel
            await expect(page.getByTestId(`${PACE}-friendly-location-collapsed`)).toBeVisible();
            await expect(
                page.getByTestId(`${PACE}-friendly-location-collapsed`).locator('.location-library'),
            ).toContainText('Dutton Park Health Sciences');
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-precise')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-floor')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-library')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-building')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-campus')).not.toBeVisible();

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

        test('bookable links appear correct on load', async ({ page }) => {
            // public bookable Architecture and Music example
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-not-bookable`)).not.toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-link`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-link`).locator('a')).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-booking-link`).locator('a')).toHaveAttribute(
                'href',
                `https://uqbookit.uq.edu.au/#/app/booking-types/333`,
            );

            // second panel
            await expect(page.getByTestId(`${PACE}-not-bookable`)).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-booking-link`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-booking-link`).locator('a')).toBeVisible();
            await expect(page.getByTestId(`${PACE}-booking-link`).locator('a')).toHaveAttribute(
                'href',
                `https://uqbookit.uq.edu.au/#/app/booking-types/222`,
            );

            // third panel
            await expect(page.getByTestId(`${LIV}-not-bookable`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-not-bookable`)).toContainText('No booking required.');
            await expect(page.getByTestId(`${LIV}-booking-link`)).not.toBeVisible();
        });

        test('capacity loads correctly', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-capacity`)).toContainText('Space for 6 people.');

            // second panel
            await expect(page.getByTestId(`${PACE}-capacity`)).toContainText('Space for 5 people.');

            // third panel
            await expect(page.getByTestId(`${LIV}-capacity`)).toContainText('Space for 1 person.');
        });

        test('description loads correctly', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveCount(1); // second line is hidden

            // second panel
            await expect(page.getByTestId(`${PACE}-description`)).toHaveCount(1);

            // third panel
            await expect(page.getByTestId(`${LIV}-description`)).toHaveCount(0);
        });

        test('opening hours appear correct on load', async ({ page }) => {
            // public Architecture and Music Library example
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toContainText(
                'Opening hours Today: 7:30am - 7:30pm',
            );
            await expect(page.getByTestId(`${ARCH_REFERENCE}-override_opening_hours`)).not.toBeVisible();

            // second panel
            await expect(page.getByTestId(`${PACE}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-summary-hours`)).toContainText(
                'Opening hours Today: 10:15pm - 10:30pm',
            );
            await expect(page.getByTestId(`${PACE}-override_opening_hours`)).not.toBeVisible();

            // third panel
            await expect(page.getByTestId(`${LIV}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-summary-hours`)).toContainText('Open from 7am Monday - Friday');
            await expect(page.getByTestId(`${LIV}-override_opening_hours`)).not.toBeVisible();
            await expect(page.getByTestId(`${LIV}-override_opening_hours`)).toContainText(
                'Open from 7am Monday - Friday',
            );

            // the spaces below the first 3 have the correct details
            await expect(page.getByTestId(`${FOURTH_PANEL}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${FOURTH_PANEL}-summary-hours`)).toContainText(
                'Opening hours Today: 7:30am - 7:30pm',
            );

            await expect(page.getByTestId(`${FIFTH_PANEL}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${FIFTH_PANEL}-summary-hours`)).toContainText(
                'Architecture and Music Library opening hours Today: 7:30am - 7:30pm',
            );
            await expect(page.getByTestId(`${FIFTH_PANEL}-override_opening_hours`)).toContainText(
                'this space opens at 8am',
            );

            await expect(page.getByTestId(`${SIXTH_PANEL}-summary-hours`)).not.toBeVisible();
            await expect(page.getByTestId(`${SEVENTH_PANEL}-summary-hours`)).toBeVisible();
            await expect(page.getByTestId(`${SEVENTH_PANEL}-summary-hours`)).toContainText(
                'Opening hours Today: 7:30am - 7:30pm',
            );

            await expect(page.getByTestId(`${EIGHTH_PANEL}-summary-hours`)).not.toBeVisible();
            await expect(page.getByTestId(`${NINTH_PANEL}-summary-hours`)).not.toBeVisible();
            await expect(page.getByTestId(`${TENTH_PANEL}-summary-hours`)).not.toBeVisible();
        });

        test('facilities are hidden on opening', async ({ page }) => {
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).toBeDefined();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).not.toBeVisible();

            // second panel
            await expect(page.getByTestId(`${PACE}-facility`)).toBeDefined();
            await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();

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

            // second panel
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-friendly-location`).first()).toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-precise')).not.toBeVisible();
            await expect(page.getByTestId(`${PACE}-friendly-location`).locator('.location-floor')).toContainText(
                'Ground floor',
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
            await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-0`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-0`)).toContainText('Today');
            await expect(page.getByTestId(`${ARCH_REFERENCE}-openingHours-1`)).toContainText('Tomorrow');

            // second panel
            await expect(page.getByTestId(`${PACE}-override_opening_hours`)).not.toBeVisible();
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-override_opening_hours`)).not.toBeVisible();

            // fifth panel
            await expect(page.getByTestId(`${FIFTH_PANEL}-override_opening_hours`)).not.toBeVisible();
            await page.getByTestId(`${FIFTH_PANEL}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${FIFTH_PANEL}-override_opening_hours`)).toBeVisible();
            await expect(page.getByTestId(`${FIFTH_PANEL}-override_opening_hours`)).toContainText(
                'Note: this space opens at 8am',
            );
        });

        test('facilities appear correctly when panel expands', async ({ page }) => {
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();

            await page.getByTestId(`${ARCH_BOOKABLE}-facility`).scrollIntoViewIfNeeded();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`).locator(' > *')).toHaveCount(13);
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
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility-19`)).toContainText('Bookable');

            // close first panel
            await page.getByTestId(`${ARCH_BOOKABLE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${ARCH_BOOKABLE}-facility`)).not.toBeVisible();

            // second panel
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${PACE}-facility`).locator(' > *')).toHaveCount(16);
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
            await expect(page.getByTestId(`${PACE}-facility-19`)).toContainText('Bookable');

            // close second panel
            await page.getByTestId(`${PACE}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();

            // third panel
            await page.getByTestId(`${LIV}-toggle-panel-button`).click();
            await expect(page.getByTestId(`${LIV}-facility`)).toBeVisible();
            await expect(page.getByTestId(`${LIV}-facility`).locator(' > *')).toHaveCount(9);
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
    });
    test.describe('accessibility', () => {
        test('homepage is accessible', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            await assertAccessibility(page, '[data-testid="library-spaces"]');
        });
        test('homepage with content panel open is accessible', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const panelOpenerButton = `${ARCH_REFERENCE}-toggle-panel-button`;
            await expect(page.getByTestId(panelOpenerButton)).toBeVisible();
            await page.getByTestId(panelOpenerButton).click();

            await assertAccessibility(page, '[data-testid="library-spaces"]');
        });
    });
    test('no spaces yet', async ({ page }) => {
        await page.goto('spaces?responseType=empty-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('no-spaces')).toBeVisible();
        await expect(page.getByTestId('no-spaces')).toContainText('No locations found yet - please try again soon.');
    });
    test('can expand-collapse sub-panels', async ({ page }) => {
        await page.goto('');
        await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
        await page.goto('spaces');
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
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIV}-facility`)).not.toBeVisible();

        // and the summary shows
        await expect(page.getByTestId(`${ARCH_REFERENCE}-summary-hours`)).toBeVisible();
        await expect(page.getByTestId(`${PACE}-summary-hours`)).toBeVisible();
        await expect(page.getByTestId(`${LIV}-summary-hours`)).toBeVisible();

        // and description is truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveClass(/truncated/);

        // expand the bottom sub-panel
        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

        // the lower sub-panel is visible
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).toBeVisible();
        // the other blocks have not appeared (are unaffected by this button click)
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIV}-facility`)).not.toBeVisible();
        // and description is no longer truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).not.toHaveClass(/truncated/);
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
        await expect(page.getByTestId(`${PACE}-summary-hours`)).toBeVisible();
        await expect(page.getByTestId(`${LIV}-summary-hours`)).toBeVisible();

        // collapse the bottom sub-panel
        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();

        // and the lower sub-panel details are hidden again
        await expect(page.getByTestId(`${ARCH_REFERENCE}-facility`)).not.toBeVisible();
        // the other blocks have not appeared (button only affects one space)
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIV}-facility`)).not.toBeVisible();
        // and description is truncated
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-description`)).toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-collapse-button`)).not.toBeVisible();
    });
    test.describe('filtering', () => {
        test('can filter with sidebar checkboxes', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            // setup Ids
            const bookableId = 19;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const adjustableDeskCheckbox = page.getByTestId('facility-type-listitem-39');
            const highNoiseCheckbox = page.getByTestId('facility-type-listitem-10');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            const duttonParkGroupStudyRoom = page.getByTestId(PACE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');
            const filterCount = page.getByTestId('space-filter-count').locator('span');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible(); // no filters selected
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // filter to show "Bookable" only
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // panels shown changes
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('1');
            await expect(page.getByTestId('space-space-count')).toContainText('5');

            // add 'Adjustable desks'
            await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toContainText('Adjustable desks');
            await adjustableDeskCheckbox.locator('span input').check();

            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');
            await expect(page.getByTestId('space-space-count')).toContainText('1');

            // add 'High noise'
            await expect(highNoiseCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(highNoiseCheckbox.locator('label:first-of-type')).toContainText('High noise level');
            await highNoiseCheckbox.locator('span input').check();

            // selecting "Adjustable desks" & "High noise" & "Bookable" means none are visible, and the user is notified
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).toBeVisible(); // "no spaces" message
            await expect(architectureBookableSpace).not.toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('3');
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // uncheck "Adjustable desks"
            await adjustableDeskCheckbox.locator('span input').uncheck();
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).not.toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).not.toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');
            await expect(page.getByTestId('space-space-count')).toContainText('1');

            // uncheck other filters and all the Spaces appear
            await bookableCheckbox.locator('span input').uncheck();
            await highNoiseCheckbox.locator('span input').uncheck();

            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible();
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
        });
        test('can filter for open spaces', async ({ page }) => {
            // This test dynamically extracts a date from the mock data and uses it for filtering
            // This makes the test independent of mock data date ranges
            let dateToMatchForFiltering = '2025-08-25'; // fallback if extraction fails

            await page.route('**/bookable_spaces/weekly_hours*', async route => {
                const response = await route.fetch();
                const weeklyHoursData = await response.json();

                // Dynamically extract the first date from the mock data
                if (weeklyHoursData?.locations && weeklyHoursData.locations.length > 0) {
                    const firstLocation = weeklyHoursData.locations[0];
                    if (firstLocation?.departments?.[0]?.weeks?.[0]) {
                        const firstWeek = firstLocation.departments[0].weeks[0];
                        // Get the first day's date from the week object
                        const firstDayData = Object.values(firstWeek)[0] as any;
                        if (firstDayData?.date) {
                            dateToMatchForFiltering = firstDayData.date;
                        }
                    }
                }

                // Set exactly one location (lid 3841) to be currently_open for the extracted date
                if (weeklyHoursData?.locations) {
                    weeklyHoursData.locations.forEach(location => {
                        const isTargetLocation = location?.lid === 3841; // Walter Harrison Law Library
                        if (location && location.departments) {
                            location.departments.forEach(department => {
                                if (department && department.weeks) {
                                    department.weeks.forEach(week => {
                                        Object.entries(week || {}).forEach(([dayName, dayData]) => {
                                            // Only set currently_open for the extracted date
                                            if (dayData && dayData.date === dateToMatchForFiltering && dayData.times) {
                                                dayData.times.currently_open = isTargetLocation;
                                            } else if (dayData && dayData.times) {
                                                // Set all other dates to not currently_open
                                                dayData.times.currently_open = false;
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }

                // Send back the modified response
                await route.fulfill({
                    status: response.status(),
                    headers: response.headers(),
                    body: JSON.stringify(weeklyHoursData),
                });
            });

            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const currentlyOpenCheckbox = page.getByTestId('facility-type-listitem-9999');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // show only 'currently open' spaces
            await expect(currentlyOpenCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(currentlyOpenCheckbox.locator('label:first-of-type')).toContainText('Currently open');
            await currentlyOpenCheckbox.locator('span input').check();

            // Filter should reduce the visible count (one location is marked as currently_open)
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).not.toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
        });
        test('can OR on filters in the same group', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            // setup Ids
            const bookableId = 19;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
            const avEquipmentCheckbox = page.getByTestId('facility-type-listitem-8');
            const byodStationCheckbox = page.getByTestId('facility-type-listitem-32');
            const architectureReferenceSpace = page.getByTestId(ARCH_REFERENCE).locator('h3');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            const duttonParkGroupStudyRoom = page.getByTestId(PACE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');
            const filterCount = page.getByTestId('space-filter-count').locator('span');

            // initially all Spaces are visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).not.toBeVisible(); // no filters selected
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // choose AV equipment
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
            await avEquipmentCheckbox.locator('span input').check();

            // display changes
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                3 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('1');
            await expect(page.getByTestId('space-space-count')).toContainText('3');

            // add byod station, which is in the same group, and MORE appear (because it is an OR)
            await expect(byodStationCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(byodStationCheckbox.locator('label:first-of-type')).toContainText('BYOD station');
            await byodStationCheckbox.locator('span input').check();

            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                5 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('2');
            await expect(page.getByTestId('space-space-count')).toContainText('5');

            // select "EXCLUDE bookable" filter
            await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
            await expect(bookableExcludeCheckboxlabel).toBeVisible();
            await bookableExcludeCheckboxlabel.check();

            // display changes, showing FEWER because the OR is only WITHIN a group
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                2 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).not.toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(page.getByTestId(FOURTH_PANEL).locator('h3')).toBeVisible();
            await expect(filterCount).toBeVisible();
            await expect(filterCount).toContainText('3');
            await expect(page.getByTestId('space-space-count')).toContainText('2');
        });
        test('can unfilter by cartouche', async ({ page }) => {
            await page.goto('');
            await page.setViewportSize({ width: 1300, height: 1000 }); // set size before loading page
            await page.goto('spaces');
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const bookableId = 19;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
            const bookableUnsetCartouche = page.getByTestId(`button-deselect-unselected-${bookableId}`);
            const avEquipmentId = 8;
            const avEquipmentCheckbox = page.getByTestId(`facility-type-listitem-${avEquipmentId}`);
            const avEquipmentUnsetCartouche = page.getByTestId(`button-deselect-selected-${avEquipmentId}`);

            const architectureReferenceSpace = page.getByTestId(ARCH_REFERENCE).locator('h3');
            const architectureBookableSpace = page.getByTestId(ARCH_BOOKABLE).locator('h3');
            const duttonParkGroupStudyRoom = page.getByTestId(PACE).locator('h3');
            const andrewLiverisComputerRoom = page.getByTestId(LIV).locator('h3');

            // there are initially all Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // filter to show "AV equipment" only
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
            await avEquipmentCheckbox.locator('span input').check();

            // only 3 Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                3 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(page.getByTestId('space-space-count')).toContainText('3');

            // cartouche visible
            await expect(avEquipmentUnsetCartouche).toBeVisible();
            await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(1);

            // select "exclude bookable" filter
            await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
            await expect(bookableExcludeCheckboxlabel).toBeVisible();
            await bookableExcludeCheckboxlabel.check();

            // and we are down to 1 showing
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).not.toBeVisible();
            await expect(architectureBookableSpace).not.toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(page.getByTestId('space-space-count')).toContainText('1');

            // cartouche visible
            await expect(avEquipmentUnsetCartouche).toBeVisible();
            await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
            await expect(bookableUnsetCartouche).toBeVisible();
            await expect(bookableUnsetCartouche).toContainText('Bookable');
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);

            // now unfilter using the cartouches
            await avEquipmentUnsetCartouche.click();

            // spaces visible changes
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                4 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).not.toBeVisible();
            await expect(duttonParkGroupStudyRoom).not.toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(page.getByTestId(FOURTH_PANEL).locator('h3')).toBeVisible();
            await expect(page.getByTestId(SIXTH_PANEL).locator('h3')).toBeVisible();
            await expect(page.getByTestId(NINTH_PANEL).locator('h3')).toBeVisible();
            await expect(page.getByTestId('space-space-count')).toContainText('4');

            await bookableUnsetCartouche.click();

            // back to all Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
            await expect(architectureReferenceSpace).toBeVisible();
            await expect(architectureBookableSpace).toBeVisible();
            await expect(duttonParkGroupStudyRoom).toBeVisible();
            await expect(andrewLiverisComputerRoom).toBeVisible();
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();

            // no cartouches left
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
        });
        test('can clear all filters with one click', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const bookableId = 19;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
            const avEquipmentId = 8;
            const avEquipmentCheckbox = page.getByTestId(`facility-type-listitem-${avEquipmentId}`);

            // select some filters
            await avEquipmentCheckbox.locator('span input').check();

            await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
            await expect(bookableExcludeCheckboxlabel).toBeVisible();
            await bookableExcludeCheckboxlabel.check();

            // correct number of cartouches showing
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);
            // correct number of panels showing
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                1 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('space-space-count')).toContainText('1');

            // click deselect-all-cartouches
            await expect(page.getByTestId('button-deselect-all-filters')).toBeVisible();
            await page.getByTestId('button-deselect-all-filters').click();

            // all panels visible
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('space-space-count')).not.toBeVisible();
            // all cartouches removed
            await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
            // no checkboxes checked
            await expect(
                page.getByTestId('sidebarCheckboxes').locator(':scope > *[type="checkbox"]:checked'),
            ).toHaveCount(0);
        });
        test('can filter for capacity', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

            const filterCount = page.getByTestId('space-filter-count').locator('span');
            const spacesCount = page.getByTestId('space-space-count');
            const cartoucheList = page.getByTestId('button-deselect-list'); // buttons at top of the filters to turn them off
            const deselectAllFiltersButton = page.getByTestId('button-deselect-all-filters');
            const minimumCapacityField = page.getByTestId('capacitySlider-inputRight');
            const maximumCapacityField = page.getByTestId('capacitySlider-inputLeft');

            // there are initially all Spaces visible on the page
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible(); // no 'no spaces' warning present
            await expect(filterCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();

            // update minimum to 'at least 10 people'
            await minimumCapacityField.click();
            await minimumCapacityField.clear();
            await minimumCapacityField.fill('10');

            // spaces displayed changes
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                4 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // controls update
            await expect(filterCount).toContainText('1');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(1);
            await expect(spacesCount).toContainText('4');
            await expect(deselectAllFiltersButton).toBeVisible();

            // update maximum to "no more than 20 people"
            await maximumCapacityField.click();
            await maximumCapacityField.clear();
            await maximumCapacityField.fill('20');

            // spaces displayed changes
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                2 + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );

            // controls unchanged
            await expect(filterCount).toContainText('1');
            await expect(cartoucheList.locator(':scope > *')).toHaveCount(1);
            await expect(spacesCount).toContainText('2');
            await expect(deselectAllFiltersButton).toBeVisible();

            // clear the capacity filters
            await page.getByTestId('button-deselect-all-filters').click();

            // the page is reset
            await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(
                VISIBLE_SPACES_COUNT + NUMBER_EXTRA_ELEMENTS_IN_SPACE_LIST,
            );
            await expect(filterCount).not.toBeVisible();
            await expect(spacesCount).not.toBeVisible();
            await expect(cartoucheList).not.toBeVisible();
            await expect(deselectAllFiltersButton).not.toBeVisible();
        });
    });
    test.describe('sidebar filter type group can open-collapse', () => {
        const FILTER_GROUP_SPACE_ROOM_TYPE = 1;
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

        test('sidebar filter type group open-collapse loads correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)
                    .locator('h3')
                    .getByText(/Space\/Room Type/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).not.toBeVisible();

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
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)
                    .locator('h3')
                    .getByText(/Space\/Room Type/),
            ).toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)
                    .locator('ul')
                    .locator(':scope > *'),
            ).toHaveCount(1);

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul li')).toBeVisible();

            // the state of the other groups is known (and won't change after click)
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            await expect(filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toHaveAttribute(
                'aria-expanded',
                'true',
            );
            await expect(filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toHaveAttribute(
                'aria-label',
                'Hide Space/Room Type filter options',
            );

            // collapse the open Space/Room Type group
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();

            // visibility flips
            await expect(filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toHaveAttribute(
                'aria-expanded',
                'false',
            );
            await expect(filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toHaveAttribute(
                'aria-label',
                'Show Space/Room Type filter options',
            );
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul li')).not.toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).not.toBeVisible();
            await expect(expandIcon(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('opening a collapsed sidebar filter type group shows correctly', async ({ page }) => {
            // "on this floor" loads collapsed. Confirm we can open it
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // the group appears as expected
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
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
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
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('ul')
                    .locator(':scope > *'),
            ).toHaveCount(4);

            // the group we opened has completely changed - visibility flips
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul li:first-of-type')).toBeVisible();
            await expect(expandIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).not.toBeVisible();
            await expect(collapseIcon(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('multiple open-collapse sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // sidebar filter types group load open-collapsedness as expected
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // open "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible(); // has changed

            // no change in others
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "space room type" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).not.toBeVisible(); // changed
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "noise level" sidebar filter type roup
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible(); // changed
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-open "space room type" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible(); // NOT
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-collapse "on this floor" sidebar filter type group
            await filterGroupButton(FILTER_GROUP_ON_THIS_FLOOR, page).click();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-expanded-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
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
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
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
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();
            await filterGroupButton(FILTER_GROUP_SPACE_FEATURES, page).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed with single entry', async ({
            page,
        }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-expanded-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // filter to show "Bookable" only; this public group has a single entry
            const bookableId = 19;
            const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
            await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
            await bookableCheckbox.locator('span input').check();

            // while the single-entry group is still open, no collapsed-count is shown
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // collapse the single-entry public group
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();

            // now the collapsed group shows the selected-count summary
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).toHaveText('(1 of 1)');

            // re-open it and the collapsed-count disappears again
            await filterGroupButton(FILTER_GROUP_SPACE_ROOM_TYPE, page).click();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();

            // collapse a few more, to be sure
            await filterGroupButton(FILTER_GROUP_NOISE_LEVEL, page).click();
            await filterGroupButton(FILTER_GROUP_SPACE_FEATURES, page).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
    });
});
test.describe('Spaces errors', () => {
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
        await page.goto('spaces?responseType=weeklyHoursError');
        await expect(page.locator('body').getByText(/Filter Spaces/)).toBeVisible();

        await page.getByTestId(`${ARCH_REFERENCE}-toggle-panel-button`).click();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-weekly-hours-error`)).toBeVisible();
        await expect(page.getByTestId(`${ARCH_REFERENCE}-weekly-hours-error`)).toContainText(
            'General opening hours currently unavailable - please try again later.',
        );
    });
});

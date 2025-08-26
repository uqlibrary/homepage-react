import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

const openCloseWorks = () => {
    test.describe('tests', () => {
        test('can click away to close the dialog', async ({ page }) => {
            await page.getByTestId('hours-accordion-open').click();
            // dialog is open
            await expect(page.getByTestId('locations-wrapper')).toContainText('See all Library and AskUs hours');
            // click elsewhere on the screen
            await page.locator('body').click();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });

        test('clicking the button can open and close the dialog', async ({ page }) => {
            const clickButton = async () => {
                await page.getByTestId('hours-accordion-open').click();
            };
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // open dialog
            await clickButton();

            // confirm dialog is open
            await expect(page.getByTestId('hours-item-askus')).toContainText('AskUs chat hours');
            // re-click button
            await clickButton();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');

            // re-click button
            await clickButton();
            // dialog is open
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

            // re-click button
            await clickButton();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });
        test('clicking the button label can open and close the dialog', async ({ page }) => {
            const clickLabel = async () => {
                const button = await page.getByTestId('hours-accordion-open');
                const box = await button.boundingBox();
                if (box) {
                    await button.click({
                        position: {
                            x: box.width / 2,
                            y: box.height / 2,
                        },
                    });
                }
            };
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // open dialog
            await clickLabel();

            // confirm dialog is open
            await expect(page.getByTestId('hours-item-askus')).toContainText('AskUs chat hours');

            // re-click button
            await clickLabel();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');

            // re-click button
            await clickLabel();
            // dialog is open
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

            // re-click button
            await clickLabel();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });

        test('clicking the button up-down arrow can open and close the dialog', async ({ page }) => {
            const clickChevron = async () => {
                const button = await page.getByTestId('hours-accordion-open');
                const box = await button.boundingBox();
                if (box) {
                    const paddingRight = 10; // Adjust based on your actual padding
                    await button.click({
                        position: {
                            x: box.width - paddingRight / 2,
                            y: box.height / 2,
                        },
                    });
                }
            };
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // open dialog
            await clickChevron();

            // confirm dialog is open
            await expect(page.getByTestId('hours-item-askus')).toContainText('AskUs chat hours');

            // re-click button
            await clickChevron();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');

            // re-click button
            await clickChevron();
            // dialog is open
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

            // re-click button
            await clickChevron();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });

        test('clicking the button map icon can open and close the dialog', async ({ page }) => {
            const clickIcon = async () => await page.getByTestId('hours-accordion-open').click();

            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // open dialog
            await clickIcon();
            // confirm dialog is open
            await expect(page.getByTestId('hours-item-askus')).toContainText('AskUs chat hours');

            // re-click button
            await clickIcon();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');

            // re-click button
            await clickIcon();
            // dialog is open
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

            // re-click button
            await clickIcon();
            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });

        test('escape key can close the dialog', async ({ page }) => {
            // open dialog
            await page.getByTestId('hours-accordion-open').click();

            // confirm dialog is open
            await expect(page.getByTestId('locations-wrapper')).toContainText('all Library and AskUs hours');

            // click escape key to close dialog
            await page.getByTestId('locations-wrapper').focus();
            await page.keyboard.press('Escape');

            // dialog is closed
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
        });
    });
};

test.describe('Locations Panel', () => {
    test('loads as expected', async ({ page }) => {
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await page.getByTestId('hours-accordion-open').click();

        // the expected content is found on the page
        await expect(page.getByTestId('hours-item-arch-music')).toContainText('Architecture and Music');

        // at desktop hours are displayed
        await expect(page.getByTestId('location-item-arch-music-hours')).toContainText('7:30am - 7:30pm');
        await expect(page.getByTestId('locations-hours-disclaimer')).toContainText('Student and staff hours');
        await expect(page.getByTestId('hours-item-askus-link')).toContainText('AskUs chat hours');

        // there is a gap above the askus link
        const panel = page.getByTestId('locations-panel-content');
        const gattonBottom = await panel
            .locator('[data-testid="hours-item-gatton"] a')
            .evaluate(el => el.getBoundingClientRect().top + el.offsetHeight);
        const lawBox = await panel.locator('[data-testid="hours-item-law"] a').evaluate(el => {
            return {
                top: el.getBoundingClientRect().top,
                bottom: el.getBoundingClientRect().top + el.offsetHeight,
            };
        });

        const askusTop = await panel
            .locator('[data-testid="hours-item-askus"] a')
            .evaluate(el => el.getBoundingClientRect().top);

        // law is below gatton and askus is below law
        expect(lawBox.top).toBeGreaterThan(gattonBottom);
        expect(askusTop).toBeGreaterThan(lawBox.bottom);
        // the gap between gatton and law is smaller than the gap between askus and law
        const spaceBetweenGattonAndLaw = lawBox.top - gattonBottom;
        const spaceBetweenLawAndAskus = askusTop - lawBox.bottom;
        expect(spaceBetweenLawAndAskus).toBeGreaterThan(spaceBetweenGattonAndLaw * 1.5);
        // just rough "distinct difference" rather than precise number
    });
    test.describe('Accessibility', () => {
        test('200 is Accessible', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('hours-accordion-open').click();

            // dialog has loaded correctly
            await expect(
                page
                    .locator('a[data-testid="hours-item-arch-music-link"]')
                    .getByText(/Architecture and Music/)
                    .first(),
            ).toBeVisible();

            await assertAccessibility(page, 'div[data-testid="locations-panel"]');
        });
        test('error is Accessible', async ({ page }) => {
            await page.goto('/?responseType=error');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('hours-accordion-open').click();

            // dialog has loaded correctly
            await expect(
                page
                    .getByTestId('locations-error')
                    .getByText(
                        /We can't load opening hours or how busy Library spaces are right now\. Please refresh your browser or try again later\./,
                    )
                    .first(),
            ).toBeVisible();

            await assertAccessibility(page, 'div[data-testid="locations-panel"]');
        });
    });
    test.describe('loading 200', () => {
        test('at tablet size the hours column is not displayed', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 414, height: 736 });

            await page.getByTestId('hours-accordion-open').click();

            // name shows, hours does not, busy appears
            // assume if columns are right in this row then are other rows are right
            await expect(
                page
                    .getByTestId('hours-item-arch-music-link')
                    .getByText(/Architecture/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('location-item-arch-music-hours')).not.toBeVisible();
            await expect(page.locator('[data-testid="hours-item-busy-arch-music"] span').first()).toHaveAttribute(
                'aria-valuenow',
                '85',
            );

            let retry = false;
            await expect(async () => {
                if (retry) {
                    await page.setViewportSize({ width: 800, height: 736 });
                    await page.waitForTimeout(500);
                    await page.setViewportSize({ width: 414, height: 736 });
                }
                retry = true;
                // askus hidden (it only has hours, no point having the row with no hours)
                await expect(page.getByTestId('locations-hours-disclaimer')).not.toBeVisible({ timeout: 500 });
                // hours disclaimer hidden (if no hours displayed, then no point in disclaimer)
                await expect(page.getByTestId('hours-item-askus-link')).not.toBeVisible({ timeout: 500 });
            }).toPass();
        });
        test.describe('the open Locations panel butts up against the Utility bar', () => {
            test('at very wide desktop', async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 2300, height: 800 });
            });
            test('at wide desktop', async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 1300, height: 800 });
            });
            test('at minimal desktop', async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 1000, height: 800 });
            });
            test('at tablet landscape', async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 800, height: 600 });
            });
            test('at tablet portrait', async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 600, height: 800 });
            });
            test.afterEach(async ({ page }) => {
                await page.getByTestId('hours-accordion-open').click();

                await expect(page.getByTestId('homepage-hours-weeklyhours-link')).toContainText(
                    'See all Library and AskUs hours',
                );

                const utilityBarBottom = await page
                    .getByTestId('hours-accordion-open')
                    .locator('..')
                    .evaluate(el => el.getBoundingClientRect().top + el.offsetHeight);

                const locationsPanelTop = await page
                    .getByTestId('locations-panel')
                    .evaluate(el => el.getBoundingClientRect().top);
                expect(utilityBarBottom - locationsPanelTop).toBeLessThan(0.02);

                // test fails? drop this in the webpage console to get the change:
                // const utilityBar = document.querySelector('[data-testid="utility-bar-button-wrapper"]');
                // const locationPanel = document.querySelector('[data-testid="locations-panel"]');
                // const utilityBarBoundingBox = utilityBar.getBoundingClientRect();
                // const utilityBarBottom = utilityBarBoundingBox.top + utilityBarBoundingBox.height;
                // const locationPanelBoundingBox = locationPanel.getBoundingClientRect();
                // const diff = utilityBarBottom - locationPanelBoundingBox.top;
                // console.log('change `top` of StyledStandardCard in Locations.js by ', diff, 'px');
            });
        });
        test('can navigate to weekly hours page from the library name cell', async ({ page }) => {
            await page.route(/architecture-and-music-library/, route => {
                route.fulfill({
                    status: 200,
                    body: 'user has navigated to Drupal hours page',
                });
            });
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('hours-accordion-open').click();

            await page
                .locator('a[data-testid="hours-item-arch-music-link"]')
                .getByText(/Architecture and Music/)
                .click();

            await expect(page.getByText(/user has navigated to Drupal hours page/)).toBeVisible();
        });
        test('can navigate to book a room page', async ({ page }) => {
            await page.route(/uqbookit/, route => {
                route.fulfill({
                    status: 200,
                    body: 'user has navigated to Bookit page',
                });
            });
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('homepage-hours-bookit-link')).toHaveText(/Book a room/);
            await page.getByTestId('homepage-hours-bookit-link').click();
            await expect(
                page
                    .locator('body')
                    .getByText(/user has navigated to Bookit page/)
                    .first(),
            ).toBeVisible();
        });
        test('shows the expected values', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // the dialog is closed initially
            await expect(page.getByTestId('hours-accordion-open')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('inert', 'true');

            // open the dialog
            await page.getByTestId('hours-accordion-open').click();

            // the dialog is open
            await expect(page.getByTestId('hours-accordion-open')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');
            await expect(page.getByTestId('locations-wrapper')).not.toHaveAttribute('inert', /.*/);

            // content displayed correctly
            await expect(
                page
                    .locator('[data-testid="hours-item-arch-music"] > div:first-child')
                    .getByText(/Architecture and Music/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-arch-music"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The Architecture and Music Library study space is open 7:30am to 7:30pm. This space is currently very busy.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-arch-music"] > div:nth-child(2)')
                    .getByText(/7:30am - 7:30pm/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-arch-music"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-valuenow', '85');
            await expect(
                page.locator('[data-testid="hours-item-arch-music"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-label', 'Very busy');

            await expect(
                page
                    .locator('[data-testid="hours-item-biol-sci"] > div:first-child')
                    .getByText(/Biological Sciences/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-biol-sci"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The Biological Sciences Library study space is open 24 hours. This space is currently moderately busy.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-biol-sci"] > div:nth-child(2)')
                    .getByText(/24 Hours/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-biol-sci"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-valuenow', '48');
            await expect(
                page.locator('[data-testid="hours-item-biol-sci"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-label', 'Moderately busy');

            await expect(
                page
                    .locator('[data-testid="hours-item-central"] > div:first-child')
                    .getByText(/Central/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-central"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The Central Library study space is open 24 hours. This space is currently not busy.',
            );

            await expect(
                page
                    .locator('[data-testid="hours-item-central"] > div:nth-child(2)')
                    .getByText(/24 Hours/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-central"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-valuenow', '5');
            await expect(
                page.locator('[data-testid="hours-item-central"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-label', 'Not busy');

            await expect(
                page
                    .locator('[data-testid="hours-item-duhig-study"] > div:first-child')
                    .getByText(/Duhig Tower/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-duhig-study"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The Duhig Tower Library study space is open 24 hours.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-duhig-study"] > div:nth-child(2)')
                    .getByText(/24 Hours/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-duhig-study"] > div:nth-child(3) div.occupancyText')
                    .getByText(/Data not available/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-dutton-park"] > div:first-child')
                    .getByText(/Dutton Park Health Sciences/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-dutton-park"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The Dutton Park Health Sciences Library study space is open 7am to 10:30am.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-dutton-park"] > div:nth-child(2)')
                    .getByText(/7am - 10:30am/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-dutton-park"] > div:nth-child(3) div.occupancyText'),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-dutton-park"] > div:nth-child(3) div.occupancyText')
                    .getByText(/Closed/)
                    .first(),
            ).toBeVisible();

            await expect(
                page
                    .locator('[data-testid="hours-item-gatton"] > div:first-child')
                    .getByText(/JK Murray \(UQ Gatton\)/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-gatton"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'The JK Murray Library study space is open 24 hours.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-gatton"] > div:nth-child(2)')
                    .getByText(/24 Hours/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-gatton"] > div:nth-child(3) div.occupancyText'),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-gatton"] > div:nth-child(3) div.occupancyText')
                    .getByText(/Data not available/)
                    .first(),
            ).toBeVisible();

            await expect(
                page
                    .locator('[data-testid="hours-item-law"] > div:first-child')
                    .getByText(/Walter Harrison Law/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-law"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'Click through to the location page for the Walter Harrison Law Library hours and busy level.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-law"] > div:nth-child(2)')
                    .getByText(/See location/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-law"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-valuenow', '51');
            await expect(
                page.locator('[data-testid="hours-item-law"] > div:nth-child(3) span').first(),
            ).toHaveAttribute('aria-label', 'Quite busy');

            await expect(page.locator('[data-testid="hours-item-fryer"] > div:first-child')).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-fryer"] > div:first-child')
                    .getByText(/Fryer/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-fryer"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'Fryer Library study space is open by appointment.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-fryer"] > div:nth-child(2)')
                    .getByText(/By appointment/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-fryer"] > div:nth-child(3) div.occupancyText'),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="hours-item-fryer"] > div:nth-child(3) div.occupancyText')
                    .getByText(/By appointment/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-fryer"] > div:nth-child(3)')).toBeVisible();

            await expect(
                page
                    .locator('[data-testid="hours-item-askus"] > div:first-child')
                    .getByText(/AskUs chat hours/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="hours-item-askus"] > div:first-child a')).toHaveAttribute(
                'aria-label',
                'AskUs chat assistance operating hours today is open 8am to 8pm.',
            );
            await expect(
                page
                    .locator('[data-testid="hours-item-askus"] > div:nth-child(2)')
                    .getByText(/8am - 8pm/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="hours-item-askus"] > div:nth-child(3) div.occupancyWrapper'),
            ).toBeEmpty();

            // close the dialog
            await page.getByTestId('hours-accordion-open').click();
            // everything now shows the dialog is closed
            await expect(page.getByTestId('hours-accordion-open')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
            await expect(page.getByTestId('locations-wrapper')).toHaveAttribute('inert', 'true');
        });

        // whitty is manually removed - test this is actually happening!
        test('data is removed correctly', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('hours-accordion-open').click();
            // dialog is open
            await expect(
                page
                    .getByTestId('homepage-hours-weeklyhours-link')
                    .getByText(/See all Library and AskUs hours/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('hours-item-whitty-mater')).not.toBeVisible();
        });

        test.describe('all close methods work', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto('/');
                await page.setViewportSize({ width: 1300, height: 1000 });
            });

            openCloseWorks();
        });
    });
    test.describe('handles an error as expected', () => {
        test('loads correctly', async ({ page }) => {
            await page.goto('/?responseType=error');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('hours-accordion-open').click();

            // the expected content is found on the page
            await expect(page.getByTestId('locations-error')).toContainText(
                "We can't load opening hours or how busy Library spaces are right now. Please refresh your browser or try again later.",
            );
        });

        test.describe('all close methods work', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto('/?responseType=error');
                await page.setViewportSize({ width: 1300, height: 1000 });
            });
            openCloseWorks();
        });
    });
});

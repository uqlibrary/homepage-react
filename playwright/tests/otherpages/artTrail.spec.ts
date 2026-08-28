import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import type { Page } from '@playwright/test';

// Art Trail is a standalone section: it carries its own look and feel, so App renders it without the shared
// Library chrome (the header, footer and alerts every other route is wrapped in). This is the scaffold the
// section's pages will be built out from.

const trailPages = [
    { heading: /Indigenous art and Library discovery trail/i, infoButtons: 0, locationButtons: 0 },
    { heading: /Hector Tijupuru Burton/, infoButtons: 1, locationButtons: 1 },
    { heading: /Lily Kelly Napangardi/, infoButtons: 1, locationButtons: 1 },
    { heading: /Gloria Tamerre Petyarre/, infoButtons: 1, locationButtons: 1 },
    { heading: /Johnny Yungut Tjupurrula/, infoButtons: 1, locationButtons: 1 },
    { heading: /Nora Wompi Nungurrayi/, infoButtons: 2, locationButtons: 2 },
    { heading: /Craig Koomeeta/, infoButtons: 1, locationButtons: 1 },
    { heading: /Megan Cope/, infoButtons: 1, locationButtons: 1 },
    { heading: /Brian Robinson/, infoButtons: 1, locationButtons: 1 },
    {
        heading: /Exploring Aboriginal and Torres Strait Islander stories/,
        infoButtons: 0,
        locationButtons: 0,
    },
];

const openTrailPage = async (page: Page, pageIndex: number) => {
    await page.getByRole('button', { name: 'open navigation menu' }).click();
    await page.getByRole('menuitem').nth(pageIndex).click();
    await expect(page.getByRole('heading', { name: trailPages[pageIndex].heading })).toBeVisible();
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(page.locator('#art-trail-tabpanel-trail [data-testid="pageContent"]:visible')).toHaveCount(1);
};

const toggleEveryAccordion = async (page: Page) => {
    const controls = page.locator('#art-trail-tabpanel-trail [data-testid="pageContent"]:visible [aria-expanded]');
    const controlTargets = await controls.evaluateAll(elements =>
        elements.map(element => element.getAttribute('aria-controls')).filter((target): target is string => !!target),
    );
    expect(controlTargets.length).toBeGreaterThan(0);
    const targetOccurrences = new Map<string, number>();

    for (const target of controlTargets) {
        const occurrence = targetOccurrences.get(target) ?? 0;
        const control = page.locator(`[aria-controls="${target}"]`).nth(occurrence);
        targetOccurrences.set(target, occurrence + 1);
        const initiallyExpanded = await control.getAttribute('aria-expanded');

        await control.click();
        await expect(control).toHaveAttribute('aria-expanded', initiallyExpanded === 'true' ? 'false' : 'true');
        await control.click();
        await expect(control).toHaveAttribute('aria-expanded', initiallyExpanded ?? 'false');
    }
};

const openEveryDrawer = async (page: Page, name: string, expectedCount: number) => {
    const buttons = page.getByRole('button', { name });
    const drawer = page.locator('.MuiDrawer-paper');
    await expect(buttons).toHaveCount(expectedCount);

    for (let index = 0; index < expectedCount; index += 1) {
        await buttons.nth(index).click();
        await expect(drawer).toBeVisible();
        await expect(drawer.getByRole('heading')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(drawer).toBeHidden();
    }
};

test.describe('Art Trail', () => {
    test.describe('renders the landing page', () => {
        test('renders the Art Trail landing page in the shared Library chrome', async ({ page }) => {
            await page.goto('/art-trail');

            await expect(
                page.getByRole('heading', {
                    name: 'Welcome to the Indigenous Art and Library Discovery Trail at the University of Queensland Library.',
                }),
            ).toBeVisible();
            await expect(page.getByRole('button', { name: 'Launch Web App' })).toBeVisible();
            await expect(page.getByRole('img', { name: 'Indigenous Art and Library Discovery Trail' })).toBeVisible();

            await expect(page.locator('uq-header')).toHaveCount(1);
            await expect(page.locator('uq-footer')).toHaveCount(1);
            await expect(page.getByRole('region', { name: 'Site content' })).toBeVisible();

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            const availableScreen = await page.evaluate(() => ({
                width: screen.availWidth,
                height: screen.availHeight,
            }));
            const popupPromise = page.waitForEvent('popup');

            await page.getByRole('button', { name: 'Launch Web App' }).click();

            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded');

            await expect(popup).toHaveURL(/\/art-trail\/app$/);
            expect(await popup.evaluate(() => ({ width: outerWidth, height: outerHeight }))).toEqual(availableScreen);

            await popup.close();
        });
    });
    test.describe('renders the app', () => {
        test('renders on its own, without the shared Library chrome', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');

            await expect(page.getByTestId('art-trail-app')).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Indigenous art and Library discovery trail' }),
            ).toBeVisible();

            // The chrome App wraps every other route in is absent here.
            await expect(page.locator('uq-header')).toHaveCount(0);
            await expect(page.locator('uq-footer')).toHaveCount(0);
            await expect(page.getByRole('region', { name: 'Site content' })).toHaveCount(0);

            await assertAccessibility(page, '[data-testid="art-trail-app"]');
        });
    });
    test.describe('renders the app pages', () => {
        trailPages.forEach(({ infoButtons, locationButtons }, pageIndex) => {
            test(`page ${pageIndex + 1} supports its interactive content`, async ({ page }) => {
                await page.goto('/art-trail/app?user=public');
                await openTrailPage(page, pageIndex);

                await toggleEveryAccordion(page);
                await openEveryDrawer(page, 'More information about this artwork', infoButtons);
                await openEveryDrawer(page, 'Location information about this artwork', locationButtons);
                await assertAccessibility(page, '#art-trail-tabpanel-trail');
            });
        });

        test('opens a map POI and follows its artwork link', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');
            await page.getByRole('button', { name: 'Map' }).click();

            const marker = page.getByRole('button', { name: 'Sand Hills, Duhig Tower, Level 1' });
            await expect(marker).toBeVisible();
            await marker.focus();
            await page.keyboard.press('Enter');

            const closePopupButton = page.getByRole('button', { name: 'Close popup' });
            const artworkLink = page
                .getByTestId('mazemap-container')
                .getByRole('link', { name: /Lily Kelly Napangardi/ });
            await expect(artworkLink).toBeFocused();

            await marker.focus();
            await page.keyboard.press('Shift+Tab');
            await expect(closePopupButton).toBeFocused();

            const nextMarker = page.getByRole('button', {
                name: 'Devil Mountain Lizard Dreaming, Duhig Tower, Level 1',
            });
            await nextMarker.focus();
            await page.keyboard.press('Enter');
            await expect(
                page.getByTestId('mazemap-container').getByRole('link', { name: /Gloria Tamerre Petyarre/ }),
            ).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(closePopupButton).not.toBeVisible();
            await expect(nextMarker).toBeFocused();

            await marker.focus();
            await page.keyboard.press('Space');
            await expect(artworkLink).toBeFocused();

            await expect(artworkLink).toBeVisible();
            await artworkLink.click();

            await expect(page.getByRole('heading', { name: trailPages[2].heading })).toBeVisible();
        });

        test('plays and stops audio on the Welcome and Continue Your Journey pages', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');

            for (const pageIndex of [0, 9]) {
                await openTrailPage(page, pageIndex);
                await page.getByRole('button', { name: 'Play Listen to this page', exact: true }).click();
                await expect(page.getByRole('button', { name: 'Stop Listen to this page' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Stop Listen to this page' })).toBeFocused();
                await expect(page.getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
                await expect
                    .poll(async () => Number(await page.getByTestId('audio-progress').getAttribute('aria-valuenow')))
                    .toBeGreaterThan(0);
                await page.getByRole('button', { name: 'Stop Listen to this page' }).click();
                await expect(page.getByRole('button', { name: 'Replay Listen to this page' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Replay Listen to this page' })).toBeEnabled();
                await page.getByRole('button', { name: 'Replay Listen to this page' }).click();
                await expect(page.getByRole('button', { name: 'Play Listen to this page', exact: true })).toBeFocused();
                await expect(page.getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
            }
        });

        test('navigates between pages with the hamburger menu', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');

            await openTrailPage(page, 5);
            await openTrailPage(page, 9);
        });

        test('moves focus from Start the trail to the heading after Space-key navigation', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');
            const startButton = page.getByRole('button', { name: 'Start the trail' });
            await startButton.evaluate(button => {
                const trackedWindow = window as typeof window & { startTrailButton?: Element };
                trackedWindow.startTrailButton = button;
            });

            await startButton.focus();
            await page.keyboard.press('Space');

            const heading = page.getByRole('heading', { level: 1, name: trailPages[1].heading });
            expect(
                await page.evaluate(() => {
                    const trackedWindow = window as typeof window & { startTrailButton?: Element };
                    return trackedWindow.startTrailButton?.isConnected;
                }),
            ).toBe(false);
            await expect(heading).toBeFocused();
            await expect(page.getByRole('button', { name: 'Next page' })).not.toBeFocused();
        });
    });
});

import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import type { Page } from '@playwright/test';

// Art Trail is a standalone section: it carries its own look and feel, so App renders it without the shared
// Library chrome (the header, footer and alerts every other route is wrapped in).

const youtubeEmbedSelector = 'iframe[src*="youtube.com/embed"]';
const artTrailAccessibilityOptions = { excludedSelectors: [youtubeEmbedSelector] };

const trailPages = [
    { heading: /Indigenous art and Library discovery trail/i, infoButtons: 0, locationButtons: 0 },
    { heading: /Hector Tjupuru Burton/, infoButtons: 1, locationButtons: 1 },
    { heading: /Lily Kelly Napangardi/, infoButtons: 1, locationButtons: 1 },
    { heading: /Gloria Tamerre Petyarre/, infoButtons: 1, locationButtons: 1 },
    { heading: /Johnny Yungut Tjupurrula/, infoButtons: 1, locationButtons: 1 },
    { heading: /Nora Wompi Nungurrayi/, infoButtons: 2, locationButtons: 2 },
    { heading: /Craig Koomeeta/, infoButtons: 1, locationButtons: 1 },
    { heading: /Megan Cope/, infoButtons: 1, locationButtons: 1 },
    { heading: /Brian Robinson/, infoButtons: 1, locationButtons: 1 },
    {
        heading: /Continue your journey/,
        infoButtons: 0,
        locationButtons: 0,
    },
];

const openTrailPage = async (page: Page, pageIndex: number) => {
    await page.getByRole('button', { name: 'open navigation menu' }).click();
    await assertAccessibility(page, '[data-testid="artTrailMenu"]');
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

        /* the YT iframe has accessibility issues we cannot fix ourselves, so for this
        test simply test directly the element is in the page, and exclude the element
        from the accessibility check */
        const youtubeEmbeds = page.locator(`[id="${target}"]`).locator(youtubeEmbedSelector);
        for (let index = 0; index < (await youtubeEmbeds.count()); index += 1) {
            await expect(youtubeEmbeds.nth(index)).toHaveAttribute('title', /\S+/);
        }

        await control.click();
        await expect(control).toHaveAttribute('aria-expanded', initiallyExpanded ?? 'false');
        await assertAccessibility(page, '[data-testid="art-trail-app"]', artTrailAccessibilityOptions);
    }
};

const openEveryDrawer = async (page: Page, name: RegExp, expectedCount: number) => {
    const buttons = page.getByRole('button', { name });
    const drawer = page.locator('.MuiDrawer-paper');
    await expect(buttons).toHaveCount(expectedCount);

    for (let index = 0; index < expectedCount; index += 1) {
        await buttons.nth(index).click();
        await expect(drawer).toBeVisible();
        await assertAccessibility(page, '[data-testid="art-trail-information-drawer"]');
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
                await openEveryDrawer(page, /^More information about /, infoButtons);
                await openEveryDrawer(page, /^Location information about /, locationButtons);
                await assertAccessibility(page, '#art-trail-tabpanel-trail', artTrailAccessibilityOptions);
            });
        });

        test('opens a map POI and follows its artwork link', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');
            await page.getByRole('button', { name: 'Map' }).click();

            const marker = page.getByRole('button', { name: 'Sand Hills, Duhig Tower, Level 1' });

            await assertAccessibility(page, '[data-testid="art-trail-app"]');

            await expect(marker).toBeVisible();
            await marker.focus();
            await page.keyboard.press('Enter');

            const closePopupButton = page.getByRole('button', { name: 'Close popup' });

            await assertAccessibility(page, '[data-testid="art-trail-app"]');

            const artworkLink = page
                .getByTestId('mazemap-container')
                .getByRole('link', { name: /Lily Kelly Napangardi/ });
            await expect(artworkLink).toBeFocused();

            await page.keyboard.press('Tab');
            await expect(closePopupButton).toBeFocused();

            await page.keyboard.press('Escape');
            await expect(closePopupButton).not.toBeVisible();
            await expect(marker).toBeFocused();

            const nextMarker = page.getByRole('button', {
                name: 'Devil Mountain Lizard Dreaming, Duhig Tower, Level 1',
            });
            await nextMarker.focus();
            await page.keyboard.press('Enter');
            await expect(
                page.getByTestId('mazemap-container').getByRole('link', { name: /Gloria Tamerre Petyarre/ }),
            ).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(nextMarker).toBeFocused();

            await marker.focus();
            await page.keyboard.press('Space');
            await expect(artworkLink).toBeFocused();

            await page.keyboard.press('Enter');

            await expect(page.getByRole('heading', { name: trailPages[2].heading })).toBeVisible();
        });

        test('plays and stops audio on the Welcome and Continue Your Journey pages', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');

            for (const pageIndex of [0, 9]) {
                await openTrailPage(page, pageIndex);
                await page.getByRole('button', { name: 'Play audio', exact: true }).click();
                await expect(page.getByRole('button', { name: 'Stop audio playback' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Stop audio playback' })).toBeFocused();
                await expect(page.getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
                await expect
                    .poll(async () => Number(await page.getByTestId('audio-progress').getAttribute('aria-valuenow')))
                    .toBeGreaterThan(0);
                await page.getByRole('button', { name: 'Stop audio playback' }).click();
                await expect(page.getByRole('button', { name: 'Reset audio playback' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Reset audio playback' })).toBeEnabled();
                await page.getByRole('button', { name: 'Reset audio playback' }).click();
                await expect(page.getByRole('button', { name: 'Play audio', exact: true })).toBeFocused();
                await expect(page.getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
            }
        });

        test('navigates between pages with the hamburger menu', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');

            await openTrailPage(page, 5);
            await openTrailPage(page, 9);
        });

        test('focuses the initial heading and announces later navigation', async ({ page }) => {
            await page.goto('/art-trail/app?user=public');
            const startButton = page.getByRole('button', { name: 'Start the trail' });
            const announcement = page.getByTestId('aria-announcement');
            const initialHeading = page.getByRole('heading', {
                level: 1,
                name: trailPages[0].heading,
            });

            await expect(announcement).toHaveCount(1);
            await expect(announcement).toBeEmpty();
            await expect(initialHeading).toBeFocused();

            await startButton.focus();
            await page.keyboard.press('Space');

            await expect(announcement).toHaveText(/Hector Tjupuru Burton/);
            await expect(page.getByRole('heading', { level: 1, name: trailPages[1].heading })).not.toBeFocused();

            await page.getByRole('button', { name: 'Map' }).click();

            await expect(announcement).toHaveText('Art Trail Map of St Lucia campus');
            await expect(announcement).toHaveCount(1);
        });
    });
});

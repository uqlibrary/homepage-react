import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Account panel', () => {
    test.describe('General', () => {
        test('shows relevant links for account user', async ({ page }) => {
            await page.goto('http://localhost:2020/');
            await page.setViewportSize({ width: 1280, height: 900 });

            // once the page has loaded for a UQ user, check if all required links are shown.
            await expect(
                page
                    .getByTestId('catalogue-panel')
                    .getByText('Your library account')
                    .first(),
            ).toBeVisible();

            await expect(
                page
                    .getByTestId('catalogue-panel-content')
                    .getByText('Loans (1)')
                    .first(),
            ).toBeVisible();
        });
        test('displays no Requests on an error correctly', async ({ page }) => {
            await page.goto('http://localhost:2020/?user=s1111111&responseType=almaError');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(
                page
                    .getByTestId('show-requests')
                    .getByText(/Requests/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('show-requests')).not.toHaveText(/\(/);
            await expect(page.getByTestId('show-loans')).not.toHaveText(/\(/);
            await expect(page.getByTestId('show-papercut')).not.toHaveText(/\(/);
        });
    });
    test.describe('is accessible', () => {
        test('on load', async ({ page }) => {
            await page.goto('/?user=s1111111');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(
                page
                    .getByTestId('show-searchhistory')
                    .getByText(/Search history/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="account-panel"]');
        });
        test('when papercut menu is open', async ({ page }) => {
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('papercut-menu-button')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('papercut-menu-button').click();
            await expect(
                page
                    .getByTestId('papercut-item-button-1')
                    .getByText(/Top up/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="account-panel"]');
        });
        test('when papercut menu is open to error', async ({ page }) => {
            await page.goto('http://localhost:2020/?responseType=almaError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('papercut-menu-button')
                    .getByText(/Print balance/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('papercut-menu-button').click();
            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="account-panel"]');
        });
    });
    test.describe('Papercut', () => {
        async function openPapercutPopup(page: Page) {
            // center where the menu will be
            await page.getByTestId('show-searchhistory').scrollIntoViewIfNeeded();
            // print balance button is on screen
            await expect(page.getByTestId('papercut-menu-button')).toHaveText(/Print balance/);
            await page.getByTestId('papercut-menu-button').click();
            await expect(page.getByTestId('papercut-menu')).toBeVisible();
        }

        test('Personalised panel print menu can open', async ({ page }) => {
            await page.goto('/?user=s1111111');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('homepage-user-greeting')
                    .getByText(/Michael/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More about your printing account/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-item-button-1')
                    .getByText(/Top up your print balance - \$5/)
                    .first(),
            ).toBeVisible();
        });

        test('Personalised panel print menu can close with escape key', async ({ page }) => {
            await page.goto('/?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('homepage-user-greeting')
                    .getByText(/UQ/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More about your printing account/)
                    .first(),
            ).toBeVisible();

            // papercut menu closes by user tapping the escape key
            await page.locator('body').press('Escape');

            // "More about your printing account" link is no longer available
            await expect(page.getByTestId('papercut-item-button-4')).not.toBeVisible();
        });

        test('Personalised panel print menu can close with button click', async ({ page }) => {
            await page.goto('/?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('homepage-user-greeting')
                    .getByText(/UQ/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More about your printing account/)
                    .first(),
            ).toBeVisible();

            // papercut menu closes by user reclicking the open button
            await page.getByTestId('papercut-menu-button').click();

            // "More about your printing account" link is no longer available
            await expect(page.getByTestId('papercut-item-button-4')).not.toBeVisible();
        });

        test('Personalised panel print menu can close with a click away', async ({ page }) => {
            await page.goto('/?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('homepage-user-greeting')
                    .getByText(/UQ/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More about your printing account/)
                    .first(),
            ).toBeVisible();

            // papercut menu closes by user clicking somewhere else in the window
            await page.getByTestId('homepage-user-greeting').click();

            // "More about your printing account" link is no longer available
            await expect(page.getByTestId('papercut-item-button-4')).not.toBeVisible();
        });

        test('can navigate to papercut manage page', async ({ page }) => {
            await page.route(/your-printing-account/, async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'text/plain',
                    body: 'papercut info page',
                });
            });

            await page.goto('/?user=emcommunity');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('homepage-user-greeting')
                    .getByText(/Community/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await page
                .locator('li[data-testid="papercut-item-button-4"]')
                .getByText(/More about your printing account/)
                .first()
                .click();
            await expect(
                page
                    .locator('body')
                    .getByText(/papercut info page/)
                    .first(),
            ).toBeVisible();
        });

        test('can navigate to papercut topup page', async ({ page }) => {
            await page.route(/payments.uq.edu.au/, async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'text/plain',
                    body: 'papercut topup page',
                });
            });

            await page.goto('/?user=s1111111');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('papercut-print-balance')
                    .getByText(/12\.50/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await page
                .getByTestId('papercut-item-button-1')
                .getByText(/Top up your print balance/)
                .first()
                .click();
            await expect(
                page
                    .locator('body')
                    .getByText(/papercut topup page/)
                    .first(),
            ).toBeVisible();
        });

        test('top up items dont appear on error', async ({ page }) => {
            // if we don't get a print balance entry, we lack the details to send them through
            await page.goto('http://localhost:2020/?user=s1111111&responseType=almaError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('show-requests')
                    .getByText(/Requests/)
                    .first(),
            ).toBeVisible();

            await openPapercutPopup(page);

            await expect(
                page
                    .getByTestId('papercut-item-button-4')
                    .getByText(/More about your printing account/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('papercut-item-button-1')).not.toBeVisible();
        });
    });
});

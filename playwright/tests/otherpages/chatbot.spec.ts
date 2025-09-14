import { test, expect, Page } from '@uq/pw/test';

test.describe('Chatbot', () => {
    const loadPage = async (page: Page) => {
        await expect(async () => {
            await page.goto('chatbot.html', { timeout: 60_000 });
            await expect(page.locator('.webchat').first()).toBeVisible({ timeout: 30_000 });
            // ideally we wouldn't test the specific text here, because ITS controls it, not us
            // _but it wont pass without it_
            // (and I think it is pretty fixed now)
            await expect(
                page
                    .locator('.webchat')
                    .getByText('I work in a question and answer format') // these words appear in the "bubble" the chatbot presents to the user
                    .first(),
            ).toBeVisible();
        }).toPass();
        await page.setViewportSize({ width: 1300, height: 1000 });
    };

    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test.describe('chatbot', () => {
        test('works as expected', async ({ page }) => {
            await loadPage(page);

            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).not.toBeNull(); // for comparison with other test
        });
    });

    test.describe('chatbot without session storage', () => {
        const testCookieName = 'SESSIONSTORAGE_BLOCKED';
        test.beforeEach(async ({ page, context }) => {
            await context.addCookies([
                {
                    name: testCookieName,
                    value: 'active',
                    url: 'http://localhost',
                },
            ]);
            await loadPage(page);
        });
        test('works without session storage', async ({ page, context }) => {
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === testCookieName);
            expect(cookie).toBeDefined();

            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).toBeNull();
        });
    });
});

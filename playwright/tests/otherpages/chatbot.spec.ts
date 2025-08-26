import { test, expect, Page } from '@uq/pw/test';

test.describe('Chatbot', () => {
    const loadPage = async (page: Page) => {
        await page.goto('chatbot.html');
        await expect(async () => await expect(page.locator('article').first()).toBeVisible()).toPass();
        await page.setViewportSize({ width: 1300, height: 1000 });
    };

    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test.describe('chatbot', () => {
        test.beforeEach(async ({ page }) => await loadPage(page));
        test('works as expected', async ({ page }) => {
            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).not.toBeNull();
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

            expect(await page.locator('article').count()).toBeGreaterThan(0);
            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).toBeNull();
        });
    });
});

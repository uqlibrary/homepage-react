import { Page, expect, Locator } from '../test';
import { BrowserContext } from '@uq/pw/test';

export const getOpenedLink = async (context: BrowserContext, locator: Locator) => {
    const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()]);
    return newPage;
};

export async function mockXHRResponse(
    page: Page,
    url: string | RegExp | ((url: URL) => boolean),
    status = 200,
    body = '',
) {
    await page.route(url, route =>
        route.fulfill({
            status,
            body,
        }),
    );
}

export async function removeVpnNeededToast(page: Page) {
    try {
        await page.evaluate(() => document.querySelector('[data-testid="vpn-needed-toast"]')?.remove());
    } catch {
        /* empty */
    }
}

export async function mockReusable(page: Page) {
    await mockXHRResponse(page, 'https://assets.library.uq.edu.au/reusable-webcomponents/**');
}

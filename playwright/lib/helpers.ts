import { BrowserContext, Page, Locator, expect } from '@uq/pw/test';

/**
 * Helper to set input value.
 *
 * Note: useful for flaky tests - for most cases the assertions performed by this method are overkill and will just
 *
 * @param input
 * @param value
 * @param options
 */
export const setInputValue = async (
    input: Locator,
    value: string,
    options: {
        force?: boolean;
        noWaitAfter?: boolean;
        timeout?: number;
    } = { timeout: 1000 },
) => {
    await expect(async () => {
        // no need to use focus() - already done as part of fill()
        await input.fill(value, options);
        await input.blur({ timeout: options.timeout });
        await expect(input).toHaveValue(value, { timeout: options.timeout });
    }).toPass({ timeout: 5000 });
};

/**
 * Helper to add to input value.
 *
 * Note: useful for flaky tests - for most cases the assertions performed by this method are overkill and will just
 * add to the total test time unnecessarily.
 *
 * @param input
 * @param value
 * @param mode
 * @param options
 */
export const addToInputValue = async (
    input: Locator,
    value: string,
    mode: 'prepend' | 'append' = 'append',
    options: {
        delay?: number;
        noWaitAfter?: boolean;
        timeout?: number;
    } = { timeout: 1000 },
) => {
    await expect(async () => {
        const current = await input.inputValue();
        await input.focus({ timeout: options.timeout });
        await input.press(mode === 'append' ? 'End' : 'Home', options);
        await input.pressSequentially(value, options);
        await input.blur({ timeout: options.timeout });
        // assert value
        await expect(input).toHaveValue(mode === 'append' ? `${current}${value}` : `${value}${current}`, {
            timeout: options.timeout,
        });
    }).toPass({ timeout: 5000 });
};

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

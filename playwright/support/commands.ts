import { expect, Page, Locator } from '../test';
import { CSS_SELECTOR_STARTS_WITH, DATA_ATTRIBUTE } from '../lib/constants';

export function dataStartsWith(page: Page, id: string, ...args: string[]): Locator {
    return page.locator(`[${DATA_ATTRIBUTE}${CSS_SELECTOR_STARTS_WITH}${id}]${args.join('')}`);
}

export function dataByElementStartsWith(page: Page, el: string, id: string, ...args: string[]): Locator {
    return page.locator(`${el}[${DATA_ATTRIBUTE}${CSS_SELECTOR_STARTS_WITH}${id}]${args.join('')}`);
}

export async function getStore(page: Page) {
    return await page.evaluate(() => (window as any).__store__);
}

export async function isNotInViewport(page: Page, element: Locator) {
    await expect(element).not.toBeInViewport();
}

export async function isInViewport(page: Page, element: Locator) {
    await expect(element).toBeInViewport();
}

export async function uploadFile(subject: Locator, filePath: string, fileName: string) {
    await subject.setInputFiles(filePath);
}

export async function rendersALoggedOutUser(page: Page, hasPanels: (page: Page, options: string[]) => Promise<void>) {
    await page.context().clearCookies();
    await page.goto('/?user=public');
    await page.setViewportSize({ width: 1300, height: 1000 });
    await hasPanels(page, []);
}

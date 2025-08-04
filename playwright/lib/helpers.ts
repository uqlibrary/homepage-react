import { Page, expect, Locator } from '../test';
import { BrowserContext } from '@playwright/test';
import path from 'path';

export const assertEnabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeEnabled();

export const assertDisabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeDisabled();

export const assertTriggersDisabled = async (page: Page, selector: string, callback: any) => {
    await assertEnabled(page, selector);
    await callback();
    await assertDisabled(page, selector);
};

export const fillInput = async (page: Page, selector: string, value: any, times: number = 1) => {
    await page.fill(selector, String(value).repeat(times));
};

export async function assertIsVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
}

export async function assertIsNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeInViewport();
}

export async function clickAutoSuggestion(page: Page, fieldName: string, ordinal: string | number): Promise<void> {
    await page.locator(`#${fieldName}-option-${ordinal}`).click();
}

export const testIdStartsWith = (page: Page | Locator, id: string) => page.locator(`[data-testid^=${id}]`);

export const getOpenedLink = async (context: BrowserContext, locator: Locator) => {
    const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()]);
    return newPage;
};


export const setFileInput = async (container: Page | Locator, fileName: string) =>
    // @ts-ignore https://playwright.dev/docs/api/class-locator#locator-set-input-files
    await container.setInputFiles(path.join(__dirname, `../tests/fixtures/${fileName}`));

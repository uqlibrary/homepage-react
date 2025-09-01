import { Page } from '../test';

export const readCKEditor = async (page: Page) => (await page.locator('.ck-content').textContent()) ?? '';

export const typeCKEditor = async (page: Page, content: string) =>
    await page.locator('[contenteditable]').fill(content);

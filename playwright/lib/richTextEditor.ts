import { Page } from '../test';

export const readRichTextEditor = async (page: Page) =>
    (await page.locator('.ProseMirror').textContent()) ?? '';

export const typeRichTextEditor = async (page: Page, content: string) => {
    await page.locator('.ProseMirror').fill(content);
};

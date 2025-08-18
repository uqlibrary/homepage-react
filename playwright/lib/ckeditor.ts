import { Page } from '../test';

export const readCKEditor = async (page: Page, containerTestId?: string) => {
    if (!containerTestId) {
        return (await page.locator('.ck-content').textContent()) ?? '';
    }
    return (await page.locator(`[data-testid="${containerTestId}"] .ck-editor__main p`).textContent()) ?? '';
};

export const typeCKEditor = async (page: Page, containerTestId: string | undefined, content: string) => {
    if (!containerTestId) {
        await page.locator('[contenteditable]').fill(content);
        return;
    }
    await page
        .getByTestId(containerTestId)
        .locator('[contenteditable]')
        .fill(content);
};

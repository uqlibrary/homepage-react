import { expect, Page } from '@uq/pw/test';

export async function assertToastHasMessage(page: Page, msg: string) {
    await expect(page.getByTestId('toast-corner-message')).toBeVisible();
    await expect(page.getByTestId('toast-corner-message')).toContainText(msg);
}

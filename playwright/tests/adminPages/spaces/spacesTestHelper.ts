import { expect, Page, test } from '@uq/pw/test';

export async function assertToastHasMessage(page: Page, msg: string) {
    await expect(page.getByTestId('toast-message')).toBeVisible();
    await expect(page.getByTestId('toast-message')).toContainText(msg);
}
export async function assertErrorPopupAppears(page: Page, msg: string) {
    await expect(page.getByTestId('message-title')).toBeVisible();
    await expect(page.getByTestId('message-title')).toContainText(msg);
}
export async function assertDialogToastHasMessage(page: Page, msg: string) {
    await expect(page.getByTestId('dialogMessage')).toBeVisible();
    await expect(page.getByTestId('dialogMessage')).toContainText(msg);
}

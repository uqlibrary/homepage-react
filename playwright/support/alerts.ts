import { expect, Page } from '../test';

export async function hasAWorkingHelpButton(page: Page) {
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
    await page.getByTestId('admin-alerts-help-button').click();
    await expect(page.getByTestId('admin-alerts-help-example')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
}

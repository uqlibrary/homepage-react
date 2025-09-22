import { expect, Page } from '@uq/pw/test';

export async function hasAWorkingHelpButton(page: Page) {
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
    await page.getByTestId('admin-alerts-help-button').click();
    await expect(page.getByTestId('admin-alerts-help-example')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
}

export async function dateHasValue(page: Page, dateField: string, expectedDate: string) {
    const dateValue = await page.locator(dateField).getAttribute('value');
    expect(dateValue).toMatch(new RegExp(`^${expectedDate}`));
}

export const uqPurple = 'rgb(81, 36, 122)';

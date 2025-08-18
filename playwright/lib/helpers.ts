import { Page, expect, Locator } from '../test';
import { BrowserContext } from '@uq/pw/test';

export const getOpenedLink = async (context: BrowserContext, locator: Locator) => {
    const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()]);
    return newPage;
};

export async function hasAWorkingHelpButton(page: Page) {
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
    await page.getByTestId('admin-alerts-help-button').click();
    await expect(page.getByTestId('admin-alerts-help-example')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByTestId('admin-alerts-help-example')).not.toBeVisible();
}

export async function clickButton(page: Page, selector: string) {
    await page.locator(selector).click();
}

export async function clickSVGButton(page: Page, selector: string) {
    await page.locator(selector).click();
}

export async function dateHasValue(page: Page, dateField: string, expectedDate: string) {
    const dateValue = await page.locator(dateField).getAttribute('value');
    expect(dateValue).toMatch(new RegExp(`^${expectedDate}`));
}

import { expect, Page } from '../test';

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

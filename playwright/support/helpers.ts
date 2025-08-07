import { expect, Page } from '../test';

export async function clickButton(page: Page, selector: string) {
    await page.locator(selector).click();
}

export async function clickSVGButton(page: Page, selector: string) {
    await page.locator(selector).click();
}

export function readingListLength(courseReadingList: any): number {
    return (
        (!!courseReadingList.reading_lists &&
            courseReadingList.reading_lists.length > 0 &&
            !!courseReadingList.reading_lists[0] &&
            !!courseReadingList.reading_lists[0].totalCount &&
            courseReadingList.reading_lists[0].totalCount) ||
        0
    );
}

export async function dateHasValue(page: Page, dateField: string, expectedDate: string) {
    const dateValue = await page.locator(dateField).getAttribute('value');
    expect(dateValue).toMatch(new RegExp(`^${expectedDate}`));
}

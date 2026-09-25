import { Page, expect } from '@uq/pw/test';

export const assertHasLinkFileTabError = async (page: Page) =>
    await expect(page.getByTestId('dlor-panel-validity-indicator-2').locator('.MuiBadge-badge')).toHaveText('1');

export const assertMissingLinkFileTabError = async (page: Page) =>
    await expect(page.getByTestId('dlor-panel-validity-indicator-2').locator('.MuiBadge-badge')).not.toBeVisible();

export const selectFileForUpload = async (page: Page, file: object) =>
    // @ts-expect-error TODO fix when setInputFiles has a importable type
    await page.getByTestId('dlor-object-file-selector').locator('input[type="file"]').setInputFiles(file);

export const createFileMock = (filename: string, mimeType: string, contents: string = '') => ({
    name: filename,
    mimeType,
    buffer: Buffer.from(contents),
});

export const setObjectReviewDate = async (page: Page, date: string) => {
    await page.locator('[data-testid="object-review-date"] input').click();
    await page.locator('[data-testid="object-review-date"] input').clear();
    await page.locator('[data-testid="object-review-date"] input').fill(date);
    await page.locator('[data-testid="object-review-date"] input').blur();
    await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(date);
};

export const assertDlorFormSubmittedData = async (
    page: Page,
    callback: () => Promise<Record<string | number, unknown>>,
) => {
    await page.setViewportSize({ width: 1300, height: 1000 });

    const cookies = await page.context().cookies();
    const testCookie = cookies.find(c => c.name === 'CYPRESS_TEST_DATA');
    expect(testCookie).toBeTruthy();
    expect(testCookie?.value).toBe('active');

    const expectedValues = await callback();

    const cookie = await page.context().cookies();
    const dataSavedCookie = cookie.find(c => c.name === 'CYPRESS_DATA_SAVED');
    expect(dataSavedCookie).toBeTruthy();
    const sentValues = JSON.parse(decodeURIComponent(dataSavedCookie?.value || ''));

    const sentFacets = sentValues.facets;
    const expectedFacets = expectedValues.facets;
    const sentKeywords = sentValues.object_keywords;
    const expectedKeywords = expectedValues.object_keywords;
    delete sentValues.facets;
    delete expectedValues.facets;
    delete sentValues.object_keywords;
    delete expectedValues.object_keywords;
    delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
    delete expectedValues.object_review_date_next;

    expect(sentValues).toEqual(expectedValues);
    expect(sentFacets).toEqual(expectedFacets);
    expect(sentKeywords).toEqual(expectedKeywords);

    await page.context().clearCookies();
};

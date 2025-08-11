import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';
test.describe('Past Exam Papers Pages', () => {
    test.describe('searching', () => {
        test('the past exam paper search page is accessible', async ({ page }) => {
            await page.goto('/exams');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Search for a past exam paper/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('Responsive display is accessible', async ({ page }) => {
            await page.goto('/exams');
            await page.setViewportSize({ width: 414, height: 736 });
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Search for a past exam paper/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('has breadcrumbs', async ({ page }) => {
            await page.goto('/exams/course/empt');
            await expect(
                page
                    .locator('[data-testid="subsite-title"]')
                    .getByText(/Past exam papers/)
                    .first(),
            ).toBeVisible();
        });
        test('when I type a valid course code fragment in the search bar, appropriate suggestions load', async ({
            page,
        }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fren1');
            // suggestions load
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(3);
        });
        test('the suggestions list is accessible', async ({ page }) => {
            await page.goto('/exams');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fren1');
            // suggestions load
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('when I type an invalid course code fragment in the search bar, a hint shows', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('em');
            await expect(page.locator('.MuiAutocomplete-listbox')).toHaveCount(0);
            await expect(
                page
                    .locator('.MuiAutocomplete-noOptions')
                    .getByText(/We have not found any past exams for this course/)
                    .first(),
            ).toBeVisible();
        });
        test('when I type too short a course code fragment in the search bar, a hint shows', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('f');
            await expect(page.locator('.MuiAutocomplete-listbox')).toHaveCount(0);
            await expect(
                page
                    .locator('.MuiAutocomplete-noOptions')
                    .getByText(/Type more characters to search/)
                    .first(),
            ).toBeVisible();
        });
        test('when I dont have any results yet, the "results for this search" doesnt get added to the drop down', async ({
            page,
        }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('f');
            await expect(page.locator('.MuiAutocomplete-listbox')).not.toBeVisible();
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').pressSequentially('ren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(17);
        });
        test('when I click on a suggestion from the list, the correct result page loads', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(17);
            await page.locator('#exam-search-option-0').click({ force: true });
            await expect(page).toHaveURL(/exams\/course\/FREN/);
        });
        test('when I hit return on a search list, the result page for the first option loads', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(17);
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').press('Enter');
            await expect(page).toHaveURL(/exams\/course\/FREN/);
        });
        test('when my search term matches the first result I do not get a "show all" prompt', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fren101');
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(2);
            await expect(page.locator('#exam-search-option-0')).toContainText('View all exam papers for FREN101');
            await expect(page.locator('#exam-search-option-1')).toContainText('FREN1010');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').pressSequentially('0');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(1);
            await expect(page.locator('#exam-search-option-0')).toContainText('FREN1010');
        });
        test('when the api fails I get an appropriate error message', async ({ page }) => {
            await page.goto('/exams');
            await page.locator('[data-testid="past-exam-paper-search-autocomplete-input"]').fill('fail');
            await expect(page.locator('.MuiAutocomplete-listbox')).toHaveCount(0);
            await expect(
                page
                    .locator('div[data-testid="past-exam-paper-error"]')
                    .getByText(/Autocomplete suggestions currently unavailable - please try again later/)
                    .first(),
            ).toBeVisible();
        });
    });
    test.describe('results', () => {
        test('the past exam paper result page is accessible', async ({ page }) => {
            await page.goto('/exams/course/fren');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Past Exam Papers/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['empty-table-header'] });
        });
        test('past exam paper result page responsive display is accessible', async ({ page }) => {
            await page.goto('/exams/course/fren');
            await page.setViewportSize({ width: 414, height: 736 });
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Past Exam Papers/)
                    .first(),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test.describe('a desktop page', () => {
            test(' with multiple subjects displayed shows table view for Original papers', async ({ page }) => {
                await page.goto('/exams/course/fren');
                await expect(
                    page
                        .locator('[data-testid="subsite-title"]')
                        .getByText(/Past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('div[id="content-container"]')
                        .getByText(/Past Exam Papers from 2017 to 2022 for "FREN"/)
                        .first(),
                ).toBeVisible();
                // sample papers are correct
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-sample-link-0-0-0"]')
                        .getByText(/FREN1010 Sem\.2 2020/)
                        .first(),
                ).toBeVisible();
                // original papers are correct
                await expect(
                    page.locator('[data-testid="exampaper-desktop-originals-table-header"]').locator(':scope > *'),
                ).toHaveCount(4);
                await expect(
                    page.locator('[data-testid="exampaper-desktop-originals-table-body"]').locator(':scope > *'),
                ).toHaveCount(22);
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-1-1-0"]')
                        .getByText(/FREN2010/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-1-1-0"]')
                        .getByText(/Final/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-4-1-0"]')
                        .getByText(/FREN2082/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-4-1-0"]')
                        .getByText(/a special french paper/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-4-0-0"]')
                        .getByText(/FREN2082/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-originals-link-4-0-0"] span:first-child')
                        .getByText(/Final Paper/)
                        .first(),
                ).toBeVisible();
            });
            test('with one subject and no sample papers shows originals in Simple view', async ({ page }) => {
                await page.goto('/exams/course/PHYS1001?user=s1111111');
                await expect(
                    page
                        .locator('[data-testid="exampapers-original-heading"]')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(page.locator('[data-testid="exampaper-desktop-original-line"]')).toBeVisible();
                await expect(page.locator('[data-testid="exampaper-desktop-sample-line"]')).not.toBeVisible();
            });
            test('with no original papers and some sample papers shows Simple view', async ({ page }) => {
                await page.goto('/exams/course/dent1050?user=s1111111');
                await expect(
                    page
                        .locator('[data-testid="exampapers-original-heading"]')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="no-original-papers-provided"]')
                        .getByText(/No original papers provided\./)
                        .first(),
                ).toBeVisible();
                await expect(page.locator('[data-testid="original-papers-table"]')).not.toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="sample-papers-heading"]')
                        .getByText(/Sample past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-desktop-sample-link-0-0-0"]')
                        .getByText(/DENT1050 Sem\.2 2022/)
                        .first(),
                ).toBeVisible();
            });
        });
        test.describe('a mobile page', () => {
            test(' with multiple subjects displayed shows simple view for Original papers', async ({ page }) => {
                await page.goto('/exams/course/fren');
                await page.setViewportSize({ width: 414, height: 736 });
                // sample papers are correct
                await expect(page.locator('[data-testid="exampaper-mobile-sample-link-0-0-0"]')).toHaveText(
                    /FREN1010 Sem\.2 2020/,
                );

                await expect(page.locator('[data-testid="exampaper-mobile-original-link-0-0-0"]')).toContainText(
                    'FREN1010 Sem.1 2020 Paper A',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-0-0-1"]')).toContainText(
                    'FREN1010 Sem.1 2020 Paper B',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-1-0-0"]')).toContainText(
                    'FREN2010 Sem.1 2021',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-1-1-0"]')).toContainText(
                    'FREN2010 Sem.1 2019 Final',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-4-1-0"]')).toContainText(
                    'FREN2082 Sem.1 2020 a special french paper',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-4-1-1"]')).toContainText(
                    'FREN2082 Sem.1 2020 Paper 2',
                );
                await expect(page.locator('[data-testid="exampaper-mobile-original-link-4-0-0"]')).toContainText(
                    'FREN2082 Sem.1 2021 (Final Paper)',
                );
            });
            test('with one subject and no sample papers shows originals in Simple view', async ({ page }) => {
                await page.goto('/exams/course/PHYS1001?user=s1111111');
                await page.setViewportSize({ width: 414, height: 736 });
                await expect(
                    page
                        .locator('[data-testid="exampapers-original-heading"]')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(page.locator('[data-testid="exampaper-mobile-original-line"]')).toBeVisible();
                await expect(page.locator('[data-testid="exampaper-mobile-sample-line"]')).not.toBeVisible();
            });
            test('with no original papers and some sample papers shows Simple view', async ({ page }) => {
                await page.goto('/exams/course/dent1050?user=s1111111');
                await page.setViewportSize({ width: 414, height: 736 });
                await expect(
                    page
                        .locator('[data-testid="exampapers-original-heading"]')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="no-original-papers-provided"]')
                        .getByText(/No original papers provided\./)
                        .first(),
                ).toBeVisible();
                await expect(page.locator('[data-testid="original-papers-table"]')).not.toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="sample-papers-heading"]')
                        .getByText(/Sample past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .locator('[data-testid="exampaper-mobile-sample-link-0-0-0"]')
                        .getByText(/DENT1050 Sem\.2 2022/)
                        .first(),
                ).toBeVisible();
            });
        });
    });
    test.describe('search errors', () => {
        test('has breadcrumbs', async ({ page }) => {
            await page.goto('/exams/course/empt');
            await expect(
                page
                    .locator('[data-testid="subsite-title"]')
                    .getByText(/Past exam papers/)
                    .first(),
            ).toBeVisible();
        });
        test('a search with no results shows a message', async ({ page }) => {
            await page.goto('/exams/course/empt');
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Past Exam Papers from 2017 to 2022 for "EMPT"/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('div[data-testid="past-exam-paper-missing"]')
                    .getByText(/We have not found any past exams for this course "EMPT"\./)
                    .first(),
            ).toBeVisible();
        });
        test('a search for a true 404 shows a message', async ({ page }) => {
            await page.goto('/exams/course/mock404');
            await expect(
                page
                    .locator('div[id="content-container"]')
                    .getByText(/Past Exam Papers by Subject/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('div[data-testid="past-exam-paper-missing"]')
                    .getByText(/We have not found any past exams for this course\./)
                    .first(),
            ).toBeVisible();
        });
        test('when the api fails I get an appropriate error message', async ({ page }) => {
            await page.goto('/exams/course/fail');
            await expect(page.locator('.MuiAutocomplete-listbox')).toHaveCount(0);
            await expect(
                page
                    .locator('div[data-testid="past-exam-paper-error"]')
                    .getByText(/Past exam paper search is currently unavailable - please try again later/)
                    .first(),
            ).toBeVisible();
        });
    });
});

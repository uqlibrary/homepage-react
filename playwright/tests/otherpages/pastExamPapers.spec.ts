import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

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
        test('the suggestions list is accessible', async ({ page }) => {
            await page.goto('/exams');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren1');
            // suggestions load
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('when I type a valid course code fragment in the search bar, appropriate suggestions load', async ({
            page,
        }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren1');
            // suggestions load
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(3);
        });
        test('when I click on a suggestion from the list, the correct result page loads', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(17);
            await page.locator('#exam-search-option-0').click();
            await expect(page).toHaveURL(/exams\/course\/FREN/);
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
            test('with multiple subjects displayed shows table view for Original papers', async ({ page }) => {
                await page.goto('/exams/course/fren');
                await expect(
                    page
                        .locator('div[id="content-container"]')
                        .getByText(/Past Exam Papers from 2017 to 2022 for "FREN"/)
                        .first(),
                ).toBeVisible();

                // sample papers are correct
                await expect(
                    page
                        .getByTestId('exampaper-desktop-sample-link-FREN1010-semester0-paper0')
                        .getByText(/FREN1010 Sem\.2 2020/)
                        .first(),
                ).toBeVisible();

                // four columns: one course label and three semesters; 22 rows: 21 subjects + one header row
                await expect(
                    page.getByTestId('exampaper-desktop-originals-table-header').locator(':scope > *'),
                ).toHaveCount(4);
                await expect(
                    page.getByTestId('exampaper-desktop-originals-table-body').locator(':scope > *'),
                ).toHaveCount(22);
            });
        });
        test.describe('a mobile page', () => {
            test(' with multiple subjects displayed shows simple view for Original papers', async ({ page }) => {
                await page.goto('/exams/course/fren');
                await page.setViewportSize({ width: 414, height: 736 });

                // sample papers are correct
                await expect(page.getByTestId('exampaper-mobile-sample-link-FREN1010-semester0-paper0')).toHaveText(
                    /FREN1010 Sem\.2 2020/,
                );

                // original papers are correct
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN1010-semester0-paper0')
                        .getByText('FREN1010 Sem.1 2020 Paper A'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN1010-semester0-paper1')
                        .getByText('FREN1010 Sem.1 2020 Paper B'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN2010-semester0-paper0')
                        .getByText('FREN2010 Sem.1 2021'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN2010-semester1-paper0')
                        .getByText('FREN2010 Sem.1 2019 Final'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN2082-semester1-paper0')
                        .getByText('FREN2082 Sem.1 2020 a special french paper'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN2082-semester1-paper1')
                        .getByText('FREN2082 Sem.1 2020 Paper 2'),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-original-link-FREN2082-semester0-paper0')
                        .getByText('FREN2082 Sem.1 2021 (Final Paper)'),
                ).toBeVisible();
            });
        });
    });
});

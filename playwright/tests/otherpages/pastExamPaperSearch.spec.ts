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
        test('when I type a valid course code fragment in the search bar, appropriate suggestions load', async ({
            page,
        }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren1');
            // suggestions load
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(3);
        });
        test('the suggestions list is accessible', async ({ page }) => {
            await page.goto('/exams');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren1');
            // suggestions load
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('when I type an invalid course code fragment in the search bar, a hint shows', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('em');
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
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('f');
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
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('f');
            await expect(page.locator('.MuiAutocomplete-listbox')).not.toBeVisible();
            await page.getByTestId('past-exam-paper-search-autocomplete-input').pressSequentially('ren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(17);
        });
        test('when I click on a suggestion from the list, the correct result page loads', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(17);
            await page.locator('#exam-search-option-0').click();
            await expect(page).toHaveURL(/exams\/course\/FREN/);
        });
        test('when I hit return on a search list, the result page for the first option loads', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(17);
            await page.getByTestId('past-exam-paper-search-autocomplete-input').press('Enter');
            await expect(page).toHaveURL(/exams\/course\/FREN/);
        });
        test('when my search term matches the first result I do not get a "show all" prompt', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fren101');
            await expect(page.locator('.MuiAutocomplete-listbox').locator(':scope > *')).toHaveCount(2);
            await expect(
                page.locator('#exam-search-option-0').getByText('View all exam papers for FREN101'),
            ).toBeVisible();
            await expect(page.locator('#exam-search-option-1').getByText('FREN1010')).toBeVisible();
            await page.getByTestId('past-exam-paper-search-autocomplete-input').pressSequentially('0');
            await expect(page.locator('.MuiAutocomplete-listbox').locator('> *')).toHaveCount(1);
            await expect(page.locator('#exam-search-option-0').getByText('FREN1010')).toBeVisible();
        });
        test('when the api fails I get an appropriate error message', async ({ page }) => {
            await page.goto('/exams');
            await page.getByTestId('past-exam-paper-search-autocomplete-input').fill('fail');
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

                // FREN1010 row one, column one, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN1010-semester0')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN1010-semester0')).toBeEmpty();

                // FREN1010 row one, column two, cell has two links
                const paper1A = page.getByTestId('exampaper-desktop-originals-link-FREN1010-semester1-paper0');
                await expect(paper1A.getByText(/FREN1010/).first()).toBeVisible();
                await expect(paper1A.getByText(/Paper A/).first()).toBeVisible();
                expect(await paper1A.innerHTML()).toBe('FREN1010<span><br>Paper A</span>');
                await expect(paper1A).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations__2018_FREN1020_613.pdf',
                );

                const paper1B = page.getByTestId('exampaper-desktop-originals-link-FREN1010-semester1-paper1');
                await expect(paper1B.getByText(/FREN1010/).first()).toBeVisible();
                await expect(paper1B.getByText(/Paper B/).first()).toBeVisible();
                expect(await paper1B.innerHTML()).toBe('FREN1010<span><br>Paper B</span>');
                await expect(paper1B).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations__2018_FREN1020_614.pdf',
                );

                // FREN1010 row one, column three, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN1010-semester2')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN1010-semester2')).toBeEmpty();

                // FREN2010 row two, column one, cell has link
                const paper2 = page.getByTestId('exampaper-desktop-originals-link-FREN2010-semester0-paper0');
                await expect(paper2.getByText(/FREN2010/).first()).toBeVisible();
                await expect(paper2).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8461.pdf',
                );

                // FREN2010 row two, column two, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2010-semester1')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2010-semester1')).toBeEmpty();

                // FREN2010 row two, column three, cell has link
                const paper3 = page.getByTestId('exampaper-desktop-originals-link-FREN2010-semester2-paper0');
                await expect(paper3.getByText(/FREN2010/).first()).toBeVisible();
                await expect(paper3.getByText(/Final/).first()).toBeVisible();
                expect(await paper3.innerHTML()).toBe('FREN2010<span><br>Final</span>');
                await expect(paper3).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2019_FREN7221_school.pdf',
                );

                // FREN2080 row three, column one, cell has link
                const paper4 = page.getByTestId('exampaper-desktop-originals-link-FREN2080-semester0-paper0');
                await expect(paper4.getByText(/FREN2080/).first()).toBeVisible();
                await expect(paper4).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8462.pdf',
                );

                // FREN2080 row three, column two, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2080-semester1')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2080-semester1')).toBeEmpty();

                // FREN2080 row three, column three, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2080-semester2')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2080-semester2')).toBeEmpty();

                // FREN2081 row four, column one, cell has link
                const paper5 = page.getByTestId('exampaper-desktop-originals-link-FREN2081-semester0-paper0');
                await expect(paper5.getByText(/FREN2081/).first()).toBeVisible();
                await expect(paper5).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8463.pdf',
                );

                // FREN2081 row four, column two, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2081-semester1')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2081-semester1')).toBeEmpty();

                // FREN2081 row four, column three, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2081-semester2')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2081-semester2')).toBeEmpty();

                // FREN2082 row five, column one, cell has link
                const paper6 = page.getByTestId('exampaper-desktop-originals-link-FREN2082-semester0-paper0');
                await expect(paper6.getByText(/Final Paper/).first()).toBeVisible();
                await expect(paper6.getByText(/FREN2082/).first()).toBeVisible();
                expect(await paper6.innerHTML()).toBe('<span>Final Paper<br></span>FREN2082');
                await expect(paper6).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8464.pdf',
                );

                // FREN2082 row five, column two, cell has two links
                const paper7A = page.getByTestId('exampaper-desktop-originals-link-FREN2082-semester1-paper0');
                await expect(paper7A.getByText(/FREN2082/).first()).toBeVisible();
                await expect(paper7A.getByText(/a special french paper/).first()).toBeVisible();
                expect(await paper7A.innerHTML()).toBe('FREN2082<span><br>a special french paper</span>');
                await expect(paper7A).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_847.pdf',
                );

                const paper7B = page.getByTestId('exampaper-desktop-originals-link-FREN2082-semester1-paper1');
                await expect(paper7B.getByText(/FREN2082/).first()).toBeVisible();
                await expect(paper7B).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_848.pdf',
                );

                // FREN2082 row five, column three, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2082-semester2')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2082-semester2')).toBeEmpty();

                // FREN2083 row six, column one, cell has link
                const paper8 = page.getByTestId('exampaper-desktop-originals-link-FREN2083-semester0-paper0');
                await expect(paper8.getByText(/FREN2083/).first()).toBeVisible();
                await expect(paper8).toHaveAttribute(
                    'href',
                    'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8465.pdf',
                );

                // FREN2083 row six, column two, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2083-semester1')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2083-semester1')).toBeEmpty();

                // FREN2083 row six, column three, cell is empty
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2083-semester2')).toBeDefined();
                await expect(page.getByTestId('exampaper-desktop-originals-FREN2083-semester2')).toBeEmpty();
            });

            test('with one subject and no sample papers shows originals in Simple view', async ({ page }) => {
                await page.goto('/exams/course/PHYS1001?user=s1111111');
                await expect(
                    page
                        .getByTestId('exampapers-original-heading')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();

                await expect(page.getByTestId('exampaper-desktop-original-line')).toBeVisible();
                await expect(page.getByTestId('exampaper-desktop-sample-line')).not.toBeVisible();
            });
            test('with no original papers and some sample papers shows Simple view', async ({ page }) => {
                await page.goto('/exams/course/dent1050?user=s1111111');
                await expect(
                    page
                        .getByTestId('exampapers-original-heading')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('no-original-papers-provided')
                        .getByText(/No original papers provided\./)
                        .first(),
                ).toBeVisible();
                await expect(page.getByTestId('original-papers-table')).not.toBeVisible();
                await expect(
                    page
                        .getByTestId('sample-papers-heading')
                        .getByText(/Sample past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-desktop-sample-link-DENT1050-semester0-paper0')
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
            test('with one subject and no sample papers shows originals in Simple view', async ({ page }) => {
                await page.goto('/exams/course/PHYS1001?user=s1111111');
                await page.setViewportSize({ width: 414, height: 736 });
                await expect(
                    page
                        .getByTestId('exampapers-original-heading')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(page.getByTestId('exampaper-mobile-original-line')).toBeVisible();
                await expect(page.getByTestId('exampaper-mobile-sample-line')).not.toBeVisible();
            });
            test('with no original papers and some sample papers shows Simple view', async ({ page }) => {
                await page.goto('/exams/course/dent1050?user=s1111111');
                await page.setViewportSize({ width: 414, height: 736 });
                await expect(
                    page
                        .getByTestId('exampapers-original-heading')
                        .getByText(/Original past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('no-original-papers-provided')
                        .getByText(/No original papers provided\./)
                        .first(),
                ).toBeVisible();
                await expect(page.getByTestId('original-papers-table')).not.toBeVisible();
                await expect(
                    page
                        .getByTestId('sample-papers-heading')
                        .getByText(/Sample past exam papers/)
                        .first(),
                ).toBeVisible();
                await expect(
                    page
                        .getByTestId('exampaper-mobile-sample-link-DENT1050-semester0-paper0')
                        .getByText(/DENT1050 Sem\.2 2022/)
                        .first(),
                ).toBeVisible();
            });
        });
    });
    test.describe('search errors', () => {
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

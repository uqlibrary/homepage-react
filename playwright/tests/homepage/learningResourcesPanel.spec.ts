import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { accounts } from '../../../src/data/mock/data';
import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';

test.describe('The Homepage Learning Resource Panel', () => {
    test('Learning resources panel is accessible', async ({ page }) => {
        await page.goto('/?user=s1111111');

        await expect(
            page
                .locator('[data-testid="learning-resources-panel"] [data-testid="your-courses"]')
                .getByText(locale.homepagePanel.userCourseTitle)
                .first(),
        ).toBeVisible();
        await page.setViewportSize({ width: 1300, height: 1000 });
        console.log('Learning resources panel');
        await expect(page.locator('div[data-testid="learning-resources-homepage-panel"]')).toBeVisible();
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel]')
                .getByText(locale.homepagePanel.title)
                .first(),
        ).toBeVisible();
        await page.locator('div[data-testid=learning-resources-panel] form input').fill('FREN');
        await expect(
            page
                .locator('h2')
                .getByText(/Matching courses/)
                .first(),
        ).toBeVisible();
        await page.waitForTimeout(600);
        await assertAccessibility(page, 'div[data-testid="learning-resources-panel"]');
    });

    test('The Learning resources panel links correctly', async ({ page }) => {
        await page.goto('/?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        const currentClasses = accounts.s1111111.current_classes;
        expect(currentClasses.length).toBeGreaterThan(1); // the user has courses that we can click on
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel]')
                .getByText(locale.homepagePanel.title)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel] h4')
                .getByText(locale.homepagePanel.userCourseTitle)
                .first(),
        ).toBeVisible();

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel] h4')
                .locator('..')
                .locator('..')
                .locator(':scope > *')
                .locator(':scope > *'),
        ).toHaveCount(numberOfBlocks);

        // the users clicks one of the classes in the 'Your courses' list
        const classIndex = 0;
        const specificClass = currentClasses[classIndex];
        await page
            .locator(`[data-testid="learning-resource-panel-course-link-${classIndex}"]`)
            .getByText(`${specificClass.SUBJECT}${specificClass.CATALOG_NBR}`)
            .first()
            .click({
                force: true,
            });
        // the user lands on the correct page
        await expect(page).toHaveURL(
            `learning-resources?user=s1111111&coursecode=${specificClass.SUBJECT}${specificClass.CATALOG_NBR}&campus=St%20Lucia&semester=Semester%202%202020`,
        );
        await expect(
            page
                .locator(`div[data-testid="classpanel-${classIndex}"] h2`)
                .getByText(specificClass.SUBJECT)
                .first(),
        ).toBeVisible();
    });

    test('The Learning resources panel searches correctly', async ({ page }) => {
        await page.goto('/?user=s3333333');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel]')
                .getByText(locale.homepagePanel.title)
                .first(),
        ).toBeVisible();

        // the user is not enrolled in any subjects which means the form has no sibling elements
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel] form')
                .locator('..')
                .locator(':scope > *'),
        ).toHaveCount(2); // 1 search field and one div with 'no courses' text
        // the user sees a search field
        await expect(page.locator('div[data-testid="learning-resource-search-input-field"] input')).toBeVisible();
        await expect(page.locator('div[data-testid="learning-resource-search-input-field"] input')).toBeVisible();

        // user enters ACCT
        await page.locator('div[data-testid=learning-resources-panel] form input').fill('ACCT11');
        const subjectSearchSuggestionsWithACCT = subjectSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        await expect(
            page.locator('ul#homepage-learningresource-autocomplete-listbox').locator(':scope > *'),
        ).toHaveCount(subjectSearchSuggestionsWithACCT.length + 1); // add one for title
        // user clicks on #1, ACCT1101
        await page
            .locator('li#homepage-learningresource-autocomplete-option-0')
            .getByText(/ACCT1101/)
            .first()
            .click();

        // user lands on appropriate learning resources page
        await expect(page).toHaveURL(
            /learning-resources\?user=s3333333&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020/,
        );

        const classPanelId = 'classpanel-0';
        await expect(
            page
                .locator(`div[data-testid=${classPanelId}] h3`)
                .getByText(/ACCT1101/)
                .first(),
        ).toBeVisible();
    });

    test('The Learning resources panel displays results correctly when the user has many classes', async ({ page }) => {
        await page.goto('?user=s5555555');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.locator('div[data-testid=learning-resources-panel]')).toContainText(
            locale.homepagePanel.title,
        );
        await expect(page.getByTestId('staff-course-prompt')).toHaveCount(0);

        const yourCourses = page.getByTestId('your-courses');
        await expect(yourCourses.locator('> * > *')).toHaveCount(5 + 2);

        await expect(page.getByTestId('learning-resource-panel-course-multi-footer')).toContainText(
            'See all 10 classes',
        );

        const liItems = yourCourses.locator('li');
        await expect(liItems).toHaveCount(5);

        const firstItemLeft = await liItems
            .locator('.descriptor')
            .nth(0)
            .evaluate(el => el.getBoundingClientRect().left);
        const thirdDescriptor = liItems.locator('.descriptor').nth(3);
        await expect(thirdDescriptor).toContainText('Animals');

        const { top, left, height } = await thirdDescriptor.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return { top: rect.top, left: rect.left, height: rect.height };
        });

        expect(left).toBe(firstItemLeft);
        const heightDiff = height;
        expect(heightDiff).toBeGreaterThan(47);
        expect(heightDiff).toBeLessThan(49);
    });

    test('The Learning resources panel displays results with incomplete data correctly', async ({ page }) => {
        await page.goto('/?user=s3333333');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[data-testid=learning-resources-panel]')
                .getByText(locale.homepagePanel.title)
                .first(),
        ).toBeVisible();
        await expect(page.locator('div[data-testid="learning-resource-search-input-field"] input')).toBeVisible();
        await expect(page.locator('div[data-testid="learning-resource-search-input-field"] input')).toBeVisible();

        // user enters FREN
        await page.locator('div[data-testid=learning-resources-panel] form input').fill('FREN');

        // the subjects that are missing some data appear correctly
        await expect(
            page
                .locator('#homepage-learningresource-autocomplete-option-0')
                .getByText(/FREN1010 \(has mock data - Introductory French 1, St Lucia, Semester 2 2020\)/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('#homepage-learningresource-autocomplete-option-1')
                .getByText(/FREN1012 \(French subject with blank semester, St Lucia\)/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('#homepage-learningresource-autocomplete-option-2')
                .getByText(/FREN1011 \(French subject with blank campus, Semester 2 2020\)/)
                .first(),
        ).toBeVisible();
    });

    // at one point, a course code entered in all caps would not match a complete course code
    test('The search field loads the matching result for a complete course code', async ({ page }) => {
        await page.goto('/?user=s3333333');
        await page.locator('div[data-testid=learning-resources-panel] form input').clear();
        await page.locator('div[data-testid=learning-resources-panel] form input').fill('ACCT1101');
        await expect(
            page.locator('ul#homepage-learningresource-autocomplete-listbox').locator(':scope > *'),
        ).toHaveCount(1 + 1); // add one for title
    });

    test('Staff see example courses', async ({ page }) => {
        await page.goto('/?user=uqstaff');
        await expect(
            page
                .getByTestId('staff-course-prompt')
                .getByText(/Students see enrolled courses\. Example links below:/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('no-enrolled-courses')).not.toBeVisible();
        const numberOfBlocks = 3 + 1; // n classes + 1 header
        await expect(
            page
                .getByTestId('your-courses')
                .locator(':scope > *')
                .locator(':scope > *'),
        ).toHaveCount(numberOfBlocks);
        await expect(
            page
                .getByTestId('hcr-0')
                .getByText(/FREN1010/)
                .first(),
        ).toBeVisible();
    });
});

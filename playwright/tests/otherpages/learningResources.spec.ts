import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { _courseLink, _pluralise } from '../../../src/modules/Pages/LearningResources/shared/learningResourcesHelpers';
import { default as FREN1010ReadingList } from '../../../src/data/mock/data/records/learningResources/courseReadingList_FREN1010';
import { default as FREN1011ReadingList } from '../../../src/data/mock/data/records/learningResources/courseReadinglist_FREN1011';
import { default as FREN1010Guide } from '../../../src/data/mock/data/records/learningResources/libraryGuides_FREN1010';
import { default as FREN1010Exam } from '../../../src/data/mock/data/records/learningResources/examListFREN1010';
import { default as FREN1011Exam } from '../../../src/data/mock/data/records/learningResources/examListFREN1011';
import { default as HIST1201ReadingList } from '../../../src/data/mock/data/records/learningResources/courseReadingList_HIST1201';
import { default as PHIL1002ReadingList } from '../../../src/data/mock/data/records/learningResources/courseReadingList_PHIL1002';
import { default as ACCT1101ReadingList } from '../../../src/data/mock/data/records/learningResources/courseReadingList_ACCT1101';
import { default as ACCT1101Guide } from '../../../src/data/mock/data/records/learningResources/libraryGuides_ACCT1101';
import { default as ACCT1101Exam } from '../../../src/data/mock/data/records/learningResources/examListACCT1101';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';

async function the_user_lands_on_the_My_Classes_tab(
    page: Page,
    courseReadingList: Record<string, string>,
    panelId = 0,
) {
    const title = courseReadingList.course_title || 'mock data is missing';
    await expect(
        page
            .locator('div[data-testid="learning-resources"]')
            .getByText(/Your courses/)
            .first(),
    ).toBeVisible();
    await expect(
        page
            .locator(`div[data-testid=classpanel-${panelId}] h2`)
            .getByText(title)
            .first(),
    ).toBeVisible();
}

async function the_user_lands_on_the_Search_tab(page: Page) {
    await expect(
        page
            .locator('div[data-testid="learning-resources"]')
            .getByText(locale.search.title)
            .first(),
    ).toBeVisible();
}

async function the_user_clicks_on_the_My_Courses_tab(page: Page) {
    await page
        .locator('button#topmenu-0')
        .getByText(/Your courses/)
        .first()
        .click();
}

async function the_user_clicks_on_the_Search_tab(page: Page) {
    await page
        .locator('button#topmenu-1')
        .getByText(locale.search.title)
        .first()
        .click();
}

interface ExamPaper {
    period: string;
    url: string;
}

interface ExamPapers {
    coursecode: string;
    remainingCount: number;
    list: ExamPaper[];
}

async function exams_panel_loads_correctly_for_a_subject_with_many_exams(
    page: Page,
    examPapers: ExamPapers,
    displayType = 'mycourses',
    username = 's1111111',
) {
    const headerLevel = displayType === 'mycourses' ? 'h3' : 'h4';
    const courseCode = examPapers.coursecode || 'mock data is missing';

    const examPaper = examPapers.list?.[0] || { period: '', url: '' };
    const examPeriod = examPaper.period || 'mock data is missing';
    const examPaperLink = examPaper.url || 'mock data is missing';

    const pastExamsSection = page.locator(`[data-testid="past-exams-${courseCode}"]`);
    if (await pastExamsSection.isVisible()) {
        await expect(pastExamsSection).not.toContainText('Exam papers list currently unavailable');
    }

    const numberExcessExams = examPapers.remainingCount || 0;
    const totalExamItems = examPapers.list.length + numberExcessExams;

    const examsPanel = page.getByTestId('learning-resource-subject-exams');

    // Check header
    await expect(
        examsPanel.locator(`${headerLevel}:has-text("Past exam papers (${totalExamItems} items)")`),
    ).toBeVisible();

    // Check first paper link
    await expect(examsPanel.locator('a[data-testid="examPaperItem-0"]')).toHaveAttribute('href', examPaperLink);

    // Check exam period summary
    await expect(
        examsPanel.locator('span', {
            hasText: `${examPeriod} (${examPaperLink.slice(-3).toUpperCase()})`,
        }),
    ).toBeVisible();

    // Check "more past papers" summary
    const morePapersText = `${numberExcessExams} more past ${_pluralise('paper', numberExcessExams)}`;
    await expect(page.locator('div[data-testid=exam-more-link] span', { hasText: morePapersText })).toBeVisible();

    // Check "more link" URL
    await expect(page.locator('div[data-testid=exam-more-link] a')).toHaveAttribute(
        'href',
        `http://localhost:2020/exams/course/${courseCode}?user=${username}`,
    );
}

async function guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page(page: Page) {
    await expect(
        page
            .locator('a[data-testid="referencingGuides"] span')
            .getByText(/Referencing guides/)
            .first(),
    ).toBeVisible();
    await expect(page.locator('a[data-testid="referencingGuides"]')).toHaveAttribute(
        'href',
        'https://guides.library.uq.edu.au/referencing',
    );
    await expect(
        page
            .locator('a[data-testid="all-guides"] span')
            .getByText(/All library guides/)
            .first(),
    ).toBeVisible();
    await expect(page.locator('a[data-testid="all-guides"]')).toHaveAttribute(
        'href',
        'https://guides.library.uq.edu.au/all-guides',
    );
}

async function guides_panel_loads_correctly_for_a_subject_with_one_guide(
    page: Page,
    guides: Record<string, string>,
    courseCode: string,
    displayType = 'mycourses',
) {
    const headerLevel = displayType === 'mycourses' ? 'h3' : 'h4';
    const guide = guides[0] || {};
    const guideTitle = guide.title || 'mock data is missing';
    const guideLink = guide.url || 'mock data is missing';
    await expect(
        page
            .locator(`[data-testid=guides-${courseCode}] ${headerLevel}`)
            .getByText(/Subject guides/)
            .first(),
    ).toBeVisible();
    await expect(
        page
            .locator(`div[data-testid=guides-${courseCode}] a`)
            .getByText(guideTitle)
            .first(),
    ).toHaveAttribute('href', guideLink);
    await expect(page.locator(`div[data-testid="guides-${courseCode}"]`)).not.toContainText(
        'Subject guides list currently unavailable',
    );
    await guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page(page);
}

interface CourseReadingList {
    coursecode: string;
}

async function course_links_panel_loads_correctly_for_a_subject(page: Page, courseReadingList: CourseReadingList) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';

    // Blackboard link
    await expect(
        page.locator('a[data-testid=blackboard] span', {
            hasText: 'Learn.UQ (Blackboard)',
        }),
    ).toBeVisible();
    const url = new URL(page.url());
    await expect(page.locator('a[data-testid=blackboard]')).toHaveAttribute(
        'href',
        _courseLink(courseCode, 'https://learn.uq.edu.au/', url.hostname, url.pathname),
    );
    // ECP link
    await expect(
        page.locator('a[data-testid=ecp] span', {
            hasText: 'Electronic Course Profile',
        }),
    ).toBeVisible();
    await expect(page.locator('a[data-testid=ecp]')).toHaveAttribute(
        'href',
        _courseLink(
            courseCode,
            'https://www.uq.edu.au/study/course.html?course_code=[courseCode]',
            url.hostname,
            url.pathname,
        ),
    );
}

async function load_a_subject_in_learning_resource_page_search_tab(
    page: Page,
    courseCode: string,
    searchSuggestions: Array<{ name: string }>,
    typeChar = 'FREN',
    numberOfMatchingSubject = 3,
) {
    const frenchSearchSuggestion = searchSuggestions
        .filter(obj => {
            return obj.name === courseCode;
        })
        .pop();
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').clear();
    await expect(page.getByTestId('noCoursesFound')).not.toBeVisible();
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').type(typeChar);
    await expect(page.getByTestId('noCoursesFound')).not.toBeVisible();
    await expect(page.locator('ul#full-learningresource-autocomplete-listbox').locator(':scope > *')).toHaveCount(
        numberOfMatchingSubject + 1,
    ); // plus one for title
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').press('Backspace');
    await expect(page.locator('div[data-testid=full-learningresource-autocomplete] input')).toHaveValue(
        typeChar.substring(0, typeChar.length - 1),
    );
    // the backspace means we dont have enough char and the dropdown is emptied
    await expect(page.locator('ul#full-learningresource-autocomplete-listbox')).not.toBeVisible();
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').press('Backspace');
    await expect(page.locator('div[data-testid=full-learningresource-autocomplete] input')).toHaveValue(
        typeChar.substring(0, typeChar.length - 2),
    );
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').type(typeChar.slice(-2));
    // the drop down returns
    await expect(page.locator('ul#full-learningresource-autocomplete-listbox').locator(':scope > *')).toHaveCount(
        numberOfMatchingSubject + 1,
    );
    // click the first option
    await page
        .locator('li#full-learningresource-autocomplete-option-0')
        .getByText(
            `${frenchSearchSuggestion.course_title}, ${frenchSearchSuggestion.campus}, ${frenchSearchSuggestion.period}`,
        )
        .first()
        .click();
}

async function a_user_can_use_the_search_bar_to_load_a_subject(
    page: Page,
    courseReadingList: Record<string, string>,
    searchSuggestions: Array<{ name: string }>,
    typeChar = 'FREN',
    numberOfMatchingSubject = 3, // autocomplete finds this many entries for typeChar
    tabId = 0,
) {
    load_a_subject_in_learning_resource_page_search_tab(
        page,
        courseReadingList.coursecode,
        searchSuggestions,
        typeChar,
        numberOfMatchingSubject,
    );
    // the tab loads and we see the title of the correct course
    await expect(
        page
            .locator(`div[data-testid=classpanel-${tabId}] h3`)
            .getByText(courseReadingList.course_title)
            .first(),
    ).toBeVisible();
    await expect(page.locator(`div[data-testid=classpanel-${tabId}]`)).not.toContainText(
        'Reading list currently unavailable',
    );
    await expect(page.locator(`div[data-testid=classpanel-${tabId}]`)).not.toContainText(
        'Exam papers list currently unavailable',
    );
    await expect(page.locator(`div[data-testid=classpanel-${tabId}]`)).not.toContainText(
        'Subject guides list currently unavailable',
    );
}

async function a_user_with_no_classes_sees_notice_of_same_in_courses_list(page: Page) {
    await expect(
        page
            .locator('div[data-testid=no-classes]')
            .getByText(/No enrolled courses available/)
            .first(),
    ).toBeVisible();
}

async function the_user_sees_the_search_form(page: Page) {
    await expect(page.locator('[data-testid="learning-resource-search-input-field"] input')).toBeVisible();
}

async function click_on_a_subject_tab(page: Page, panelNumber: string, courseReadingList) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';
    const title = courseReadingList.course_title || 'mock data is missing';
    await page
        .locator(`button#classtab-${panelNumber}`)
        .getByText(courseCode)
        .first()
        .click();
    await expect(
        page
            .locator(`div[data-testid=classpanel-${panelNumber}] h2`)
            .getByText(title)
            .first(),
    ).toBeVisible();
}

async function the_title_block_displays_properly(page: Page, courseReadingList: Record<string, string>) {
    const listTitle = courseReadingList.course_title || 'mock data is missing1';
    const courseCode = courseReadingList.coursecode || 'mock data is missing2';
    await expect(
        page
            .locator('h2[data-testid=learning-resource-subject-title]')
            .getByText(listTitle)
            .first(),
    ).toBeVisible();
    await expect(
        page
            .locator('h2[data-testid=learning-resource-subject-title]')
            .getByText(courseCode)
            .first(),
    ).toBeVisible();
}

async function FREN1010_loads_properly_for_s111111_user(page: Page) {
    await the_user_lands_on_the_My_Classes_tab(page, FREN1010ReadingList);
    await the_title_block_displays_properly(page, FREN1010ReadingList);
    await expect(
        page
            .locator('[data-testid="learning-resource-subject-reading-list"] h3')
            .getByText(/Course reading lists/)
            .first(),
    ).toBeVisible();
    await expect(page.locator('div[data-testid="reading-list-FREN1010"]')).not.toContainText(
        'Reading list currently unavailable',
    );
    await exams_panel_loads_correctly_for_a_subject_with_many_exams(page, FREN1010Exam);
    await guides_panel_loads_correctly_for_a_subject_with_one_guide(page, FREN1010Guide, 'FREN1010');
    await course_links_panel_loads_correctly_for_a_subject(page, FREN1010ReadingList);
}

async function FREN1010LoadsProperly(page: Page) {
    await expect(
        page
            .getByTestId('learning-resource-subject-title')
            .getByText(/FREN1010 - Introductory French 1/)
            .first(),
    ).toBeVisible();
    await expect(
        page
            .getByTestId('reading-list-FREN1010-content')
            .getByText(/FREN1010 Reading list \(contains 2 items\)/)
            .first(),
    ).toBeVisible();

    await expect(page.locator('div[data-testid="reading-list-FREN1010"]')).not.toContainText(
        'Reading list currently unavailable',
    );
    await expect(
        page
            .getByTestId('past-exams-FREN1010-content')
            .getByText(/Past exam papers \(16 items\)/)
            .first(),
    ).toBeVisible();
    await expect(
        page
            .getByTestId('guides-FREN1010-content')
            .getByText(/French Studies/)
            .first(),
    ).toBeVisible();
    await expect(page.getByTestId('legalResearchEssentials-LAWS7107')).not.toBeVisible();
}

async function searchFor(page: Page, searchFor = 'FREN', selectCourseCode: string) {
    const searchSuggestionForThisCourse = subjectSearchSuggestions
        .filter(obj => {
            return obj.name === selectCourseCode;
        })
        .pop();
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').clear();
    await page.locator('div[data-testid=full-learningresource-autocomplete] input').type(searchFor);
    // click the first option
    await page
        .locator('li#full-learningresource-autocomplete-option-0')
        .getByText(
            `${searchSuggestionForThisCourse.course_title}, ${searchSuggestionForThisCourse.campus}, ${searchSuggestionForThisCourse.period}`,
        )
        .first()
        .click();
}

test.describe('Learning Resources Accessibility', () => {
    test('LR is accessible', async ({ page }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[data-testid="learning-resources"]')
                .getByText(/Your courses/)
                .first(),
        ).toBeVisible();
        await page.waitForTimeout(1000);
        await assertAccessibility(page, 'div[data-testid="learning-resources"]');
    });
    test('Responsive display is accessible', async ({ page }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 414, height: 736 });
        await expect(
            page
                .locator('div[data-testid="learning-resources"]')
                .getByText(/Your courses/)
                .first(),
        ).toBeVisible();
        await page.waitForTimeout(1000);
        await assertAccessibility(page, 'div[data-testid="learning-resources"]');
    });
});
test.describe('Learning Resources Access', () => {
    test('A non-loggedin user cannot access Learning Resources', async ({ page }) => {
        await page.goto('/learning-resources?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/The requested page is available to authenticated users only\./)
                .first(),
        ).toBeVisible();
    });
    test('A loggedin user without Learning Resource privs cannot access Learning Resources', async ({ page }) => {
        await page.goto('/learning-resources?user=emcommunity');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/The requested page is available to authorised users only\./)
                .first(),
        ).toBeVisible();
    });
    test('an rhd user, who is only doing research subjects can access the learning resources page', async ({
        page,
    }) => {
        await page.goto(
            '/learning-resources?user=s2222222&coursecode=PHYS1101E&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/PHYS1101E/)
                .first(),
        ).toBeVisible();
    });
    test('an rhd user, who is doing non research subjects can access the learning resources page', async ({ page }) => {
        await page.goto(
            '/learning-resources?user=s6666666&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/FREN1010/)
                .first(),
        ).toBeVisible();
    });
});
test.describe('The Learning Resources Page', () => {
    test('has breadcrumbs', async ({ page }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('subsite-title')
                .getByText(/Learning resources/)
                .first(),
        ).toBeVisible();
    });
    test('User with classes sees their classes', async ({ page }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/FREN1010 - Introductory French 1/)
                .first(),
        ).toBeVisible();
        await click_on_a_subject_tab(page, 1, HIST1201ReadingList);
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/HIST1201 - The Australian Experience/)
                .first(),
        ).toBeVisible();
        await click_on_a_subject_tab(page, 2, PHIL1002ReadingList);
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/PHIL1002 - Introduction to Philosophy: What is Philosophy\?/)
                .first(),
        ).toBeVisible();

        await click_on_a_subject_tab(page, 1, HIST1201ReadingList);
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/HIST1201 - The Australian Experience/)
                .first(),
        ).toBeVisible();
        await the_user_clicks_on_the_Search_tab(page);
        await the_user_sees_the_search_form(page);
    });
    test('User without classes sees the search field', async ({ page }) => {
        await page.goto('/learning-resources?user=s3333333');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_lands_on_the_Search_tab(page);
        await a_user_can_use_the_search_bar_to_load_a_subject(page, FREN1010ReadingList, subjectSearchSuggestions);
        await FREN1010LoadsProperly(page);
        await the_user_clicks_on_the_My_Courses_tab(page);
        await a_user_with_no_classes_sees_notice_of_same_in_courses_list(page);
    });
    test('A user who has arrived by clicking on the homepage own course gets the course they requested', async ({
        page,
    }) => {
        await page.goto(
            '/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await page.setViewportSize({ width: 1300, height: 1000 });
        await FREN1010_loads_properly_for_s111111_user(page);
    });
    test('A user who has arrived by searching for a course on the homepage gets the course they requested', async ({
        page,
    }) => {
        await page.goto(
            '/learning-resources?user=s1111111&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_lands_on_the_Search_tab(page);
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/ACCT1101 - Accounting for Decision Making/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('[data-testid="reading-list-ACCT1101-content"] h4')
                .getByText(/Course reading lists/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/ACCT1101 Reading list \(contains 2 items\)/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('div[data-testid="reading-list-ACCT1101"]')).not.toContainText(
            'Reading list currently unavailable',
        );
        await exams_panel_loads_correctly_for_a_subject_with_many_exams(page, ACCT1101Exam, 'searchresults');

        await guides_panel_loads_correctly_for_a_subject_with_one_guide(
            page,
            ACCT1101Guide,
            'ACCT1101',
            'searchresults',
        );

        await course_links_panel_loads_correctly_for_a_subject(page, ACCT1101ReadingList);
    });
    test('A user who searches for a course that happens to have a blank campus gets the course they requested', async ({
        page,
    }) => {
        await page.goto('/learning-resources?user=s3333333&coursecode=FREN1011&campus=&semester=Semester%202%202020');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_lands_on_the_Search_tab(page);
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/FREN1011 - Introductory French 1 extended/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('[data-testid="reading-list-FREN1011-content"] h4')
                .getByText(/Course reading lists/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/FREN1011 Reading list \(contains 11 items\)/)
                .first(),
        ).toBeVisible();
        await exams_panel_loads_correctly_for_a_subject_with_many_exams(
            page,
            FREN1011Exam,
            'searchresults',
            's3333333',
        );
        await guides_panel_loads_correctly_for_a_subject_with_one_guide(
            page,
            FREN1010Guide,
            'FREN1011',
            'searchresults',
        );
        await course_links_panel_loads_correctly_for_a_subject(page, FREN1011ReadingList);
    });
    test('A user who searches for a subject they are enrolled in will be changed to the mycourses tab', async ({
        page,
    }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_clicks_on_the_Search_tab(page);
        await the_user_sees_the_search_form(page);
        await load_a_subject_in_learning_resource_page_search_tab(
            page,
            FREN1010ReadingList.coursecode,
            subjectSearchSuggestions,
        );
        await FREN1010_loads_properly_for_s111111_user(page);
    });
    test('A user who searches for multiple subjects can switch between the tabs for each one', async ({ page }) => {
        async function HIST1201LoadsProperly(page: Page) {
            await expect(
                page
                    .getByTestId('learning-resource-subject-title')
                    .getByText(/HIST1201/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('reading-list-HIST1201-content')
                    .getByText(/HIST1201 Reading list \(contains 35 items\)/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('past-exams-HIST1201-content')).toBeVisible();
            await expect(
                page
                    .getByTestId('past-exams-HIST1201-content')
                    .getByText(/Past exam papers \(1 item\)/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('guides-false-content')).toBeVisible();
            await expect(
                page
                    .getByTestId('guides-false-content')
                    .getByText(/No subject guides/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('legalResearchEssentials')).not.toBeVisible();
        }

        async function ACCT1101LoadsProperly(page: Page) {
            await expect(
                page
                    .getByTestId('learning-resource-subject-title')
                    .getByText(/ACCT1101/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('reading-list-ACCT1101-content')
                    .getByText(/ACCT1101 Reading list \(contains 2 items\)/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('past-exams-ACCT1101-content')
                    .getByText(/Past exam papers \(9 items\)/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('guides-ACCT1101-content')
                    .getByText(/Accounting/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('legalResearchEssentials')).not.toBeVisible();
        }

        await page.goto('/learning-resources?user=s3333333');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_lands_on_the_Search_tab(page);
        await searchFor(page, 'FREN', 'FREN1010');
        await FREN1010LoadsProperly(page);
        // search for PHYS1101E
        await searchFor(page, 'PHYS', 'PHYS1101E');
        await expect(
            page
                .getByTestId('learning-resource-subject-title')
                .getByText(/PHYS1101E/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('reading-list-PHYS1101E-content')
                .getByText(/No Reading list for this course/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('past-exams-false-content')
                .getByText(/No Past Exam Papers for this course/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('no-guides')).toHaveText(/No subject guides for this course/);

        // swap tabs to FREN1010 - at one point swapping from an error to an ok wiped the ok :(
        await page
            .getByTestId('classtab-FREN1010')
            .getByText(/FREN1010/)
            .first()
            .click();
        await expect(
            page
                .locator('div[data-testid=classpanel-0] h3')
                .getByText(/FREN1010/)
                .first(),
        ).toBeVisible();
        await FREN1010LoadsProperly(page);
        await searchFor(page, 'HIST', 'HIST1201');
        await HIST1201LoadsProperly(page);
        await searchFor(page, 'ACCT', 'ACCT1101');
        await ACCT1101LoadsProperly(page);
        // swap tabs to FREN1010
        await page
            .getByTestId('classtab-FREN1010')
            .getByText(/FREN1010/)
            .first()
            .click();
        await expect(
            page
                .locator('div[data-testid=classpanel-0] h3')
                .getByText(/FREN1010/)
                .first(),
        ).toBeVisible();
        await FREN1010LoadsProperly(page);
        // swap tabs to HIST1201
        await page
            .getByTestId('classtab-HIST1201')
            .getByText(/HIST1201/)
            .first()
            .click();

        await HIST1201LoadsProperly(page);
        await searchFor(page, 'ACCT', 'ACCT1101');
        await ACCT1101LoadsProperly(page);
        await expect(page.locator('header [role="tablist"] button')).toHaveCount(4);
    });
    test('A user putting a space in a search still gets their result on the full page', async ({ page }) => {
        await page.goto('/learning-resources?user=s3333333');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // enter a repeating string
        await page.locator('input[data-testid="full-learningresource-autocomplete-input-wrapper"]').clear();
        await page.locator('input[data-testid="full-learningresource-autocomplete-input-wrapper"]').fill('FREN 1');
        // and the drop-down will not appear
        await expect(page.locator('ul#full-learningresource-autocomplete-listbox').locator(':scope > *')).toHaveCount(
            3 + 1,
        );
    });

    async function hasExamReadMoreLink(page: Page) {
        await expect(
            page
                .locator('[data-testid="exams-readmore"] a span')
                .getByText(/Read more about past exam papers/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="exams-readmore"] a')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/study-and-learning-support/coursework/past-exam-papers',
        );
    }

    test("the content on a tab from url parameters is correct when it isnt the first one on the user's account", async ({
        page,
    }) => {
        await page.goto(
            '/learning-resources?coursecode=HIST1201&campus=St%20Lucia&semester=Semester%202%202020&user=s1111111',
        );
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/HIST1201 Reading list \(contains 35 items\)/)
                .first(),
        ).toBeVisible();

        await expect(page.getByTestId('learning-resource-subject-title')).toContainText('HIST1201');
        await expect(page.getByTestId('learning-resource-subject-title')).toContainText('The Australian Experience');
        await hasExamReadMoreLink(page);
        await expect(page.getByTestId('exam-list-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('examPaperItem-0')).toContainText('Semester 1 2016');
        await expect(page.getByTestId('no-guides')).toContainText('No subject guides for this course');
    });
    test('the content on the french tab is correct', async ({ page }) => {
        await page.goto(
            '/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/FREN1010 Reading list \(contains 2 items\)/)
                .first(),
        ).toBeVisible();

        await expect(page.getByTestId('learning-resource-subject-title')).toContainText('FREN1010');
        await expect(page.getByTestId('learning-resource-subject-title')).toContainText('Introductory French 1');
        await hasExamReadMoreLink(page);
        await expect(page.getByTestId('exam-list-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('examPaperItem-0')).toContainText('Semester 2 2019');
        await expect(page.getByTestId('examPaperItem-1')).toContainText('Semester 1 2019');
        await expect(page.getByTestId('exam-more-link')).toContainText('14 more past papers');
        await expect(page.locator('[data-testid="guides-FREN1010-content"] > div').locator(':scope > *')).toHaveCount(
            3,
        );
        await expect(page.getByTestId('guide-0')).toContainText('French Studies');
    });
    test('the content on the Philosophy tab is correct', async ({ page }) => {
        await page.goto(
            '/learning-resources?user=s1111111&coursecode=PHIL1002&campus=St%20Lucia&semester=Semester%203%202020',
        );
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/PHIL1002 \(has 2 reading lists\)/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('learning-resource-subject-title')).toContainText(
            'PHIL1002 - Introduction to Philosophy: What is Philosophy?',
        );
        await hasExamReadMoreLink(page);
        await expect(page.getByTestId('exam-list-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-exam-papers')).toContainText('No Past Exam Papers for this course');
        await expect(page.locator('[data-testid="guides-PHIL1002-content"] > div').locator(':scope > *')).toHaveCount(
            5,
        );
        await expect(page.getByTestId('guide-0')).toContainText('PHIL1002');
        await expect(page.getByTestId('guide-1')).toContainText('Philosophy');
        await expect(page.getByTestId('guide-2')).toContainText('Stuff');
    });
    test('a user who manages to load a subject that has no reading list informed so', async ({ page }) => {
        await page.goto(
            '/learning-resources?user=s3333333&coursecode=PHYS1101E&campus=St%20Lucia&semester=Semester%202%202020',
        );
        await expect(
            page
                .getByTestId('reading-list-PHYS1101E-content')
                .getByText(/No Reading list for this course/)
                .first(),
        ).toBeVisible();
    });
    test('A user sees an extra link on laws subjects', async ({ page }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await the_user_clicks_on_the_Search_tab(page);
        await the_user_sees_the_search_form(page);
        await searchFor(page, 'LAWS', 'LAWS7107');
        await expect(
            page
                .getByTestId('legalResearchEssentials')
                .getByText(/Legal Research Essentials/)
                .first(),
        ).toBeVisible();
    });
    test('when springshare returns an error, guides panel appears correctly', async ({ page }) => {
        await page.goto(
            '/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020&responseType=springshareError',
        );
        await expect(
            page
                .getByTestId('reading-list-link')
                .getByText(/FREN1010 Reading list \(contains 2 items\)/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('exams-springshare-error')).toBeVisible();
        await expect(
            page
                .getByTestId('exams-springshare-error')
                .getByText(/Exam papers list currently unavailable/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('guides-springshare-error').scrollIntoViewIfNeeded();
        await expect(
            page
                .getByTestId('guides-springshare-error')
                .getByText(/Subject guides list currently unavailable/)
                .first(),
        ).toBeVisible();
    });
});

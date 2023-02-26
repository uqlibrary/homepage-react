/* eslint camelcase: 0 */
/* eslint max-len: 0 */
import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { _courseLink, _pluralise } from '../../../src/modules/Pages/LearningResources/shared/learningResourcesHelpers';
import { default as FREN1010ReadingList } from '../../../src/data/mock/data/records/courseReadingList_FREN1010';
import { default as FREN1011ReadingList } from '../../../src/data/mock/data/records/courseReadinglist_FREN1011';
import { default as FREN1010Guide } from '../../../src/data/mock/data/records/libraryGuides_FREN1010';
import { default as FREN1010Exam } from '../../../src/data/mock/data/records/examListFREN1010';
import { default as FREN1011Exam } from '../../../src/data/mock/data/records/examListFREN1011';
import { default as HIST1201ReadingList } from '../../../src/data/mock/data/records/courseReadingList_HIST1201';
import { default as PHIL1002ReadingList } from '../../../src/data/mock/data/records/courseReadingList_PHIL1002';
import { default as PHIL1002Guide } from '../../../src/data/mock/data/records/libraryGuides_PHIL1002';
import { default as ACCT1101ReadingList } from '../../../src/data/mock/data/records/courseReadingList_ACCT1101';
import { default as ACCT1101Guide } from '../../../src/data/mock/data/records/libraryGuides_ACCT1101';
import { default as ACCT1101Exam } from '../../../src/data/mock/data/records/examListACCT1101';
import { default as learningResourceSearchSuggestions } from '../../../src/data/mock/data/records/learningResourceSearchSuggestions';
import { getReadingListHeader, readingListLength } from '../../support/helpers';

function the_user_lands_on_the_My_Classes_tab(courseReadingList, panelId = 0) {
    const title = courseReadingList.course_title || 'mock data is missing';

    cy.get('div[data-testid="learning-resources"]').contains(locale.myCourses.title);

    cy.get(`div[data-testid=classpanel-${panelId}] h2`).contains(title);
}

function the_user_lands_on_the_Search_tab() {
    cy.get('div[data-testid="learning-resources"]').contains(locale.search.title);
}

function the_user_clicks_on_the_My_Courses_tab() {
    cy.get('button#topmenu-0')
        .contains(locale.myCourses.title)
        .click();
}

function the_user_clicks_on_the_Search_tab() {
    cy.get('button#topmenu-1')
        .contains(locale.search.title)
        .click();
}

function firstReadingListItems(courseReadingList) {
    return readingListLength(courseReadingList) > 0 ? courseReadingList.reading_lists[0].list[0] : [];
}

function reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
    courseCode,
    courseReadingList,
    headerLevel = 'h3',
) {
    const readingList = firstReadingListItems(courseReadingList);
    const firstReadingListTitle = readingList.title || 'mock data is missing';
    const firstReadingListLink = readingList.itemLink || 'mock data is missing';
    const readingListHeader = getReadingListHeader(FREN1010ReadingList);
    cy.get('[data-testid="learning-resource-subject-reading-list"]')
        .find(`${headerLevel}`)
        .contains(readingListHeader);
    cy.get(`div[data-testid="reading-list-${courseCode}"`).should('not.contain', 'Reading list currently unavailable');
    cy.get('[data-testid="learning-resource-subject-reading-list"]')
        .find('a')
        .contains(firstReadingListTitle)
        .should('have.attr', 'href', firstReadingListLink);
}

function reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_of_more_than_the_max_displayable_items(
    courseReadingList,
    headerLevel = 'h3',
) {
    const readingList =
        !!courseReadingList.reading_lists &&
        courseReadingList.reading_lists.length > 0 &&
        courseReadingList.reading_lists[0];
    const readingListLink = readingList.url || 'mock data is missing';
    const readingListHeader = getReadingListHeader(courseReadingList);
    cy.get(`[data-testid="learning-resource-subject-reading-list"] ${headerLevel}`).contains(readingListHeader);
    const numberExcessReadingLists =
        readingListLength(courseReadingList) - locale.myCourses.readingLists.visibleItemsCount;
    cy.get('div[data-testid=reading-list-more-link] a')
        .contains(`${numberExcessReadingLists} more items`)
        .should('have.attr', 'href', readingListLink);
}

function reading_list_panel_loads_correctly_for_a_subject_with_multiple_reading_lists(courseReadingList, coursecode) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';

    const multipleLabel = locale.myCourses.readingLists.error.multiple.replace('[classnumber]', courseCode);
    expect(multipleLabel).contains(coursecode);
    cy.get('p[data-testid=reading-list-multiple-label]').contains(multipleLabel);
    cy.get('a[data-testid=multiple-reading-list-search-link]')
        .contains(locale.myCourses.readingLists.error.footer.linkLabel)
        .should('have.attr', 'href', locale.myCourses.readingLists.error.footer.linkOut);
}

function exams_panel_loads_correctly_for_a_subject_with_no_exams(coursecode) {
    cy.get(`div[data-testid=past-exams-${coursecode}]`).contains(locale.myCourses.examPapers.none);
    cy.get(`div[data-testid=past-exams-${coursecode}] a`).should(
        'have.attr',
        'href',
        _courseLink('', locale.myCourses.examPapers.footer.noPastExams.linkOut),
    );
}

function exams_panel_loads_correctly_for_a_subject_with_one_exam() {
    cy.get('div[data-testid=exam-more-link] a').should('not.exist');
}

function exams_panel_loads_correctly_for_a_subject_with_many_exams(examPapers, displayType = 'mycourses') {
    const headerLevel = displayType === 'mycourses' ? 'h3' : 'h4';

    const courseCode = examPapers.coursecode || 'mock data is missing';

    const examPaper = (!!examPapers.list && examPapers.list.length > 0 && examPapers.list[0]) || {};
    const examPeriod = examPaper.period || 'mock data is missing';
    const examPaperLink = examPaper.url || 'mock data is missing';

    cy.get(`div[data-testid="past-exams-${courseCode}"`).should(
        'not.contain',
        'Exam papers list currently unavailable',
    );

    const numberExcessExams = examPapers.remainingCount || 0;
    const totalExamItems = examPapers.list.length + numberExcessExams;
    cy.get('[data-testid="learning-resource-subject-exams"]')
        .find(`${headerLevel}`)
        .contains(`${locale.myCourses.examPapers.title} (${totalExamItems} items)`);
    cy.get('[data-testid="learning-resource-subject-exams"]')
        .find('a')
        .contains(`${examPeriod} (${examPaperLink.slice(-3).toUpperCase()})`)
        .should('have.attr', 'href', examPaperLink);
    cy.get('div[data-testid=exam-more-link] a')
        .contains(
            locale.myCourses.examPapers.footer.morePastExams.linkLabel
                .replace('[numberExcessExams]', numberExcessExams)
                .replace('[examNumber]', _pluralise('paper', numberExcessExams)),
        )
        .should(
            'have.attr',
            'href',
            _courseLink(courseCode, locale.myCourses.examPapers.footer.morePastExams.linkOutPattern),
        );
}

function guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page() {
    locale.myCourses.guides.footer.links.map(link => {
        const guideId = link.id || 'mock-data-is-missing';
        const guideTitle = link.linkLabel || 'mock data is missing';
        const guideLink = link.linkTo || 'mock data is missing';

        cy.get(`a[data-testid=${guideId}]`)
            .contains(guideTitle)
            .should('have.attr', 'href', guideLink);
    });
}

function guides_panel_loads_correctly_for_a_subject_with_zero_guides() {
    cy.get('div[data-testid=no-guides]').contains(locale.myCourses.guides.none);

    guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page();
}

function guides_panel_loads_correctly_for_a_subject_with_many_guides(guidesList, coursecode) {
    cy.get(`div[data-testid=guides-${coursecode}] h3`).contains(`${locale.myCourses.guides.title}`);

    const numGuides = guidesList.length - 1;
    const numGuidesVisible =
        numGuides > locale.myCourses.guides.visibleItemsCount ? locale.myCourses.guides.visibleItemsCount : numGuides;
    guidesList.map((guide, index) => {
        const guideTitle = guide.title || 'mock data is missing';
        const guideLink = guide.url || 'mock data is missing';
        if (index >= numGuidesVisible) {
            cy.get(`div[data-testid=guides-${coursecode}]`).should('not.have.value', guideTitle);
        } else {
            cy.get(`div[data-testid=guides-${coursecode}] a`)
                .contains(guideTitle)
                .should('have.attr', 'href', guideLink);
        }
    });

    guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page();
}

function guides_panel_loads_correctly_for_a_subject_with_one_guide(guides, coursecode, displayType = 'mycourses') {
    const headerLevel = displayType === 'mycourses' ? 'h3' : 'h4';

    const guide = guides[0] || {};
    const guideTitle = guide.title || 'mock data is missing';
    const guideLink = guide.url || 'mock data is missing';

    cy.get(`[data-testid=guides-${coursecode}] ${headerLevel}`).contains(locale.myCourses.guides.title);
    cy.get(`div[data-testid=guides-${coursecode}] a`)
        .contains(guideTitle)
        .should('have.attr', 'href', guideLink);
    cy.get(`div[data-testid="guides-${coursecode}"]`).should(
        'not.contain',
        'Subject guides list currently unavailable',
    );

    guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page();
}

function course_links_panel_loads_correctly_for_a_subject(courseReadingList) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';

    expect(locale.myCourses.courseLinks.links).to.be.an('array');
    expect(locale.myCourses.courseLinks.links.length).to.not.equals(0);
    locale.myCourses.courseLinks.links.map(item => {
        cy.get(`a[data-testid=${item.id}-${courseCode}]`)
            .contains(item.linkLabel)
            .should('have.attr', 'href', _courseLink(courseCode, item.linkOutPattern));
    });
}

function load_a_subject_in_learning_resource_page_search_tab(
    courseReadingList,
    searchSuggestions,
    typeChar = 'FREN',
    numberOfMatchingSubject = 3, // autocomplete finds this many entries for typeChar
) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';
    const frenchSearchSuggestion = searchSuggestions
        .filter(obj => {
            return obj.name === courseCode;
        })
        .pop();

    // cy.get('div[data-testid=full-learningresource-autocomplete] input')
    //     .should('exist')
    //     .type('WXYZ');
    // cy.get('[data-testid="noCoursesFound"]').contains(locale.search.noResultsText);

    cy.get('div[data-testid=full-learningresource-autocomplete] input').clear();
    cy.get('[data-testid="noCoursesFound"]').should('not.exist');

    cy.get('div[data-testid=full-learningresource-autocomplete] input').type(typeChar);
    cy.get('[data-testid="noCoursesFound"]').should('not.exist');

    cy.get('ul#full-learningresource-autocomplete-popup')
        .children()
        .should('have.length', numberOfMatchingSubject + 1); // plus one for title

    cy.log('backspace one char');
    cy.get('div[data-testid=full-learningresource-autocomplete] input').type('{backspace}');
    cy.get('div[data-testid=full-learningresource-autocomplete] input').should(
        'have.value',
        typeChar.substring(0, typeChar.length - 1),
    );
    // the backspace means we dont have enough char and the dropdown is emptied
    cy.get('ul#full-learningresource-autocomplete-popup').should('not.exist');

    cy.get('div[data-testid=full-learningresource-autocomplete] input').type('{backspace}');
    cy.get('div[data-testid=full-learningresource-autocomplete] input').should(
        'have.value',
        typeChar.substring(0, typeChar.length - 2),
    );

    // re-enter the characters
    cy.get('div[data-testid=full-learningresource-autocomplete] input').type(typeChar.slice(-2));
    // the drop down returns
    cy.get('ul#full-learningresource-autocomplete-popup')
        .children()
        .should('have.length', numberOfMatchingSubject + 1);

    // click the first option
    cy.get('li#full-learningresource-autocomplete-option-0')
        .contains(
            `${frenchSearchSuggestion.course_title}, ${frenchSearchSuggestion.campus}, ${frenchSearchSuggestion.period}`,
        )
        .click();
}

function a_user_can_use_the_search_bar_to_load_a_subject(
    courseReadingList,
    searchSuggestions,
    typeChar = 'FREN',
    numberOfMatchingSubject = 3, // autocomplete finds this many entries for typeChar
    tabId = 0,
) {
    load_a_subject_in_learning_resource_page_search_tab(
        courseReadingList,
        searchSuggestions,
        typeChar,
        numberOfMatchingSubject,
    );

    // the tab loads and we see the title of the correct course
    cy.get(`div[data-testid=classpanel-${tabId}] h3`).contains(courseReadingList.course_title);
    cy.get(`div[data-testid=classpanel-${tabId}]`).should('not.contain', 'Reading list currently unavailable');
    cy.get(`div[data-testid=classpanel-${tabId}]`).should('not.contain', 'Exam papers list currently unavailable');
    cy.get(`div[data-testid=classpanel-${tabId}]`).should('not.contain', 'Subject guides list currently unavailable');
}

function a_user_with_no_classes_sees_notice_of_same_in_courses_list() {
    cy.get('div[data-testid=no-classes]').contains(locale.myCourses.none.title);
}

function the_user_sees_the_search_form() {
    cy.get('div[data-testid=full-learningresource-autocomplete] input').should(
        'have.attr',
        'placeholder',
        locale.search.placeholder,
    );
}

function click_on_a_subject_tab(panelNumber, courseReadingList) {
    const courseCode = courseReadingList.coursecode || 'mock data is missing';
    const title = courseReadingList.course_title || 'mock data is missing';
    cy.get(`button#classtab-${panelNumber}`)
        .contains(courseCode)
        .click();
    cy.get(`div[data-testid=classpanel-${panelNumber}] h2`).contains(title);
}

function the_user_clicks_on_the_second_subject_tab(courseReadingList) {
    click_on_a_subject_tab(1, courseReadingList);
}

function the_user_clicks_on_the_third_subject_tab(courseReadingList) {
    click_on_a_subject_tab(2, courseReadingList);
}

function the_title_block_displays_properly(courseReadingList) {
    const listTitle = courseReadingList.course_title || 'mock data is missing1';
    const coursecode = courseReadingList.coursecode || 'mock data is missing2';
    cy.get('h2[data-testid=learning-resource-subject-title]').contains(listTitle);
    cy.get('h2[data-testid=learning-resource-subject-title]').contains(coursecode);
}

function FREN1010_loads_properly_for_s111111_user() {
    the_user_lands_on_the_My_Classes_tab(FREN1010ReadingList);

    the_title_block_displays_properly(FREN1010ReadingList);

    reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
        'FREN1010',
        FREN1010ReadingList,
    );

    exams_panel_loads_correctly_for_a_subject_with_many_exams(FREN1010Exam);

    guides_panel_loads_correctly_for_a_subject_with_one_guide(FREN1010Guide, 'FREN1010');

    course_links_panel_loads_correctly_for_a_subject(FREN1010ReadingList);
}

context('Learning Resources Accessibility', () => {
    it('LR is accessible', () => {
        cy.visit('/learning-resources?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="learning-resources"]').contains('My courses');
        cy.log('Learning Resources');
        cy.checkA11y('div[data-testid="learning-resources"]', {
            reportName: 'Learning Resources',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Responsive display is accessible', () => {
        cy.visit('/learning-resources?user=s1111111');
        cy.injectAxe();
        cy.viewport(414, 736);
        cy.get('div[data-testid="learning-resources"]').contains('My courses');
        cy.log('Learning Resources');
        cy.checkA11y('div[data-testid="learning-resources"]', {
            reportName: 'Learning Resources',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

context('Learning Resources Access', () => {
    it('A non-loggedin user cannot access Learning Resources', () => {
        cy.visit('/learning-resources?user=public');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authenticated users only.');
    });

    it('A loggedin user without Learning Resource privs cannot access Learning Resources', () => {
        cy.visit('/learning-resources?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');
    });
});

context('The Learning Resources Page', () => {
    /**
     * Show a user with 3 classes can see all the variations correctly
     * The mock data has been selected to cover the display options:
     *
     *          |  reading lists                    | exams         | guides         |
     * ---------+-----------------------------------+---------------+----------------+
     * FREN1010 | has 1 list with exactly 2 entries | has > 2 exams | has 1 guide    |
     * ---------+-----------------------------------+---------------+----------------+
     * HIST1201 | has 1 list with > 2 entries       | has 1 exams   | has 0 guides   |
     * ---------+-----------------------------------+---------------+----------------+
     * PHIL1002 | has > 1 list reading lists        | has 0 exams   | has > 2 guides |            |
     * ---------+-----------------------------------+---------------+----------------+
     *
     * NOTE: purely for coverage, this test is duplicated into cypress/adminPages/learning-resources
     *
     */
    it('User with classes sees their classes', () => {
        cy.visit('/learning-resources?user=s1111111');
        cy.viewport(1300, 1000);

        FREN1010_loads_properly_for_s111111_user();

        // next tab
        the_user_clicks_on_the_second_subject_tab(HIST1201ReadingList);

        reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_of_more_than_the_max_displayable_items(
            HIST1201ReadingList,
        );

        exams_panel_loads_correctly_for_a_subject_with_one_exam();

        guides_panel_loads_correctly_for_a_subject_with_zero_guides();

        // next tab
        the_user_clicks_on_the_third_subject_tab(PHIL1002ReadingList);

        reading_list_panel_loads_correctly_for_a_subject_with_multiple_reading_lists(PHIL1002ReadingList, 'PHIL1002');

        exams_panel_loads_correctly_for_a_subject_with_no_exams('PHIL1002');

        guides_panel_loads_correctly_for_a_subject_with_many_guides(PHIL1002Guide, 'PHIL1002');

        // and back to the second tab (to load a tab where we don't need to reload the data)
        the_user_clicks_on_the_second_subject_tab(HIST1201ReadingList);

        // next tab
        the_user_clicks_on_the_Search_tab();
        the_user_sees_the_search_form();
    });

    it('User without classes sees the search field', () => {
        cy.visit('/learning-resources?user=s3333333');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        a_user_can_use_the_search_bar_to_load_a_subject(FREN1010ReadingList, learningResourceSearchSuggestions);
        const readingListHeader = getReadingListHeader(FREN1010ReadingList);
        cy.get('[data-testid="reading-list-FREN1010"]').contains(readingListHeader);
        cy.get('[data-testid="past-exams-FREN1010"]').contains('Past exam papers (16 items)');
        cy.get('[data-testid="guides-FREN1010"]').should('contain', 'French Studies');

        the_user_clicks_on_the_My_Courses_tab();
        a_user_with_no_classes_sees_notice_of_same_in_courses_list();
    });

    it('A user who has arrived by clicking on the homepage own course gets the course they requested', () => {
        cy.visit(
            '/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
        );
        cy.viewport(1300, 1000);

        the_user_lands_on_the_My_Classes_tab(FREN1010ReadingList);

        FREN1010_loads_properly_for_s111111_user();
    });

    it('A user who has arrived by searching for a course on the homepage gets the course they requested', () => {
        cy.visit(
            '/learning-resources?user=s1111111&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020',
        );
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
            'ACCT1101',
            ACCT1101ReadingList,
            'h4',
        );

        exams_panel_loads_correctly_for_a_subject_with_many_exams(ACCT1101Exam, 'searchresults');

        guides_panel_loads_correctly_for_a_subject_with_one_guide(ACCT1101Guide, 'ACCT1101', 'searchresults');

        course_links_panel_loads_correctly_for_a_subject(ACCT1101ReadingList);
    });

    it('A user who searches for a course that happens to have a blank campus gets the course they requested', () => {
        cy.visit('/learning-resources?user=s1111111&coursecode=FREN1011&campus=&semester=Semester%202%202020');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab(FREN1011ReadingList);

        reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_of_more_than_the_max_displayable_items(
            FREN1011ReadingList,
            'h4',
        );

        exams_panel_loads_correctly_for_a_subject_with_many_exams(FREN1011Exam, 'searchresults');

        guides_panel_loads_correctly_for_a_subject_with_one_guide(FREN1010Guide, 'FREN1011', 'searchresults');

        course_links_panel_loads_correctly_for_a_subject(FREN1011ReadingList);
    });

    it('A user who searches for a subject they are enrolled in will be changed to the mycourses tab', () => {
        cy.visit('/learning-resources?user=s1111111');
        cy.viewport(1300, 1000);

        the_user_clicks_on_the_Search_tab();

        the_user_sees_the_search_form();

        load_a_subject_in_learning_resource_page_search_tab(FREN1010ReadingList, learningResourceSearchSuggestions);

        FREN1010_loads_properly_for_s111111_user();
    });

    it('A user who searches for multiple subjects can switch between the tabs for each one', () => {
        cy.visit('/learning-resources?user=s3333333');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        a_user_can_use_the_search_bar_to_load_a_subject(FREN1010ReadingList, learningResourceSearchSuggestions);

        a_user_can_use_the_search_bar_to_load_a_subject(
            HIST1201ReadingList,
            learningResourceSearchSuggestions,
            'HIST',
            1,
            1,
        );

        a_user_can_use_the_search_bar_to_load_a_subject(
            ACCT1101ReadingList,
            learningResourceSearchSuggestions,
            'ACCT',
            8,
            2,
        );

        cy.get('[data-testid=classtab-FREN1010]')
            .contains('FREN1010')
            .click();
        cy.get('div[data-testid=classpanel-0] h3').contains('FREN1010');

        cy.get('[data-testid=classtab-HIST1201]')
            .contains('HIST1201')
            .click();
        cy.get('div[data-testid=classpanel-1] h3').contains('HIST1201');

        // search again and go to the existing tab
        a_user_can_use_the_search_bar_to_load_a_subject(
            ACCT1101ReadingList,
            learningResourceSearchSuggestions,
            'ACCT',
            8,
            2,
        );
    });

    // it('A repeating string is handled correctly', () => {
    //     cy.visit('/learning-resources?user=s3333333');
    //     cy.viewport(1300, 1000);
    //
    //     // enter a repeating string
    //     cy.get('input[data-testid="full-learningresource-autocomplete-input-wrapper"]').type('AAAAA');
    //     // and the drop down will not appear
    //     cy.get('ul#full-learningresource-autocomplete-popup').should('not.exist');
    // });

    it('A user putting a space in a search still gets their result on the full page', () => {
        cy.visit('/learning-resources?user=s3333333');
        cy.viewport(1300, 1000);

        // enter a repeating string
        cy.get('input[data-testid="full-learningresource-autocomplete-input-wrapper"]')
            .clear()
            .type('FREN 1');
        // and the drop-down will not appear
        cy.get('ul#full-learningresource-autocomplete-popup')
            .children()
            .should('have.length', 3 + 1);
    });

    // a subject with one reading list which contains more than the minimum number displays correctly
    it('the content on the history tab is correct', () => {
        cy.visit(
            '/learning-resources?coursecode=HIST1201&campus=St%20Lucia&semester=Semester%202%202020&user=s1111111',
        );
        cy.waitUntil(() =>
            cy
                .get('[data-testid="reading-list-HIST1201-content"]')
                .should('exist')
                .should('contain', 'Reading list for Semester 2 2020 at St Lucia (35 items)'),
        );

        cy.get('[data-testid="learning-resource-subject-title"]').should('contain', 'HIST1201');
        cy.get('[data-testid="learning-resource-subject-title"]').should('contain', 'The Australian Experience');
        cy.get('[data-testid="reading-list-HIST1201-content"]').should(
            'contain',
            'Reading list for Semester 2 2020 at St Lucia (35 items)',
        );
        cy.get('[data-testid="reading-list-0"]').should('contain', 'True stories: history, politics, aboriginality');
        cy.get('[data-testid="reading-list-1"]').should('contain', 'Warrior: a legendary');
        cy.get('[data-testid="reading-list-more-link"]').should('contain', '33 more items');
        cy.get('[data-testid="past-exams-HIST1201-content"] > div')
            .children()
            .should('have.length', 1);
        cy.get('[data-testid="examPaperItem-0"]').should('contain', 'Semester 1 2016');
        cy.get('[data-testid="no-guides"]').should('contain', 'No subject guides for this course');
    });

    // a subject with one reading list which has only the minimum number of items displays correctly
    it('the content on the french tab is correct', () => {
        cy.visit(
            '/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
        );
        cy.waitUntil(() =>
            cy
                .get('[data-testid="reading-list-FREN1010-content"] h3')
                .should('exist')
                .should('contain', 'Reading list for Semester 2 2020 at St Lucia (2 items)'),
        );

        cy.get('[data-testid="learning-resource-subject-title"]').should('contain', 'FREN1010');
        cy.get('[data-testid="learning-resource-subject-title"]').should('contain', 'Introductory French 1');

        cy.get('[data-testid="reading-list-FREN1010-content"]').should(
            'contain',
            'Reading list for Semester 2 2020 at St Lucia (2 items)',
        );
        cy.get('[data-testid="reading-list-0"]').should('contain', 'Chahi, Fatiha');
        cy.get('[data-testid="reading-list-1"]').should('contain', 'Collins Robert French dictionary');
        cy.get('[data-testid="reading-list-more-link"]').should('not.exist');

        cy.get('[data-testid="past-exams-FREN1010-content"] > div')
            .children()
            .should('have.length', 3);
        cy.get('[data-testid="examPaperItem-0"]').should('contain', 'Semester 2 2019');
        cy.get('[data-testid="examPaperItem-1"]').should('contain', 'Semester 1 2019');
        cy.get('[data-testid="exam-more-link"]').should('contain', '14 more past papers');

        cy.get('[data-testid="guides-FREN1010-content"] > div')
            .children()
            .should('have.length', 3);
        cy.get('[data-testid="guide-0"]').should('contain', 'French Studies');
    });

    // a subject with multiple reading lists displays correctly
    it('the content on the Philosophy tab is correct', () => {
        cy.visit(
            '/learning-resources?user=s1111111&coursecode=PHIL1002&campus=St%20Lucia&semester=Semester%203%202020',
        );
        cy.waitUntil(() =>
            cy
                .get('[data-testid="reading-list-PHIL1002-content"]')
                .should('exist')
                .should('contain', 'Reading list for Semester 3 2020 at St Lucia'),
        );

        cy.get('[data-testid="learning-resource-subject-title"]').should('contain', 'PHIL1002');
        cy.get('[data-testid="learning-resource-subject-title"]').should(
            'contain',
            'Introduction to Philosophy: What is Philosophy?',
        );

        cy.get('[data-testid="reading-list-PHIL1002-content"]').should(
            'contain',
            'Reading list for Semester 3 2020 at St Lucia',
        );
        cy.get('[data-testid="reading-list-multiple-label"]').should(
            'contain',
            'More than one reading list found for PHIL1002. Please select a list:',
        );
        cy.get('[data-testid="reading-list-link-0"]').should('contain', 'PHIL1002 St Lucia, Summer 2022/23');
        cy.get('[data-testid="reading-list-link-1"]').should('contain', 'PHIL1002 St Lucia, Summer 2022/23');
        cy.get('[data-testid="reading-list-multiple-label"]')
            .parent()
            .children()
            .should('have.length', 4);

        cy.get('[data-testid="multiple-reading-list-search-link"]').should('contain', 'Search other reading lists');

        cy.get('[data-testid="past-exams-PHIL1002-content"] > div')
            .children()
            .should('have.length', 2);
        cy.get('[data-testid="no-exam-papers"]').should('contain', 'No Past Exam Papers for this course');

        cy.get('[data-testid="guides-PHIL1002-content"] > div')
            .children()
            .should('have.length', 5);
        cy.get('[data-testid="guide-0"]').should('contain', 'PHIL1002');
        cy.get('[data-testid="guide-1"]').should('contain', 'Philosophy');
        cy.get('[data-testid="guide-2"]').should('contain', 'Stuff');
    });
});
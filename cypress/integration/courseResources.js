/* eslint camelcase: 0 */
/* eslint max-len: 0 */
import { accounts } from '../../src/mock/data';
import { default as locale } from '../../src/modules/Pages/CourseResources/courseResources.locale';
import { _courseLink, _pluralise } from '../../src/modules/Pages/CourseResources/courseResourcesHelpers';
import { default as FREN1010ReadingList } from '../../src/mock/data/records/courseReadingList_FREN1010';
import { default as FREN1010Guide } from '../../src/mock/data/records/libraryGuides_FREN1010';
import { default as FREN1010Exam } from '../../src/mock/data/records/examListFREN1010';
import { default as HIST1201ReadingList } from '../../src/mock/data/records/courseReadingList_HIST1201';
import { default as PHIL1002ReadingList } from '../../src/mock/data/records/courseReadingList_PHIL1002';
import { default as PHIL1002Guide } from '../../src/mock/data/records/libraryGuides_PHIL1002';
import { default as ACCT1101ReadingList } from '../../src/mock/data/records/courseReadingList_ACCT1101';
import { default as ACCT1101Guide } from '../../src/mock/data/records/libraryGuides_ACCT1101';
import { default as ACCT1101Exam } from '../../src/mock/data/records/examListACCT1101';
import { default as learningResourceSearchSuggestions } from '../../src/mock/data/records/learningResourceSearchSuggestions';

context('Course Resources', () => {
    function the_user_lands_on_the_My_Classes_tab(courseReadingList, panelId = 0) {
        const title = courseReadingList.course_title || 'mock data is missing';

        cy.get('div[data-testid="course-resources"]').contains(locale.myCourses.title);

        cy.get(`div[data-testid=classpanel-${panelId}] h3`).contains(title);
    }

    function the_user_lands_on_the_Search_tab() {
        cy.get('div[data-testid="course-resources"]').contains(locale.search.title);
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

    function readingListLength(courseReadingList) {
        return (
            (!!courseReadingList.reading_lists &&
                courseReadingList.reading_lists.length > 0 &&
                !!courseReadingList.reading_lists[0] &&
                !!courseReadingList.reading_lists[0].list &&
                courseReadingList.reading_lists[0].list.length) ||
            0
        );
    }

    function firstReadingListItems(courseReadingList) {
        return readingListLength(courseReadingList) > 0 ? courseReadingList.reading_lists[0].list[0] : [];
    }

    function reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
        courseReadingList,
        displayType = 'mycourses',
    ) {
        const headerLevel = displayType === 'mycourses' ? 'h4' : 'h5';
        const readingList = firstReadingListItems(courseReadingList);
        const firstReadingListTitle = readingList.title || 'mock data is missing';
        const firstReadingListLink = readingList.itemLink || 'mock data is missing';

        cy.log(`${locale.myCourses.readingLists.title} (${readingListLength(courseReadingList)} items)`);
        cy.get(`.readingLists ${headerLevel}`).contains(
            `${locale.myCourses.readingLists.title} (${readingListLength(courseReadingList)} items)`,
        );
        cy.get('.readingLists a')
            .contains(firstReadingListTitle)
            .should('have.attr', 'href', firstReadingListLink);
    }

    function reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_of_more_than_the_max_displayable_items(
        courseReadingList,
    ) {
        const readingList =
            !!courseReadingList.reading_lists &&
            courseReadingList.reading_lists.length > 0 &&
            courseReadingList.reading_lists[0];
        const readingListLink = readingList.url || 'mock data is missing';

        cy.get('.readingLists h4').contains(
            `${locale.myCourses.readingLists.title} (${readingListLength(courseReadingList)} items)`,
        );

        const numberExcessReadingLists =
            readingListLength(courseReadingList) - locale.myCourses.readingLists.visibleItemsCount;
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains(`${numberExcessReadingLists} more items`)
            .should('have.attr', 'href', readingListLink);
    }

    function reading_list_panel_loads_correctly_for_a_subject_with_multiple_reading_lists(
        courseReadingList,
        coursecode,
    ) {
        const courseCode = courseReadingList.title || 'mock data is missing';

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
            _courseLink('', locale.myCourses.examPapers.footer.linkOutPattern),
        );
    }

    function exams_panel_loads_correctly_for_a_subject_with_one_exam() {
        cy.get('div[data-testid=exam-more-link] a').should('not.exist');
    }

    function exams_panel_loads_correctly_for_a_subject_with_many_exams(examPapers, displayType = 'mycourses') {
        const headerLevel = displayType === 'mycourses' ? 'h4' : 'h5';

        const courseCode = examPapers.coursecode || 'mock data is missing';

        const examPaper = (!!examPapers.list && examPapers.list.length > 0 && examPapers.list[0]) || {};
        const examPeriod = examPaper.period || 'mock data is missing';
        const examPaperLink = examPaper.url || 'mock data is missing';

        cy.get(`.exams ${headerLevel}`).contains(
            `${locale.myCourses.examPapers.title} (${examPapers.list.length} items)`,
        );
        cy.get('.exams a')
            .contains(`${examPeriod} (${examPaperLink.slice(-3).toUpperCase()})`)
            .should('have.attr', 'href', examPaperLink);
        const numberExcessExams = examPapers.list.length - locale.myCourses.examPapers.visibleItemsCount;
        cy.get('div[data-testid=exam-more-link] a')
            .contains(
                locale.myCourses.examPapers.morePastExams
                    .replace('[numberExcessExams]', numberExcessExams)
                    .replace('[examNumber]', _pluralise('paper', numberExcessExams)),
            )
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.examPapers.footer.linkOutPattern));
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
        cy.get(`div[data-testid=guides-${coursecode}] h4`).contains(`${locale.myCourses.guides.title}`);

        const numGuides = guidesList.length - 1;
        const numGuidesVisible =
            numGuides > locale.myCourses.guides.visibleItemsCount
                ? locale.myCourses.guides.visibleItemsCount
                : numGuides;
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
        const headerLevel = displayType === 'mycourses' ? 'h4' : 'h5';

        const guide = guides[0] || {};
        const guideTitle = guide.title || 'mock data is missing';
        const guideLink = guide.url || 'mock data is missing';

        cy.get(`[data-testid=guides-${coursecode}] ${headerLevel}`).contains(locale.myCourses.guides.title);
        cy.get(`div[data-testid=guides-${coursecode}] a`)
            .contains(guideTitle)
            .should('have.attr', 'href', guideLink);

        guides_panel_has_correct_Library_Guides_footer_links_for_a_subject_page();
    }

    function course_links_panel_loads_correctly_for_a_subject(courseReadingList) {
        const courseCode = courseReadingList.title || 'mock data is missing';

        expect(locale.myCourses.courseLinks.links).to.be.an('array');
        expect(locale.myCourses.courseLinks.links.length).to.not.equals(0);
        locale.myCourses.courseLinks.links.map(item => {
            cy.get(`a[data-testid=${item.id}-${courseCode}]`)
                .contains(item.linkLabel)
                .should('have.attr', 'href', _courseLink(courseCode, item.linkOutPattern));
        });
    }

    function load_a_subject_in_course_resource_page_search_tab(
        courseReadingList,
        searchSuggestions,
        typeChar = 'FREN',
        numberOfMatchingSubject = 2, // autocomplete finds this many entries for typeChar
    ) {
        const courseCode = courseReadingList.title || 'mock data is missing';
        const frenchSearchSuggestion = searchSuggestions
            .filter(obj => {
                return obj.name === courseCode;
            })
            .pop();

        cy.get('div[data-testid=full-courseresource-autocomplete] input')
            .should('exist')
            .type(typeChar);

        cy.get('ul#full-courseresource-autocomplete-popup')
            .children()
            .should('have.length', numberOfMatchingSubject + 1); // plus one for title

        cy.log('backspace one char');
        cy.get('div[data-testid=full-courseresource-autocomplete] input').type('{backspace}');
        cy.get('div[data-testid=full-courseresource-autocomplete] input').should(
            'have.value',
            typeChar.substring(0, typeChar.length - 1),
        );
        // the backspace means we dont have enough char and the dropdown is emptied
        cy.get('ul#full-courseresource-autocomplete-popup').should('not.exist');

        cy.get('div[data-testid=full-courseresource-autocomplete] input').type('{backspace}');
        cy.get('div[data-testid=full-courseresource-autocomplete] input').should(
            'have.value',
            typeChar.substring(0, typeChar.length - 2),
        );

        // re-enter the characters
        cy.get('div[data-testid=full-courseresource-autocomplete] input').type(typeChar.slice(-2));
        // the drop down returns
        cy.get('ul#full-courseresource-autocomplete-popup')
            .children()
            .should('have.length', numberOfMatchingSubject + 1);

        // click the first option
        cy.get('li#full-courseresource-autocomplete-option-0')
            .contains(`${frenchSearchSuggestion.course_title}, ${frenchSearchSuggestion.period}`)
            .click();
    }

    function a_user_can_use_the_search_bar_to_load_a_subject(
        courseReadingList,
        searchSuggestions,
        typeChar = 'FREN',
        numberOfMatchingSubject = 2, // autocomplete finds this many entries for typeChar
        tabId = 0,
    ) {
        load_a_subject_in_course_resource_page_search_tab(
            courseReadingList,
            searchSuggestions,
            typeChar,
            numberOfMatchingSubject,
        );

        // the tab loads and we see the title of the correct course
        cy.get(`div[data-testid=classpanel-${tabId}] h4`).contains(courseReadingList.course_title);
    }

    function a_user_with_no_classes_sees_notice_of_same_in_courses_list() {
        cy.get('div[data-testid=no-classes]').contains(locale.myCourses.none.title);
    }

    function the_user_sees_the_search_form() {
        cy.get('div[data-testid=full-courseresource-autocomplete] input').should(
            'have.attr',
            'placeholder',
            locale.search.placeholder,
        );
    }

    function click_on_a_subject_tab(panelNumber, courseReadingList) {
        const courseCode = courseReadingList.title || 'mock data is missing';
        const title = courseReadingList.course_title || 'mock data is missing';
        cy.get(`button#classtab-${panelNumber}`)
            .contains(courseCode)
            .click();
        cy.get(`div[data-testid=classpanel-${panelNumber}] h3`).contains(title);
    }

    function the_user_clicks_on_the_second_subject_tab(courseReadingList) {
        click_on_a_subject_tab(1, courseReadingList);
    }

    function the_user_clicks_on_the_third_subject_tab(courseReadingList) {
        click_on_a_subject_tab(2, courseReadingList);
    }

    function the_title_block_displays_properly(courseReadingList) {
        const listTitle = courseReadingList.course_title || 'mock data is missing1';
        const coursecode = courseReadingList.title || 'mock data is missing2';
        const readingList =
            !!courseReadingList.reading_lists &&
            courseReadingList.reading_lists.length > 0 &&
            courseReadingList.reading_lists[0];
        const semester = readingList.period || 'mock data is missing3';
        const campus = readingList.campus || 'mock data is missing4';

        cy.get('h3[data-testid=course-resource-subject-title]').contains(listTitle);
        cy.get('h3[data-testid=course-resource-subject-title]').contains(coursecode);
        cy.get('h3[data-testid=course-resource-subject-title]').contains(campus);
        cy.get('h3[data-testid=course-resource-subject-title]').contains(semester);
    }

    function FREN1010_loads_properly_for_s111111_user() {
        the_user_lands_on_the_My_Classes_tab(FREN1010ReadingList);

        the_title_block_displays_properly(FREN1010ReadingList);

        reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
            FREN1010ReadingList,
        );

        exams_panel_loads_correctly_for_a_subject_with_many_exams(FREN1010Exam);

        guides_panel_loads_correctly_for_a_subject_with_one_guide(FREN1010Guide, 'FREN1010');

        course_links_panel_loads_correctly_for_a_subject(FREN1010ReadingList);
    }

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
     */
    it('User with classes sees their classes', () => {
        cy.visit('/courseresources?user=s1111111');
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
        cy.visit('/courseresources?user=s3333333');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        a_user_can_use_the_search_bar_to_load_a_subject(FREN1010ReadingList, learningResourceSearchSuggestions);

        the_user_clicks_on_the_My_Courses_tab();
        a_user_with_no_classes_sees_notice_of_same_in_courses_list();
    });

    it('A user who has arrived by clicking on the homepage own course gets the course they requested', () => {
        cy.visit('/courseresources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_My_Classes_tab(FREN1010ReadingList);

        FREN1010_loads_properly_for_s111111_user();
    });

    it('A user who has arrived by searching for a course on the homepage gets the course they requested', () => {
        cy.visit('/courseresources?user=s1111111&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        reading_lists_panel_loads_correctly_for_a_subject_with_one_reading_list_with_the_maximum_num_displayable_items(
            ACCT1101ReadingList,
            'searchresults',
        );

        exams_panel_loads_correctly_for_a_subject_with_many_exams(ACCT1101Exam, 'searchresults');

        guides_panel_loads_correctly_for_a_subject_with_one_guide(ACCT1101Guide, 'ACCT1101', 'searchresults');

        course_links_panel_loads_correctly_for_a_subject(ACCT1101ReadingList);
    });

    it('A user who searches for a subject they are enrolled in will be changed to the mycourses tab', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);

        the_user_clicks_on_the_Search_tab();

        the_user_sees_the_search_form();

        load_a_subject_in_course_resource_page_search_tab(FREN1010ReadingList, learningResourceSearchSuggestions);

        FREN1010_loads_properly_for_s111111_user();
    });

    it('The Course resources panel links correctly and the back button works', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);
        const currentClasses = accounts.s1111111.current_classes;
        expect(currentClasses.length).to.be.above(1); // the course we are going to click on exists

        cy.get('div[data-testid=course-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=course-resources-panel] h4').contains(locale.homepagePanel.userCourseTitle);

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        cy.get('div[data-testid=course-resources-panel] h4')
            .parent()
            .parent()
            .children()
            .should('have.length', numberOfBlocks);

        // the users clicks the first one (HIST1201)
        const secondClass = currentClasses[1];
        const dropdownId = 'hcr-1';
        cy.get(`div[data-testid=${dropdownId}] a`)
            .contains(`${secondClass.SUBJECT}${secondClass.CATALOG_NBR}`)
            .click();
        // the user lands on the correct page
        cy.url().should(
            'include',
            'courseresources?user=s1111111&coursecode=HIST1201&campus=St%20Lucia&semester=Semester%202%202020',
        );
        const classPanelId = 'classpanel-1';
        cy.get(`div[data-testid=${classPanelId}] h3`).contains(secondClass.SUBJECT);

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=s1111111'); // homepage
    });

    it('The Course resources panel searches correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=course-resources-panel]').contains(locale.homepagePanel.title);

        // the user sees NO subjects (the form has no sibling elements)
        cy.get('div[data-testid=course-resources-panel] form')
            .parent()
            .children()
            .should('have.length', 2); // 1 search field and one div with 'no courses' text
        // the user sees a search field
        cy.get('div[data-testid=course-resources-panel] form input').should(
            'have.attr',
            'placeholder',
            locale.search.placeholder,
        );
        // user enters ACCT
        cy.get('div[data-testid=course-resources-panel] form input').type('ACCT11');
        const learningResourceSearchSuggestionsWithACCT = learningResourceSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        cy.get('ul#homepage-courseresource-autocomplete-popup')
            .children()
            .should('have.length', learningResourceSearchSuggestionsWithACCT.length + 1); // add one for title
        // user clicks on #1, ACCT1101
        cy.get('li#homepage-courseresource-autocomplete-option-0')
            .contains('ACCT1101')
            .click();
        // user lands on appropriate course resources page
        cy.url().should(
            'include',
            'courseresources?user=s3333333&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020',
        );
        const classPanelId = 'classpanel-0';
        cy.get(`div[data-testid=${classPanelId}] h4`).contains('ACCT1101');
    });

    it('The non-loggedin user cannot access Course Resources', () => {
        cy.visit('/courseresources?user=public');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authenticated users only.');
    });

    it('The loggedin user without course resource privs cannot access Course Resources', () => {
        cy.visit('/courseresources?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    it('A user who searches for multiple subjects can switch between the tabs for each one', () => {
        cy.visit('/courseresources?user=s3333333');
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
            learningResourceSearchSuggestions.filter(item => item.name.startsWith('ACCT')).length,
            2,
        );

        cy.get('[data-testid=classtab-FREN1010]')
            .contains('FREN1010')
            .click();
        cy.get('div[data-testid=classpanel-0] h4').contains('FREN1010');

        cy.get('[data-testid=classtab-HIST1201]')
            .contains('HIST1201')
            .click();
        cy.get('div[data-testid=classpanel-1] h4').contains('HIST1201');

        // search again and go to the existing tab
        a_user_can_use_the_search_bar_to_load_a_subject(
            ACCT1101ReadingList,
            learningResourceSearchSuggestions,
            'ACCT',
            learningResourceSearchSuggestions.filter(item => item.name.startsWith('ACCT')).length,
            2,
        );
    });

    it('A repeating string is handled correctly', () => {
        cy.visit('/courseresources?user=s3333333');
        cy.viewport(1300, 1000);

        // enter a repeating string
        cy.get('div[data-testid=full-courseresource-content] form input').type('AAAAA');
        // and the drop down will not appear
        cy.get('ul#full-courseresource-autocomplete-popup').should('not.exist');
    });
});

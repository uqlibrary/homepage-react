/* eslint camelcase: 0 */
import { default as locale } from '../../src/modules/Pages/CourseResources/courseResourcesLocale';
import { primoSearch as searchLocale } from '../../src/modules/SharedComponents/PrimoSearch/components/primoSearchLocale';
import { _courseLink, _pluralise } from '../../src/modules/Pages/CourseResources/courseResourcesHelpers';
import { default as FREN1010LearningResources } from '../../src/mock/data/records/learningResources_FREN1010';
import { default as FREN1010ReadingList1 } from '../../src/mock/data/records/courseReadingList_6888AB68-0681-FD77-A7D9-F7B3DEE7B29F';
import { default as FREN1010Guide } from '../../src/mock/data/records/libraryGuides_FREN1010';
import { default as HIST1201LearningResources } from '../../src/mock/data/records/learningResources_HIST1201';
import { default as HIST1201ReadingList1 } from '../../src/mock/data/records/courseReadingList_2109F2EC-AB0B-482F-4D30-1DD3531E46BE';
import { default as PHIL1002LearningResources } from '../../src/mock/data/records/learningResources_PHIL1002';
import { default as learningResourceSearchSuggestions } from '../../src/mock/data/records/learningResourceSearchSuggestions';

context('Course Resources', () => {
    function the_user_lands_on_the_My_Classes_tab(learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const title = learningResource.course_title || 'mock data is missing';

        cy.get('div[data-testid="course-resources"]').contains(locale.myCourses.title);

        cy.get('div[data-testid=classpanel-0] h3').contains(title);
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

    function the_user_clicks_on_the_Study_Help_tab() {
        cy.get('button#topmenu-2')
            .contains(locale.studyHelp.title)
            .click();
    }

    function a_subject_with_one_reading_list_with_the_maximum_num_displayable_items_loads_correctly(readingLists) {
        const readingList = readingLists[0] || {};
        const readingListTitle = readingList.title || 'mock data is missing';
        const readingListLink = readingList.itemLink || 'mock data is missing';

        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (${readingLists.length})`);
        cy.get('.readingLists a')
            .contains(readingListTitle)
            .should('have.attr', 'href', readingListLink);
    }

    function a_subject_with_one_reading_list_of_more_than_the_max_displayable_items_loads_correctly(
        learningResourceList,
        readingLists,
    ) {
        const learningResource = learningResourceList[0] || {};

        const readingList = (!!learningResource.reading_lists && learningResource.reading_lists[0]) || {};

        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (${readingLists.length})`);

        const numberExcessReadingLists = readingLists.length - 2;
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains(`${numberExcessReadingLists} more items`)
            .should('have.attr', 'href', readingList.url);
    }

    function a_subject_with_multiple_reading_lists_loads_correctly(learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';

        cy.get('div[data-testid=standard-card-reading-lists--content]').contains(
            locale.myCourses.readingLists.multiple.title.replace('[classnumber]', courseCode),
        );
        cy.get('a[data-testid=multiple-reading-list-search-link]')
            .contains(locale.myCourses.readingLists.multiple.linkLabel)
            .should('have.attr', 'href', locale.myCourses.readingLists.multiple.linkOut);
    }

    function a_subject_with_no_exams_loads_correctly() {
        cy.get('div[data-testid=standard-card-past-exam-papers--content]').contains(locale.myCourses.examPapers.none);
        cy.get('div[data-testid=standard-card-past-exam-papers--content] a').should(
            'have.attr',
            'href',
            _courseLink('', locale.myCourses.examPapers.footer.linkOutPattern),
        );
    }

    function a_subject_with_one_exam_loads_correctly() {
        cy.get('div[data-testid=exam-more-link] a').should('not.exist');
    }

    function a_subject_with_many_exams_loads_correctly(learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';

        const examPapers = learningResource.exam_papers || [];
        const examPaper = examPapers[0] || {};
        const examPeriod = examPaper.period || 'mock data is missing';
        const examPaperLink = examPaper.url || 'mock data is missing';

        cy.get('.exams h3').contains(`${locale.myCourses.examPapers.title} (${examPapers.length})`);
        cy.get('.exams a')
            .contains(`${examPeriod} (${examPaperLink.slice(-3)})`)
            .should('have.attr', 'href', examPaperLink);
        const numberExcessExams = examPapers.length - 2;
        cy.get('div[data-testid=exam-more-link] a')
            .contains(
                locale.myCourses.examPapers.morePastExams
                    .replace('[numberExcessExams]', numberExcessExams)
                    .replace('[examNumber]', _pluralise('paper', numberExcessExams)),
            )
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.examPapers.footer.linkOutPattern));
    }

    function a_subject_page_should_have_a_link_to_Library_Guides_homepage() {
        cy.get('a[data-testid=all-guides]')
            .contains(locale.myCourses.guides.footer.linkLabel)
            .should('have.attr', 'href', locale.myCourses.guides.footer.linkOut);
    }

    function a_subject_with_zero_guides_loads_correctly() {
        cy.get('div[data-testid=no-guides]').contains(locale.myCourses.guides.none);
    }

    function a_subject_with_one_guide_loads_correctly(guides) {
        const guide = guides[0] || {};
        const guideTitle = guide.title || 'mock data is missing';
        const guideLink = guide.url || 'mock data is missing';

        cy.get('h3[data-testid=standard-card-library-guides-header]').contains(locale.myCourses.guides.title);
        cy.get('div[data-testid=standard-card-library-guides-content] a')
            .contains(guideTitle)
            .should('have.attr', 'href', guideLink);
    }

    function a_subject_loads_course_links_correctly(learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';

        cy.get('a[data-testid=ecp-FREN1010]')
            .contains(locale.myCourses.links.ecp.title)
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.links.ecp.linkOutPattern));

        cy.get('a[data-testid=blackboard-FREN1010]')
            .contains(locale.myCourses.links.blackboard.title)
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.links.blackboard.linkOutPattern));
    }

    function a_user_can_use_the_search_bar_to_load_a_subject() {
        const learningResource = FREN1010LearningResources[0] || {};
        const frenchSearchSuggestion = learningResourceSearchSuggestions
            .filter(obj => {
                return obj.name === 'FREN1010';
            })
            .pop();

        cy.get('div[data-testid=primo-search-autocomplete] input')
            .should('exist')
            .type('FREN');
        cy.get('[data-testid="primo-search-autocomplete"]').click();
        cy.get('li#primo-search-autocomplete-option-0')
            .contains(`${frenchSearchSuggestion.course_title}, ${frenchSearchSuggestion.period}`)
            .click();
        cy.get('button[data-testid=primo-search-submit]').click();
        cy.get('div[data-testid=classpanel-0] h3').contains(learningResource.course_title);
    }

    function a_user_with_no_classes_sees_notice_of_same_in_courses_list() {
        cy.get('div[data-testid=no-classes]').contains(locale.myCourses.none.title);
    }

    function the_user_sees_the_search_form() {
        const courseResourceSearchParams = searchLocale.typeSelect.items
            .filter(obj => {
                return obj.name === 'Course reading lists';
            })
            .pop();
        cy.get('div[data-testid=primo-search-autocomplete] input').should(
            'have.attr',
            'placeholder',
            courseResourceSearchParams.placeholder,
        );
    }

    function the_user_sees_the_Study_Help_links() {
        cy.get('h3[data-testid=standard-card-study-help-header]').contains(locale.studyHelp.title);
        expect(locale.studyHelp.links).to.be.an('array');
        expect(locale.studyHelp.links.length).to.not.equals(0);
        locale.studyHelp.links.map(link => {
            cy.get(`a#${link.id}`)
                .contains(link.linkLabel)
                .should('have.attr', 'href', link.linkTo);
        });
    }

    function click_on_a_subject_tab(panelNumber, learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';
        const title = learningResource.course_title || 'mock data is missing';
        cy.get(`button#classtab-${panelNumber}`)
            .contains(courseCode)
            .click();
        cy.get(`div[data-testid=classpanel-${panelNumber}] h3`).contains(title);
    }

    function the_user_clicks_on_the_second_subject_tab(learningResourceList) {
        click_on_a_subject_tab(1, learningResourceList);
    }

    function the_user_clicks_on_the_third_subject_tab(learningResourceList) {
        click_on_a_subject_tab(2, learningResourceList);
    }

    /**
     * Show a user with 3 classes can see all the variations correctly
     * The mock data has been selected to cover the display options:
     *
     *          |  reading lists                    | exams         | guides       |
     * ---------+-----------------------------------+---------------+--------------+
     * FREN1010 | has 1 list with exactly 2 entries | has > 2 exams | has 1 guide  |
     * ---------+-----------------------------------+---------------+--------------+
     * HIST1201 | has 1 list with > 2 entries       | has 1 exams   | has 0 guides |
     * ---------+-----------------------------------+---------------+--------------+
     * PHIL1002 | has > 1 list reading lists        | has 0 exams   | -            |
     * ---------+-----------------------------------+---------------+--------------+
     */
    it('User with classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_My_Classes_tab(FREN1010LearningResources);

        a_subject_with_one_reading_list_with_the_maximum_num_displayable_items_loads_correctly(FREN1010ReadingList1);

        a_subject_with_many_exams_loads_correctly(FREN1010LearningResources);

        a_subject_with_one_guide_loads_correctly(FREN1010Guide);

        a_subject_page_should_have_a_link_to_Library_Guides_homepage();

        a_subject_loads_course_links_correctly(FREN1010LearningResources);

        // next tab
        the_user_clicks_on_the_second_subject_tab(HIST1201LearningResources);

        a_subject_with_one_reading_list_of_more_than_the_max_displayable_items_loads_correctly(
            HIST1201LearningResources,
            HIST1201ReadingList1,
        );

        a_subject_with_one_exam_loads_correctly();

        a_subject_with_zero_guides_loads_correctly();

        a_subject_page_should_have_a_link_to_Library_Guides_homepage();

        // next tab
        the_user_clicks_on_the_third_subject_tab(PHIL1002LearningResources);

        a_subject_with_multiple_reading_lists_loads_correctly(PHIL1002LearningResources);

        a_subject_with_no_exams_loads_correctly();

        // next tab
        the_user_clicks_on_the_Search_tab();
        the_user_sees_the_search_form();

        // next tab
        the_user_clicks_on_the_Study_Help_tab();
        the_user_sees_the_Study_Help_links();
    });

    it('User without classes', () => {
        cy.visit('/courseresources?user=s2222222');
        cy.viewport(1300, 1000);

        the_user_lands_on_the_Search_tab();

        a_user_can_use_the_search_bar_to_load_a_subject();

        the_user_clicks_on_the_My_Courses_tab();
        a_user_with_no_classes_sees_notice_of_same_in_courses_list();
    });
});

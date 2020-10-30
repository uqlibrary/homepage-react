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
    function itDisplaysTheFirstSubjectTabValidly(learningResourceList, readingLists, guides) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';
        const title = learningResource.course_title || 'mock data is missing';

        const examPapers = learningResource.exam_papers || [];
        const examPaper = examPapers[0] || {};
        const examPeriod = examPaper.period || 'mock data is missing';
        const examPaperLink = examPaper.url || 'mock data is missing';

        const readingList = readingLists[0] || {};
        const readingListTitle = readingList.title || 'mock data is missing';
        const readingListLink = readingList.itemLink || 'mock data is missing';

        const guide = guides[0] || {};
        const guideTitle = guide.title || 'mock data is missing';
        const guideLink = guide.url || 'mock data is missing';

        cy.get('button#classtab-0').contains(courseCode);
        cy.get('div[data-testid=classpanel-0] h3').contains(title);

        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (${readingLists.length})`);
        cy.get('.readingLists a')
            .contains(readingListTitle)
            .should('have.attr', 'href', readingListLink);
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

        cy.get('h3[data-testid=standard-card-library-guides-header]').contains(locale.myCourses.guides.title);
        cy.get('div[data-testid=standard-card-library-guides-content] a')
            .contains(guideTitle)
            .should('have.attr', 'href', guideLink);
        cy.get('a[data-testid=all-guides]')
            .contains(locale.myCourses.guides.footer.linkLabel)
            .should('have.attr', 'href', locale.myCourses.guides.footer.linkOut);

        cy.get('a[data-testid=ecp-FREN1010]')
            .contains(locale.myCourses.links.ecp.title)
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.links.ecp.linkOutPattern));

        cy.get('a[data-testid=blackboard-FREN1010]')
            .contains(locale.myCourses.links.blackboard.title)
            .should('have.attr', 'href', _courseLink(courseCode, locale.myCourses.links.blackboard.linkOutPattern));
    }

    function itDisplaysTheSecondSubjectTabValidly(learningResourceList, readingLists) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';
        const title = learningResource.course_title;

        const readingList = (!!learningResource.reading_lists && learningResource.reading_lists[0]) || {};

        cy.get('button#classtab-1')
            .contains(courseCode)
            .click();
        cy.get('div[data-testid=classpanel-1] h3').contains(title);
        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (${readingLists.length})`);

        const numberExcessReadingLists = readingLists.length - 2;
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains(`${numberExcessReadingLists} more items`)
            .should('have.attr', 'href', readingList.url);

        cy.get('div[data-testid=exam-more-link] a').should('not.exist');
    }

    function itDisplaysTheThirdSubjectTabValidly(learningResourceList) {
        const learningResource = learningResourceList[0] || {};
        const courseCode = learningResource.title || 'mock data is missing';

        cy.get('button#classtab-2')
            .contains(courseCode)
            .click();
        cy.get('div[data-testid=standard-card-reading-lists--content]').contains(
            locale.myCourses.readingLists.multiple.title.replace('[classnumber]', courseCode),
        );
        cy.get('a[data-testid=multiple-reading-list-search-link]')
            .contains(locale.myCourses.readingLists.multiple.linkLabel)
            .should('have.attr', 'href', locale.myCourses.readingLists.multiple.linkOut);

        cy.get('div[data-testid=standard-card-past-exam-papers--content]').contains(locale.myCourses.examPapers.none);
        cy.get('div[data-testid=standard-card-past-exam-papers--content] a').should(
            'have.attr',
            'href',
            _courseLink('', locale.myCourses.examPapers.footer.linkOutPattern),
        );
    }

    it('User with classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="course-resources"]').contains(locale.myCourses.title);

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

        // click the first subject tab
        itDisplaysTheFirstSubjectTabValidly(FREN1010LearningResources, FREN1010ReadingList1, FREN1010Guide);

        // click the second subject tab
        itDisplaysTheSecondSubjectTabValidly(HIST1201LearningResources, HIST1201ReadingList1);

        // click the third subject tab
        itDisplaysTheThirdSubjectTabValidly(PHIL1002LearningResources);

        // click the course search button, user gets a search form
        cy.get('button#topmenu-1')
            .contains(locale.search.title)
            .click();
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

        // click the Study Help button, see correct links
        cy.get('button#topmenu-2')
            .contains(locale.studyHelp.title)
            .click();
        cy.get('h3[data-testid=standard-card-study-help-header]').contains(locale.studyHelp.title);
        expect(locale.studyHelp.links).to.be.an('array');
        expect(locale.studyHelp.links.length).to.not.equals(0);
        locale.studyHelp.links.map(link => {
            cy.get(`a#${link.id}`)
                .contains(link.linkLabel)
                .should('have.attr', 'href', link.linkTo);
        });
    });

    it('User without classes', () => {
        const learningResource = FREN1010LearningResources[0] || {};
        const frenchSearchSuggestion = learningResourceSearchSuggestions
            .filter(obj => {
                return obj.name === 'FREN1010';
            })
            .pop();

        cy.visit('/courseresources?user=s2222222');
        cy.viewport(1300, 1000);
        // a user with no classes loads the Course Search tab
        cy.get('div[data-testid="course-resources"]').contains(locale.search.title);

        // a user can use the search bar to load a subject
        cy.get('div[data-testid=primo-search-autocomplete] input')
            .should('exist')
            .type('FREN');
        cy.get('[data-testid="primo-search-autocomplete"]').click();
        cy.get('li#primo-search-autocomplete-option-0')
            .contains(`${frenchSearchSuggestion.course_title}, ${frenchSearchSuggestion.period}`)
            .click();
        cy.get('button[data-testid=primo-search-submit]').click();
        cy.get('div[data-testid=classpanel-0] h3').contains(learningResource.course_title);

        // click the My Courses button, see student has no classes
        cy.get('button#topmenu-0')
            .contains(locale.myCourses.title)
            .click();
        cy.get('div[data-testid=no-classes]').contains(locale.myCourses.none.title);
    });
});

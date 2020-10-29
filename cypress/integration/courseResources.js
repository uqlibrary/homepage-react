import { default as locale } from '../../src/modules/Pages/CourseResources/courseResourcesLocale';
import { _courseLink, _pluralise } from '../../src/modules/Pages/CourseResources/courseResourcesHelpers';
import { default as FREN1010LearningResources } from '../../src/mock/data/records/learningResources_FREN1010';
import { default as FREN1010ReadingList1 } from '../../src/mock/data/records/courseReadingList_6888AB68-0681-FD77-A7D9-F7B3DEE7B29F';
import { default as FREN1010Guide } from '../../src/mock/data/records/libraryGuides_FREN1010';
import { default as HIST1201LearningResources } from '../../src/mock/data/records/learningResources_HIST1201';
import { default as HIST1201ReadingList1 } from '../../src/mock/data/records/courseReadingList_2109F2EC-AB0B-482F-4D30-1DD3531E46BE';
import { default as PHIL1002LearningResources } from '../../src/mock/data/records/learningResources_PHIL1002';

context('Course Resources', () => {
    function itDisplaysTheFirstSubjectTabValidly(learningResource, readingList, guides) {
        const courseCode = learningResource.title;

        cy.get('button#classtab-0').contains(courseCode);
        cy.get('div[data-testid=classpanel-0] h3').contains(learningResource.course_title);

        cy.get('.readingLists h3').contains(
            `${locale.myCourses.readingLists.title} (${learningResource.reading_lists.length})`,
        );
        cy.get('.readingLists a')
            .contains(readingList[0].title)
            .should('have.attr', 'href', readingList[0].itemLink);

        const examPapers = learningResource.exam_papers;
        cy.get('.exams h3').contains(`${locale.myCourses.examPapers.title} (${examPapers.length})`);
        cy.get('.exams a')
            .contains(`${examPapers[0].period} (${examPapers[0].url.slice(-3)})`)
            .should('have.attr', 'href', examPapers[0].url);
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
            .contains(guides.title)
            .should('have.attr', 'href', guides.url);
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

    function itDisplaysTheSecondSubjectTabValidly(learningResource, readingList) {
        cy.get('button#classtab-1')
            .contains(learningResource.title)
            .click();
        cy.get('div[data-testid=classpanel-1] h3').contains(learningResource.course_title);
        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (${readingList.length})`);

        const numberExcessReadingLists = readingList.length - 2;
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains(`${numberExcessReadingLists} more items`)
            .should('have.attr', 'href', learningResource.reading_lists[0].url);

        cy.get('div[data-testid=exam-more-link] a').should('not.exist');
    }

    function itDisplaysTheThirdSubjectTabValidly(learningResource) {
        const courseCode = learningResource.title;
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
         * the mock data has been selected to cover the display options:
         *
         *          |  reading lists               | exams   | guides |
         * ---------+------------------------------+---------+--------+
         * FREN1010 | has 1 with exactly 2 entries | has > 2 | has 1  |
         * ---------+------------------------------+---------+--------+
         * HIST1201 | has 1 with > 2 entries       | has 1   | has 0  |
         * ---------+------------------------------+---------+--------+
         * PHIL1002 | has 2 reading lists          | has 0   | has 1  |
         * ---------+------------------------------+---------+--------+
         */

        itDisplaysTheFirstSubjectTabValidly(FREN1010LearningResources[0], FREN1010ReadingList1, FREN1010Guide[0]);

        // click the second subject tab, HIST1201
        itDisplaysTheSecondSubjectTabValidly(HIST1201LearningResources[0], HIST1201ReadingList1);

        // click the third subject tab, PHIL1002
        itDisplaysTheThirdSubjectTabValidly(PHIL1002LearningResources[0]);

        // click the course search button
        cy.get('button#topmenu-1')
            .contains(locale.search.title)
            .click();
        cy.get('div[data-testid=primo-search-autocomplete] input').should(
            'have.attr',
            'placeholder',
            'Enter a course code',
        );

        // click the Study Help button
        cy.get('button#topmenu-2')
            .contains(locale.studyHelp.title)
            .click();
        cy.get('h3[data-testid=standard-card-study-help-header]').contains(locale.studyHelp.title);
        locale.studyHelp.links.map(link => {
            cy.get(`a#${link.id}`)
                .contains(link.linkLabel)
                .should('have.attr', 'href', link.linkTo);
        });
    });
});

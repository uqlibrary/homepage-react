import { default as FREN1010ReadingList } from '../../../src/mock/data/records/courseReadingList_FREN1010';
import { default as locale } from '../../../src/modules/Pages/CourseResources/courseResources.locale';

/*
  This is a single test brought in from the Course Resources test to give coverage of actions in Pipeline 1
*/

context('Course Resources', () => {
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
    it('User with classes sees their classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);

        const title = FREN1010ReadingList.course_title || 'mock data is missing';

        cy.get('div[data-testid="course-resources"]').contains(locale.myCourses.title);

        cy.get('div[data-testid=classpanel-0] h2').contains(title);

        const listTitle = FREN1010ReadingList.course_title || 'mock data is missing1';
        const coursecode = FREN1010ReadingList.title || 'mock data is missing2';
        const readingList =
            !!FREN1010ReadingList.reading_lists &&
            FREN1010ReadingList.reading_lists.length > 0 &&
            FREN1010ReadingList.reading_lists[0];
        const semester = readingList.period || 'mock data is missing3';
        const campus = readingList.campus || 'mock data is missing4';

        cy.get('h2[data-testid=course-resource-subject-title]').contains(listTitle);
        cy.get('h2[data-testid=course-resource-subject-title]').contains(coursecode);
        cy.get('h2[data-testid=course-resource-subject-title]').contains(campus);
        cy.get('h2[data-testid=course-resource-subject-title]').contains(semester);

        cy.get('.readingLists h3').contains(
            `${locale.myCourses.readingLists.title} (${readingListLength(FREN1010ReadingList)} items)`,
        );

        readingList.list.forEach(l => {
            cy.get('body').contains(l.title);
        });
    });
});

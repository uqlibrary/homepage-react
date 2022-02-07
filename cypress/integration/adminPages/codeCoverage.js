import { default as FREN1010ReadingList } from '../../../src/mock/data/records/courseReadingList_FREN1010';
import { default as locale } from '../../../src/modules/Pages/LearningResources/learningResources.locale';
import { default as learningResourceSearchSuggestions } from '../../../src/mock/data/records/learningResourceSearchSuggestions';
import { readingListLength } from '../../support/helpers';
/*
 * this section duplcates tests in the homepage and otherpages folders and is needed to provide full coverage in the
 * admin pipeline during code coverage runs on aws :(
 */

context('Personalisation', () => {
    it('Renders a logged out user', () => {
        cy.rendersALoggedoutUser();
    });
});

context('Learning Resources', () => {
    it('User with classes sees their classes', () => {
        // this test simplifies the matching homepage/learningResources.js test, just to give coverage
        cy.visit('/learningresources?user=s1111111');
        cy.viewport(1300, 1000);

        const title = FREN1010ReadingList.course_title || 'mock data is missing';

        cy.get('div[data-testid="learning-resources"]').contains(locale.myCourses.title);

        cy.get('div[data-testid=classpanel-0] h2').contains(title);

        const listTitle = FREN1010ReadingList.course_title || 'mock data is missing1';
        const coursecode = FREN1010ReadingList.title || 'mock data is missing2';
        const readingList =
            !!FREN1010ReadingList.reading_lists &&
            FREN1010ReadingList.reading_lists.length > 0 &&
            FREN1010ReadingList.reading_lists[0];
        const semester = readingList.period || 'mock data is missing3';
        const campus = readingList.campus || 'mock data is missing4';

        cy.get('h2[data-testid=learning-resource-subject-title]').contains(listTitle);
        cy.get('h2[data-testid=learning-resource-subject-title]').contains(coursecode);
        cy.get('h2[data-testid=learning-resource-subject-title]').contains(campus);
        cy.get('h2[data-testid=learning-resource-subject-title]').contains(semester);

        cy.get('.readingLists h3').contains(
            `${locale.myCourses.readingLists.title} (${readingListLength(FREN1010ReadingList)} items)`,
        );

        readingList.list.forEach(l => {
            cy.get('body').contains(l.title);
        });
    });

    it('The Learning resources panel searches correctly', () => {
        // this test simplifies the matching homepage/learningResources.js test, just to give coverage
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);

        // the user sees NO subjects (the form has no sibling elements)
        cy.get('div[data-testid=learning-resources-panel] form')
            .parent()
            .children()
            .should('have.length', 2); // 1 search field and one div with 'no courses' text
        // the user sees a search field
        cy.get('div[data-testid=learning-resources-panel] form input').should(
            'have.attr',
            'placeholder',
            locale.search.placeholder,
        );

        // user enters ACCT
        cy.get('div[data-testid=learning-resources-panel] form input').type('ACCT11');
        const learningResourceSearchSuggestionsWithACCT = learningResourceSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        cy.get('ul#homepage-learningresource-autocomplete-popup')
            .children()
            .should('have.length', learningResourceSearchSuggestionsWithACCT.length + 1); // add one for title
    });
});

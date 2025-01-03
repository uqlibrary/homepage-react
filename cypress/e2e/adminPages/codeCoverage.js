import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';
/*
 * this section duplicates tests in the homepage and otherpages folders and is needed to provide full coverage in the
 * admin pipeline during code coverage runs on aws :(
 */

context('Personalisation', () => {
    it('Renders a logged out user', () => {
        // tests ?user=public
        cy.rendersALoggedoutUser();
    });
});

context('Learning Resources', () => {
    it('The Learning resources panel searches correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);

        // the user is not enrolled in any subjects which means the form has no sibling elements
        cy.get('div[data-testid=learning-resources-panel] form')
            .parent()
            .children()
            .should('have.length', 2); // 1 search field and one div with 'no courses' text
        // the user sees a search field
        cy.get('div[data-testid="learning-resource-search-input-field"] input')
            .should('exist')
            .should('be.visible');

        // user enters ACCT
        cy.get('div[data-testid=learning-resources-panel] form input').type('ACCT11');
        const subjectSearchSuggestionsWithACCT = subjectSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        cy.get('ul#homepage-learningresource-autocomplete-listbox')
            .children()
            .should('have.length', subjectSearchSuggestionsWithACCT.length + 1); // add one for title
        // user clicks on #1, ACCT1101
        cy.get('li#homepage-learningresource-autocomplete-option-0')
            .contains('ACCT1101')
            .click();
        // user lands on appropriate learning resources page
        cy.url().should(
            'include',
            'learning-resources?user=s3333333&coursecode=ACCT1101&campus=St%20Lucia&semester=Semester%202%202020',
        );
        const classPanelId = 'classpanel-0';
        cy.get(`div[data-testid=${classPanelId}] h3`).contains('ACCT1101');
    });
});

import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { default as learningResourceSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/learningResourceSearchSuggestions';
/*
 * this section duplcates tests in the homepage and otherpages folders and is needed to provide full coverage in the
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
        cy.get('ul#homepage-learningresource-autocomplete-listbox')
            .children()
            .should('have.length', learningResourceSearchSuggestionsWithACCT.length + 1); // add one for title
    });
});

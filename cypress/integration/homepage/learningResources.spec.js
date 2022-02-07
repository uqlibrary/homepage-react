import { accounts } from '../../../src/mock/data';
import { default as locale } from '../../../src/modules/Pages/LearningResources/learningResources.locale';
import { default as learningResourceSearchSuggestions } from '../../../src/mock/data/records/learningResourceSearchSuggestions';

context('The Homepage Learning Resource Panel', () => {
    it('Learning resources panel is accessible', () => {
        cy.visit('/?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Learning resources panel');
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.wait(500);
        cy.checkA11y('div[data-testid="learning-resources-panel"]', {
            reportName: 'Learning resources panel',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('The Learning resources panel links correctly', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);
        const currentClasses = accounts.s1111111.current_classes;
        expect(currentClasses.length).to.be.above(1); // the course we are going to click on exists

        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=learning-resources-panel] h3').contains(locale.homepagePanel.userCourseTitle);

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        cy.get('div[data-testid=learning-resources-panel] h3')
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
            'learning-resources?user=s1111111&coursecode=HIST1201&campus=St%20Lucia&semester=Semester%202%202020',
        );
        const classPanelId = 'classpanel-1';
        cy.get(`div[data-testid=${classPanelId}] h2`).contains(secondClass.SUBJECT);
    });

    // NOTE: purely for coverage, this test is duplicated into cypress/adminPages/learning-resources
    it('The Learning resources panel searches correctly', () => {
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
        // user enters a invalid course code and see the error
        cy.get('div[data-testid=learning-resources-panel] form input').type('FREX');
        cy.get('[data-testid="noCoursesFound"]').contains(locale.search.noResultsText);
        cy.get('div[data-testid=learning-resources-panel] form input').clear();

        // user enters ACCT
        cy.get('div[data-testid=learning-resources-panel] form input').type('ACCT11');
        const learningResourceSearchSuggestionsWithACCT = learningResourceSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        cy.get('ul#homepage-learningresource-autocomplete-popup')
            .children()
            .should('have.length', learningResourceSearchSuggestionsWithACCT.length + 1); // add one for title
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

    it('A user putting a space in a search still gets their result on the homepage', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);

        cy.get('input[data-testid="homepage-learningresource-autocomplete-input-wrapper"]').type('FREN 1');
        cy.get('ul#homepage-learningresource-autocomplete-popup')
            .children()
            .should('have.length', 1 + 1);
    });
});

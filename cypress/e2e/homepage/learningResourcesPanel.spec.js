import { accounts } from '../../../src/data/mock/data';
import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';

context('The Homepage Learning Resource Panel', () => {
    it('Learning resources panel is accessible', () => {
        cy.visit('/?user=s1111111');
        cy.injectAxe();
        // cy.wait(2000);
        cy.waitUntil(() =>
            cy
                .get('div[data-testid="your-courses"]')
                .should('exist')
                .contains(locale.homepagePanel.userCourseTitle),
        );
        cy.viewport(1300, 1000);
        cy.log('Learning resources panel');
        cy.waitUntil(() => cy.get('div[data-testid="learning-resources-homepage-panel"]').should('exist'));
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=learning-resources-panel] form input').type('FREN');
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
        expect(currentClasses.length).to.be.above(1); // the user has courses that we can click on

        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=learning-resources-panel] h3').contains(locale.homepagePanel.userCourseTitle);

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        cy.get('div[data-testid=learning-resources-panel] h3')
            .parent()
            .parent()
            .children()
            .should('have.length', numberOfBlocks);

        // the users clicks one of the classes in the 'Your courses' list
        const classIndex = 0;
        const specificClass = currentClasses[classIndex];
        cy.get(`[data-testid="learning-resource-panel-course-link-${classIndex}"]`)
            .contains(`${specificClass.SUBJECT}${specificClass.CATALOG_NBR}`)
            .click({ force: true });
        // the user lands on the correct page
        cy.url().should(
            'include',
            `learning-resources?user=s1111111&coursecode=${specificClass.SUBJECT}${specificClass.CATALOG_NBR}&campus=St%20Lucia&semester=Semester%202%202020`,
        );
        cy.get(`div[data-testid="classpanel-${classIndex}"] h2`).contains(specificClass.SUBJECT);
    });

    // NOTE: purely for coverage, this test is duplicated into cypress/adminPages/learning-resources
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
        cy.get('div[data-testid=learning-resources-panel] form input').should(
            'have.attr',
            'placeholder',
            locale.search.placeholder,
        );

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

    it('The Learning resources panel displays results with incomplete data correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);

        cy.get('div[data-testid=learning-resources-panel] form input').should(
            'have.attr',
            'placeholder',
            locale.search.placeholder,
        );

        // user enters FREN
        cy.get('div[data-testid=learning-resources-panel] form input').type('FREN');

        // the subjects that are missing some data appear correctly
        cy.waitUntil(() =>
            cy
                .get('#homepage-learningresource-autocomplete-option-0')
                .contains('FREN1010 (has mock data - Introductory French 1, St Lucia, Semester 2 2020)'),
        );
        cy.get('#homepage-learningresource-autocomplete-option-1').contains(
            'FREN1012 (French subject with blank semester, St Lucia)',
        );
        cy.get('#homepage-learningresource-autocomplete-option-2').contains(
            'FREN1011 (French subject with blank campus, Semester 2 2020)',
        );
    });

    // at one point, a course code entered in all caps would not match a complete course code
    it('The search field loads the matching result for a complete course code', () => {
        cy.visit('/?user=s3333333');
        cy.get('div[data-testid=learning-resources-panel] form input')
            .clear()
            .type('ACCT1101');
        cy.get('ul#homepage-learningresource-autocomplete-listbox')
            .children()
            .should('have.length', 1 + 1); // add one for title
    });
});

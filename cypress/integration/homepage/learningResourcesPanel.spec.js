import { accounts } from '../../../src/mock/data';
import { default as locale } from '../../../src/modules/Pages/LearningResources/learningResources.locale';

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
        expect(currentClasses.length).to.be.above(1); // the user has courses that we can click on

        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=learning-resources-panel] h3').contains(locale.homepagePanel.userCourseTitle);

        cy.get('div[data-testid=learning-resources-panel] h3')
            .parent()
            .parent()
            .children()
            .should('have.length', currentClasses.length + 1); // n classes + 1 header

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

        // user clicks on first result
        cy.get('li#homepage-learningresource-autocomplete-option-0').click();
        // user lands on appropriate learning resources page
        cy.url().should(
            'include',
            // details of first mock result
            'learning-resources?user=s3333333&coursecode=FREN3111&campus=St%20Lucia&semester=Semester%201%202021',
        );
        const classPanelId = 'classpanel-0';
        cy.get(`div[data-testid=${classPanelId}] h3`).contains('FREN3111');
    });
});

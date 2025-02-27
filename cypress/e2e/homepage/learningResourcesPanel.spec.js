import { accounts } from '../../../src/data/mock/data';
import { default as locale } from '../../../src/modules/Pages/LearningResources/shared/learningResources.locale';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';

context('The Homepage Learning Resource Panel', () => {
    // do not leave this skipped for prod!!!!!!
    it.skip('Learning resources panel is accessible', () => {
        cy.visit('/?user=s1111111');
        cy.injectAxe();
        // cy.wait(2000);
        cy.waitUntil(() =>
            cy
                .get('[data-testid="learning-resources-panel"] [data-testid="your-courses"]')
                .should('exist')
                .contains(locale.homepagePanel.userCourseTitle),
        );
        cy.viewport(1300, 1000);
        cy.log('Learning resources panel');
        cy.waitUntil(() => cy.get('div[data-testid="learning-resources-homepage-panel"]').should('exist'));
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);
        cy.get('div[data-testid=learning-resources-panel] form input').type('FREN');
        cy.waitUntil(() =>
            cy
                .get('h2')
                .should('exist')
                .contains('Matching courses'),
        );
        cy.wait(600);
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
        cy.get('div[data-testid=learning-resources-panel] h4').contains(locale.homepagePanel.userCourseTitle);

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        cy.get('div[data-testid=learning-resources-panel] h4')
            .parent()
            .parent()
            .children()
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

    it('The Learning resources panel displays results correctly when the user has many classes', () => {
        cy.visit('?user=s5555555');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);

        cy.get('[data-testid="staff-course-prompt"]').should('not.exist');
        cy.get('[data-testid="your-courses"]')
            .should('exist')
            .should('be.visible')
            .children()
            .children()
            .should('have.length', 5 + 2);
        cy.get('[data-testid="learning-resource-panel-course-multi-footer"]')
            .should('exist')
            .should('be.visible')
            .contains('See all 10 classes');
        // the longer subject name wraps properly
        cy.get('[data-testid="your-courses"]').within(() => {
            cy.get('li').should('have.length', 5);
            let firstItemLeft;
            cy.get('li .descriptor')
                .eq(0)
                .should('be.visible')
                .then($el => {
                    firstItemLeft = $el.position().left;
                });
            cy.get('li .descriptor')
                .eq(3)
                .contains('Animals')
                .then($el3 => {
                    const thirdItemTop = $el3.position().top;
                    const thirdItemLeft = $el3.position().left;
                    const thirdItemBottom = $el3.position().top + $el3.outerHeight();

                    // they both sit at the same spot on the left
                    expect(thirdItemLeft).to.equal(firstItemLeft);
                    // the line wraps correctly - it has a height of more than one line
                    expect(thirdItemBottom - thirdItemTop).be.greaterThan(47);
                    expect(thirdItemBottom - thirdItemTop).be.lessThan(49);
                    // (hard to test something useful)
                });
        });
    });

    it('The Learning resources panel displays results with incomplete data correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=learning-resources-panel]').contains(locale.homepagePanel.title);

        cy.get('div[data-testid="learning-resource-search-input-field"] input')
            .should('exist')
            .should('be.visible');

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

    it('Staff see example courses', () => {
        cy.visit('/?user=uqstaff');
        cy.get('[data-testid="staff-course-prompt"]')
            .should('exist')
            .contains('Students see enrolled courses. Example links below:');
        cy.get('[data-testid="no-enrolled-courses"]').should('not.exist');
        const numberOfBlocks = 3 + 1; // n classes + 1 header
        cy.get('[data-testid="your-courses"]')
            .children()
            .children()
            .should('have.length', numberOfBlocks);
        cy.get('[data-testid="hcr-0"]')
            .should('exist')
            .contains('FREN1010');
    });
});

import { accounts } from '../../../src/data/mock/data';
import { default as subjectSearchSuggestions } from '../../../src/data/mock/data/records/learningResources/subjectSearchSuggestions';

context('The Homepage Past Exam Papers Panel', () => {
    it('Past exam papers panel is accessible', () => {
        cy.visit('/?user=s1111111');
        cy.injectAxe();
        // cy.wait(2000);
        cy.waitUntil(() =>
            cy
                .get('[data-testid="past-exam-papers-panel"] [data-testid="your-courses"]')
                .should('exist')
                .contains('Your courses'),
        );
        cy.viewport(1300, 1000);
        cy.log('Past exam papers panel');
        cy.waitUntil(() => cy.get('div[data-testid="past-exam-papers-homepage-panel"]').should('exist'));
        cy.get('div[data-testid=past-exam-papers-panel]').contains('Past exam papers');
        cy.get('div[data-testid=past-exam-papers-panel] form input').type('FREN');
        cy.wait(500);
        cy.checkA11y('div[data-testid="past-exam-papers-panel"]', {
            reportName: 'Past exam papers panel',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('The Past exam papers panel links correctly', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);
        const currentClasses = accounts.s1111111.current_classes;
        expect(currentClasses.length).to.be.above(1); // the user has courses that we can click on

        cy.get('div[data-testid=past-exam-papers-panel]').contains('Past exam papers');
        cy.get('div[data-testid=past-exam-papers-panel] h4').contains('Your courses');

        const numberOfBlocks = currentClasses.length + 1; // n classes + 1 header
        cy.get('div[data-testid=past-exam-papers-panel] h4')
            .parent()
            .parent()
            .children()
            .should('have.length', numberOfBlocks);

        // the users clicks one of the classes in the 'Your courses' list
        const classIndex = 0;
        cy.get(`[data-testid="past-exam-papers-panel-course-link-${classIndex}"]`)
            .contains('FREN1010')
            .click({ force: true });
        // the user lands on the correct page
        cy.url().should('include', 'exams/course/fren1010?user=s1111111');
        cy.get('[data-testid="StandardPage-title"]').contains('Past Exam Papers from 2017 to 2022 for "FREN1010"');
    });

    it('The Past exam papers panel searches correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=past-exam-papers-panel]').contains('Past exam papers');
        cy.get('[data-testid="no-enrolled-courses"]')
            .should('exist')
            .contains('Your enrolled courses will appear here three weeks prior to the start of the semester');

        // the user is not enrolled in any subjects which means the form has no sibling elements
        cy.get('div[data-testid=past-exam-papers-panel] form')
            .parent()
            .children()
            .should('have.length', 2); // 1 search field and one div with 'no courses' text
        // the user sees a search field
        cy.get('div[data-testid=past-exam-papers-panel] form input').should(
            'have.attr',
            'placeholder',
            'Search by course code or keyword',
        );

        // user enters ACCT
        cy.get('div[data-testid=past-exam-papers-panel] form input').type('ACCT11');
        const subjectSearchSuggestionsWithACCT = subjectSearchSuggestions.filter(item =>
            item.name.startsWith('ACCT11'),
        );
        cy.get('ul#homepage-pastexampapers-autocomplete-listbox')
            .children()
            .should('have.length', subjectSearchSuggestionsWithACCT.length + 1); // add one for title
        // user clicks on #1, ACCT1101
        cy.get('li#homepage-pastexampapers-autocomplete-option-0')
            .contains('ACCT1101')
            .click();
        // user lands on appropriate Past exam papers page
        cy.url().should('include', 'exams/course/acct1101?user=s3333333');
    });

    it('The Past exam papers panel displays results with incomplete data correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid=past-exam-papers-panel]').contains('Past exam papers');

        cy.get('div[data-testid=past-exam-papers-panel] form input').should(
            'have.attr',
            'placeholder',
            'Search by course code or keyword',
        );

        // user enters FREN
        cy.get('div[data-testid=past-exam-papers-panel] form input').type('FREN');

        // the subjects that are missing some data appear correctly
        cy.waitUntil(() =>
            cy
                .get('#homepage-pastexampapers-autocomplete-option-0')
                .contains('FREN1010 (has mock data - Introductory French 1, St Lucia, Semester 2 2020)'),
        );
        cy.get('#homepage-pastexampapers-autocomplete-option-1').contains(
            'FREN1012 (French subject with blank semester, St Lucia)',
        );
        cy.get('#homepage-pastexampapers-autocomplete-option-2').contains(
            'FREN1011 (French subject with blank campus, Semester 2 2020)',
        );
    });

    // at one point, a course code entered in all caps would not match a complete course code
    it('The search field loads the matching result for a complete course code', () => {
        cy.visit('/?user=s3333333');
        cy.get('div[data-testid=past-exam-papers-panel] form input')
            .clear()
            .type('ACCT1101');
        cy.get('ul#homepage-pastexampapers-autocomplete-listbox')
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
        cy.get('div[data-testid=past-exam-papers-panel] h4')
            .parent()
            .parent()
            .children()
            .should('have.length', numberOfBlocks);
        cy.get('[data-testid="past-exam-papers-panel-course-link-0"]')
            .should('exist')
            .contains('FREN1010');
    });
});

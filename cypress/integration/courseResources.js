context('Course Resources', () => {
    it('User with classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="course-resources"]').contains('My courses');

        cy.get('button#classtab-0').contains('FREN101');
        cy.get('div[data-testid=classpanel-0] h3').contains('Introductory French 1');

        cy.get('.readingLists h3').contains('Reading lists (2)');
        cy.get('.readingLists a')
            .contains('Collins Robert French dictionary')
            .should('have.attr', 'href', 'http://lr.library.uq.edu.au/items/598CB489-69A1-49E3-CDA5-BCDD0B4EFA3F.html');

        cy.get('.exams h3').contains('Past exam papers (8)');
        cy.get('.exams a')
            .contains('Semester 2 2019 (pdf)')
            .should(
                'have.attr',
                'href',
                'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_FREN1010.pdf',
            );
        cy.get('div[data-testid=exam-more-link] a')
            .contains('6 more past papers')
            .should('have.attr', 'href', 'https://www.library.uq.edu.au/exams/papers.php?stub=FREN1010');

        cy.get('h3[data-testid=standard-card-library-guides-header]').contains('Library guides');
        cy.get('div[data-testid=standard-card-library-guides-content] a')
            .contains('French Studies')
            .should('have.attr', 'href', 'https://guides.library.uq.edu.au/french');
        cy.get('a[data-testid=all-guides]')
            .contains('All library guides')
            .should('have.attr', 'href', 'https://guides.library.uq.edu.au');

        cy.get('a[data-testid=ecp-FREN1010]')
            .contains('Electronic Course Profile')
            .should('have.attr', 'href', 'https://www.uq.edu.au/study/course.html?course_code=FREN1010');

        cy.get('a[data-testid=blackboard-FREN1010]')
            .contains('Learn.UQ (Blackboard)')
            .should('have.attr', 'href', 'https://learn.uq.edu.au/FREN1010');

        // click the second subject tab, HIST1201
        cy.get('button#classtab-1')
            .contains('HIST1201')
            .click();
        cy.get('div[data-testid=classpanel-1] h3').contains('The Australian Experience');
        cy.get('.readingLists h3').contains('Reading lists (35)');
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains('33 more items')
            .should('have.attr', 'href', 'http://lr.library.uq.edu.au/lists/2109F2EC-AB0B-482F-4D30-1DD3531E46BE');
        // cy.get('div.exams').to.not.contain('more past papers');
        cy.get('div[data-testid=exam-more-link] a').should('not.exist');

        // click the second subject tab, PHIL1002
        cy.get('button#classtab-2')
            .contains('PHIL1002')
            .click();
        cy.get('div[data-testid=standard-card-reading-lists--content]').contains('More than one reading list found');
        cy.get('a[data-testid=multiple-reading-list-search-link]')
            .contains('Search other reading lists')
            .should('have.attr', 'href', 'http://lr.library.uq.edu.au/index.html');

        cy.get('div[data-testid=standard-card-past-exam-papers--content]').contains(
            'No Past Exam Papers for this course',
        );
        cy.get('div[data-testid=standard-card-past-exam-papers--content] a')
            .contains('Search for other exam papers')
            .should('have.attr', 'href', 'https://www.library.uq.edu.au/exams/papers.php?stub=');

        // click the course search button
        cy.get('button#topmenu-1')
            .contains('Course search')
            .click();
        cy.get('div[data-testid=primo-search-autocomplete] input').should(
            'have.attr',
            'placeholder',
            'Enter a course code',
        );

        // click the Study Help button
        cy.get('button#topmenu-2')
            .contains('Study Help')
            .click();
        cy.get('h3[data-testid=standard-card-study-help-header]').contains('Study Help');
        cy.get('a#referencingGuides')
            .contains('Referencing guides')
            .should('have.attr', 'href', 'https://guides.library.uq.edu.au/referencing');
    });
});

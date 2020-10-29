import { default as locale } from '../../src/modules/Pages/CourseResources/courseResourcesLocale';
import { _pluralise, _courseLink } from '../../src/modules/Pages/CourseResources/courseResourcesHelpers';

context('Course Resources', () => {
    it('User with classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="course-resources"]').contains(locale.myCourses.title);

        cy.get('button#classtab-0').contains('FREN101');
        cy.get('div[data-testid=classpanel-0] h3').contains('Introductory French 1');

        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (2)`);
        cy.get('.readingLists a')
            .contains('Collins Robert French dictionary')
            .should('have.attr', 'href', 'http://lr.library.uq.edu.au/items/598CB489-69A1-49E3-CDA5-BCDD0B4EFA3F.html');

        cy.get('.exams h3').contains(`${locale.myCourses.examPapers.title} (8)`);
        cy.get('.exams a')
            .contains('Semester 2 2019 (pdf)')
            .should(
                'have.attr',
                'href',
                'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_FREN1010.pdf',
            );
        cy.get('div[data-testid=exam-more-link] a')
            .contains(
                locale.myCourses.examPapers.morePastExams
                    .replace('[numberExcessExams]', 6)
                    .replace('[examNumber]', _pluralise('paper', 6)),
            )
            .should('have.attr', 'href', _courseLink('FREN1010', locale.myCourses.examPapers.footer.linkOutPattern));

        cy.get('h3[data-testid=standard-card-library-guides-header]').contains(locale.myCourses.guides.title);
        cy.get('div[data-testid=standard-card-library-guides-content] a')
            .contains('French Studies')
            .should('have.attr', 'href', 'https://guides.library.uq.edu.au/french');
        cy.get('a[data-testid=all-guides]')
            .contains(locale.myCourses.guides.footer.linkLabel)
            .should('have.attr', 'href', locale.myCourses.guides.footer.linkOut);

        cy.get('a[data-testid=ecp-FREN1010]')
            .contains(locale.myCourses.links.ecp.title)
            .should('have.attr', 'href', _courseLink('FREN1010', locale.myCourses.links.ecp.linkOutPattern));

        cy.get('a[data-testid=blackboard-FREN1010]')
            .contains(locale.myCourses.links.blackboard.title)
            .should('have.attr', 'href', _courseLink('FREN1010', locale.myCourses.links.blackboard.linkOutPattern));

        // click the second subject tab, HIST1201
        cy.get('button#classtab-1')
            .contains('HIST1201')
            .click();
        cy.get('div[data-testid=classpanel-1] h3').contains('The Australian Experience');
        cy.get('.readingLists h3').contains(`${locale.myCourses.readingLists.title} (35)`);
        cy.get('div[data-testid=reading-list-more-link] a')
            .contains('33 more items')
            .should('have.attr', 'href', 'http://lr.library.uq.edu.au/lists/2109F2EC-AB0B-482F-4D30-1DD3531E46BE');
        cy.get('div[data-testid=exam-more-link] a').should('not.exist');

        // click the third subject tab, PHIL1002
        cy.get('button#classtab-2')
            .contains('PHIL1002')
            .click();
        cy.get('div[data-testid=standard-card-reading-lists--content]').contains(
            locale.myCourses.readingLists.multiple.title.replace('[classnumber]', 'PHIL1002'),
        );
        cy.get('a[data-testid=multiple-reading-list-search-link]')
            .contains(locale.myCourses.readingLists.multiple.linkLabel)
            .should('have.attr', 'href', locale.myCourses.readingLists.multiple.linkOut);

        cy.get('div[data-testid=standard-card-past-exam-papers--content]').contains(locale.myCourses.examPapers.none);
        cy.get('div[data-testid=standard-card-past-exam-papers--content] a').should(
            'have.attr',
            'href',
            _courseLink('', locale.myCourses.examPapers.footer.linkOutPattern),
        );

        // click the course search button
        cy.get('button#topmenu-1')
            .contains(locale.search.title)
            .click();
        cy.get('div[data-testid=primo-search-autocomplete] input').should(
            'have.attr',
            'placeholder',
            'Enter a course code',
        );

        // click the Study Help button
        cy.get('button#topmenu-2')
            .contains(locale.studyHelp.title)
            .click();
        cy.get('h3[data-testid=standard-card-study-help-header]').contains(locale.studyHelp.title);
        locale.studyHelp.links.map(link => {
            cy.get(`a#${link.id}`)
                .contains(link.linkLabel)
                .should('have.attr', 'href', link.linkTo);
        });
    });
});

describe('header', () => {
    // really this ought to be in reusable
    // but we are testing how it appears _in_ homepage so we need homepage available
    // so it has to be here :(
    context('breadcrumbs', () => {
        it('loads the breadcrumbs correctly', () => {
            cy.visit('http://localhost:2020/?user=s1111111');
            cy.viewport(1280, 900);

            // once the page has loaded
            cy.get('[data-testid="personalised-panel"]')
                .should('exist')
                .contains('Michael');
            // then the homepage has the correct breadcrumbs
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="site-title"]')
                        .should('exist')
                        .contains('Library Local')
                        .should('have.attr', 'href')
                        .and('include', 'http://localhost:2020/?user=s1111111');
                    cy.get('[data-testid="secondlevel-site-title"]').should('not.exist');
                });
            // when we visit a subsystem
            // (could have been any of the subsystems, but this one has a link on page
            // and its valuable to test the actual navigation)
            cy.get('[data-testid="learning-resource-panel-course-link-0"]')
                .should('exist')
                .contains('FREN1010')
                .click();
            // the Learning Resource page loads
            cy.url().should(
                'eq',
                'http://localhost:2020/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
            );
            cy.waitUntil(() => cy.get('[data-testid="StandardPage"]'))
                .should('exist')
                .contains('Learning resources');
            // and the correct breadcrumbs are present
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="site-title"]')
                        .should('exist')
                        .contains('Library Local')
                        .should('have.attr', 'href')
                        .and('include', 'http://localhost:2020/?user=s1111111');
                    cy.get('[data-testid="secondlevel-site-title"]')
                        .should('exist')
                        .contains('Learning resource')
                        .should('have.attr', 'href')
                        .and('include', '/learning-resources');

                    // ok now the important test: nav back to homepage and then show third breadcrumb removed
                    cy.get('[data-testid="site-title"]').click();
                });
            // show the page has fully loaded
            cy.url().should('eq', 'http://localhost:2020/?user=s1111111');
            cy.get('[data-testid="personalised-panel"]')
                .should('exist')
                .contains('Michael');
            // and the breadcrumbs are as expected:  learning resource breadcrumb has been removed :)
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="site-title"]')
                        .should('exist')
                        .contains('Library Local')
                        .should('have.attr', 'href')
                        .and('include', 'http://localhost:2020/?user=s1111111');
                    cy.get('[data-testid="secondlevel-site-title"]').should('not.exist');
                });
        });
    });
});

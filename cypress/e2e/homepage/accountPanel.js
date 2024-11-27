describe('Alma Primo', () => {
    context('Logged in Account panel', () => {
        it('shows relevant links for account user', () => {
            cy.visit('http://localhost:2020/');
            cy.viewport(1280, 900);

            // once the page has loaded for a UQ user, check if all required links are shown.
            cy.get('[data-testid="catalogue-panel"]')
                .should('exist')
                .contains('Your library account');
            cy.get('[data-testid="catalogue-panel-content"]')
                .should('exist')
                .contains('Loans (1)');
        });
        it('displays nothing on an error correctly', () => {
            cy.visit('http://localhost:2020/?user=s1111111&responseType=almaError');
            cy.viewport(1280, 900);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="show-requests"]')
                    .should('exist')
                    .contains('Requests'),
            );
            cy.get('[data-testid="show-requests"]').should('not.contain', '(');
            cy.get('[data-testid="show-loans"]').should('not.contain', '(');
            cy.get('[data-testid="show-papercut"]').should('not.contain', '(');
        });
    });
});
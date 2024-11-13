describe('Referencing', () => {
    context('Referencing Links', () => {
        it('shows both referencing and endnote links for UQ user', () => {
            cy.visit('http://localhost:2020/');
            cy.viewport(1280, 900);

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="referencing-homepage-panel"]')
                    .should('exist')
                    .contains('Referencing'),
            );
            cy.get('[data-testid="referencing-style"]')
                .should('exist')
                .should('contain', 'Referencing style guides');
            cy.get('[data-testid="referencing-endnote"]')
                .should('exist')
                .should('contain', 'Endnote referencing software');
        });
        it('shows both endnote links only for non UQ user', () => {
            // now check for non-uq users - end not should not be shown.
            cy.visit('http://localhost:2020?user=emcommunity');
            cy.viewport(1280, 900);

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="referencing-homepage-panel"]')
                    .should('exist')
                    .contains('Referencing'),
            );
            cy.get('[data-testid="referencing-style"]')
                .should('exist')
                .should('contain', 'Referencing style guides');
            cy.get('[data-testid="referencing-endnote"]').should('not.exist');
        });
    });
});

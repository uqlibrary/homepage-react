describe('Alma Primo', () => {
    // really this ought to be in reusable
    // but we are testing how it appears _in_ homepage so we need homepage available
    // so it has to be here :(
    context('My UQ Account Links', () => {
        it('shows relevant links for account user', () => {
            cy.visit('http://localhost:2020/');
            cy.viewport(1280, 900);

            // once the page has loaded for a UQ user, check if all required links are shown.
            cy.get('[data-testid="catalogue-panel"]')
                .should('exist')
                .contains('My library account');
            cy.get('[data-testid="catalogue-panel-content"]')
                .should('exist')
                .contains('Your library loans (1)');
            // cy.get('.reference-panel-item')
            //     .should('contain', 'Referencing style guides')
            //     .and('contain', 'Endnote referencing software');

            // // now check for non-uq users - end not should not be shown.
            // cy.visit('http://localhost:2020?user=emcommunity');
            // cy.viewport(1280, 900);

            // cy.get('[data-testid="referencing-homepage-panel"]')
            //     .should('exist')
            //     .contains('Referencing');
            // cy.get('.reference-panel-item')
            //     .should('contain', 'Referencing style guides')
            //     .and('not.contain', 'Endnote referencing software');
        });
    });
});
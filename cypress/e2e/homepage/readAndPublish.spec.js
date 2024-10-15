describe('Read and Publish (homepage)', () => {
    context('Containing elements', () => {
        it('Shows all the favourites when the user only has a few favourites', () => {
            cy.visit('http://localhost:2020/?user=uqstaff');
            cy.viewport(1280, 900);

            // User with only 2 items
            cy.get('[data-testid="rp-journalsearch-items"]')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="rp-yourfavourite-count"]').should('contain', 2);
        });
        it('Shows only 5 favourites when the user has many favourites', () => {
            cy.visit('http://localhost:2020/?user=uqresearcher');

            cy.viewport(1280, 900);

            // User with 8 items, only showing 5 in the list
            cy.get('[data-testid="rp-journalsearch-items"]')
                .should('exist')
                .children()
                .should('have.length', 5);
            // 8 in total, but only shows 5.
            cy.get('[data-testid="rp-yourfavourite-count"]').should('contain', 8);
        });
        it('Shows an error when the api did not return', () => {
            cy.visit('http://localhost:2020/?user=uqpf');
            cy.viewport(1280, 900);

            // User in which an error shows
            cy.get('[data-testid="readpublish-panel-content"]')
                .should('exist')
                .should('contain', 'Journal search')
                .should('contain', 'We cannot display your favourite journal searches at this time.');
            cy.get('[data-testid="rp-journalsearch-items"]').should('not.exist');

            // no count should be showing
            cy.get('[data-testid="rp-yourfavourite-count"]').should('not.exist');
        });
        it('indicates when the user has not favourited any journals', () => {
            cy.visit('http://localhost:2020/?user=s2222222');
            cy.viewport(1280, 900);

            // User that has no favourite items.
            cy.get('[data-testid="readpublish-panel-content"]')
                .should('exist')
                .should('contain', 'Journal search')
                .should('contain', 'You have no favourite items');
            cy.get('[data-testid="rp-journalsearch-items"]').should('not.exist');

            // no count should be showing, but hold a message.
            cy.get('[data-testid="rp-yourfavourite-count"]')
                .should('exist')
                .should('contain', 'no favourite items');
        });
        it('does not show read and publish to the non logged in user', () => {
            cy.visit('http://localhost:2020/?user=public');
            cy.get('[data-testid="readpublish-panel-content"]').should('not.exist');
        });
    });
});

describe('Read and Publish (homepage)', () => {
    context('Containing elements', () => {
        it('does not show read and publish to the non logged in user', () => {
            cy.visit('http://localhost:2020/?user=public');
            cy.get('[data-testid="readpublish-panel-content"]').should('not.exist');
        });
        it('does show read and publish to the logged in user', () => {
            cy.visit('http://localhost:2020/?user=uqstaff');
            cy.get('[data-testid="readpublish-panel-content"]').should('exist');
        });
    });
});

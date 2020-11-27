context('AskUs', () => {
    it('Renders as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="askus-button"]').contains('Ask us');
    });

    it('Shows correct menu for a vanilla user', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="askus-button"]').contains('Ask us');
        cy.get('button[data-testid="askus-button"]').click();
        cy.get('ul[data-testid="askus-menulist"]')
            .children()
            .should('have.length', 7);
    });
});

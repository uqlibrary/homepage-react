context('AskUs', () => {
    it('Renders as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="AskUs-button"]').contains('Ask us');
    });

    it('Shows correct menu for a vanilla user', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="AskUs-button"]').contains('Ask us');
        cy.get('button[data-testid="AskUs-button"]').click();
        cy.get('div[data-testid="AskUs-menu-items"]')
            .children()
            .should('have.length', 7);
    });
});

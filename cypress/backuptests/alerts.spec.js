context('Alerts', () => {
    it('Render as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="alert-0"]').contains('Test urgent alert 2');
        cy.get('div[data-testid="alert-0"]').should('be.visible');
        cy.get('button[data-testid="alert-0-action-button"]')
            .should('be.visible')
            .contains('urgent link description');
        cy.get('button[data-testid="alert-0-hide-button"]').should('be.visible');
    });
    it('Hides as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="alert-0"]').should('be.visible');
        cy.get('button[data-testid="alert-0-hide-button"]').click();
        cy.get('div[data-testid="alert-0"]').should('not.be.visible');
    });
});

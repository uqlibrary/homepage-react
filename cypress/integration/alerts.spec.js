context('Homepage', () => {
    it('Renders as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="alert-0"]').contains('Test urgent alert 2');
        cy.get('div[data-testid="alert-1"]').contains('We are open on-campus and online');

        cy.get('div[data-testid="alert-0"]').should('be.visible');
        cy.get('div[data-testid="alert-1"]').should('be.visible');

        cy.get('button[data-testid="alert-0-action-button"]')
            .should('be.visible')
            .contains('urgent link description');
        cy.get('button[data-testid="alert-1-action-button"]')
            .should('be.visible')
            .contains('UQ Library COVID-19 Updates');

        cy.get('button[data-testid="alert-0-hide-button"]').should('be.visible');
        cy.get('button[data-testid="alert-1-hide-button"]').should('be.visible');
    });
    it('Hides as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="alert-0"]').should('be.visible');
        cy.get('div[data-testid="alert-1"]').should('be.visible');

        cy.get('button[data-testid="alert-0-hide-button"]').click();
        cy.get('div[data-testid="alert-0"]').should('not.be.visible');
        cy.get('div[data-testid="alert-1"]').should('be.visible');

        cy.get('button[data-testid="alert-1-hide-button"]').click();
        cy.get('div[data-testid="alert-0"]').should('not.be.visible');
        cy.get('div[data-testid="alert-1"]').should('not.be.visible');
    });
});

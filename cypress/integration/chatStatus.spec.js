context('Homepage', () => {
    it('Renders as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="chat-status-snackbar-online"]').contains('Chat online now');
        cy.get('svg[data-testid="chat-status-icon-online"]').should('not.be.visible');
    });

    it('Shows icon when closed', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="chat-status-snackbar-online"]').contains('Chat online now');
        cy.get('button[data-testid="chat-status-snackbar-online-close-button"]').click();
        cy.get('svg[data-testid="chat-status-icon-online"]').should('be.visible');
    });
});

context('ACCESSIBILITY', () => {
    it('Chat status', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="chat-status-snackbar-online"]').contains('Chat online now');
        cy.log('Online chat status open');
        cy.checkA11y('div[data-testid="chat-status-snackbar-online"]', {
            reportName: 'Homepage',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('button[data-testid="chat-status-snackbar-online-close-button"]').click();
        cy.log('Online chat status closed');
        cy.checkA11y('button[data-testid="chat-status-icon-button-online"]', {
            reportName: 'Homepage',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

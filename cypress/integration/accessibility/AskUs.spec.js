context('ACCESSIBILITY', () => {
    it('Ask Us Button', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="AskUs-button"]').contains('Ask us');

        cy.log('Ask Us button');
        cy.checkA11y('button[data-testid="AskUs-button"]', {
            reportName: 'AskUs',
            scopeName: 'Button',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('Ask Us menu');
        cy.get('button[data-testid="AskUs-button"]').click();
        cy.checkA11y('div[data-testid="AskUs-menu-items"]', {
            reportName: 'AskUs',
            scopeName: 'Menu',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});

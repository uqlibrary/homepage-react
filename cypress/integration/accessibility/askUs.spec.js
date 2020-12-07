context('ACCESSIBILITY', () => {
    it('Ask Us Button', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="askus-button"]').contains('Ask us');

        cy.log('Ask Us button');
        cy.checkA11y('button[data-testid="askus-button"]', {
            reportName: 'AskUs',
            scopeName: 'Button',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.log('Ask Us menu');
        cy.get('button[data-testid="askus-button"]').click();
        cy.get('li[data-testid="askus-menuitem-0"]').contains('FAQ');
        cy.wait(500);
        // TODO: For some reason, Axe seems to think there is a light foreground color when there isnt.
        cy.checkA11y('div[data-testid="askus-paper"]', {
            reportName: 'AskUs',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

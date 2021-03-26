context('ACCESSIBILITY', () => {
    it('My Library Button', () => {
        cy.visit('/?user=uqstaff');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').contains('My library');

        cy.log('My Library button');
        cy.checkA11y('button[data-testid="mylibrary-button"]', {
            reportName: 'My Library',
            scopeName: 'Button',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.log('My Library menu');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('li[data-testid="mylibrary-menuitem-masquerade"]').contains('Masquerade');
        cy.wait(500);
        // TODO: For some reason, Axe seems to think there is a light foreground color when there isnt.
        cy.checkA11y('div[data-testid="mylibrary-paper"]', {
            reportName: 'My Library',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

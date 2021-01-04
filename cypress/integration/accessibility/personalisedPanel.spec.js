context('ACCESSIBILITY', () => {
    it('Personalised panel', () => {
        cy.visit('/?user=uqresearcher');
        cy.wait(2000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('John');
        cy.get('div[data-testid="personalised-panel"]').contains('Link ORCiD account to eSpace');
        cy.log('Personalised panel as loaded');
        cy.checkA11y('div[data-testid="personalised-panel"]', {
            reportName: 'Personalised panel',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('Personalised panel print menu', () => {
        cy.visit('/');
        cy.wait(2000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');
        cy.get('div[data-testid="personalised-panel"]').contains('Manage your print balance');

        cy.log('Papercut menu');
        cy.get('button[data-testid="pp-papercut-menu-button"]').click();
        cy.get('li[data-testid="pp-papercut-item-button-0"]').contains('Log in and manage your print balance');
        cy.wait(500);
        cy.checkA11y('div[data-testid="papercut-paper"]', {
            reportName: 'My Library',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Personalised panel location menu', () => {
        cy.visit('/');
        cy.wait(2000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');
        cy.get('button[data-testid="location-button"]').contains('Set a preferred campus');

        cy.log('Location menu');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"]').contains('No preference');
        cy.wait(500);
        cy.checkA11y('div[data-testid="location-paper"]', {
            reportName: 'Location',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

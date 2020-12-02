context('ACCESSIBILITY', () => {
    it('Computer availability', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Computers');
        cy.get('button[data-testid="computers-library-button-0"]').contains('Architecture & Music Library');

        cy.log('Computers list');
        cy.checkA11y('div[data-testid="standard-card-training"]', {
            reportName: 'Computers',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('Level displayed');
        cy.get('button[data-testid="computers-library-button-0"]').click();
        cy.checkA11y('div[data-testid="standard-card-training"]', {
            reportName: 'Computers',
            scopeName: 'Level expanded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('Floor map');
        cy.get('button[data-testid="computers-library-0-level-3-button"]').click();
        cy.checkA11y('div[data-testid="computers-library-dialog"]', {
            reportName: 'Computers',
            scopeName: 'Lvel map',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

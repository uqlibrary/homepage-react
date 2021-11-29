context('Hours Accessibility', () => {
    it('Hours Accessibility', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Hours');
        cy.get('[data-testid="hours-item-0"]').contains('Arch Music');

        cy.log('Hours list');
        cy.checkA11y('div[data-testid="library-hours-panel"]', {
            reportName: 'Hours',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('shows the expected values in hours', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="hours-item-0"] div:first-child').contains('Arch Music');
        cy.get('[data-testid="hours-item-0"] div:nth-child(2)').contains('7:30am - 7:30pm');
        cy.get('[data-testid="hours-item-0"] div:nth-child(3)').should('not.exist');
        cy.get('[data-testid="hours-item-3"] div:first-child').contains('Central');
        cy.get('[data-testid="hours-item-3"] div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-3"] div:nth-child(3)').contains('8am - 6pm');
    });
});

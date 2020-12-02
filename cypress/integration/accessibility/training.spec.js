context('ACCESSIBILITY', () => {
    it('Training', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Training');
        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');

        cy.log('Events list');
        cy.checkA11y('div[data-testid="standard-card-training"]', {
            reportName: 'Training',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.log('Event detail');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.wait(500);
        cy.checkA11y('div[data-testid="standard-card-training"]', {
            reportName: 'Training',
            scopeName: 'Event detail',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

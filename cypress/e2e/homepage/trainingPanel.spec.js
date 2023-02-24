context('Training', () => {
    it('Training Accessibility', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.wait(2000);
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('div[data-testid="training-panel"]').should('exist'));
        cy.log('Training');
        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');

        cy.log('Events list');
        cy.get('[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .should('have.text', 'EndNote: getting started24 November at 10am - Online');
        cy.checkA11y('button[data-testid="training-event-detail-button-0"]', {
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

    it('shows the number of places correctly', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);

        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.wait(500);
        // when placesRemaining > 0 we see 'places available'
        cy.get('div[data-testid="training-events-detail-2824657"]').contains('Places still available');
        // close it
        cy.get('button[data-testid="training-event-detail-close-button"]').click();
        cy.wait(500);

        cy.get('button[data-testid="training-event-detail-button-1"]').contains('Advanced Adobe Illustrator');
        cy.get('button[data-testid="training-event-detail-button-1"]').click();
        cy.wait(500);
        // when placesRemaining is not null we see 'full' (null means there is no limit)
        cy.get('div[data-testid="training-events-detail-2870806"]').contains('Event is fully booked');
        // close it
        cy.get('button[data-testid="training-event-detail-close-button"]').click();
        cy.wait(500);

        cy.get('button[data-testid="training-event-detail-button-2"]').contains(
            'SciFinder n - learning the new features of this chemistry database',
        );
        cy.get('button[data-testid="training-event-detail-button-2"]').click();
        cy.wait(500);
        // when placesRemaining is 0 we see 'Event is fully booked'
        cy.get('div[data-testid="training-events-detail-2873532"]').contains('Booking is not required');
    });
});

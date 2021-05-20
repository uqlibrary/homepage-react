context('ACCESSIBILITY', () => {
    it('Book Exam Booth', () => {
        cy.visit('/book-exam-booth');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Book Exam Booth');

        cy.log('Question');
        cy.checkA11y('[data-testid="standard-card-booking-options"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('No option');
        cy.get('[data-testid="display-decider-option-no"]').click();
        cy.get('[data-testid="no-booking-necessary"]').should('exist');
        cy.checkA11y('[data-testid="no-booking-necessary"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'No option',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('Yes option');
        cy.get('[data-testid="display-decider-option-yes"]').click();
        cy.get('[data-testid="booking-details"]').should('exist');
        cy.checkA11y('[data-testid="booking-details"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'Yes option',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

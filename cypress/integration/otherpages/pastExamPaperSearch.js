context('past exam paper search page', () => {
    it('the past exam paper search page is accessible', () => {
        cy.visit('/exams');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('Search for a past exam paper');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'past exam paper search',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

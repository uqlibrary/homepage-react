context('Alert Admin', () => {
    it('displays an "unauthorised" page to non-authorised users', () => {
        cy.visit('http://localhost:2020/admin/alerts?user=uqstaffnonpriv');
        cy.viewport(1300, 1000);
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('Permission denied');
    });
    it('displays a list of alerts to the authorised user', () => {
        cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="current-list"]').should('be.visible');
        cy.get('[data-testid="current-list"] tbody')
            .children()
            .should('have.length', 1);

        cy.get('[data-testid="future-list"]').should('be.visible');
        cy.get('[data-testid="future-list"] tbody')
            .children()
            .should('have.length', 2);

        cy.get('[data-testid="past-list"]').should('be.visible');
        cy.get('[data-testid="past-list"] tbody ')
            .children()
            .should('have.length', 5);
    });
    it('is accessible', () => {
        cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h3').should('be.visible');
        cy.get('h3').contains('List of all Alerts');
        cy.wait(500);
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Alerts Admin',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it.skip('Works as expected', () => {
        // tbd
    });
});

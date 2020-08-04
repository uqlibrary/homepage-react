context('Actions', () => {
    it('login', () => {
        cy.viewport(1920, 1600);
        cy.visit(Cypress.env('HOMEPAGE_HOST'));
        cy.get('.log-in-button', { timeout: 1000, force: true }).click();
        cy.get('#username').type(Cypress.env('HOMEPAGE_AUTH_ID'));
        cy.get('#password').type(Cypress.env('HOMEPAGE_AUTH_PASSWORD'));
        cy.get('.button--sign-on').click();
        cy.get('.log-out-button', { timeout: 5000 });
        cy.getCookie('UQLID')
            .should('exist')
            .then(cookie => {
                cy.exec(`echo ${cookie.value} > cypress/fixtures/token`);
            });
    });
});

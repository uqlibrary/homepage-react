describe('Digital learning hub admin homepage', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmn';
    context('homepage', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor homepage',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has a working "add an object" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add object')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/add?user=dloradmn');
        });
    });
});

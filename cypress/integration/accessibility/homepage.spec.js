context('ACCESSIBILITY', () => {
    // it('Whole page', () => {
    //     cy.visit('/?user=uqstaff');
    //     cy.injectAxe();
    //     cy.viewport(1300, 1000);
    //     cy.get('button[data-testid="uq-site-header-home-button"]').contains('Library');
    //     cy.checkA11y('html', {
    //         reportName: 'Connect Footer',
    //         scopeName: 'Content',
    //         includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //     });
    // });
    it('Footer', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid=connect-footer] h3').contains('Connect with us');
        cy.log('Connect Footer');
        cy.checkA11y('[data-testid=connect-footer]', {
            reportName: 'Connect Footer',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.get('[data-testid=minimal-footer]').should('contain', '3365 3333');
        cy.log('Minimal Footer');
        cy.checkA11y('[data-testid=minimal-footer]', {
            reportName: 'Minimal Footer',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

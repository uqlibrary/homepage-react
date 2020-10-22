context('ACCESSIBILITY', () => {
    it('unprivileged user on an admin-only page', () => {
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid="notfound-label"]').contains('Page not found');
        cy.checkA11y('[data-testid="notfound"]', {
            reportName: 'Not found admin only',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('public user on a page that requires login', () => {
        cy.visit('/courseresources?user=public');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid="unauthorised-label"]').contains('Permissions denied');
        cy.checkA11y('[data-testid="notfound-unauthorised"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('genuine 404', () => {
        cy.visit('/xxxxxx/?user=vanilla');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid="notfound-label"]').contains('Page not found');
        cy.checkA11y('[data-testid="notfound-label"]', {
            reportName: 'Not found 404',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

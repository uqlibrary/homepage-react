context('ACCESSIBILITY', () => {
    it('unprivileged user on an admin-only page', () => {
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2[data-testid="StandardPage-title"]').contains('Page not found');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found admin only',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('public user on a page that requires login', () => {
        cy.visit('/courseresources?user=public');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2[data-testid="StandardPage-title"]').contains('Permission denied');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('genuine 404', () => {
        cy.visit('/xxxxxx/?user=vanilla');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2[data-testid="StandardPage-title"]').contains('Page not found');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found 404',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

context('ACCESSIBILITY', () => {
    it('genuine 404', () => {
        cy.visit('/xxxxxx/?user=vanilla');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Page not found');
        cy.checkA11y('[data-testid="notfound"]', {
            reportName: 'Not found 404',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    // only privileged page atm is masquerade, which gives 'page not found' 404
    // it('unprivileged user on a privileged page', () => {
    //     cy.visit('/admin/masquerade/?user=s1111111');
    //     cy.injectAxe();
    //     cy.viewport(1300, 1000);
    //     cy.get('h2').contains('Authentication required');
    //     cy.checkA11y('[data-testid="notfound-authenticate"]', {
    //         reportName: 'Not found admin only',
    //         scopeName: 'Content',
    //         includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //     });
    // });

    it('public user on a page that requires login', () => {
        cy.visit('/courseresources?user=public');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Permissions denied');
        cy.checkA11y('[data-testid="notfound-unauthorised"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

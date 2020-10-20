context('ACCESSIBILITY', () => {
    it('Homepage Admin', () => {
        cy.visit('/admin/masquerade?user=uqstaff');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#masquerade').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('div#masquerade', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Homepage Readonly', () => {
        cy.visit('/admin/masquerade?user=uqmasquerade');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#masquerade').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('div#masquerade', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

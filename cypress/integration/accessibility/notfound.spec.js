context('ACCESSIBILITY', () => {
    it('unprivileged user on an admin-only page', () => {
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('Page not found');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found admin only',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('non-loggedin user on a page that requires login', () => {
        cy.visit('/courseresources?user=public');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('authenticated users only');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('pages that arent available to all logged in users return an authorisation error', () => {
        cy.visit('/courseresources?user=emcommunity');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('authorised users only');
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
        cy.get('div[id="content-container"]').contains('Page not found');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found 404',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

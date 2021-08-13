describe('Spotlights Admin Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Spotlights Admin public access', () => {
        it('the list page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('the add page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });
    context('Spotlights Admin unauthorised access ', () => {
        it('the list page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('the add page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });
    context('Spotlights list page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('displays a list of spotlights to the authorised user', () => {
            cy.get('[data-testid="spotlight-list-current-and-scheduled"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="spotlight-list-current-and-scheduled"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="headerRow-count-current"]').contains('1 spotlight');

            // only the scheduled spotlight has a 'scheduled' icon
            cy.get('svg[data-testid="spotlight-scheduled-icon-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]').should('exist');
            // current alert exists, but it does not have a 'scheduled' icon
            cy.get('tr[data-testid="spotlight-list-row-b286d890-76f9-11eb-9471-41351ee40e02"]').should('exist');
            cy.get('svg[data-testid="spotlight-scheduled-icon-b286d890-76f9-11eb-9471-41351ee40e02"]').should(
                'not.exist',
            );

            // cy.wait(500);
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('be.visible');
            // cy.get('[data-testid="headerRow-count-past"]').contains('78 spotlights');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('not.exist');
            // cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('exist');
            // cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains('1-5 of 78');
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('All spotlights');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

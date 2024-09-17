context('Personalised panel accessibility', () => {
    it('Main Personalised panel is accessible', () => {
        cy.visit('/?user=uqresearcher');
        cy.injectAxe();
        cy.wait(2000);
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('div[data-testid="promo-panel"]').should('exist'));
        cy.get('div[data-testid="personalised-panel"]').contains('John');
        cy.get('div[data-testid="personalised-panel"]').contains('Claim 18 UQ eSpace records');
        cy.get('div[data-testid="personalised-panel"]').contains('Link ORCiD account to UQ eSpace');
        cy.get('div[data-testid="personalised-panel"]').contains('Complete 18 NTRO records in UQ eSpace');
        cy.log('Personalised panel as loaded');
        cy.wait(500);
        cy.checkA11y('div[data-testid="personalised-panel"]', {
            reportName: 'Personalised panel',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('Personalised panel print menu', () => {
        cy.visit('/?user=vanilla');
        cy.wait(3000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');
        cy.get('div[data-testid="personalised-panel"]').contains('Manage your print balance');

        cy.log('Papercut menu');
        cy.get('button[data-testid="pp-papercut-menu-button"]').click();
        cy.get('li[data-testid="pp-papercut-item-button-0"]').contains('More about your printing account');
        cy.wait(500);
        cy.checkA11y('div[data-testid="papercut-paper"]', {
            reportName: 'My Library',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
context('Personalised panel', () => {
    it('location popup can be closed', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);

        // open location selector popup
        cy.get('[data-testid=location]')
            .contains('Set a preferred campus')
            .click();
        cy.get('[data-testid="location-option-0"]')
            .should('exist')
            .should('contain', 'No preference');

        // click away from popup to close
        cy.get('body').type('{esc}');
        cy.get('[data-testid="location-option-0"]').should('not.be.visible');
    });

    function openPapercutPopup() {
        cy.get('[data-testid="personalised-panel"]')
            .should('exist')
            .scrollIntoView();
        cy.get('button[data-testid="pp-papercut-menu-button"]')
            .should('exist')
            .should('be.visible')
            .should('contain', 'Manage your print balance')
            .click();
    }
});

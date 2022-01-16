context('Personalised panel accessibility', () => {
    it('Main Personalised panel', () => {
        cy.visit('/?user=uqresearcher');
        cy.wait(3000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('John');
        cy.get('div[data-testid="personalised-panel"]').contains('Link ORCiD account to eSpace');
        cy.log('Personalised panel as loaded');
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
        cy.get('li[data-testid="pp-papercut-item-button-0"]').contains('Log in and manage your print balance');
        cy.wait(500);
        cy.checkA11y('div[data-testid="papercut-paper"]', {
            reportName: 'My Library',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Personalised panel location menu', () => {
        cy.visit('/?user=vanilla');
        cy.wait(3000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');
        cy.get('button[data-testid="location-button"]').contains('Set a preferred campus');

        cy.log('Location menu');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"]').contains('No preference');
        cy.wait(500);
        cy.checkA11y('div[data-testid="location-paper"]', {
            reportName: 'Location',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
context('Personalised panel', () => {
    it('location button changes location', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);

        // page is initialised as default
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
        cy.get('[data-testid=computers-library-button-0]').contains('Architecture');
        cy.get('[data-testid=hours-item-0]').contains('Arch Music');

        // select a location in the Personalised Panel location selector
        cy.get('[data-testid=location]')
            .contains('Set a preferred campus')
            .click();
        cy.get('[data-testid=location-option-1]')
            .contains('St Lucia')
            .click();

        // a wiggling location button displays in both these panels
        cy.get('[data-testid=computers-wiggler]').should('exist');
        cy.get('[data-testid=hours-wiggler]').should('exist');

        // after a bit the wiggler goes away
        cy.wait(6000);
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
    });

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
        cy.get('body').click();
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

    it('Personalised panel print menu can close', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');

        openPapercutPopup();

        cy.get('[data-testid="pp-papercut-menu"]')
            .should('exist')
            .scrollIntoView();
        cy.get('li[data-testid="pp-papercut-item-button-0"]').contains('Log in and manage your print balance');

        // papercut menu closes
        cy.get('body').click(); // click away
        cy.get('li[data-testid="pp-papercut-item-button-0"]').should('not.exist');
        cy.get('button[data-testid="pp-papercut-menu-button"]').contains('Manage your print balance');
    });

    it('can navigate to papercut manage page', () => {
        // from PersonalisedPanel locale: items.papercut.url
        cy.intercept(/lib-print/, 'user has navigated to papercut page');

        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);

        openPapercutPopup();

        cy.get('li[data-testid="pp-papercut-item-button-0"]')
            .contains('Log in and manage your print balance')
            .click();

        cy.get('body').contains('user has navigated to papercut page');
    });

    it('can navigate to papercut topup page', () => {
        // from PersonalisedPanel locale: items.papercut.url
        cy.intercept(/payments.uq.edu.au/, 'user has navigated to papercut topup page');

        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);

        openPapercutPopup();

        cy.get('li[data-testid="pp-papercut-item-button-1"]')
            .contains('Top up your print balance')
            .click();

        cy.get('body').contains('user has navigated to papercut topup page');
    });
});

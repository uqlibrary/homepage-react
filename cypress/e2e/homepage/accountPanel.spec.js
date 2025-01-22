describe('Account panel', () => {
    context('General', () => {
        it('shows relevant links for account user', () => {
            cy.visit('http://localhost:2020/');
            cy.viewport(1280, 900);

            // once the page has loaded for a UQ user, check if all required links are shown.
            cy.get('[data-testid="catalogue-panel"]')
                .should('exist')
                .contains('Your library account');
            cy.get('[data-testid="catalogue-panel-content"]')
                .should('exist')
                .contains('Loans (1)');
        });
        it('displays no Requests on an error correctly', () => {
            cy.visit('http://localhost:2020/?user=s1111111&responseType=almaError');
            cy.viewport(1280, 900);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="show-requests"]')
                    .should('exist')
                    .contains('Requests'),
            );
            cy.get('[data-testid="show-requests"]').should('not.contain', '(');
            cy.get('[data-testid="show-loans"]').should('not.contain', '(');
            cy.get('[data-testid="show-papercut"]').should('not.contain', '(');
        });
    });
    context('is accessible', () => {
        it('on load', () => {
            cy.visit('/?user=s1111111');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="show-searchhistory"]').should('exist'));
            cy.get('[data-testid="show-searchhistory"]').contains('Search history');
            cy.checkA11y('[data-testid="account-panel"]', {
                reportName: 'Account panel',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('when papercut menu is open', () => {
            cy.visit('/');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="papercut-menu-button"]')
                    .should('exist')
                    .contains('12.50'),
            );
            cy.get('[data-testid="papercut-menu-button"]').click();
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="papercut-item-button-1"]')
                    .should('exist')
                    .contains('Top up'),
            );

            cy.checkA11y('[data-testid="account-panel"]', {
                reportName: 'papercut panel',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('when papercut menu is open to error', () => {
            cy.visit('http://localhost:2020/?responseType=almaError');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="papercut-menu-button"]')
                    .should('exist')
                    .contains('Print balance'),
            );
            cy.get('[data-testid="papercut-menu-button"]').click();
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="papercut-item-button-4"]')
                    .should('exist')
                    .contains('More'),
            );

            cy.checkA11y('[data-testid="account-panel"]', {
                reportName: 'papercut panel',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
    context('Papercut', () => {
        function openPapercutPopup() {
            // center where the menu will be
            cy.get('[data-testid="show-searchhistory"]')
                .should('exist')
                .scrollIntoView();
            cy.wait(100);
            // print balance button is on screen
            cy.get('[data-testid="papercut-menu-button"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Print balance');
            cy.get('[data-testid="papercut-menu-button"]').click();

            cy.get('[data-testid="papercut-menu"]')
                .should('exist')
                .should('be.visible');
        }

        it('Personalised panel print menu can open', () => {
            cy.visit('/?user=s1111111');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="homepage-user-greeting"]').contains('Michael');
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-4"]')
                .should('exist')
                .should('be.visible')
                .contains('More about your printing account');
            cy.get('[data-testid="papercut-item-button-1"]')
                .should('exist')
                .should('be.visible')
                .contains('Top up your print balance - $5');
        });

        it('Personalised panel print menu can close with escape key', () => {
            cy.visit('/?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="homepage-user-greeting"]').contains('UQ');
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-4"]')
                .should('exist')
                .should('be.visible')
                .contains('More about your printing account');

            // papercut menu closes by user tapping the escape key
            cy.get('body').type('{esc}');

            // "More about your printing account" link is no longer available
            cy.get('[data-testid="papercut-item-button-4"]').should('not.exist');
        });

        it('Personalised panel print menu can close with button click', () => {
            cy.visit('/?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="homepage-user-greeting"]').contains('UQ');
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-4"]')
                .should('exist')
                .should('be.visible')
                .contains('More about your printing account');

            // papercut menu closes by user reclicking the open button
            cy.get('[data-testid="papercut-menu-button"]').click();

            // "More about your printing account" link is no longer available
            cy.get('[data-testid="papercut-item-button-4"]').should('not.exist');
        });

        it('Personalised panel print menu can close with a click away', () => {
            cy.visit('/?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="homepage-user-greeting"]').contains('UQ');
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-4"]')
                .should('exist')
                .should('be.visible')
                .contains('More about your printing account');

            // papercut menu closes by user clicking somewhere else in the window
            cy.get('[data-testid="homepage-user-greeting"]').click();

            // "More about your printing account" link is no longer available
            cy.get('[data-testid="papercut-item-button-4"]').should('not.exist');
        });

        it('can navigate to papercut manage page', () => {
            cy.intercept(/your-printing-account/, 'papercut info page');

            cy.visit('/?user=emcommunity');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="homepage-user-greeting"]').contains('Community');
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('li[data-testid="papercut-item-button-4"]')
                .contains('More about your printing account')
                .click();

            cy.get('body').contains('papercut info page');
        });

        it('can navigate to papercut topup page', () => {
            cy.intercept(/payments.uq.edu.au/, 'papercut topup page');

            cy.visit('/?user=s1111111');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="papercut-print-balance"]').contains('12.50'));

            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-1"]')
                .contains('Top up your print balance')
                .click();

            cy.get('body').contains('papercut topup page');
        });

        it('top up items dont appear on error', () => {
            // if we don't get a print balance entry, we lack the details to send them through
            cy.visit('http://localhost:2020/?user=s1111111&responseType=almaError');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="show-requests"]')
                    .should('exist')
                    .contains('Requests'),
            );
            openPapercutPopup();

            cy.get('[data-testid="papercut-item-button-4"]')
                .should('exist')
                .should('be.visible')
                .contains('More about your printing account');
            cy.get('[data-testid="papercut-item-button-1"]').should('not.exist');
        });
        it.skip('MANUALLY CHECK THAT TABBING WORKS!!!!', () => {
            // there is custom tab handling on the papercut menu, but Cypress cant test that :(
            // working:
            // load http://localhost:2020/?user=vanilla
            // tab to Print balance field
            // tab again - focus is on "See all training"
            // back tab - back on Print balance
            // click return - menu opens, focus is on first item
            // tab through each item, land on next item in menu
            // tab out of final menu item, menu closes, focus is on "See all training"
            // back tab, focus is on Print balance
            // click enter to load menu
            // tab to final entry on menu
            // back tab through each menu item
            // back tab out of first menu item, menu closes, focus is on Print balance
            // -- also check when fines and charges available
            // load http://localhost:2020/?user=s1111111
            // tab to Print balance field
            // tab again - focus is on "Fines and charges"
            // back tab - back on Prin galance
            // click return - menu opens, focus is on first item
            // tab through each item, land on next item in menu
            // tab out of final menu item, menu closes, focus is on "Fines and charges"
            // back tab, focus is on Print balance
            // click enter to load menu
            // tab to final entry on menu
            // back tab through each menu item
            // back tab out of first menu item, menu closes, focus is on Print balance        })
        });
    });
});

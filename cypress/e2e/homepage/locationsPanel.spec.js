const ESCAPE_KEYCODE = 27;

context('Locations Panel', () => {
    it('behaves as expected', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);

        cy.log('Hours');
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        // the expected content is found on the page
        cy.get('[data-testid="hours-item-arch-music"]')
            .should('be.visible')
            .contains('Architecture and Music');
    });
    it.skip('is Accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);

        cy.log('Hours');
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        // dialog has loaded corrrectly
        cy.get('[data-testid="hours-item-arch-music"]')
            .should('be.visible')
            .contains('Architecture and Music');

        cy.checkA11y('div[data-testid="locations-panel"]', {
            reportName: 'Hours',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('can navigate to weekly hours page from the library name cell', () => {
        cy.intercept('GET', 'https://web.library.uq.edu.au/locations-hours/architecture-music-library', {
            statusCode: 200,
            body: 'user has navigated to Drupal hours page',
        });
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));

        cy.get('[data-testid="hours-accordion-open"]').click();
        // cy.get('[data-testid="hours-item-arch-music-link"]')
        //     // .find('a')
        //     .should('contain', 'Architecture and Music');
        cy.get('a[data-testid="hours-item-arch-music-link"]')
            .should('contain', 'Architecture and Music')
            .click();
        cy.get('body').contains('user has navigated to Drupal hours page');
    });
    it('can navigate to book a room page', () => {
        cy.intercept(/uqbookit/, 'user has navigated to Bookit page');
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="homepage-hours-bookit-link"]')
            .should('contain', 'Book a room')
            .click();
        cy.get('body').contains('user has navigated to Bookit page');
    });
    it('shows the expected values in hours', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        cy.get('[data-testid="hours-item-arch-music"] > div:first-child').contains('Architecture and Music');
        cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(2)').contains('7:30am - 7:30pm');
        cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(3) span')
            .should('exist')
            .should('have.attr', 'aria-valuenow', '85');
        cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(4)').contains('Very busy');

        cy.get('[data-testid="hours-item-biol-sci"] > div:first-child').contains('Biological Sciences');
        cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(3) span')
            .should('exist')
            .should('have.attr', 'aria-valuenow', '48');
        cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(4)').contains('Moderate');

        cy.get('[data-testid="hours-item-central"] > div:first-child').contains('Central');
        cy.get('[data-testid="hours-item-central"] > div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-central"] > div:nth-child(3) span')
            .should('exist')
            .should('have.attr', 'aria-valuenow', '5');
        cy.get('[data-testid="hours-item-central"] > div:nth-child(4)').contains('Not busy');

        cy.get('[data-testid="hours-item-duhig-study"] > div:first-child').contains('Duhig Tower');
        cy.get('[data-testid="hours-item-duhig-study"] > div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-duhig-study"] > div:nth-child(3) span')
            .should('exist')
            .should('have.attr', 'aria-valuenow', '54');
        cy.get('[data-testid="hours-item-duhig-study"] > div:nth-child(4)').contains('Busy');

        cy.get('[data-testid="hours-item-dutton-park"] > div:first-child').contains('Dutton Park Health Sciences');
        cy.get('[data-testid="hours-item-dutton-park"] > div:nth-child(2)').contains('7am - 10:30am');
        cy.get('[data-testid="hours-item-dutton-park"] > div:nth-child(3) div.occupancyTextClosed')
            .should('exist')
            .contains('Closed');
        cy.get('[data-testid="hours-item-dutton-park"] > div:nth-child(4) span').should('be.empty');

        cy.get('[data-testid="hours-item-gatton-library"] > div:first-child').contains('JK Murray (UQ Gatton)');
        cy.get('[data-testid="hours-item-gatton-library"] > div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-gatton-library"] > div:nth-child(3) div.occupancyText')
            .should('exist')
            .contains('Data not available');
        cy.get('[data-testid="hours-item-gatton-library"] > div:nth-child(4) span').should('be.empty');

        cy.get('[data-testid="hours-item-law"] > div:first-child').contains('Walter Harrison Law');
        cy.get('[data-testid="hours-item-law"] > div:nth-child(2)').contains('See location');
        cy.get('[data-testid="hours-item-law"] > div:nth-child(3) div.occupancyText')
            .should('exist')
            .contains('Data not available');
        cy.get('[data-testid="hours-item-law"] > div:nth-child(4) span').should('be.empty');

        cy.get('[data-testid="hours-item-fryer"] > div:first-child')
            .should('exist')
            .contains('Fryer');
        cy.get('[data-testid="hours-item-fryer"] > div:nth-child(2)').contains('By Appointment');
        cy.get('[data-testid="hours-item-fryer"] > div:nth-child(3) div.occupancyText')
            .should('exist')
            .contains('By appointment only');
        cy.get('[data-testid="hours-item-fryer"] > div:nth-child(3)').should('exist');
        cy.get('[data-testid="hours-item-fryer"] > div:nth-child(4) span').should('be.empty');

        // cy.log('Whitty has a missing department field (should never happen) so we see "See location"');
        // cy.get('[data-testid="hours-item-whitty-mater"] div:first-child')
        //     .should('exist')
        //     .contains('Whitty building, Mater');
        // cy.get('[data-testid="hours-item-whitty-mater"] div:nth-child(2)').contains('See location');
    });
    it('can click away to close the dialog', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();
        // dialog is open
        cy.get('[data-testid="homepage-hours-weeklyhours-link"]')
            .should('exist')
            .contains('See weekly');

        // click elsewhere on the screen
        cy.get('h1')
            .should('exist')
            .scrollIntoView()
            .contains('Library')
            .click();
        // dialog is closed
        cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
    });
    it('escape key can close the dialog', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();
        // dialog is open
        cy.waitUntil(() =>
            cy
                .get('[data-testid="homepage-hours-weeklyhours-link"]')
                .should('exist')
                .should('be.visible')
                .contains('See weekly'),
        );

        // click escape key
        cy.get('body')
            .focus()
            .trigger('keydown', { keyCode: ESCAPE_KEYCODE });
        // dialog is closed
        cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
    });
    // whitty is manually removed - test this is actually happening!
    it('data is removed correctly', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();
        // dialog is open
        cy.waitUntil(() =>
            cy
                .get('[data-testid="homepage-hours-weeklyhours-link"]')
                .should('exist')
                .should('be.visible')
                .contains('See weekly'),
        );

        cy.get('[data-testid="hours-item-whitty-mater"]').should('not.exist');
    });
});

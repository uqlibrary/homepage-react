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
    context('can navigate to weekly hours page', () => {
        // the user can click from anywhere on each row
        beforeEach(() => {
            cy.intercept('GET', 'https://web.library.uq.edu.au/locations-hours/architecture-music-library', {
                statusCode: 200,
                body: 'user has navigated to Drupal hours page',
            });
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));

            cy.get('[data-testid="hours-accordion-open"]').click();
            cy.get('[data-testid="hours-item-arch-music"]')
                .find('a')
                .should('contain', 'Architecture and Music');
        });
        it('from the library name cell', () => {
            cy.get('a[data-testid="hours-item-name-0"]')
                .should('contain', 'Architecture and Music')
                .click();
            cy.get('body').contains('user has navigated to Drupal hours page');
        });
        it('from the library open hours cell', () => {
            cy.get('a[data-testid="hours-item-hours-0"]')
                .should('contain', '7:30am - 7:30pm')
                .click();
            cy.get('body').contains('user has navigated to Drupal hours page');
        });
        it('from the busy level cell', () => {
            cy.get('a[data-testid="hours-item-busy-0"]').click();
            cy.get('body').contains('user has navigated to Drupal hours page');
        });
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

        cy.get('[data-testid="hours-item-arch-music"] td:first-child').contains('Architecture and Music');
        cy.get('[data-testid="hours-item-arch-music"] td:nth-child(2)').contains('7:30am - 7:30pm');
        cy.get('[data-testid="hours-item-arch-music"] td:nth-child(3) div.occupancyPercent85')
            .should('exist')
            .should('have.attr', 'title', 'Very busy');

        cy.get('[data-testid="hours-item-central"] td:first-child').contains('Central');
        cy.get('[data-testid="hours-item-central"] td:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-central"] td:nth-child(3) div.occupancyPercent7')
            .should('exist')
            .should('have.attr', 'title', 'Not busy');

        cy.get('[data-testid="hours-item-biol-sci"] td:first-child').contains('Biological Sciences');
        cy.get('[data-testid="hours-item-biol-sci"] td:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-biol-sci"] td:nth-child(3) div.occupancyPercent48')
            .should('exist')
            .should('have.attr', 'title', 'Moderately busy');

        cy.get('[data-testid="hours-item-duhig-study"] td:first-child').contains('Duhig Tower');
        cy.get('[data-testid="hours-item-duhig-study"] td:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-duhig-study"] td:nth-child(3) div.occupancyPercent54')
            .should('exist')
            .should('have.attr', 'title', 'Busy');

        cy.get('[data-testid="hours-item-dutton-park"] td:first-child').contains('Dutton Park Health Sciences');
        cy.get('[data-testid="hours-item-dutton-park"] td:nth-child(2)').contains('7am - 10:30am');
        cy.get('[data-testid="hours-item-dutton-park"] td:nth-child(3) div.occupancyTextClosed')
            .should('exist')
            .contains('Closed');

        cy.get('[data-testid="hours-item-gatton-library"] td:first-child').contains('JK Murray (UQ Gatton)');
        cy.get('[data-testid="hours-item-gatton-library"] td:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-gatton-library"] td:nth-child(3) div.occupancyText')
            .should('exist')
            .contains('No information');

        cy.get('[data-testid="hours-item-law"] td:first-child').contains('Walter Harrison Law');
        cy.get('[data-testid="hours-item-law"] td:nth-child(2)').contains('See location');
        cy.get('[data-testid="hours-item-law"] td:nth-child(3) div.occupancyText')
            .should('exist')
            .contains('No information');

        cy.get('[data-testid="hours-item-fryer"] td:first-child')
            .should('exist')
            .contains('Fryer');
        cy.get('[data-testid="hours-item-fryer"] td:nth-child(2)').contains('By Appointment');
        cy.get('[data-testid="hours-item-fryer"] td:nth-child(3) div.occupancyText').should('not.exist');
        cy.get('[data-testid="hours-item-fryer"] td:nth-child(3) a').should('exist');

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

context('Library Opening Hours Homepage Panel', () => {
    it('is Accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);

        cy.log('Hours');
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        // the expected content is found on the page
        cy.get('[data-testid="hours-item-0"]').contains('Arch Music');

        cy.checkA11y('div[data-testid="library-hours-panel"]', {
            reportName: 'Hours',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('can navigate to specific library hours page', () => {
        cy.intercept('GET', 'https://web.library.uq.edu.au/locations-hours/architecture-music-library', {
            statusCode: 200,
            body: 'user has navigated to Drupal hours page',
        });
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        cy.get('[data-testid="hours-item-0"]')
            .find('a')
            .should('contain', 'Arch Music')
            .click();
        cy.get('body').contains('user has navigated to Drupal hours page');
    });
    it('can navigate to weekly hours page', () => {
        cy.intercept('GET', 'https://web.library.uq.edu.au/locations-hours/opening-hours', {
            statusCode: 200,
            body: 'user has navigated to Drupal weekly hours page',
        });
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        cy.get('[data-testid="homepage-hours-weeklyhours-link"]')
            .should('contain', 'Weekly hours')
            .click();
        cy.get('body').contains('user has navigated to Drupal weekly hours page');
    });
    it('can navigate to book a room page', () => {
        cy.intercept(/uqbookit/, 'user has navigated to Bookit page');
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

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

        cy.log('Architecture has study space hours but not askus hours');
        cy.get('[data-testid="hours-item-0"] div:first-child').contains('Arch Music');
        cy.get('[data-testid="hours-item-0"] div:nth-child(2)').contains('7:30am - 7:30pm');
        cy.get('[data-testid="hours-item-0"] div:nth-child(3)').should('not.exist');

        cy.log('Central has study space AND askus hours');
        cy.get('[data-testid="hours-item-3"] div:first-child').contains('Central');
        cy.get('[data-testid="hours-item-3"] div:nth-child(2)').contains('24 Hours');
        cy.get('[data-testid="hours-item-3"] div:nth-child(3)').contains('8am - 6pm');

        cy.log('Hervey Bay has an empty departments field, so we see "See Location');
        cy.get('[data-testid="hours-item-10"] div:first-child')
            .scrollIntoView()
            .contains('HerveyBay');
        cy.get('[data-testid="hours-item-10"] div:nth-child(2)').contains('See location');

        cy.log('Rockhampton has a missing department field (should never happen) so we see "See location"');
        cy.get('[data-testid="hours-item-12"] div:first-child')
            .scrollIntoView()
            .contains('Rockhampton');
        cy.get('[data-testid="hours-item-12"] div:nth-child(2)').contains('See location');
    });
});

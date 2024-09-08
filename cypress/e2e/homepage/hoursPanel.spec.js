context('Library Opening Locations Homepage Panel', () => {
    it('is Accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);

        cy.log('Hours');
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        // the expected content is found on the page
        cy.get('[data-testid="hours-item-arch-music"]').contains('Architecture & Music Library');

        cy.checkA11y('div[data-testid="locations-panel"]', {
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

        cy.get('[data-testid="hours-item-arch-music"]')
            .find('a')
            .should('contain', 'Architecture & Music Library')
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
            .should('contain', 'See weekly Library and AskUs hours')
            .click();
        cy.get('body').contains('user has navigated to Drupal weekly hours page');
    });
    it('can navigate to book a room page', () => {
        cy.intercept(/uqbookit/, 'user has navigated to Bookit page');
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="homepage-hours-bookit-link"]')
            .should('contain', 'Make a booking')
            .click();
        cy.get('body').contains('user has navigated to Bookit page');
    });
    it('shows the expected values in hours', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        cy.log('Architecture has study space hours but not askus hours');
        cy.get('[data-testid="hours-item-arch-music"] div:first-child').contains('Architecture & Music Library');
        cy.get('[data-testid="hours-item-arch-music"] div:nth-child(2)').contains('7:30am - 7:30pm');

        cy.log('Central has study space AND askus hours');
        cy.get('[data-testid="hours-item-central"] div:first-child').contains('Central Library');
        cy.get('[data-testid="hours-item-central"] div:nth-child(2)').contains('24 Hours');

        cy.log('Fryer has no departments we show times from, so we see "See Location');
        cy.get('[data-testid="hours-item-fryer"] div:first-child')
            .should('exist')
            .contains('FW Robinson Reading Room');
        cy.get('[data-testid="hours-item-fryer"] div:nth-child(2)').contains('See location');

        cy.log('Whitty has a missing department field (should never happen) so we see "See location"');
        cy.get('[data-testid="hours-item-whitty-mater"] div:first-child')
            .should('exist')
            .contains('Whitty building, Mater');
        cy.get('[data-testid="hours-item-whitty-mater"] div:nth-child(2)').contains('See location');
    });
});

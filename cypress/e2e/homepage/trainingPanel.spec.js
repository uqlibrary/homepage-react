context('Training', () => {
    it('content is correct', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);

        cy.waitUntil(() =>
            cy
                .get('[data-testid="standard-card-training-header"]')
                .should('exist')
                .contains('Training'),
        );

        cy.get('[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .contains('EndNote: getting started');
        cy.get('[data-testid="training-event-detail-button-1"]')
            .should('exist')
            .contains('UQRDM for researchers');
        cy.get('[data-testid="training-event-detail-button-2"]')
            .should('exist')
            .contains('SciFinder n');
    });

    it('list is Accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('div[data-testid="training-panel"]').should('exist'));
        cy.get('[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .scrollIntoView()
            .contains('EndNote: getting started');
        cy.checkA11y('[data-testid="training-panel"]', {
            reportName: 'Training',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('h3 h3').should('not.exist'); // we managed to nest the heading at one point
    });

    it.skip('detail panel is accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('div[data-testid="training-panel"]').should('exist'));

        cy.get('[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .scrollIntoView()
            .contains('EndNote: getting started');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.waitUntil(() =>
            cy
                .get('[data-testid="training-events-detail-2824657"]')
                .should('exist')
                .should('be.visible')
                .contains('Places still available'),
        );
        cy.checkA11y('[data-testid="training-panel"]', {
            reportName: 'Training',
            scopeName: 'Event detail',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('detail pane shows the number of places correctly', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);

        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.waitUntil(() =>
            cy
                .get('[data-testid="event-detail-open-summary"]')
                .should('exist')
                .contains('Learn how to use EndNote referencing software'),
        );
        // when placesRemaining > 0 we see 'places available'
        cy.get('div[data-testid="training-events-detail-2824657"]').contains('Places still available');
        cy.get('[data-testid="training-event-detail-training-login-button"]').contains('Log in and book now');
        cy.get('button[data-testid="training-event-detail-close-button"]').click(); // close it

        cy.waitUntil(() =>
            cy.get('button[data-testid="training-event-detail-button-1"]').contains('UQRDM for researchers'),
        );
        cy.get('button[data-testid="training-event-detail-button-1"]').click(); // open it

        cy.waitUntil(() =>
            cy
                .get('[data-testid="event-detail-open-summary"]')
                .should('exist')
                .contains(
                    'A short hands-on course that introduces some intermediate level tools and skills with Adobe Illustrator.',
                ),
        );
        cy.get('div[data-testid="training-events-detail-2870806"]').contains('Event is fully booked');
        cy.get('[data-testid="training-event-detail-training-login-button"]').contains('Log in to join wait list');
        cy.get('button[data-testid="training-event-detail-close-button"]').click(); // close it

        cy.waitUntil(() => cy.get('button[data-testid="training-event-detail-button-2"]').contains('SciFinder n'));
        cy.get('button[data-testid="training-event-detail-button-2"]').click(); // open it

        cy.waitUntil(() =>
            cy
                .get('[data-testid="event-detail-open-summary"]')
                .should('exist')
                .contains('This is a hands on session'),
        );
        cy.get('div[data-testid="training-events-detail-2873532"]').contains('Booking is not required');
        cy.get('[data-testid="training-event-detail-training-login-button"]').contains('Log in for more details');
    });

    it('can close a detail pane from a click', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        // we brng the detail pane over these fields to make the pane bigger,
        // but we have to manually display: hidden them or we get an accessibility issue
        cy.get('button[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .scrollIntoView();

        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.wait(500);
        // cy.get('#seeAllTrainingLink').should('not.be.visible');
        cy.get('[data-testid="training-events-detail-2824657"]')
            .should('exist')
            .contains('EndNote: getting started');

        cy.get('[data-testid="training-event-detail-close-button"]')
            .should('exist')
            .click();

        cy.get('[data-testid="training-events-detail-2824657"]').should('not.exist');
    });
    it('can navigate to event page', () => {
        cy.intercept(/studenthub/, 'user has navigated to Studenthub page');

        cy.visit('/');
        cy.viewport(1300, 1000);

        cy.get('button[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .scrollIntoView();
        cy.get('button[data-testid="training-event-detail-button-0"]').contains('EndNote: getting started');
        cy.get('button[data-testid="training-event-detail-button-0"]').click();
        cy.wait(500);

        cy.get('[data-testid="training-events-detail-2824657"]')
            .should('exist')
            .contains('EndNote: getting started');
        cy.get('[data-testid="training-event-detail-training-login-button"]')
            .should('exist')
            .click();

        cy.get('body').contains('user has navigated to Studenthub page');
    });

    it('when there is no training it shows a friendly message', () => {
        cy.visit('/?user=s1111111&responseType=empty');
        cy.waitUntil(() =>
            cy
                .get('[data-testid="standard-card-training-header"]')
                .should('exist')
                .contains('Training'),
        );

        cy.get('[data-testid="training-api-error"]')
            .should('exist')
            .contains('There are no training sessions available at the moment.');
    });

    it('when the api 404s, it shows a friendly message', () => {
        cy.visit('/?user=s1111111&responseType=404');
        cy.viewport(1300, 1000);

        cy.waitUntil(() =>
            cy
                .get('[data-testid="standard-card-training-header"]')
                .should('exist')
                .contains('Training'),
        );

        cy.get('[data-testid="training-api-error"]')
            .should('exist')
            .contains('We can’t load training events right now');
    });

    it('shows an api error correctly', () => {
        cy.visit('/?user=s1111111&responseType=error');
        cy.viewport(1300, 1000);

        cy.waitUntil(() =>
            cy
                .get('[data-testid="standard-card-training-header"]')
                .should('exist')
                .contains('Training'),
        );

        cy.get('[data-testid="training-api-error"]')
            .should('exist')
            .contains('We can’t load training events right now');
    });
});

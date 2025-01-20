const ESCAPE_KEYCODE = 27;

const openCloseWorks = () => {
    describe('tests', () => {
        it('can click away to close the dialog', () => {
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            cy.get('[data-testid="hours-accordion-open"]').click();
            // dialog is open
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]')
                .should('exist')
                .contains('See all Library and AskUs hours');

            // click elsewhere on the screen
            cy.get('h1')
                .should('exist')
                .scrollIntoView()
                .contains('Library')
                .click();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
        it('clicking the button can open and close the dialog', () => {
            function clickButton() {
                cy.get('[data-testid="hours-accordion-open"]')
                    .should('be.visible')
                    .click();
            }
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            // open dialog
            clickButton();

            // confirm dialog is open
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="hours-item-askus"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('AskUs chat hours'),
            );

            // re-click button
            clickButton();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');

            // re-click button
            clickButton();
            // dialog is open
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('be.visible');

            // re-click button
            clickButton();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
        it('clicking the button label can open and close the dialog', () => {
            function clickLabel() {
                cy.get('[data-testid="hours-accordion-open"]')
                    .should('be.visible')
                    .then($button => {
                        // the ;label is in the middle of the  button
                        cy.wrap($button).click($button.width() / 2, $button.height() / 2);
                    });
            }
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            // open dialog
            clickLabel();

            // confirm dialog is open
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="hours-item-askus"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('AskUs chat hours'),
            );

            // re-click button
            clickLabel();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');

            // re-click button
            clickLabel();
            // dialog is open
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('be.visible');

            // re-click button
            clickLabel();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
        it('clicking the button up-down arrow can open and close the dialog', () => {
            function clickChevron() {
                cy.get('[data-testid="hours-accordion-open"]')
                    .should('be.visible')
                    .then($button => {
                        // the chevron is at the right of the button
                        const paddingRight = parseFloat($button.css('padding-right'));
                        cy.wrap($button).click(paddingRight / 2, $button.height() / 2);
                    });
            }
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            // open dialog
            clickChevron();

            // confirm dialog is open
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="hours-item-askus"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('AskUs chat hours'),
            );

            // re-click button
            clickChevron();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');

            // re-click button
            clickChevron();
            // dialog is open
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('be.visible');

            // re-click button
            clickChevron();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
        it('clicking the button map icon can open and close the dialog', () => {
            function clickIcon() {
                cy.get('[data-testid="hours-accordion-open"]')
                    .should('be.visible')
                    .then($button => {
                        // the map icon is at the left of the button
                        const paddingLeft = parseFloat($button.css('padding-left'));
                        cy.wrap($button).click(paddingLeft / 2, $button.height() / 2);
                    });
            }
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            // open dialog
            clickIcon();
            // confirm dialog is open
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="hours-item-askus"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('AskUs chat hours'),
            );

            // re-click button
            clickIcon();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');

            // re-click button
            clickIcon();
            // dialog is open
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('be.visible');

            // re-click button
            clickIcon();
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
        it('escape key can close the dialog', () => {
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            // open dialog
            cy.get('[data-testid="hours-accordion-open"]').click();
            // confirm dialog is open
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="homepage-hours-weeklyhours-link"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('all Library and AskUs hours'),
            );

            // click escape key to close dialog
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]')
                .focus()
                .trigger('keydown', { keyCode: ESCAPE_KEYCODE });
            // dialog is closed
            cy.get('[data-testid="homepage-hours-weeklyhours-link"]').should('not.be.visible');
        });
    });
};

describe('Locations Panel', () => {
    it('loads as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);

        cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
        cy.get('[data-testid="hours-accordion-open"]').click();

        // the expected content is found on the page
        cy.get('[data-testid="hours-item-arch-music"]')
            .should('be.visible')
            .contains('Architecture and Music');

        // at desktop hours are displayed
        cy.get('[data-testid="location-item-arch-music-hours"]')
            .should('exist')
            .should('be.visible')
            .contains('7:30am - 7:30pm');
        cy.get('[data-testid="locations-hours-disclaimer"]')
            .should('exist')
            .contains('Student and staff hours');
        cy.get('[data-testid="hours-item-askus-link"]')
            .should('exist')
            .contains('AskUs chat hours');

        // there is a gap above the askus link
        cy.get('[data-testid="locations-panel-content"]').within(() => {
            let gattonBottom;
            cy.get('[data-testid="hours-item-gatton"] a')
                .should('be.visible')
                .then($gattonLink => {
                    gattonBottom = $gattonLink.position().top + $gattonLink.outerHeight();
                });

            let lawTop;
            let lawBottom;
            cy.get('[data-testid="hours-item-law"] a')
                .should('be.visible')
                .then($lawLink => {
                    lawTop = $lawLink.position().top;
                    lawBottom = $lawLink.position().top + $lawLink.outerHeight();
                });

            let askusTop;
            cy.get('[data-testid="hours-item-askus"] a')
                .should('be.visible')
                .then($askusLink => {
                    askusTop = $askusLink.position().top;

                    // law is below gatton and askus is below law
                    expect(lawTop).to.be.greaterThan(gattonBottom);
                    expect(askusTop).to.be.greaterThan(lawBottom);
                    // the gap between gatton and law is smaller than the gap between askus and law
                    const spaceBetweenGattonAndLaw = lawTop - gattonBottom;
                    const spaceBetweenLawAndAskus = askusTop - lawBottom;
                    expect(spaceBetweenLawAndAskus).to.be.greaterThan(spaceBetweenGattonAndLaw * 1.5);
                });
        });
    });
    context('Accessibility', () => {
        it('200 is Accessible', () => {
            cy.visit('/');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            cy.get('[data-testid="hours-accordion-open"]').click();

            // dialog has loaded corrrectly
            cy.get('a[data-testid="hours-item-arch-music-link"]')
                .should('be.visible')
                .contains('Architecture and Music');

            cy.checkA11y('div[data-testid="locations-panel"]', {
                reportName: 'Hours',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('error is Accessible', () => {
            cy.visit('/?responseType=error');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            cy.get('[data-testid="hours-accordion-open"]').click();

            // dialog has loaded corrrectly
            cy.get('[data-testid="locations-error"]')
                .should('be.visible')
                .contains(
                    "We can't load opening hours or how busy Library spaces are right now. Please refresh your browser or try again later.",
                );

            cy.checkA11y('div[data-testid="locations-panel"]', {
                reportName: 'Hours',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
    context('loading 200', () => {
        it('at tablet size the hours column is not displayed', () => {
            cy.visit('/');
            cy.viewport(414, 736);

            cy.get('[data-testid="location-item-arch-music-hours"]').should('not.exist');
            cy.get('[data-testid="locations-hours-disclaimer"]').should('not.exist');
            cy.get('[data-testid="hours-item-askus-link"]').should('not.exist');
        });
        it('can navigate to weekly hours page from the library name cell', () => {
            cy.intercept('GET', 'https://web.library.uq.edu.au/visit/architecture-and-music-library', {
                statusCode: 200,
                body: 'user has navigated to Drupal hours page',
            });
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));

            cy.get('[data-testid="hours-accordion-open"]').click();

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
        it('shows the expected values', () => {
            cy.visit('/');
            cy.viewport(1300, 1000);

            // the dialog is closed initially
            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            cy.get('[data-testid="hours-accordion-open"]').should('have.attr', 'aria-expanded', 'false');
            cy.get('[data-testid="locations-wrapper"]').should('exist');
            cy.get('[data-testid="locations-wrapper"]').should('have.attr', 'aria-live', 'off');
            cy.get('[data-testid="locations-wrapper"]').should('have.attr', 'inert', 'true');

            // open the dialog
            cy.get('[data-testid="hours-accordion-open"]').click();

            // the dialog is open
            cy.get('[data-testid="hours-accordion-open"]').should('have.attr', 'aria-expanded', 'true');
            cy.get('[data-testid="locations-wrapper"]').should('exist');
            cy.get('[data-testid="locations-wrapper"]').should('have.attr', 'aria-live', 'assertive');
            cy.get('[data-testid="locations-wrapper"]').should('not.have.attr', 'inert');

            // content displayed correctly
            cy.get('[data-testid="hours-item-arch-music"] > div:first-child').contains('Architecture and Music');
            cy.get('[data-testid="hours-item-arch-music"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The Architecture and Music Library study space is open 7:30am to 7:30pm. This space is currently very busy.',
            );
            cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(2)').contains('7:30am - 7:30pm');
            cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-valuenow', '85');
            cy.get('[data-testid="hours-item-arch-music"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-label', 'Very busy');

            cy.get('[data-testid="hours-item-biol-sci"] > div:first-child').contains('Biological Sciences');
            cy.get('[data-testid="hours-item-biol-sci"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The Biological Sciences Library study space is open 24 hours. This space is currently moderately busy.',
            );
            cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(2)').contains('24 Hours');
            cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-valuenow', '48');
            cy.get('[data-testid="hours-item-biol-sci"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-label', 'Moderately busy');

            cy.get('[data-testid="hours-item-central"] > div:first-child').contains('Central');
            cy.get('[data-testid="hours-item-central"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The Central Library study space is open 24 hours. This space is currently not busy.',
            );

            cy.get('[data-testid="hours-item-central"] > div:nth-child(2)').contains('24 Hours');
            cy.get('[data-testid="hours-item-central"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-valuenow', '5');
            cy.get('[data-testid="hours-item-central"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-label', 'Not busy');

            cy.get('[data-testid="hours-item-duhig-study"] > div:first-child').contains('Duhig Tower');
            cy.get('[data-testid="hours-item-duhig-study"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The Duhig Tower Library study space is open 24 hours.',
            );
            cy.get('[data-testid="hours-item-duhig-study"] > div:nth-child(2)').contains('24 Hours');
            cy.get('[data-testid="hours-item-duhig-study"] > div:nth-child(3) div.occupancyText')
                .should('exist')
                .contains('Data not available');

            cy.get('[data-testid="hours-item-dutton-park"] > div:first-child').contains('Dutton Park Health Sciences');
            cy.get('[data-testid="hours-item-dutton-park"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The Dutton Park Health Sciences Library study space is open 7am to 10:30am.',
            );
            cy.get('[data-testid="hours-item-dutton-park"] > div:nth-child(2)').contains('7am - 10:30am');
            cy.get('[data-testid="hours-item-dutton-park"] > div:nth-child(3) div.occupancyText')
                .should('exist')
                .contains('Closed');

            cy.get('[data-testid="hours-item-gatton"] > div:first-child').contains('JK Murray (UQ Gatton)');
            cy.get('[data-testid="hours-item-gatton"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'The JK Murray Library study space is open 24 hours.',
            );
            cy.get('[data-testid="hours-item-gatton"] > div:nth-child(2)').contains('24 Hours');
            cy.get('[data-testid="hours-item-gatton"] > div:nth-child(3) div.occupancyText')
                .should('exist')
                .contains('Data not available');

            cy.get('[data-testid="hours-item-law"] > div:first-child').contains('Walter Harrison Law');
            cy.get('[data-testid="hours-item-law"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'Click through to the location page for the Walter Harrison Law Library hours and busy level.',
            );
            cy.get('[data-testid="hours-item-law"] > div:nth-child(2)').contains('See location');
            cy.get('[data-testid="hours-item-law"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-valuenow', '51');
            cy.get('[data-testid="hours-item-law"] > div:nth-child(3) span')
                .should('exist')
                .should('have.attr', 'aria-label', 'Quite busy');

            cy.get('[data-testid="hours-item-fryer"] > div:first-child')
                .should('exist')
                .contains('Fryer');
            cy.get('[data-testid="hours-item-fryer"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'Fryer Library study space is open by appointment.',
            );
            cy.get('[data-testid="hours-item-fryer"] > div:nth-child(2)').contains('By appointment');
            cy.get('[data-testid="hours-item-fryer"] > div:nth-child(3) div.occupancyText')
                .should('exist')
                .contains('By appointment');
            cy.get('[data-testid="hours-item-fryer"] > div:nth-child(3)').should('exist');

            cy.get('[data-testid="hours-item-askus"] > div:first-child').contains('AskUs chat hours');
            cy.get('[data-testid="hours-item-askus"] > div:first-child a').should(
                'have.attr',
                'aria-label',
                'AskUs chat assistance operating hours today is open 8am to 8pm.',
            );
            cy.get('[data-testid="hours-item-askus"] > div:nth-child(2)').contains('8am - 8pm');
            cy.get('[data-testid="hours-item-askus"] > div:nth-child(3) div.occupancyWrapper').should('be.empty');

            // cy.log('Whitty has a missing department field (should never happen) so we see "See location"');
            // cy.get('[data-testid="hours-item-whitty-mater"] div:first-child')
            //     .should('exist')
            //     .contains('Whitty building, Mater');
            // cy.get('[data-testid="hours-item-whitty-mater"] div:nth-child(2)').contains('See location');

            // close the dialog
            cy.get('[data-testid="hours-accordion-open"]').click();
            // everything now shows the dialog is closed
            cy.get('[data-testid="hours-accordion-open"]').should('have.attr', 'aria-expanded', 'false');
            cy.get('[data-testid="locations-wrapper"]').should('exist');
            cy.get('[data-testid="locations-wrapper"]').should('have.attr', 'aria-live', 'off');
            cy.get('[data-testid="locations-wrapper"]').should('have.attr', 'inert', 'true');
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
                    .contains('See all Library and AskUs hours'),
            );

            cy.get('[data-testid="hours-item-whitty-mater"]').should('not.exist');
        });

        context('all close methods work', () => {
            beforeEach(() => {
                cy.visit('/');
                cy.viewport(1300, 1000);
            });

            openCloseWorks();
        });
    });
    context('handles an error as expected', () => {
        it('loads correctly', () => {
            cy.visit('/?responseType=error');
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="hours-accordion-open"]').should('exist'));
            cy.get('[data-testid="hours-accordion-open"]').click();

            // the expected content is found on the page
            cy.get('[data-testid="locations-error"]')
                .should('be.visible')
                .contains(
                    "We can't load opening hours or how busy Library spaces are right now. Please refresh your browser or try again later.",
                );
        });

        context('all close methods work', () => {
            beforeEach(() => {
                cy.visit('/?responseType=error');
                cy.viewport(1300, 1000);
            });
            openCloseWorks();
        });
    });
});

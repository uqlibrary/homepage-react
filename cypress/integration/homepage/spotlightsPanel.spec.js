import { spotlights as spotlightsHomepage } from '../../../src/mock/data/spotlights';

context('Spotlights on homepage', () => {
    it('Spotlights is accessible', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Spootlights');
        cy.wait(500);
        cy.get('img[alt="Academic Integrity Modules - Everything you need to know about academic integrity at UQ"]')
            .should('be.visible')
            .and($img => {
                expect($img[0].naturalWidth).to.be.greaterThan(0);
            });
        cy.checkA11y('div[data-testid="spotlights"]', {
            reportName: 'Spotlights',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    function slideWithFocusIs(slideId, expectedPanel) {
        const numSlides = spotlightsHomepage.length;

        for (let ii = 0; ii < numSlides; ii++) {
            const isSelected = ii === slideId;
            cy.get(`[data-testid="spotlights-slide-${ii}"]`)
                .should('exist')
                .should('have.attr', 'aria-selected', !!isSelected ? 'true' : 'false');
            cy.get(`[data-testid="spotlights-dot-${ii}"]`)
                .should('exist')
                .should(!!isSelected ? 'have.attr' : 'not.have.attr', 'disabled');
        }

        let previousButtonStatus = 'not.be.disabled';
        let nextButtonStatus = 'not.be.disabled';
        if (expectedPanel === 'first') {
            previousButtonStatus = 'be.disabled';
        } else if (expectedPanel === 'last') {
            nextButtonStatus = 'be.disabled';
        }
        cy.get('[data-testid="spotlights-previous-button"]').should(previousButtonStatus);
        cy.get('[data-testid="spotlights-next-button"]').should(nextButtonStatus);
    }
    it('Spotlights homepage renders as expected', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Spootlights navigation tests');
        cy.get(
            '[alt="Academic Integrity Modules - Everything you need to know about academic integrity at UQ"]',
        ).should('be.visible');

        // first spotlights panel starts with focus
        slideWithFocusIs(0, 'first');

        // click right arrow button to progress to the next slide
        cy.get('[data-testid="spotlights-next-button"]')
            .should('exist')
            .click();
        slideWithFocusIs(1);

        // again, click right arrow button to progress to the next slide
        cy.get('[data-testid="spotlights-next-button"]')
            .should('exist')
            .click();
        slideWithFocusIs(2, 'last');

        // click first dot
        cy.get('[data-testid="spotlights-dot-0"]')
            .should('exist')
            .click();
        slideWithFocusIs(0, 'first');

        // check the play button works
        cy.get('[data-testid="spotlights-play-pause-button"]')
            .should('exist')
            .click();
        cy.wait(600);
        slideWithFocusIs(1);
    });
});

describe('Digital Learning Hub', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    context('desktop homepage visits', () => {
        it('a successful unsubscribe appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/fdsgsgsdgsd');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-prompt"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials?',
                    ),
            );
            cy.get('[data-testid="dlor-unsubscribe-checkbox"] input')
                .should('exist')
                .check();
            cy.get('[data-testid="dlor-unsubscribe-button"]')
                .should('exist')
                .click();
            cy.waitUntil(() => cy.get('[data-testid="dlor-unsubscribe-success"]').should('exist'));
            cy.get('[data-testid="dlor-unsubscribe-success"]').contains(
                'Thank you. You have been unsubscribed from notifications for this title.',
            );
        });
        it('is accessible', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/fdsgsgsdgsd');
            cy.viewport(1300, 1000);
            cy.injectAxe();

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-prompt"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials?',
                    ),
            );
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor unsubscribe 1',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('[data-testid="dlor-unsubscribe-checkbox"] input')
                .should('exist')
                .check();
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor unsubscribe 2',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('[data-testid="dlor-unsubscribe-button"]')
                .should('exist')
                .click();
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor unsubscribe 3',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub');
                });
        });
        it('an expired unsubscription appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/unsubscribeExpired');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        "That unsubscribe request doesn't exist - have you already unsubscribed? Otherwise, something has gone wrong.",
                    ),
            );
        });
        it('a second click on a unsubscription link appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/duplicateclick');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        "That unsubscribe request doesn't exist - have you already unsubscribed? Otherwise, something has gone wrong.",
                    ),
            );
        });
        it('a click on an unknown unsubscription link appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/noSuchConf');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        "That unsubscribe request doesn't exist - have you already unsubscribed? Otherwise, something has gone wrong.",
                    ),
            );
        });
        it('an error on find appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/unsubscribeFindError');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should('contain', 'An error has occurred during the request'),
            );
        });
        it('an error on unsubscribe appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/unsubscribe/unsubscribeError');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-unsubscribe-prompt"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials?',
                    ),
            );
            cy.get('[data-testid="dlor-unsubscribe-checkbox"] input')
                .should('exist')
                .check();
            cy.get('[data-testid="dlor-unsubscribe-button"]')
                .should('exist')
                .click();
            cy.waitUntil(() => cy.get('[data-testid="dlor-unsubscribe-error"]').should('exist'));
            cy.get('[data-testid="dlor-unsubscribe-error"]')
                .should('be.visible')
                .should('contain', 'An error has occurred during the request');
        });
    });
});

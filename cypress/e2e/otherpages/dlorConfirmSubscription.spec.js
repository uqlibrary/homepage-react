describe('Digital Learning Hub', () => {
    context('desktop homepage visits', () => {
        it('is accessible', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_known');
            cy.viewport(1300, 1000);
            cy.injectAxe();

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-line-1"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Thank you for your interest in following Artificial Intelligence - Digital Essentials.',
                    ),
            );
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor-confirm',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('a successful confirmation appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_known');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-line-1"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Thank you for your interest in following Artificial Intelligence - Digital Essentials.',
                    ),
            );
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub');
                });
            cy.get('[data-testid="dlor-confirm-line-2"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Your request has been confirmed. We will send an email when we update the object.');
            cy.get('[data-testid="dlor-confirm-line-3"]')
                .should('exist')
                .should('be.visible')
                .find('a')
                .should('have.attr', 'href', 'http://localhost:2020/digital-learning-hub/view/938h_4986_654f');
        });
        it('an expired confirmation appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/a_known_conf_code_that_has_expired');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-line-1"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Thank you for your interest in following Artificial Intelligence - Digital Essentials.',
                    ),
            );
            cy.get('[data-testid="dlor-confirm-line-2"]')
                .should('exist')
                .should('be.visible')
                .should(
                    'contain',
                    'Unfortunately, your confirmation period expired before you were able to visit this link.',
                );
            cy.get('[data-testid="dlor-confirm-line-3"]')
                .should('exist')
                .should('be.visible')
                .find('a')
                .should('have.attr', 'href', 'http://localhost:2020/digital-learning-hub/view/938h_4986_654f');
        });
        it('a second click on a confirmation link appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/a_conf_code_that_has_already_been_used');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-line-1"]')
                    .should('exist')
                    .should('be.visible')
                    .should(
                        'contain',
                        'Thank you for your interest in following Artificial Intelligence - Digital Essentials.',
                    ),
            );
            cy.get('[data-testid="dlor-confirm-line-2"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'You have already confirmed this notification request.');
            cy.get('[data-testid="dlor-confirm-line-3"]')
                .should('exist')
                .should('be.visible')
                .find('a')
                .should('have.attr', 'href', 'http://localhost:2020/digital-learning-hub/view/938h_4986_654f');
        });
        it('a click on an unknown confirmation link appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_not_known');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-line-1"]')
                    .should('exist')
                    .should('be.visible')
                    .should('contain', 'Thank you for your interest in our Digital learning hub.'),
            );
            cy.get('[data-testid="dlor-confirm-line-2"]')
                .should('exist')
                .should('be.visible')
                .should('contain', "Unfortunately, your confirmation code isn't one that is currently available.");
            cy.get('[data-testid="dlor-confirm-line-3"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'check your email and try again');
        });
        it('handles an unexpected response type', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/an_unexpected_response_type');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should('contain', 'Something seems to have gone wrong - please check your email and try again.'),
            );
        });
        it('an error appears as expected', () => {
            cy.visit('digital-learning-hub/confirm/subscribe/error');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-confirm-error"]')
                    .should('exist')
                    .should('be.visible')
                    .should('contain', 'An error has occurred during the request'),
            );
        });
    });
});

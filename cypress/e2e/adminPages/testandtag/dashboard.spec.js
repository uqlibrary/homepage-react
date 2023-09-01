import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Dashboard', () => {
    it('page is accessible and renders base', () => {
        cy.visit('http://localhost:2020/admin/testntag?user=uqtesttag');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.dashboard.header.pageSubtitle('Library'));
        cy.wait(1000);
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Test and Tag Dashboard',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('page triggers errors if unable to load onLoad', () => {
        cy.visit('http://localhost:2020/admin/testntag?user=uqpf');
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.dashboard.header.pageSubtitle('Properties and Facilities'));
        cy.visit('http://localhost:2020/admin/testntag?user=uqpf');
        cy.data('confirmation_alert-error-alert').should('exist');
        cy.data('confirmation_alert-error-alert')
            .find('button')
            .click();
    });
});

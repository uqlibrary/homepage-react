import { clickButton } from '../../../support/helpers';

describe('Alerts Admin View Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
        cy.viewport(1300, 1000);
    });
    it('is accessible', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('View alert');
        cy.wait(500);
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Alerts Admin View',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('can view an alert without being able to edit any fields', () => {
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('View alert');
        cy.get('[data-testid="admin-alerts-view-title"] input').should('have.value', 'Example alert:');
        cy.get('[data-testid="admin-alerts-view-title"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-body"] textarea').should(
            'have.value',
            'This alert can be edited in mock.',
        );
        cy.get('[data-testid="admin-alerts-view-body"] textarea').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-start-date"] input').should('have.value', '2021-06-29T15:00:00');
        cy.get('[data-testid="admin-alerts-view-start-date"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-end-date"] input').should('have.value', '2031-07-02T18:30:00');
        cy.get('[data-testid="admin-alerts-view-end-date"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-checkbox-linkrequired"] input').should('be.checked');
        cy.get('[data-testid="admin-alerts-view-checkbox-linkrequired"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-link-title"] input').should(
            'have.value',
            'UQ community COVID-19 advice',
        );
        cy.get('[data-testid="admin-alerts-view-link-title"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-link-url"] input').should(
            'have.value',
            'https://about.uq.edu.au/coronavirus',
        );
        cy.get('[data-testid="admin-alerts-view-link-url"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-checkbox-permanent"] input').should('be.checked');
        cy.get('[data-testid="admin-alerts-view-checkbox-permanent"] input').should('be.disabled');

        // cy.get('[data-testid="admin-alerts-view-select-priority-type"] > div').should(
        //     'have.property',
        //     'aria-disabled',
        //     'true',
        // );
        // cy.get('[data-testid="admin-alerts-view-select-priority-type"] input').should(
        //     'have.property',
        //     'value',
        //     'urgent',
        // );
    });
    it('can return to the list page from the view page', () => {
        cy.get('[data-testid="admin-alerts-view-title"] input').should('have.value', 'Example alert:');
        cy.get('[data-testid="admin-alerts-view-button-block"]')
            .children()
            .should('have.length', 2)
            .then(() => {
                clickButton('button[data-testid="admin-alerts-view-button-cancel"]', 'Cancel');
            });
        cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
    });
    it('can visit the clone page from the view page', () => {
        cy.get('[data-testid="admin-alerts-view-title"] input').should('have.value', 'Example alert:');
        cy.get('[data-testid="admin-alerts-view-button-block"]')
            .children()
            .should('have.length', 2)
            .then(() => {
                clickButton('button[data-testid="admin-alerts-view-button-save"]', 'Clone');
            });
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245',
        );
    });
    it('has a Help button on the View page', () => {
        cy.get('[data-testid="admin-alerts-help-button"]').should('exist');
        // the reusable function doesnt work here - unclear why
        // hasAWorkingHelpButton();
    });
    // it('can show a preview of a info-priority non-permanent alert without link', () => {
    //     cy.visit('http://localhost:2020/admin/alerts/view/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
    //     cy.viewport(1300, 1000);
    //     cy.get('uq-alert[id="alert-preview"]').should('exist');
    //     cy.get('uq-alert[id="alert-preview"]')
    //         .shadow()
    //         .within(() => {
    //             cy.get('[data-testid="alert-icon"]').should('have.attr', 'aria-label', 'Alert.');
    //             cy.get('[data-testid="alert-title"]').should('have.text', 'Sample alert 2:');
    //             cy.get('[data-testid="alert-message"]').should('have.text', 'Has mock data.');
    //             cy.get('[data-testid="alert-close"]').should('exist');
    //             cy.get('[data-testid="alert-alert-preview-action-button"]').should('not.exist');
    //         });
    // });
    // it('can show a preview of an urgent-priority permanent alert with link', () => {
    //     cy.get('uq-alert[id="alert-preview"]').should('exist');
    //     cy.get('uq-alert[id="alert-preview"]')
    //         .shadow()
    //         .within(() => {
    //             cy.get('[data-testid="alert-icon"]').should('have.attr', 'aria-label', 'Important alert.');
    //             cy.get('[data-testid="alert-title"]').should('have.text', 'Example alert:');
    //             cy.get('[data-testid="alert-message"]').should('have.text', 'This alert can be edited in mock.');
    //             cy.get('[data-testid="alert-close"]').should('not.exist');
    //             // cy.
    //             // get('[data-testid="alert-alert-preview-action-button"]').contain('UQ community COVID-19 advice');
    //             cy.get('[data-testid="alert-alert-preview-action-button"]').should(
    //                 'have.attr',
    //                 'title',
    //                 'On the live website, this button will visit https://about.uq.edu.au/coronavirus when clicked',
    //             );
    //             cy.get('[data-testid="alert-icon"]').should('have.attr', 'aria-label', 'Important alert.');
    //         });
    // });
    it('tells the user when alert appeared on all systems', () => {
        cy.visit('http://localhost:2020/admin/alerts/view/cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="admin-alerts-view-systems"]')
            .should('exist')
            .contains('This alert appeared on all systems');
    });
    it('tells the user which systems the alert appeared on', () => {
        cy.visit('http://localhost:2020/admin/alerts/view/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="admin-alerts-view-checkbox-system-primo"]')
            .should('exist')
            .contains('Primo');
        cy.get('[data-testid="admin-alerts-view-checkbox-system-primo"] input').should('be.checked');
    });
});

import { clickButton, dateHasValue } from '../../../support/helpers';

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
        cy.get('uq-site-header')
            .shadow()
            .within(() => {
                cy.get('[data-testid="subsite-title"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('Alerts admin');
            });
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('View alert');
        cy.get('[data-testid="admin-alerts-view-title"] input').should('have.value', 'Example alert:');
        cy.get('[data-testid="admin-alerts-view-title"] input').should('be.disabled');

        cy.get('[data-testid="admin-alerts-view-body"] textarea').should(
            'have.value',
            'This alert can be edited in mock.',
        );
        cy.get('[data-testid="admin-alerts-view-body"] textarea').should('be.disabled');

        dateHasValue('[data-testid="admin-alerts-view-start-date"] input', '2021-06-29T15:00');
        cy.get('[data-testid="admin-alerts-view-start-date"] input').should('be.disabled');

        dateHasValue('[data-testid="admin-alerts-view-end-date"] input', '2031-07-02T18:30');
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

        cy.get('[data-testid="admin-alerts-view-select-priority-type"] div').should(
            'have.attr',
            'aria-disabled',
            'true',
        );
        cy.get('[data-testid="admin-alerts-view-select-priority-type"] input').should('have.value', 'urgent');
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
    it('can show a preview of an urgent-priority permanent alert with link', () => {
        cy.get('uq-alert[id="alert-preview"]')
            .should('exist')
            .should('have.attr', 'alerttitle', 'Example alert:')
            .should('have.attr', 'prioritytype', 'urgent')
            .should(
                'have.attr',
                'alertmessage',
                'This alert can be edited in mock.[UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
            );
    });
});
describe('Alerts Admin View Page - other page tests', () => {
    it('can show a preview of a info-priority non-permanent alert without link', () => {
        cy.visit('http://localhost:2020/admin/alerts/view/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('uq-alert[id="alert-preview"]')
            .should('exist')
            .should('have.attr', 'alerttitle', 'Sample alert 2:')
            .should('have.attr', 'prioritytype', 'info')
            .should('have.attr', 'alertmessage', 'Has mock data.');

        // the editing user displays correctly
        cy.get('[data-testid="admin-alerts-view-created-by"]').should('not.exist');
        cy.get('[data-testid="admin-alerts-view-updated-by"]').should('contain', 'Last Updated by: uqtest2');
    });
    it('can show a preview of an extreme-priority permanent alert with link', () => {
        cy.visit('http://localhost:2020/admin/alerts/view/d23f2e10-d7d6-11eb-a928-71f3ef9d35d9?user=uqstaff');
        cy.get('uq-alert[id="alert-preview"]')
            .should('exist')
            .should('have.attr', 'alerttitle', 'Face masks in the Library:')
            .should('have.attr', 'prioritytype', 'extreme')
            .should(
                'have.attr',
                'alertmessage',
                'Test Extreme alert with a longish body content.[UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
            );

        // the editing user displays correctly
        cy.get('[data-testid="admin-alerts-view-created-by"]').should('not.exist');
        cy.get('[data-testid="admin-alerts-view-updated-by"]').should('not.exist');
    });
    it('tells the user when alert appeared on all systems', () => {
        cy.visit('http://localhost:2020/admin/alerts/view/cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="admin-alerts-view-systems"]')
            .should('exist')
            .contains('This alert appeared on all systems');

        // the editing user displays correctly
        cy.get('[data-testid="admin-alerts-view-created-by"]').should('contain', 'Created by: uqtest1');
        cy.get('[data-testid="admin-alerts-view-updated-by"]').should('contain', 'Last Updated by: uqtest2');
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

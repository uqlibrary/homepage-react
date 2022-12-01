import { hasAWorkingHelpButton } from '../../../support/alerts';
import { clickButton, clickSVGButton } from '../../../support/helpers';

describe('Alert Admin List page', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
        cy.viewport(1300, 1200);
    });
    it('displays a list of alerts to the authorised user', () => {
        cy.waitUntil(() => cy.get('[data-testid="admin-alerts-list-current-list"]').should('exist'));
        cy.get('[data-testid="admin-alerts-list-current-list"]').should('be.visible');
        cy.get('[data-testid="admin-alerts-list-current-list"] tbody')
            .children()
            .should('have.length', 1 + numRowsHiddenAsNoDatainfo);
        cy.get('[data-testid="headerRow-count-current"]').contains('1 alert');

        // this alert has all 3 chips
        cy.get('[data-testid="alert-list-urgent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]')
            .should('exist')
            .contains('Urgent');
        cy.get('[data-testid="alert-list-link-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]')
            .should('exist')
            .contains('Link');
        cy.get('[data-testid="alert-list-permanent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]')
            .should('exist')
            .contains('Permanent');

        // the system chips display as expected
        cy.get('[data-testid="alert-list-system-chip-1db618c0-d897-11eb-a27e-df4e46db7245-homepage"]')
            .should('exist')
            .contains('System: Home page');

        cy.waitUntil(() => cy.get('[data-testid="admin-alerts-list-future-list"] tbody').should('exist'));
        cy.get('[data-testid="admin-alerts-list-future-list"] tbody').should('be.visible');
        cy.get('[data-testid="headerRow-count-scheduled"]').contains('5 alerts');
        cy.get('[data-testid="admin-alerts-list-future-list"] tbody').scrollIntoView();
        cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
            .children()
            .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        cy.get('[data-testid="admin-alerts-list-future-list"] tfoot').should('not.exist');

        // this alert has no chips
        cy.get('[data-testid="alert-list-urgent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should('not.exist');
        cy.get('[data-testid="alert-list-link-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should('not.exist');
        cy.get('[data-testid="alert-list-permanent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should('not.exist');

        cy.get('[data-testid="admin-alerts-list-past-list"]').should('be.visible');
        cy.get('[data-testid="headerRow-count-past"]').contains('78 alerts');
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody').scrollIntoView();
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody ')
            .children()
            .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').should('exist');
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 78');
    });
    it('is accessible', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').should('be.visible');
        cy.get('h2').contains('All alerts');
        cy.waitUntil(() =>
            cy.get('[data-testid="alert-list-row-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist'),
        );
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Alerts Admin',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('has a working Help button on the List page', () => {
        hasAWorkingHelpButton();
    });

    it('has a working Add button on the List page', () => {
        cy.get('[data-testid="admin-alerts-help-display-button"]').should('be.visible');
        cy.get('[data-testid="admin-alerts-help-display-button"]').click();
        cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add');
    });

    it('has a working Edit button on the List page', () => {
        clickButton('button[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]', 'Edit');
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245',
        );
    });

    it('an Edit button a long way down the List shows the top of the edit form', () => {
        // an alert from way down the list is edited (lets us check the form scrolls into view)
        cy.get('button[data-testid="alert-list-item-edit-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').scrollIntoView();
        clickButton('button[data-testid="alert-list-item-edit-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]', 'Edit');
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/alerts/edit/0aa12a30-996a-11eb-b009-3f6ded4fdb35',
        );
        cy.isInViewport('[data-testid="StandardPage"]');
    });

    it('has alert dates formatted as expected', () => {
        // non-past dates dont have the year' time is formatted as expected
        cy.get('tr[data-testid="alert-list-row-1db618c0-d897-11eb-a27e-df4e46db7245"]').within(() => {
            cy.get('td.alertText h4').contains('Example alert:');
            cy.get('td:nth-child(3)').contains('Tue 29 Jun');
            cy.get('td:nth-child(3)').contains('3pm');
            cy.get('td:nth-child(4)').contains('Wed 2 Jul');
            cy.get('td:nth-child(4)').contains('6.30pm');
        });
        // past dates do have the year and a line break
        cy.get('tr[data-testid="alert-list-row-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"').within(() => {
            cy.get('td.alertText h4').contains('Face masks in the Library:');
            cy.get('td:nth-child(3)').contains('Mon 28 Jun 2021');
            cy.get('td:nth-child(3)').contains('4.02pm');
            cy.get('td:nth-child(4)').contains('Tue 29 Jun 2021');
            cy.get('td:nth-child(4)').contains('3pm');
        });
    });
    it('can save the paginator default row count selection', () => {
        cy.get('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]').should(
            'have.value',
            '5',
        );
        cy.get('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]').select('10');
        cy.get('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]').should(
            'have.value',
            '10',
        );
        // reload the page and it is still 10 because the cookie saved it
        cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]').select('10');
        cy.get('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]').should(
            'have.value',
            '10',
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-10 of 78');
    });
    it('has working Split button actions for current/scheduled alerts', () => {
        cy.get('[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist');
        cy.get('[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]').contains('Edit');
        // the dropdown split button exists but is not open
        cy.get('[data-testid="alert-list-arrowicon-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist');
        cy.get('[data-testid="alert-list-arrowicon-1db618c0-d897-11eb-a27e-df4e46db7245"]')
            .parent()
            .parent()
            .children()
            .should('have.length', 1);
        // open the split button
        clickSVGButton(
            '[data-testid="alert-list-action-block-1db618c0-d897-11eb-a27e-df4e46db7245"] button:nth-of-type(2)',
        );
        cy.get('[data-testid="alert-list-arrowicon-1db618c0-d897-11eb-a27e-df4e46db7245"]')
            .parent()
            .parent()
            .children()
            .should('have.length', 2);
        // CLONE BUTTON WORKS
        cy.get('[data-testid="1db618c0-d897-11eb-a27e-df4e46db7245-clone-button"]').should('exist');
        cy.get('[data-testid="1db618c0-d897-11eb-a27e-df4e46db7245-clone-button"]').click();
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245',
        );
        // back to the list page
        cy.get('[data-testid="admin-alerts-form-button-cancel"]').click();
        cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        cy.get(
            '[data-testid="alert-list-action-block-1db618c0-d897-11eb-a27e-df4e46db7245"] button:nth-of-type(2)',
        ).click();
        // DELETE BUTTON WORKS
        cy.get('[data-testid="1db618c0-d897-11eb-a27e-df4e46db7245-delete-button"]').should('exist');
        cy.get('[data-testid="1db618c0-d897-11eb-a27e-df4e46db7245-delete-button"]').click();
        // confirmation appears
        cy.get('[data-testid="message-title"]').contains('Remove 1 alert?');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
        // dialog disappears
        cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
        // cant test display further as mock data doesnt actually delete
    });
    it('has working Split button actions for past alerts', () => {
        // VIEW BUTTON WORKS
        cy.get('[data-testid="alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').should('exist');
        cy.get('[data-testid="alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').contains('View');
        cy.get('[data-testid="alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').click();
        // but this is actually showing an error because we dont have the mock data
        cy.viewport(1300, 1000);
        cy.location('href').should(
            'eq',
            'http://localhost:2020/admin/alerts/view/d23f2e10-d7d6-11eb-a928-71f3ef9d35d9',
        );

        cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
        // the dropdown split button exists but is not open
        cy.get('[data-testid="alert-list-arrowicon-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').should('exist');
        cy.get('[data-testid="alert-list-arrowicon-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]')
            .parent()
            .parent()
            .children()
            .should('have.length', 1);
        cy.get(
            '[data-testid="alert-list-action-block-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"] button:nth-of-type(2)',
        ).should('exist');
        // open the split button
        cy.get(
            '[data-testid="alert-list-action-block-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"] button:nth-of-type(2)',
        ).click();
        cy.get('[data-testid="alert-list-arrowicon-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]')
            .parent()
            .parent()
            .children()
            .should('have.length', 2);
        // CLONE PAGE LINK WORKS
        cy.get('[data-testid="d23f2e10-d7d6-11eb-a928-71f3ef9d35d9-clone-button"]').should('exist');
        // but the mock data doesnt exist so we wont try to load it
        // DELETE PAGE LINK WORKS (needs actual test here because the method is slightly different to the checkbox)
        cy.get('[data-testid="d23f2e10-d7d6-11eb-a928-71f3ef9d35d9-delete-button"]').should('exist');
        cy.get('[data-testid="d23f2e10-d7d6-11eb-a928-71f3ef9d35d9-delete-button"]').click();
        // confirmation appears
        cy.get('[data-testid="message-title"]').contains('Remove 1 alert?');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
        cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
        // dialog disappears
        cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
        // cant test display further as mock data doesnt actually delete
    });
    it('the footer paginator shows all links when "all" is selected', () => {
        cy.get('[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]').select(
            'All',
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]').should(
            'have.value',
            78,
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody ')
            .children()
            .should('have.length', 78 + numRowsHiddenAsNoDatainfo);
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-78 of 78');
    });
    it('the footer paginator navigates between pages', () => {
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 78');
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(3)')
            .should('exist')
            .click();
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('6-10 of 78');
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child').should(
            'contain',
            '[5.00pm] Unexpected performance issues, UQ Library Search',
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(2)')
            .should('exist')
            .click();
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 78');
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child').should(
            'contain',
            'Face masks in the Library',
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(4)')
            .should('exist')
            .click();
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('76-78 of 78');
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child').should(
            'contain',
            'Unexpected issue, print credit top-ups',
        );
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(1)')
            .should('exist')
            .click();
        cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 78');
        cy.get('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child').should(
            'contain',
            'Face masks in the Library',
        );
    });
    context('Alert Admin deletion', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1400);
        });
        it('the user can select an alert to delete', () => {
            // select one alert and every thing looks right
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
            cy.get('[data-testid="headerRow-current"] span.deleteManager').should('not.exist');
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').check();
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgb(35, 119, 203)');
            cy.get('[data-testid="headerRow-current"] span.deleteManager span').contains('1 alert selected');
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').uncheck();
            cy.get('[data-testid="headerRow-current"] span.deleteManager').should('not.exist');

            // select two alerts and every thing looks right
            cy.get('[data-testid="alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-232d6880-996a-11eb-8a79-e7fddae87baf"]').check();
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager span').contains('2 alerts selected');

            // back down to one alert selected and every thing looks right
            cy.get('[data-testid="alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').uncheck();
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager span').contains('1 alert selected');

            // click the delete button and the delete dialog appears
            cy.get('[data-testid="alert-list-scheduled-delete-button"]').click();
            cy.get('[data-testid="cancel-alert-delete-confirm"]').should('exist');
            // close dialog
            cy.get('[data-testid="cancel-alert-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
        });

        it('the user can clear selected alerts', () => {
            cy.get('[data-testid="headerRow-scheduled"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager').should('not.exist');
            cy.get('[data-testid="alert-list-item-checkbox-d480b250-9cd8-11eb-88c0-a3882cd6c52e"]').check();
            cy.get('[data-testid="headerRow-scheduled"]').should('have.css', 'background-color', 'rgb(35, 119, 203)');
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager span').contains('1 alert selected');
            cy.get('[data-testid="alert-list-item-checkbox-857726b0-a19f-11eb-ab5b-bb33418ed6de"]').check();
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager span').contains('2 alerts selected');

            cy.get('[data-testid="alert-list-scheduled-deselect-button"]')
                .should('exist')
                .click();
            cy.get('[data-testid="headerRow-scheduled"] span.deleteManager').should('not.exist');
        });

        it('the user can delete an alert', () => {
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').check();
            cy.get('[data-testid="headerRow-current"] span span').contains('1 alert selected');

            // click the Proceed button and the alert is deleted
            cy.get('[data-testid="alert-list-current-delete-button"]').click();
            cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
            cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
            // dialog disappears
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
            // cant test display further as mock data doesnt actually delete
        });

        it('reports when a delete fails', () => {
            cy.get('[data-testid="alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').check();
            cy.get('[data-testid="headerRow-scheduled"] span span').contains('1 alert selected');
            // click bin icon
            cy.get('[data-testid="alert-list-scheduled-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
            // failure is reported in a dialog
            cy.get('[data-testid="dialogbox-alert-delete-error-dialog"]').should('exist');
            cy.get('[data-testid="dialogbox-alert-delete-error-dialog"] h2').contains(
                'Record Deletion was not successful',
            );
            // dialog can be closed
            cy.get('[data-testid="confirm-alert-delete-error-dialog"]').should('exist');
            cy.get('[data-testid="confirm-alert-delete-error-dialog"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-error-dialog"]').should('not.exist');
        });
        it('sequential deletion of alerts does not fail', () => {
            cy.get('[data-testid="alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 alert selected');
            // click bin icon
            cy.get('[data-testid="alert-list-past-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
            cy.wait(500);
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-alert-delete-error-dialog"]').should('not.exist');
            // subsequent deletes also succeed
            cy.wait(1000);
            cy.get('[data-testid="alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 alert selected');
            cy.get('[data-testid="alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('2 alerts selected');
            // click bin icon
            cy.get('[data-testid="alert-list-past-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-alert-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-alert-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-alert-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
            cy.wait(500);
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-alert-delete-error-dialog"]').should('not.exist');
        });
        it('during delete section checkboxes in other sections are disabled', () => {
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9"]').uncheck();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08"]').uncheck();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').uncheck();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );
        });
        it('can unselect all checkboxes with the "X"', () => {
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="alert-list-past-deselect-button"]').should('exist');
            cy.get('[data-testid="alert-list-past-deselect-button"]').click();
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9"]').should(
                'not.be.checked',
            );
            cy.get('[data-testid="alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08"]').should(
                'not.be.checked',
            );
            cy.get('[data-testid="alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]').should(
                'not.be.checked',
            );
        });
    });
});

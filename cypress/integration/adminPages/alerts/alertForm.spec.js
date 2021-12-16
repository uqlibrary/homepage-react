import { hasAWorkingHelpButton } from '../../../support/alerts';
import { clickButton, clickSVGButton } from '../../../support/helpers';

describe('Alerts Admin Form Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Alert Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Create alert');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it.skip('can show a preview of the initial blank alert', () => {
            // this one is more about making sure nothing bad happens rather than checking it looks ok
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-title"]').should('have.text', 'No title supplied');
                    cy.get('[data-testid="alert-message"]').should('have.text', 'No message supplied');
                    cy.get('[data-testid="alert-close"]').should('exist');
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Alert.');
                    cy.get('[data-testid="alert-close"] svg').should(
                        'have.attr',
                        'aria-label',
                        'Dismiss this alert for 24 hours',
                    );
                });
        });
        it('can show a preview of an urgent non-permanent alert without link', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title');
            cy.get('[data-testid="admin-alerts-form-body"]').type('the body');
            cy.get('[data-testid="admin-alerts-form-checkbox-urgent"] input').check();
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-title"]').should('have.text', 'alert title');
                    cy.get('[data-testid="alert-message"]').should('have.text', 'the body');
                    cy.get('[data-testid="alert-close"]').should('exist');
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Important alert.');
                });
        });
        it('can show a preview of a non-urgent permanent alert with link', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 2');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 2');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').check();
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Click here');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Alert.');
                    cy.get('[data-testid="alert-title"]').should('have.text', 'alert title 2');
                    cy.get('[data-testid="alert-message"]').should('have.text', 'body 2');
                    cy.get('[data-testid="alert-close"]').should('not.exist');
                    cy.get(
                        '[data-testid="alert-alert-preview"] [data-testid="alert-alert-preview-action-button"]',
                    ).should(
                        'have.attr',
                        'title',
                        'On the live website, this button will visit http://example.com when clicked',
                    );
                });
            // user can toggle the Preview
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('hides incomplete links from the preview', () => {
            // rather than show things like "title: body []()"
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 6');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 6');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link but entered nothing, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-message"]').should('have.text', 'body 6');
                });
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Click here');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link and entered the text but no link, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-message"]').should('have.text', 'body 6');
                });
            cy.get('[data-testid="admin-alerts-form-link-title"] input').clear();
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link and entered the link but no linktext, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-message"]').should('have.text', 'body 6');
                });
        });
        it('an url must be valid', () => {
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-form-link-title"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-form-link-url"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Read more');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://x.c');
            cy.get('[data-testid="admin-alerts-form-link-url"]').should('have.class', 'Mui-error');
            // one more character
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('o');
            cy.get('[data-testid="admin-alerts-form-link-url"]').should('not.have.class', 'Mui-error');
        });
        it('can save an alert (simple)', () => {
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 3');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 3');
            cy.get('button[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('An alert has been added');
            // click 'add another alert' button in dialog
            cy.get('[data-testid="confirm-alert-add-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add?user=uqstaff');
            // the alert page reloads with a blank form
            cy.get('[data-testid="admin-alerts-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-alerts-form-body"] textarea').should('have.value', '');
            // the preview is successfully hidden as part of the save function
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
        });
        it('can save an alert (more complex)', () => {
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 4');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 4');
            cy.get('[data-testid="admin-alerts-form-checkbox-urgent"] input').check();
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').check();

            cy.get('[data-testid="admin-alerts-form-link-title"]').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-link-url"]').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-form-link-title"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-form-link-url"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Read more');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com/');

            // TODO we dont seem to have access to the date field?
            // from https://github.com/cypress-io/cypress/issues/1366
            // cy.get('[data-testid="admin-alerts-form-start-date-0"] input')
            //     .click()
            //     .then(input => {
            //         input[0].dispatchEvent(new Event('input', { bubbles: true }));
            //         input.val('2031-04-30T13:00');
            //     })
            //     .click();
            // cy.get('[data-testid="admin-alerts-form-end-date"] label')
            //      .should('have.attr', 'style', 'color: #c80000;');

            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('An alert has been added');
            // click 'View alert list' button in dialog
            cy.get('[data-testid="cancel-alert-add-save-succeeded"]').click();
            // reloads list page (sadly it is mock data so we cant test for the presence of the new alert)
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            // then we click the add button and see an empty form
            cy.get('[data-testid="admin-alerts-help-display-button"]').click();
            cy.wait(500);
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add');
            cy.get('[data-testid="admin-alerts-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-alerts-form-body"] textarea').should('have.value', '');
            cy.get('[data-testid="confirm-alert-add-save-succeeded"]').should('not.exist');
        });
        it('the cancel button returns to the list page', () => {
            cy.get('[data-testid="admin-alerts-form-button-cancel"]').click();
            cy.wait(50);
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Add page', () => {
            hasAWorkingHelpButton();
        });
        it('buttons are disabled unless the form is valid', () => {
            function PreviewButtonAvailableAndSaveDisabled() {
                // preview button is always available
                cy.get('[data-testid="admin-alerts-form-button-preview"]').should('not.be.disabled');
                cy.get('[data-testid="admin-alerts-form-button-save"]').should('be.disabled');
            }

            function buttonsAreNOTDisabled() {
                cy.get('[data-testid="admin-alerts-form-button-preview"]').should('not.be.disabled');
                cy.get('[data-testid="admin-alerts-form-button-save"]').should('not.be.disabled');
            }

            PreviewButtonAvailableAndSaveDisabled();

            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 5');
            PreviewButtonAvailableAndSaveDisabled();

            cy.get('[data-testid="admin-alerts-form-body"]').type('body 5');
            buttonsAreNOTDisabled();

            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            PreviewButtonAvailableAndSaveDisabled();

            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('read more');
            PreviewButtonAvailableAndSaveDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http');
            PreviewButtonAvailableAndSaveDisabled();

            // complete to a valid url and the buttons are enabled
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('://example.com');
            buttonsAreNOTDisabled();
        });
    });
    context('Alert Admin Edit page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Edit alert');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the edit form presets the correct data', () => {
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-title"] input').should('have.value', 'Example alert:');
            cy.get('[data-testid="admin-alerts-form-body"]').contains('This alert can be edited in mock.');
            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('have.value', '2021-06-29T15:00:00');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('have.value', '2031-07-02T18:30:00');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-urgent"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').should(
                'have.value',
                'UQ community COVID-19 advice',
            );
            cy.get('[data-testid="admin-alerts-form-link-url"] input').should(
                'have.value',
                'https://about.uq.edu.au/coronavirus',
            );
            cy.visit('http://localhost:2020/admin/alerts/edit/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-title"] input').should('have.value', 'Sample alert 2:');
            cy.get('[data-testid="admin-alerts-form-body"]').contains('Has mock data.');
            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('have.value', '2021-06-06T00:45:00');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('have.value', '2021-06-06T05:00:00');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').should('not.be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').should('not.be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-urgent"] input').should('not.be.checked');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('be.checked');
        });
        it('has a working Edit form', () => {
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('be.disabled');
            cy.get('[data-testid="admin-alerts-form-title"]').type('Updated alert');
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('not.be.disabled');
            cy.get('[data-testid="admin-alerts-form-button-save"').click();
            cy.wait(500);
            cy.get('[data-testid="dialogbox-alert-edit-save-succeeded"] h2').contains('The alert has been updated');
            // can't do much checking here that it saves properly
            cy.get('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        });
        it('changing a system enables the save button', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('be.disabled');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('not.be.disabled');
            cy.get('[data-testid="admin-alerts-form-button-save"').click();
            cy.wait(500);
            cy.get('[data-testid="dialogbox-alert-edit-save-succeeded"] h2').contains('The alert has been updated');
            // can't do much checking here that it saves properly
            cy.get('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        });
        it('has a working Help button on the Edit page', () => {
            hasAWorkingHelpButton();
        });
        it('can show a preview of a change', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .should('have.value', 'Example alert:') // force retry until re-attached
                .clear()
                .type('Updated alert');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: visible; opacity: 1;');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Important alert.');
                    cy.get('[data-testid="alert-title"]').should('have.text', 'Updated alert');
                });
            // user can toggle the Preview
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user edits a field the preview disappears and can be reshown
            cy.get('[data-testid="admin-alerts-form-title"]').type(' again');
            // preview is only hidden by css this time - this minimises jumping around of the screen
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: hidden; opacity: 0;');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview');
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: visible; opacity: 1;');
        });
        it('can show a preview of the original alert', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview'); // show preview
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Important alert.');
                    cy.get('[data-testid="alert-title"]').contains('Example alert:');
                    cy.get('[data-testid="alert-message"]').contains('This alert can be edited in mock.');
                    cy.get('[data-testid="alert-alert-preview-action-button"]').contains(
                        'UQ community COVID-19 advice',
                    );
                });
            // user can toggle the Preview
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview'); // hide preview
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview'); // show preview
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('tells the user which systems the alert will appear on', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"]')
                .parent()
                .should('exist')
                .contains('Home page');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"]')
                .parent()
                .should('exist')
                .contains('Primo');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('be.checked');
        });
    });
    context('Alert Admin Clone page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone alert');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Clone',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can clone an alert and return to list', () => {
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone alert');
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .focus()
                .clear();
            cy.get('[data-testid="admin-alerts-form-title"] input').type('alert title 7');
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
            // click 'view alert list' button in dialog
            cy.get('[data-testid="cancel-alert-clone-save-succeeded"]').click();
            // the alert list reloads
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
        });
        it('can clone an alert and then clone again', () => {
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone alert');
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .focus()
                .clear();
            cy.get('[data-testid="admin-alerts-form-title"] input').type('alert title 10');
            // click "Add new"
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
            // click 'clone again' button in dialog
            cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff',
            );
            // click "Add new"
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
        });
        it('has a working Help button on the Clone page', () => {
            cy.wait(50);
            hasAWorkingHelpButton();
        });

        function clickPlusButton(buttonId) {
            clickSVGButton('[data-testid="admin-alerts-form-another-date-button-' + buttonId + '"]');
        }
        it('the "add a date set button" works', () => {
            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('exist');
            cy.wait(50);
            clickPlusButton('0');

            cy.get('[data-testid="admin-alerts-form-start-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            clickPlusButton('1');

            cy.get('[data-testid="admin-alerts-form-start-date-2"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-2"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-1"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-2"]').should('exist');

            clickButton('button[data-testid="admin-alerts-form-button-save"]', 'Create');
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('3 alerts have been cloned');

            clickButton('[data-testid="confirm-alert-clone-save-succeeded"]', 'Clone again');

            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('exist');
            cy.wait(50);
            clickPlusButton('0');

            cy.get('[data-testid="admin-alerts-form-start-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-1"]').should('exist');

            clickButton('button[data-testid="admin-alerts-form-button-save"]', 'Create');
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('2 alerts have been cloned'); // we dont display 3 again when this time we only saved 2
        });

        function thisManyRemoveButtonsExist(buttonId) {
            for (let ii = 0; ii < buttonId; ii++) {
                cy.get(`[data-testid="admin-alerts-form-start-date-${ii}"] input`).should('exist');
                cy.get(`[data-testid="admin-alerts-form-end-date-${ii}"] input`).should('exist');
                cy.get(`[data-testid="admin-alerts-form-remove-date-button-${ii}"]`).should('exist'); // '-' button exists
            }
            const nextButtonId = buttonId + 1;
            cy.get(`[data-testid="admin-alerts-form-remove-date-button-${nextButtonId}"]`).should('not.exist');
        }
        function clickMinusButton(buttonId) {
            clickSVGButton('[data-testid="admin-alerts-form-remove-date-button-' + buttonId + '"]');
        }
        it('the "remove a date set button" works', () => {
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-remove-date-button-0"]').should('not.exist'); // no '-' button
            clickPlusButton('0'); // add a date field
            thisManyRemoveButtonsExist(1);

            clickPlusButton('1');
            thisManyRemoveButtonsExist(2);

            clickPlusButton('2');
            thisManyRemoveButtonsExist(3);

            clickMinusButton('1'); // remove a date field
            thisManyRemoveButtonsExist(2);
        });
        it('tells the user which systems the alert will appear on', () => {
            cy.visit('http://localhost:2020/admin/alerts/clone/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"]')
                .parent()
                .should('exist')
                .contains('Home page');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"]')
                .parent()
                .should('exist')
                .contains('Primo');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').uncheck();
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('not.be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').check();
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('be.checked');
        });
    });
});

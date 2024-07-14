import { hasAWorkingHelpButton } from '../../../support/alerts';
import { clickButton, clickSVGButton, dateHasValue } from '../../../support/helpers';

const INFO_COLOUR = 'rgb(30, 114, 198)'; // #1e72c6
const URGENT_COLOUR = 'rgb(251, 184, 0)'; // #fbb800
const EXTREME_COLOUR = 'rgb(149, 17, 38)'; // #951126

function selectPriorityType(type) {
    // open the select
    cy.get('[data-testid="admin-alerts-form-select-prioritytype"]').click();
    // choose urgent
    cy.get(`[data-testid="admin-alerts-form-option-${type}"]`).click();
    cy.get('[data-testid="admin-alerts-form-prioritytype-input"]').should('have.value', type);
}

describe('Alerts Admin Form Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Alert Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        function thisManyRemoveButtonsExist(buttonId) {
            for (let ii = 0; ii <= buttonId; ii++) {
                cy.get(`[data-testid="admin-alerts-form-start-date-${ii}"] input`).should('exist');
                cy.get(`[data-testid="admin-alerts-form-end-date-${ii}"] input`).should('exist');
                cy.log('looking for remove button', ii);
                cy.get(`[data-testid="admin-alerts-form-row-${ii}"]`)
                    .should('exist')
                    .should('contain', 'Start date')
                    .find(`[data-testid="admin-alerts-form-remove-date-button-${ii}"]`)
                    .should('exist')
                    .should('have.attr', 'aria-label', 'Remove this date set');
            }
            const nextButtonId = buttonId + 1;
            cy.get(`[data-testid="admin-alerts-form-remove-date-button-${nextButtonId}"]`).should('not.exist');
        }
        function clickMinusButton(buttonId) {
            clickSVGButton('[data-testid="admin-alerts-form-remove-date-button-' + buttonId + '"]');
        }
        function clickPlusButton(buttonId) {
            clickSVGButton('[data-testid="admin-alerts-form-another-date-button-' + buttonId + '"]');
        }
        it('the "remove a date set button" works', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-add-remove-buttons-0"]').should('exist'));
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

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Create alert');
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-add-remove-buttons-0"]').should('exist'));
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can show a preview of the initial blank alert', () => {
            // this test is more about making sure nothing bad happens rather than checking it looks ok (and coverage)
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-add-remove-buttons-0"]').should('exist'));
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', '')
                .should('have.attr', 'prioritytype', 'info')
                .should('have.attr', 'alertmessage', '');
        });
        it('can show a preview of an urgent non-permanent alert without link', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title');
            cy.get('[data-testid="admin-alerts-form-body"]').type('the body');
            selectPriorityType('urgent');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title')
                .should('have.attr', 'prioritytype', 'urgent')
                .should('have.attr', 'alertmessage', 'the body');
        });
        it('can show a preview of a info-priority permanent alert with link', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-button-preview"]').should('exist'));
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 2');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 2');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').check();
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Click here');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title 2')
                .should('have.attr', 'prioritytype', 'info')
                .should('have.attr', 'alertmessage', 'body 2[Click here](http://example.com)');
            // user can toggle the Preview
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('can show a preview of a extreme permanent alert with link', () => {
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 2');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 2');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').check();
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            selectPriorityType('extreme');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Click here');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title 2')
                .should('have.attr', 'prioritytype', 'extreme')
                .should('have.attr', 'alertmessage', 'body 2[Click here](http://example.com)');
            // user can toggle the Preview
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('hides incomplete links from the preview', () => {
            // rather than show things like "title: body []()"
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 6');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 6');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link but entered nothing, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title 6')
                .should('have.attr', 'prioritytype', 'info')
                .should('have.attr', 'alertmessage', 'body 6');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').type('Click here');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link and entered the text but no link, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title 6')
                .should('have.attr', 'prioritytype', 'info')
                .should('have.attr', 'alertmessage', 'body 6');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').clear();
            cy.get('[data-testid="admin-alerts-form-link-url"] input').type('http://example.com');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user has required a link and entered the link but no linktext, no link shows in the preview
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'alert title 6')
                .should('have.attr', 'prioritytype', 'info')
                .should('have.attr', 'alertmessage', 'body 6');
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
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-add-save-succeeded"]').should('exist'));
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
            selectPriorityType('urgent');
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
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-add-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('An alert has been added');
            // click 'View alert list' button in dialog
            cy.get('[data-testid="cancel-alert-add-save-succeeded"]').click();
            // reloads list page (sadly it is mock data so we cant test for the presence of the new alert)
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-list-future-list"] tbody').should('exist'));
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
            cy.waitUntil(
                () =>
                    cy
                        .get('[data-testid="admin-alerts-list-future-list"] tbody')
                        .children()
                        .then(elements => elements.length === 5 + numRowsHiddenAsNoDatainfo),
                { timeout: 10000, interval: 500 },
            );
            // then we click the add button and see an empty form
            cy.get('[data-testid="admin-alerts-help-display-button"]').click();
            cy.waitUntil(() => cy.get('[data-testid="standard-card-create-alert"]').should('exist'));
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add');
            cy.get('[data-testid="admin-alerts-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-alerts-form-body"] textarea').should('have.value', '');
            cy.get('[data-testid="confirm-alert-add-save-succeeded"]').should('not.exist');
        });
        // This test is flakey - the button isnt always available, which is bizarre
        // Testing in jest instead see AlertsAdd.test.js
        it.skip('the cancel button returns to the list page', () => {
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
    context('Alert Admin Edit page Special', () => {
        it('if a non existing record is requested the edit form pops an error', () => {
            // this alert doesn't exist in mock, so an error pops up on edit
            cy.visit('http://localhost:2020/admin/alerts/edit/232d6880-996a-11eb-8a79-e7fddae87baf?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('button[data-testid="confirm-alert-error"]').should('exist');
            // the ok button on the error returns to the list page
            clickButton('button[data-testid="confirm-alert-error"]');
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('button[data-testid="confirm-alert-error"]').should('not.exist');
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
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the edit form presets the correct data', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('[data-testid="admin-alerts-form-title"] input').should('have.value', 'Example alert:');
            cy.get('[data-testid="admin-alerts-form-body"]').contains('This alert can be edited in mock.');
            dateHasValue('[data-testid="admin-alerts-form-start-date-0"] input', '2021-06-29T15:00');
            dateHasValue('[data-testid="admin-alerts-form-end-date-0"] input', '2031-07-02T18:30');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').should('be.checked');
            selectPriorityType('urgent');
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
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('[data-testid="admin-alerts-form-title"] input').should('have.value', 'Sample alert 2:');
            cy.get('[data-testid="admin-alerts-form-body"]').contains('Has mock data.');
            dateHasValue('[data-testid="admin-alerts-form-start-date-0"] input', '2021-06-06T00:45');
            dateHasValue('[data-testid="admin-alerts-form-end-date-0"] input', '2021-06-06T05:00');
            cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').should('not.be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-permanent"] input').should('not.be.checked');
            selectPriorityType('info');
            cy.get('[data-testid="admin-alerts-form-link-title"] input').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-link-url"] input').should('not.be.visible');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-homepage"] input').should('be.checked');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input').should('be.checked');

            // the editing user displays correctly
            cy.get('[data-testid="admin-alerts-form-created-by"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-updated-by"]').should('contain', 'Last Updated by: uqtest2');
        });
        it('has a working Edit form', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('be.disabled');
            cy.get('[data-testid="admin-alerts-form-title"]').type('Updated alert');
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('not.be.disabled');
            cy.get('[data-testid="admin-alerts-form-button-save"').click();
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-edit-save-succeeded"]').should('exist'));
            cy.get('[data-testid="dialogbox-alert-edit-save-succeeded"] h2').contains('The alert has been updated');
            // can't do much checking here that it saves properly
            cy.get('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        });
        it('changing a system enables the save button', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));

            // the editing user displays correctly
            cy.get('[data-testid="admin-alerts-form-created-by"]').should('contain', 'Created by: uqtest1');
            cy.get('[data-testid="admin-alerts-form-updated-by"]').should('contain', 'Last Updated by: uqtest2');

            cy.get('[data-testid="admin-alerts-form-button-save"]').should('be.disabled');
            cy.get('[data-testid="admin-alerts-form-checkbox-system-primo"] input')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="admin-alerts-form-button-save"]').should('not.be.disabled');
            cy.get('[data-testid="admin-alerts-form-button-save"').click();
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-edit-save-succeeded"]').should('exist'));
            cy.get('[data-testid="dialogbox-alert-edit-save-succeeded"] h2').contains('The alert has been updated');
            // can't do much checking here that it saves properly
            cy.get('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        });
        it('has a working Help button on the Edit page', () => {
            hasAWorkingHelpButton();
        });
        it('can show a preview of a change', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .should('have.value', 'Example alert:') // force retry until re-attached
                .clear()
                .type('Updated alert');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: visible; opacity: 1;');
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'Updated alert')
                .should('have.attr', 'prioritytype', 'urgent')
                .should(
                    'have.attr',
                    'alertmessage',
                    'This alert can be edited in mock.[UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
                );
            // user can toggle the Preview
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            // when the user edits a field the preview disappears and can be reshown
            cy.get('[data-testid="admin-alerts-form-title"]').type(' again');
            // preview is only hidden by css this time - this minimises jumping around of the screen
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: hidden; opacity: 0;');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]')
                .parent()
                .parent()
                .should('have.attr', 'style', 'padding-bottom: 1em; display: block; visibility: visible; opacity: 1;');
        });
        it('can show a preview of the original alert', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            clickButton('[data-testid="admin-alerts-form-button-preview"]', 'Preview'); // show preview
            cy.get('uq-alert[id="alert-preview"]')
                .should('exist')
                .should('have.attr', 'alerttitle', 'Example alert:')
                .should('have.attr', 'prioritytype', 'urgent')
                .should(
                    'have.attr',
                    'alertmessage',
                    'This alert can be edited in mock.[UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
                );
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
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Clone',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can clone an alert and return to list', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone alert');
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .focus()
                .clear();
            cy.get('[data-testid="admin-alerts-form-created-by"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-updated-by"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"] input').type('alert title 7');
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
            // click 'view alert list' button in dialog
            cy.get('[data-testid="cancel-alert-clone-save-succeeded"]').click();
            // the alert list reloads
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
        });
        it('can clone an alert and then clone again', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-checkbox-linkrequired"]').should('exist'));
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone alert');
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .focus()
                .clear();
            cy.get('[data-testid="admin-alerts-form-title"] input').type('alert title 10');
            // click "Add new"
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
            // click 'clone again' button in dialog
            cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff',
            );
            // click "Add new"
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-form-button-save"]').should('exist'));
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('The alert has been cloned');
        });
        it('has a working Help button on the Clone page', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-alerts-help-button"]').should('exist'));
            hasAWorkingHelpButton();
        });

        function clickPlusButton(buttonId) {
            cy.waitUntil(() =>
                cy.get('[data-testid="admin-alerts-form-another-date-button-' + buttonId + '"]').should('exist'),
            );
            clickSVGButton('[data-testid="admin-alerts-form-another-date-button-' + buttonId + '"]');
        }
        it('the "add a date set button" works', () => {
            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').click();

            cy.get('[data-testid="admin-alerts-form-start-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-1"]').click();

            cy.get('[data-testid="admin-alerts-form-start-date-2"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-2"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-1"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-2"]').should('exist');

            clickButton('button[data-testid="admin-alerts-form-button-save"]', 'Create');
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('3 alerts have been cloned');

            clickButton('[data-testid="confirm-alert-clone-save-succeeded"]', 'Clone again');

            cy.get('[data-testid="admin-alerts-form-start-date-0"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-0"] input').should('exist');
            clickPlusButton('0');

            cy.get('[data-testid="admin-alerts-form-start-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-end-date-1"] input').should('exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-0"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-another-date-button-1"]').should('exist');

            clickButton('button[data-testid="admin-alerts-form-button-save"]', 'Create');
            cy.waitUntil(() => cy.get('[data-testid="confirm-alert-clone-save-succeeded"]').should('exist'));
            cy.get('.MuiDialog-container').contains('2 alerts have been cloned'); // we dont display 3 again when this time we only saved 2
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

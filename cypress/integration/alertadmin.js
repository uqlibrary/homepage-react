describe('Alerts Admin Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Alert Admin List page', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays a list of alerts to the authorised user', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-list-current-list"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-list-current-list"] tbody')
                .children()
                .should('have.length', 1 + numRowsHiddenAsNoDatainfo);

            // this alert has all 3 chips
            cy.get('[data-testid="alert-list-urgent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist');
            cy.get('[data-testid="alert-list-urgent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').contains('Urgent');
            cy.get('[data-testid="alert-list-link-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist');
            cy.get('[data-testid="alert-list-link-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').contains('Link');
            cy.get('[data-testid="alert-list-permanent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').should('exist');
            cy.get('[data-testid="alert-list-permanent-chip-1db618c0-d897-11eb-a27e-df4e46db7245"]').contains(
                'Permanent',
            );

            cy.wait(500);
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody').scrollIntoView();
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
                .children()
                .should('have.length', 2 + numRowsHiddenAsNoDatainfo);

            // this alert has no chips
            cy.get('[data-testid="alert-list-urgent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should('not.exist');
            cy.get('[data-testid="alert-list-link-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should('not.exist');
            cy.get('[data-testid="alert-list-permanent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').should(
                'not.exist',
            );

            cy.get('[data-testid="admin-alerts-list-past-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-past-list"] tbody').scrollIntoView();
            cy.get('[data-testid="admin-alerts-list-past-list"] tbody ')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 81');
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('All alerts');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has a working Help button on the List page', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-help-button"]').click();
            cy.get('[data-testid="admin-alerts-help-example"]').should('be.visible');
        });

        it('has a working Add button on the List page', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-help-display-button"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-help-display-button"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add');
        });

        it('has a working Edit button on the List page', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('button[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]').should(
                'be.visible',
            );
            cy.get('button[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]').click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245',
            );

            // back to the list page
            cy.get('[data-testid="admin-alerts-form-button-cancel"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');

            // this alert doesnt exist in mock
            cy.get('button[data-testid="alert-list-item-edit-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').click();
            cy.get('button[data-testid="confirm-alert-error"]').should('exist');
            // the ok button on the error returns to the list page
            cy.get('button[data-testid="confirm-alert-error"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');

            // a alert form way down the list loads so that the form is in view
            cy.get('button[data-testid="alert-list-item-edit-dc64fde0-9969-11eb-8dc3-1d415ccc50ec"]').click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/alerts/edit/dc64fde0-9969-11eb-8dc3-1d415ccc50ec',
            );
            cy.isInViewport('[data-testid="StandardPage"]');
        });

        it('has alert dates formatted as expected', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
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

        it('the user can select an alert to delete', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            // select one alert and every thing looks right
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
            cy.get('[data-testid="headerRow-current"] span').should('not.exist');
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').check();
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgb(35, 119, 203)');
            cy.get('[data-testid="headerRow-current"] span span').contains('1 alert selected');
            cy.get('[data-testid="alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245"]').uncheck();
            cy.get('[data-testid="headerRow-current"] span').should('not.exist');

            // select two alerts and every thing looks right
            cy.get('[data-testid="alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').check();
            cy.get('[data-testid="alert-list-item-checkbox-232d6880-996a-11eb-8a79-e7fddae87baf"]').check();
            cy.get('[data-testid="headerRow-scheduled"] span span').contains('2 alerts selected');

            // back down to one alert selected and every thing looks right
            cy.get('[data-testid="alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]').uncheck();
            cy.get('[data-testid="headerRow-scheduled"] span span').contains('1 alert selected');

            // click the delete button and the delete dialog appears
            cy.get('[data-testid="alert-list-scheduled-delete-button"]').click();
            cy.get('[data-testid="cancel-alert-delete-confirm"]').should('exist');
            // close dialog
            cy.get('[data-testid="cancel-alert-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-alert-delete-confirm"]').should('not.exist');
        });

        it('the user can delete an alert', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
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
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
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
        it('sequential alerts do not fail', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
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
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
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
    });
    context('Alert Admin Add page', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
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
        it('can show a preview of the initial blank alert', () => {
            // this one is more about making sure nothing bad happens rather than checking it looks ok
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
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
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title');
            cy.get('[data-testid="admin-alerts-form-body"]').type('the body');
            cy.get('[data-testid="admin-alerts-form-checkbox-urgent"] input').check();
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
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
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
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
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('can save an alert (simple)', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-form-title"]').type('alert title 3');
            cy.get('[data-testid="admin-alerts-form-body"]').type('body 3');
            cy.get('[data-testid="admin-alerts-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('An alert has been added');
            // click 'add another alert' button in dialog
            cy.get('[data-testid="confirm-alert-add-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add?user=uqstaff');
            // the alert page reloads with a blank form
            cy.get('[data-testid="admin-alerts-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-alerts-form-body"] textarea').should('have.value', '');
        });
        it('can save an alert (more complex)', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
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
            // cy.get('[data-testid="admin-alerts-form-start-date"] input')
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
                .should('have.length', 2 + numRowsHiddenAsNoDatainfo);
            // then we click the add button and see an empty form
            cy.get('[data-testid="admin-alerts-help-display-button"]').click();
            cy.wait(500);
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts/add');
            cy.get('[data-testid="admin-alerts-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-alerts-form-body"] textarea').should('have.value', '');
            cy.get('[data-testid="confirm-alert-add-save-succeeded"]').should('not.exist');
        });
        it('the cancel button returns to the list page', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-form-button-cancel"]').click();
            cy.wait(50);
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
                .children()
                .should('have.length', 2 + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Add page', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-help-button"]').click();
            cy.get('[data-testid="admin-alerts-help-example"]').should('be.visible');
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

            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
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
        it('the footer paginator shows all links when "all" is selected', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get(
                '[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]',
            ).select('All');
            cy.get(
                '[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]',
            ).should('have.value', 81);
            cy.get('[data-testid="admin-alerts-list-past-list"] tbody ')
                .children()
                .should('have.length', 81 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-81 of 81');
        });
    });
    context('Alert Admin Edit page', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
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
        it('has a working Edit form', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.wait(100);
            cy.get('[data-testid="admin-alerts-form-title"]').type('Updated alert');
            cy.get('[data-testid="admin-alerts-form-button-save"').click();
            cy.wait(500);
            cy.get('[data-testid="dialogbox-alert-edit-save-succeeded"] h2').contains('The alert has been updated');
            // can't do much checking here that it saves properly
            cy.get('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/alerts');
        });
        it('has a working Help button on the Edit page', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-help-button"]').click();
            cy.get('[data-testid="admin-alerts-help-example"]').should('be.visible');
        });
        it('can show a preview of a change', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-title"] input')
                .focus()
                .clear();
            cy.get('[data-testid="admin-alerts-form-title"] input').type('Updated alert');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Alert.');
                    cy.get('[data-testid="alert-title"]').should('have.text', 'Updated alert');
                });
            // user can toggle the Preview
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
        it('can show a preview of the original alert', () => {
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.wait(50);
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Alert.');
                    cy.get('[data-testid="alert-title"]').contains('Example alert:');
                    cy.get('[data-testid="alert-message"]').contains('This alert can be edited in mock.');
                    cy.get('[data-testid="alert-alert-preview-action-button"]').contains(
                        'UQ community COVID-19 advice',
                    );
                    // this version of reusable isnt quite live yet
                    // cy.get('[data-testid="alert-alert-preview-action-button"]').should(
                    //     'have.attr',
                    //     'href',
                    //     'https://about.uq.edu.au/coronavirus',
                    // );
                });
            // user can toggle the Preview
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-form-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]').should('exist');
        });
    });
});

import moment from 'moment';

describe('Spotlights Admin Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Spotlights Admin public access', () => {
        it('the list page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('the add page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });
    context('Spotlights Admin unauthorised access ', () => {
        it('the list page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('the add page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });
    context('Spotlights list page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('displays a list of spotlights to the authorised user', () => {
            cy.get('[data-testid="spotlight-list-current-and-scheduled"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="spotlight-list-current-and-scheduled"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="headerRow-count-current"]').contains('1 spotlight');

            // only the scheduled spotlight has a 'scheduled' icon
            // not currently visible - move to test to after toggle is turned on
            // cy.get('svg[data-testid="spotlight-scheduled-icon-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]')
            // .should('exist');
            // current alert exists, but it does not have a 'scheduled' icon
            cy.get('tr[data-testid="spotlight-list-row-b286d890-76f9-11eb-9471-41351ee40e02"]').should('exist');
            cy.get('svg[data-testid="spotlight-scheduled-icon-b286d890-76f9-11eb-9471-41351ee40e02"]').should(
                'not.exist',
            );

            // cy.wait(500);
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('be.visible');
            // cy.get('[data-testid="headerRow-count-past"]').contains('78 spotlights');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('not.exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains('1-5 of 330');
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('All spotlights');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the footer paginator shows all links when "all" is selected', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains('1-5 of 330');
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).select('All');
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).should('have.value', 330);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', 330 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains('1-330 of 330');

            // reload the page and the cookie being set means it is still on 'all'
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains('1-330 of 330');
        });
    });
    context('Spotlight Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Create a new spotlight');
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('an url must be valid', () => {
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-form-title"] input').type('Read more');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://x.c');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('have.class', 'Mui-error');
            // one more character
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('o');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('not.have.class', 'Mui-error');
        });
        it('entering the fields works', () => {
            // form starts with submit button disabled
            cy.get('[data-testid="admin-spotlights-form-button-save"').should('be.disabled');
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-title"] input').should('have.value', 'spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', 'http://example.com');

            // add file upload test here

            // the form is currently valid so the create button should enable
            cy.get('[data-testid="admin-spotlights-form-button-save"').should('not.be.disabled');
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').check();
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');

            // end date starts with the correct default
            cy.get('[data-testid="admin-spotlights-form-end-date"] input').should($input => {
                const defaultDate = $input.val();
                expect(defaultDate).to.include(moment().format('DD/MM/YYYY'));
            });
            // so does start date
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should($input => {
                const defaultDate = $input.val();
                expect(defaultDate).to.include(moment().format('DD/MM/YYYY'));
            });
            cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
            // advance the start date one month
            cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
                .as('next-month-button')
                .click();
            // and pick the first of the month
            cy.get('.MuiPickersCalendar-week button:not(.MuiPickersDay-hidden')
                .first()
                .contains('1')
                .click();
            // the time dialog loads, but lets just ok out
            cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                .contains('OK')
                .click();
            // and date is set to next month
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should($input => {
                const defaultDate = $input.val();
                const nextmonth = moment()
                    .add(1, 'M')
                    .startOf('month');
                expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
            });
            // and the end date field now has an error, so the submit button is disabled
            cy.get('[data-testid="admin-spotlights-form-button-save"').should('be.disabled');
            // and the end date has an error message
            cy.get('[data-testid="admin-spotlights-form-end-date"] p.Mui-error')
                .should('exist')
                .and('contain', 'Date should not be before minimal date');
            // open the end date so we can fix the date
            cy.get('[data-testid="admin-spotlights-form-end-date"] button').click();
            // advance the end date another month
            cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
                .as('next-month-button')
                .click();
            // and pick the first of the month
            cy.get('.MuiPickersCalendar-week button:not(.MuiPickersDay-hidden')
                .first()
                .contains('1')
                .click();
            // the time dialog loads, but lets just ok out
            cy.get('.MuiDialogActions-spacing button:nth-child(2)')
                .contains('OK')
                .click();
            // and date is set to next month
            cy.get('[data-testid="admin-spotlights-form-end-date"] input').should($input => {
                const defaultDate = $input.val();
                const nextmonth = moment()
                    .add(2, 'M')
                    .startOf('month');
                expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
            });
            // all is good so the create button enables
            cy.get('[data-testid="admin-spotlights-form-button-save"').should('not.be.disabled');
        });
        it('can save a spotlight (simple)', () => {
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-button-save"]').click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('A spotlight has been added');
            // click 'add another alert' button in dialog
            cy.get('[data-testid="confirm-spotlight-add-save-succeeded"]').click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add?user=uqstaff');
            // the alert page reloads with a blank form
            cy.get('[data-testid="admin-spotlights-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', '');
        });
        it('the cancel button returns to the list page', () => {
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]').click();
            cy.wait(50);
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            cy.get('[data-testid="spotlight-list-current-and-scheduled"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current-and-scheduled"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Add page', () => {
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-help-button"]').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');
            cy.get('button:contains("Close")').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
        });
        it('save button is disabled unless the form is valid', () => {
            function saveButtonDisabled() {
                cy.get('[data-testid="admin-spotlights-form-button-save"]').should('be.disabled');
            }

            function saveButtonNOTDisabled() {
                cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
            }

            saveButtonDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"]').type('alert title 5');
            saveButtonDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
            saveButtonDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');
            // saveButtonDisabled();

            // upload a file
            saveButtonNOTDisabled();
        });
    });
});

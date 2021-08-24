import moment from 'moment';

const numberCurrentPublishedSpotlights = 3;
const totalCountPastRecords = 34;

function getFooterLabel(totalCountRecordsAvailable, numberDisplayedOnPage = 5) {
    // eg '1-5 of 34'
    return `1-${numberDisplayedOnPage} of ${totalCountRecordsAvailable}`;
}

function dragzoneIsReadyForDrag() {
    cy.get('[data-testid="dropzone-dragarea"]').should('exist');
    cy.get('[data-testid="dropzone-preview"]').should('not.exist');
}

function dragFileToDropzone(uploadableFile) {
    dragzoneIsReadyForDrag();
    cy.fixture(uploadableFile, 'base64').then(content => {
        cy.get('[data-testid="spotlights-form-upload-dropzone"]').uploadFile(content, uploadableFile);
    });
    cy.get('[data-testid="dropzone-dragarea"]').should('not.exist');
    cy.get('[data-testid="dropzone-preview"]').should('exist');
}

function saveButtonisDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('be.disabled');
}

function saveButtonNOTDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
}

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
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="headerRow-count-current"]').contains('1 spotlight');

            // only the scheduled spotlight has a 'scheduled' icon
            // not currently visible - move to test to after toggle is turned on
            // cy.get('svg[data-testid="spotlight-scheduled-icon-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]')
            // .should('exist');
            // current alert exists, but it does not have a 'scheduled' icon
            cy.get('tr[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should('exist');
            cy.get('svg[data-testid="spotlight-scheduled-icon-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
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
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
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
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).select('All');
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).should('have.value', totalCountPastRecords);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', totalCountPastRecords + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords, totalCountPastRecords),
            );

            // reload the page and the cookie being set means it is still on 'all'
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords, totalCountPastRecords),
            );
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
            cy.log(
                'This test fails locally occasionally because we had to add the aria-label to the buttons manually - try it again',
            );
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

        it('Entering the fields works', () => {
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-title"] input').should('have.value', 'spotlight title 3');

            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', 'http://example.com');

            dragFileToDropzone('test.jpg');

            saveButtonNOTDisabled();

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
            saveButtonisDisabled();
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
            saveButtonNOTDisabled();

            // can clear the upload with the Trashcan button
            cy.get('[data-testid="dropzone-preview"] button')
                .should('exist')
                .click();
            dragzoneIsReadyForDrag();
            saveButtonisDisabled();
        });

        it('can save a spotlight', () => {
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://example.com');
            dragFileToDropzone('test.jpg');
            cy.get('[data-testid="admin-spotlights-form-button-save"]')
                .should('not.be.disabled')
                .click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('A spotlight has been added');
            // click 'add another alert' button in dialog
            cy.get('[data-testid="confirm-spotlight-add-save-succeeded"]').click();
            // the alert page reloads with a blank form
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.get('[data-testid="admin-spotlights-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', '');
            dragzoneIsReadyForDrag();
        });
        it('the cancel button returns to the list page', () => {
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]').click();
            cy.wait(50);
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
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
            // fill out the form from the bottom up to double-check the "button enables properly"
            saveButtonisDisabled();

            dragFileToDropzone('test.jpg');
            saveButtonisDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"]').type('alert title 5');
            saveButtonisDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
            saveButtonisDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');
            saveButtonNOTDisabled();
        });
    });
});

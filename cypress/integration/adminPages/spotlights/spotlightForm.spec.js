import moment from 'moment';
import { default as locale } from '../../../../src/modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import {
    assertImageOKIsPresent,
    assertImageWarningIsPresent,
    dragFileToDropzone,
    dragzoneContainsAnImage,
    dragzoneIsReadyForDrag,
    FILTER_STORAGE_NAME,
    hasAWorkingHelpButton,
    numberCurrentPublishedSpotlights,
    placeholderImage,
    removeImageFromDragzone,
    saveButtonisDisabled,
    saveButtonNOTDisabled,
} from '../../../support/spotlights';
import { clickButton, waitUntilSpotlightListPageHasLoaded } from '../../../support/helpers';

function setDateToNow() {
    cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
    cy.get('.MuiPickersModal-withAdditionalAction button:first-child span.MuiButton-label')
        .should('be.visible')
        .contains(locale.form.labels.datePopupNowButton)
        .click();
    cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
        .contains('OK')
        .click();
    cy.get('[data-testid="admin-spotlights-form-start-date"]')
        .parent()
        .should('not.contain', 'This date is in the past.');
}

describe('Spotlights Admin Form Pages', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    const numRowsHiddenAsNoDatainfo = 1;
    context('Spotlight Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('add page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2')
                .should('be.visible')
                .contains('Create a new spotlight');
            cy.waitUntil(() => cy.get('[data-testid="admin-spotlights-form-button-cancel"]').should('exist'));
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('an url must be valid', () => {
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('http://x.c');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('have.class', 'Mui-error');
            // one more character
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('o');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('not.have.class', 'Mui-error');
        });

        it('Entering the fields on the add form works', () => {
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should('have.value', 'spotlight title 3');

            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight image alt 3');
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                'have.value',
                'spotlight image alt 3',
            );

            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').should(
                'have.value',
                'http://example.com',
            );

            dragFileToDropzone('spotlight-too-large.jpg');
            assertImageWarningIsPresent('dropzone-dimension-warning');
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').check();
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');

            // cant test end or start date initial value here - would just be reimplementing the algorithm.
            // Tested in Jest
            cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
            // advance the start date two months forward
            // (picking a date that far forward lets us test the error on the end date)
            cy.get('.MuiPickersCalendarHeader-switchHeader button:nth-of-type(2)')
                .as('next-month-button')
                .click();
            cy.get('.MuiPickersCalendarHeader-switchHeader p').then(monthLabel => {
                // towards the end of the month, the default start date is already into _next_ month,
                // only click a second time if we need to, to get Month 2
                const nextmonth = moment()
                    .add(1, 'M')
                    .startOf('month');
                let month;
                if (monthLabel.length > 1) {
                    month = monthLabel[0].textContent || monthLabel[0].innerText || '';
                } else {
                    month = monthLabel.val();
                }
                if (month === nextmonth.format('MMMM YYYY')) {
                    cy.get('@next-month-button').click(); // and on to the next month
                } else {
                    cy.log('2 months already', nextmonth);
                }
            });

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
                    .add(2, 'M')
                    .startOf('month');
                expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
            });
            cy.get('[data-testid="admin-spotlights-form-start-date"]')
                .parent()
                .should('not.contain', 'This date is in the past.');
            // and the end date field now has an error, so the submit button is disabled
            saveButtonisDisabled();
            // and the end date has an error message
            cy.get('[data-testid="admin-spotlights-form-end-date"] p.Mui-error')
                .should('exist')
                .and('contain', 'Should not be before Date published');
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
                    .add(3, 'M')
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

            cy.get('[data-testid="admin-spotlights-form-admin-note"]').type('spotlight admin note 3');
            cy.get('[data-testid="admin-spotlights-form-admin-note"] textarea').should(
                'have.value',
                'spotlight admin note 3',
            );
        });

        it('can save a spotlight on the add page', () => {
            cy.get('[data-testid="admin-spotlights-form-admin-note"]').type('spotlight admin note 4');
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 4');
            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight image alt 4');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('http://example.com');
            dragFileToDropzone('spotlight-too-large.jpg');
            assertImageWarningIsPresent('dropzone-dimension-warning');
            clickButton('[data-testid="admin-spotlights-form-button-save"]', 'Create');

            cy.waitUntil(() => cy.get('[data-testid="confirm-spotlight-add-save-succeeded"]').should('exist'));
            cy.get('body').contains('A spotlight has been added');
            // click 'add another spotlight' button in dialog
            clickButton('[data-testid="confirm-spotlight-add-save-succeeded"]', 'Add another spotlight');
            // the spotlight page reloads with a blank form
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.get('[data-testid="admin-spotlights-form-admin-note"]').should('have.value', '');
            cy.get('[data-testid="admin-spotlights-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').should('have.value', '');
            dragzoneIsReadyForDrag();
        });
        it('the cancel button on the add page returns to the list page', () => {
            clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            waitUntilSpotlightListPageHasLoaded();
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Add page', () => {
            hasAWorkingHelpButton();
        });
        it('save button on the add page is disabled unless the form is valid', () => {
            // fill out the form from the bottom up to double-check the "button enables properly"
            saveButtonisDisabled();

            dragFileToDropzone('spotlight-just-right.png');
            assertImageOKIsPresent('dropzone-dimension-warning');
            saveButtonisDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 5');
            saveButtonisDisabled();

            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight img alt 5');
            saveButtonisDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
            saveButtonisDisabled();

            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');

            saveButtonNOTDisabled(); // OK!!!!

            // as we clear fields the form is not valid
            removeImageFromDragzone();
            saveButtonisDisabled();
            dragFileToDropzone('spotlight-just-right.png');
            assertImageOKIsPresent('dropzone-dimension-warning');
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"]')
                .type('y')
                .clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"]').type('xxx');
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-tooltip"]').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('xxx');
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-link-url"]').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
            saveButtonNOTDisabled();
        });
        it('characters remaining report displays correctly', () => {
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight t');
            cy.get('[data-testid="admin-spotlights-form-title"]')
                .next()
                .should('contain', '89 characters left');
            cy.get('[data-testid="admin-spotlights-form-title"]').type('itle 5');
            cy.get('[data-testid="admin-spotlights-form-title"]')
                .next()
                .should('contain', '83 characters left');

            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight im');
            cy.get('[data-testid="admin-spotlights-form-tooltip"]')
                .next()
                .should('contain', '243 characters left');
            cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('g alt 5');
            cy.get('[data-testid="admin-spotlights-form-tooltip"]')
                .next()
                .should('contain', '236 characters left');

            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
            cy.get('[data-testid="admin-spotlights-form-link-url"]')
                .next()
                .should('contain', '242 characters left');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');
            cy.get('[data-testid="admin-spotlights-form-link-url"]')
                .next()
                .should('contain', '232 characters left');
        });
        it('add form shows the reorderable thumbs block', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.viewport(1300, 1000);

            setDateToNow();

            // we cant current do any interactive testing, so a basic check is the best we can do
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .should('exist')
                .scrollIntoView();
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .children()
                .should('have.length', 5);
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                .should('exist')
                .and('have.css', 'border-left-style', 'solid'); // proxy for "the span is highlighted"
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child span')
                .should('exist')
                .should('contain', '5');

            // the grey place holder shows as the last img
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .and('have.attr', 'src', placeholderImage);

            // drag in a new image and it is reflected in the 'reorderable thumbs'
            dragFileToDropzone('spotlight-just-right.png');
            assertImageOKIsPresent('dropzone-dimension-warning');
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                .invoke('attr', 'src')
                .then(src => {
                    expect(src).to.contains('blob:http://localhost:2020');
                });
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .invoke('attr', 'src')
                .then(src => {
                    // this is as close as we can get to the actual image
                    expect(src).to.contains('blob:http://localhost:2020');
                });

            removeImageFromDragzone();
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .and('have.attr', 'src', placeholderImage);
            dragFileToDropzone('spotlight-too-large.jpg');
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .invoke('attr', 'src')
                .then(src => {
                    // this is as close as we can get to the actual image
                    expect(src).to.contains('blob:http://localhost:2020');
                });
        });
    });
    context('Spotlight Admin Edit page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('edit page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.wait(1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Edit spotlight');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can make changes to spotlight fields on the edit form', () => {
            cy.waitUntil(() => cy.get('[data-testid="dropzone-dimension-warning"]').should('exist'));
            cy.get('[data-testid="admin-spotlights-form-start-date"]')
                .parent()
                .should('contain', 'This date is in the past.');
            cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                .clear()
                .type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
                .clear()
                .type('spotlight image alt 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child')
                .clear()
                .type('http://example.com');

            setDateToNow();

            cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
        });
        it('the edit form can save a spotlight with a new image', () => {
            dragzoneContainsAnImage();
            removeImageFromDragzone();
            saveButtonisDisabled();

            dragzoneIsReadyForDrag();
            dragFileToDropzone('spotlight-too-large.jpg');
            dragzoneContainsAnImage();
            saveButtonNOTDisabled();

            assertImageWarningIsPresent('dropzone-dimension-warning');

            clickButton('[data-testid="admin-spotlights-form-button-save"]', 'Save');
            cy.waitUntil(() => cy.get('[data-testid="confirm-spotlight-edit-save-succeeded"]').should('exist'));
            cy.get('body').contains('The spotlight has been updated');
            clickButton('[data-testid="confirm-spotlight-edit-save-succeeded"]', 'View spotlight list');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights'); // the list page reloads
        });
        it('the edit form can save a spotlight with the old image', () => {
            clickButton('[data-testid="admin-spotlights-form-button-save"]', 'Save');
            cy.waitUntil(() => cy.get('[data-testid="confirm-spotlight-edit-save-succeeded"]').should('exist'));
            cy.get('body').contains('The spotlight has been updated');
            clickButton('[data-testid="confirm-spotlight-edit-save-succeeded"]', 'View spotlight list');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights'); // the list page reloads
        });
        it('the cancel button on the edit page returns to the list page', () => {
            clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            waitUntilSpotlightListPageHasLoaded();
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('the edit form presets the correct data', () => {
            cy.waitUntil(() => cy.get('[data-testid="dropzone-dimension-warning"]').should('exist'));
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                'have.value',
                'Can be deleted and edited',
            );
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                'have.value',
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            );
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should(
                'have.value',
                '15/03/2021 00:02 am',
            );
            cy.get('[data-testid="admin-spotlights-form-start-date"]')
                .next()
                .should('contain', 'This date is in the past.');
            cy.get('[data-testid="admin-spotlights-form-end-date"] input').should('have.value', '21/03/2099 23:59 pm');
            cy.get('[data-testid="spotlights-form-upload-dropzone"] img').should(
                'have.attr',
                'src',
                'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            );
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');

            hasAWorkingHelpButton();
        });
        it('Edit save button is disabled when the form is invalid', () => {
            // this is an edit page, so the page loads valid
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"] textarea').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').type('spotlight title 5');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should('have.value', 'spotlight title 5');

            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').type('spotlight img alt 5');
            saveButtonNOTDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('http://e');
            saveButtonisDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('xample.com');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').should(
                'have.value',
                'http://example.com',
            );
        });
        it('can delete the current spotlight image on the edit form and upload a different image', () => {
            dragzoneContainsAnImage();
            removeImageFromDragzone();
            saveButtonisDisabled();

            dragzoneIsReadyForDrag();
            dragFileToDropzone('spotlight-just-right.png');
            dragzoneContainsAnImage();
            saveButtonNOTDisabled();

            assertImageOKIsPresent('dropzone-dimension-warning');
        });
        it('edit form shows the reorderable thumbs block', () => {
            cy.visit('http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff');
            cy.viewport(1300, 1000);
            dragzoneContainsAnImage();

            // we cant current do any interactive testing, so a basic check is the best we can do
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .should('exist')
                .scrollIntoView();
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .children()
                .should('have.length', 4);
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:first-child img').should(
                'have.css', // proxy for "the img is highlighted"
                'border-left-style',
                'solid',
            );

            // the thumb for the current spotlight changes correctly as we load and unload the dragzone
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                .should('exist')
                .and(
                    'have.attr',
                    'src',
                    'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
                );
            removeImageFromDragzone();
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                .should('exist')
                .and('have.attr', 'src', placeholderImage);
            dragFileToDropzone('spotlight-too-large.jpg');
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                .should('exist')
                .invoke('attr', 'src')
                .then(src => {
                    // this is as close as we can get to the actual image
                    expect(src).to.contains('blob:http://localhost:2020');
                });
        });
    });
    context('Spotlight Admin Clone page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('clone page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Clone spotlight');
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Clone',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the cancel button on the clone page returns to the list page', () => {
            clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            waitUntilSpotlightListPageHasLoaded();
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Clone page', () => {
            hasAWorkingHelpButton();
        });
        it('the clone form presets the correct data', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-spotlights-form-button-cancel"]').should('exist'));
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                'have.value',
                'Can be deleted and edited',
            );
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                'have.value',
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            );
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').should(
                'have.value',
                'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            );
            cy.get('[data-testid="spotlights-form-upload-dropzone"] img')
                .should('exist')
                .and(
                    'have.attr',
                    'src',
                    'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
                );
        });
        it('Save button is disabled when the clone form is invalid', () => {
            // this is an clone page, so the page loads valid
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"] textarea').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').type('spotlight title 5');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should('have.value', 'spotlight title 5');

            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').type('spotlight img alt 5');
            saveButtonNOTDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('http://e');
            saveButtonisDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').type('xample.com');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child').should(
                'have.value',
                'http://example.com',
            );
        });
        it('can make changes to spotlight fields on the clone form', () => {
            cy.waitUntil(() => cy.get('[data-testid="admin-spotlights-form-button-cancel"]').should('exist'));
            cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                .clear()
                .type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
                .clear()
                .type('spotlight image alt 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] textarea:first-child')
                .clear()
                .type('http://example.com');

            setDateToNow();

            cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
        });
        it('the save on the clone page runs correctly and can reclone', () => {
            cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                .clear()
                .type('a cloned spotlight');
            clickButton('[data-testid="admin-spotlights-form-button-save"]', 'Create');
            cy.waitUntil(() => cy.get('[data-testid="confirm-spotlight-clone-save-succeeded"]').should('exist'));
            cy.get('body').contains('The spotlight has been cloned');
            // click 'clone again' button in dialog
            clickButton('[data-testid="confirm-spotlight-clone-save-succeeded"]', 'Clone again');
            // the clone page reloads
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
            );
            // dialog has closed
            cy.get('[data-testid="dialogbox-spotlight-clone-save-succeeded"]').should('not.exist');
            // the original clone reloads correctly
            cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                'have.value',
                'Can be deleted and edited',
            );
        });
        it('the save on the clone form runs correctly and can return to list', () => {
            clickButton('[data-testid="admin-spotlights-form-button-save"]', 'Create');
            cy.waitUntil(() => cy.get('[data-testid="confirm-spotlight-clone-save-succeeded"]').should('exist'));
            cy.get('body').contains('The spotlight has been cloned');
            // click ''view list'' button in dialog
            clickButton('[data-testid="cancel-spotlight-clone-save-succeeded"]', 'View spotlight list');
            // the list page reloads
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
        });
        it('can delete the current spotlight image on the clone form and upload a different image', () => {
            dragzoneContainsAnImage();
            removeImageFromDragzone();
            dragzoneIsReadyForDrag();
            dragFileToDropzone('spotlight-just-right.png');
            dragzoneContainsAnImage();
            assertImageOKIsPresent('dropzone-dimension-warning');
        });
        it('clone form shows the reorderable thumbs block', () => {
            cy.visit('http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff');
            cy.viewport(1300, 1000);
            dragzoneContainsAnImage();

            // we cant current do any interactive testing, so a basic check is the best we can do
            setDateToNow(); // displays the reorderable thumbs
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .should('exist')
                .scrollIntoView();
            cy.get('[data-testid="spotlights-thumbs-reorder"]')
                .children()
                .should('have.length', 5);
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                .should('exist')
                .and('have.css', 'border-left-style', 'solid'); // proxy for "the img is highlighted"
            cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child span')
                .should('exist')
                .should('contain', '5');

            // the thumb for the current spotlight changes correctly as we load and unload the dragzone
            removeImageFromDragzone();
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .and('have.attr', 'src', placeholderImage);
            dragFileToDropzone('spotlight-too-large.jpg');
            cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                .should('exist')
                .invoke('attr', 'src')
                .then(src => {
                    // this is as close as we can get to the actual image
                    expect(src).to.contains('blob:http://localhost:2020');
                });
        });
    });
});

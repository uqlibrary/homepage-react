import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Report - Inspections by Licenced User', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/report/inspectionsbylicenceduser?user=uqtesttag');
    });
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const getFieldValue = (dataField, rowIndex, colIndex) =>
        cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    it('page is accessible and renders base', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqtest1'));

        // Note this a11y check ignores the date label elements. Without these exclusions the label contrast
        // a11y error would appear despite the colour of the label being the same as the Name field, which
        // doesnt throw an error.
        cy.checkA11y(
            {
                include: '[data-testid="StandardPage"]',
                exclude: ['[role=grid]', '#user_inspections-tagged-start-label', '#user_inspections-tagged-end-label'],
            },
            {
                reportName: 'Test and Tag Manage Inspection devices',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
    });
    it('Inspector selection works as intended', () => {
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqtest1'));
        cy.data('user_inspections-user-name').click();
        // Select user with no records.
        cy.data('user_inspections-user-name-option-2').click();
        cy.get('body').click();
        // Check the value of the dropdown.
        cy.data('user_inspections-user-name-select').should('contain', 'Third Testing user');
        // Select a second user.
        cy.wait(1000);
        cy.data('user_inspections-user-name').click();
        cy.data('user_inspections-user-name-option-1').click();
        cy.get('body').click();
        cy.data('user_inspections-user-name-select')
            .should('contain', 'Second Testing user')
            .should('contain', 'Third Testing user');
        cy.wait(1000);
        // Select third user
        cy.data('user_inspections-user-name-select').click();
        cy.data('user_inspections-user-name-option-0').click();
        cy.get('body').click();
        cy.data('user_inspections-user-name-select')
            .should('contain', 'JTest User')
            .should('contain', 'Second Testing user')
            .should('contain', '(and 1 more)');
    });
    it('Date selectors work as intended', () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = zeroPad(new Date().getMonth() + 1, 2);
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.report.inspectionsByLicencedUser.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('user_uid', 0, 0).should('contain', 'uqtest1'));
        // Add a start date
        cy.get('[data-testid="user_inspections-tagged-start"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('11')
            .click();
        cy.get('body').click();
        // Should require an end date here
        cy.get('#user_inspections-tagged-end-helper-text').should('contain', 'An end date is required');
        // Add an end date
        cy.data('user_inspections-tagged-start-input').should('have.value', `${currentYear}-${currentMonth}-11`);
        cy.get('[data-testid="user_inspections-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('12')
            .click();
        cy.get('body').click();
        cy.data('user_inspections-tagged-end-input').should('have.value', `${currentYear}-${currentMonth}-12`);
        // Set up an incorrect date for the end.
        cy.get('[data-testid="user_inspections-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('10')
            .click();
        cy.get('body').click();
        cy.get('#user_inspections-tagged-end-helper-text').should('contain', 'End date must be after start date');
        cy.get('#user_inspections-tagged-start-helper-text').should('contain', 'Start date must be before end date');

        // Now clear the inspection start date, showing error on end date.
        cy.data('user_inspections-tagged-start-input').clear();
        cy.get('body').click();
        cy.get('#user_inspections-tagged-start-helper-text').should('contain', 'A start date is required');
        // Clear the end date.
        cy.data('user_inspections-tagged-end-input').clear();
        cy.get('body').click();
        cy.data('user_inspections-tagged-end-input').should('not.have.value', `${currentYear}-${currentMonth}-12`);
        cy.data('user_inspections-tagged-start-input').should('not.have.value', `${currentYear}-${currentMonth}-12`);
    });
});

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
        // cy.checkA11y('[data-testid="StandardPage"]', {
        //     reportName: 'Test and Tag InspectionsByLicencedUsers Report',
        //     scopeName: 'Content',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
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
        cy.data('user_inspections-user-name-option-3').click();
        cy.get('body').click();
        // Check the value of the dropdown.
        cy.get('#user_inspections-user-name').should('contain', 'A Test User');
        // Select a second user.
        cy.wait(1000);
        cy.data('user_inspections-user-name').click();
        cy.data('user_inspections-user-name-option-2').click();
        cy.get('body').click();
        cy.get('#user_inspections-user-name')
            .should('contain', 'JTest user')
            .should('contain', 'A Test User');
        cy.wait(1000);
        // Select third user
        cy.data('user_inspections-user-name').click();
        cy.data('user_inspections-user-name-option-5').click();
        cy.get('body').click();
        cy.get('#user_inspections-user-name')
            .should('contain', 'JTest user')
            .should('contain', 'SecondTesting user')
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
        cy.get('[data-testid="user_inspections-tagged-start"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('10')
            .click();
        cy.get('body').click();
        cy.data('user_inspections-tagged-start-input').should('have.value', `${currentYear}-${currentMonth}-10`);
        cy.get('[data-testid="user_inspections-tagged-end"] button').click();
        cy.get('.MuiPickersCalendar-week')
            .contains('12')
            .click();
        cy.get('body').click();
        cy.data('user_inspections-tagged-end-input').should('have.value', `${currentYear}-${currentMonth}-12`);
    });
});

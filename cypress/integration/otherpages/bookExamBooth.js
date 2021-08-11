import locale from '../../../src/modules/Pages/BookExamBooth/bookExamBooth.locale';
import moment from 'moment';

context('ACCESSIBILITY', () => {
    it('Book Exam Booth', () => {
        cy.visit('/book-exam-booth');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Book Exam Booth');

        cy.log('Question');
        cy.checkA11y('[data-testid="standard-card-booking-options"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'As loaded',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('No option');
        cy.get('[data-testid="display-decider-option-no"]').click();
        cy.get('[data-testid="no-booking-necessary"]').should('exist');
        cy.checkA11y('[data-testid="no-booking-necessary"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'No option',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.log('Yes option');
        cy.get('[data-testid="display-decider-option-yes"]').click();
        cy.get('[data-testid="booking-details"]').should('exist');
        cy.checkA11y('[data-testid="booking-details"]', {
            reportName: 'Book Exam Booth',
            scopeName: 'Yes option',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

context('Book Exam Booth page', () => {
    beforeEach(() => {
        cy.visit('/book-exam-booth');
    });

    it('should show initial view', () => {
        cy.get('[data-testid="StandardPage-title"]').contains(locale.pageTitle);
    });

    it('should show message on selecting "am not sitting a ProctorU exam"', () => {
        cy.get('[data-testid="display-decider-option-no"]').click();
        cy.get('[data-testid="no-booking-necessary"]').should('exist');
    });

    it('should display form for booking details on selecting "am sitting a ProctorU exam"', () => {
        cy.get('[data-testid="display-decider-option-yes"]').click();
        cy.get('[data-testid="booking-details"]')
            .should('exist')
            .should('contain', locale.examType.label)
            .should('contain', locale.sessionLength.label)
            .should('contain', locale.startDate.label)
            .should('contain', locale.startTimeHours.label);
    });

    it('should redirect to expected url on submit without changing values', () => {
        cy.intercept(/uqbookit/, 'done'); // Stub to block URL
        cy.get('[data-testid="display-decider-option-yes"]').click();
        cy.get('[data-testid="booth-search-submit-button"]').click();

        const selectedDate = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD');

        cy.hash().should(hash => {
            expect(hash)
                .contains('#/app/booking-types/f30fe4d2-bb58-4426-9c38-843c40b2cd3c')
                .contains(`firstDay=${selectedDate}`)
                .contains('fromTime=07%3A45')
                .contains('toTime=10%3A15');
        });
    });

    it('should redirect to expected url on submit with updated values', () => {
        cy.intercept(/uqbookit/, 'done'); // Stub to block URL
        cy.get('[data-testid="display-decider-option-yes"]').click();

        // Opt to use UQ computer
        cy.get('[data-testid="exam-type-option-byod"]').click();

        // Choose 90 minute session length
        cy.get('[data-testid="session-length-select"]').click();
        cy.get('[data-testid="session-length-option-90"]').click();

        // Choose a custom date
        const bookingDate = moment()
            .add(1, 'month')
            .date(10);
        cy.get('[data-testid="start-date"] input')
            .as('date-input')
            .should($input => {
                const defaultDate = $input.val();
                const yesterday = moment().subtract(1, 'day');
                expect(defaultDate).to.equal(yesterday.format('YYYY-MM-DD'));
            })
            .click();
        cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
            .as('next-month-button')
            .click();
        if (moment().date() === 1) {
            // The field defaults to the previous day, which can be in the previous month.
            cy.get('@next-month-button').click();
        }
        cy.get('[role="dialog"] .MuiPickersBasePicker-pickerView button')
            .contains('10')
            .click();
        cy.get('[role="dialog"] button')
            .contains('OK')
            .click();
        cy.get('@date-input')
            .invoke('val')
            .then(text => {
                expect(text).to.equal(bookingDate.format('YYYY-MM-DD'));
            });

        // Choose a custom time
        cy.get('[data-testid="start-time-hours"]').click();
        cy.get('[data-testid="start-time-hours-option-10"]').click();
        cy.get('[data-testid="start-time-minutes"]').click();
        cy.get('[data-testid="start-time-minutes-option-30"]').click();

        cy.get('[data-testid="booth-search-submit-button"]').click();

        cy.hash().should(hash => {
            expect(hash)
                .contains('#/app/booking-types/ae12d42e-faae-4553-8c6a-be2fcddb4b26')
                .contains(`firstDay=${bookingDate.format('YYYY-MM-DD')}`)
                .contains('fromTime=10%3A00')
                .contains('toTime=13%3A30');
        });
    });
});

import locale from '../../src/modules/Pages/BookExamBooth/bookExamBooth.locale';
import moment from 'moment';

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

    it('should redirect to expected url on submit without changing values', () => {
        cy.intercept(/uqbookit/, 'done'); // Stub to block URL
        cy.get('[data-testid="display-decider-option-yes"]').click();

        // Opt to use UQ computer
        cy.get('[data-testid="exam-type-option-byod"]').click();

        // Choose 90 minute session length
        cy.get('[data-testid="session-length-select"]').click();
        cy.get('[data-testid="session-length-option-90"]').click();

        // Choose a custom date
        const currentDateTime = moment();
        const selectedDateTime = moment()
            .add(1, 'year')
            .date(10);
        cy.get('[data-testid="start-date"] input').click();
        cy.get('[role="dialog"] button')
            .contains(currentDateTime.year())
            .click();
        cy.get('[role="dialog"]')
            .contains(selectedDateTime.year())
            .click();
        cy.get('[role="dialog"]')
            .contains('10')
            .click();
        cy.get('[role="dialog"] button')
            .contains('OK')
            .click();

        // Choose a custom time
        cy.get('[data-testid="start-time-hours"]').click();
        cy.get('[data-testid="start-time-hours-option-10"]').click();
        cy.get('[data-testid="start-time-minutes"]').click();
        cy.get('[data-testid="start-time-minutes-option-30"]').click();

        cy.get('[data-testid="booth-search-submit-button"]').click();

        cy.hash().should(hash => {
            expect(hash)
                .contains('#/app/booking-types/ae12d42e-faae-4553-8c6a-be2fcddb4b26')
                .contains(`firstDay=${selectedDateTime.format('YYYY-MM-DD')}`)
                .contains('fromTime=10%3A00')
                .contains('toTime=13%3A30');
        });
    });
});

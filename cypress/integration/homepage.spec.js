context('Homepage', () => {
    it('Renders something', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Search');
    });

    it('Renders an on-campus undergraduate home page correctly', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('John');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="course-resources-panel"]').contains('Course resources');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').contains('Course resources');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').contains('Room bookings');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
    });

    it('Renders an RHD home page correctly', () => {
        cy.visit('/?user=s2222222');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Jane');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="course-resources-panel"]').contains('Course resources');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').contains('Course resources');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').contains('Publication metrics');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').contains('Room bookings');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
    });

    it('Renders an remote undergraduate home page correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Juno');
        cy.get('div[data-testid="course-resources-panel"]').contains('Course resources');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="library-hours-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-course-resources-link"]').contains('Course resources');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders a researcher home page correctly', () => {
        cy.visit('/?user=uqresearcher');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('John');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').contains('Publication metrics');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders a library administrator home page correctly', () => {
        cy.visit('/?user=digiteamMember');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Caroline');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="course-resources-panel"]').contains('Course resources');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').contains('Course resources');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').contains('Masquerade');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').contains('Publication metrics');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').contains('Room bookings');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');
    });

    it('Renders a Library non-admin staff member home page correctly', () => {
        cy.visit('/?user=uqstaffnonpriv');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('UQ');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="course-resources-panel"]').contains('Course resources');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').contains('Course resources');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').contains('Publication metrics');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').contains('Room bookings');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
    });

    it('Renders a non-library staff member home page correctly', () => {
        cy.visit('/?user=uqpkopit');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Peter');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').contains('Publication metrics');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders a paid community em member home page correctly', () => {
        cy.visit('/?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Community');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders an alumni (first year or paid) em member home page correctly', () => {
        cy.visit('/?user=emalumni');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Alumni');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-borrowing-link"]').contains('Borrowing');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders a hospital em member home page correctly', () => {
        cy.visit('/?user=emhospital');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Hospital');
        // cy.get('div[data-testid="computer-availability-panel"]').contains('Computer availability');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').contains('Computers');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').contains('Document delivery');
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders an associate em member home page correctly', () => {
        cy.visit('/?user=emassociate');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Associate');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders a fryer em member home page correctly', () => {
        cy.visit('/?user=emfryer');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Fryer');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });

    it('Renders an Honorary em member home page correctly', () => {
        cy.visit('/?user=emhonorary');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Honorary');
        // cy.get('div[data-testid="library-hours-panel"]').contains('Library hours');
        cy.get('div[data-testid="training-panel"]').contains('Training');
        cy.get('div[data-testid="library-services-panel"]').contains('Library services');
        cy.get('div[data-testid="feedback-panel"]').contains('Feedback');

        cy.get('div[data-testid="computer-availability-panel"]').should('not.exist');
        cy.get('div[data-testid="course-resources-panel"]').should('not.exist');

        cy.get('button[data-testid="mylibrary-button"]').should('exist');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('div[data-testid="mylibrary-library-hours-link"]').contains('Hours');
        cy.get('div[data-testid="mylibrary-print-balance-link"]').contains('Printing balance');
        cy.get('div[data-testid="mylibrary-saved-items-link"]').contains('Saved items');
        cy.get('div[data-testid="mylibrary-saved-searches-link"]').contains('Saved searches');
        cy.get('div[data-testid="mylibrary-feedback-link"]').contains('Feedback');

        cy.get('div[data-testid="mylibrary-borrowing-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-computer-availability-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-course-resources-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-document-delivery-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-masquerade-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-publication-metrics-link"]').should('not.exist');
        cy.get('div[data-testid="mylibrary-room-bookings-link"]').should('not.exist');
    });
});

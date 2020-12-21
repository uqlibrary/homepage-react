import {
    expectUserToDisplayCorrectFirstName,
    hasMyLibraryButtonOptions,
    hasPanels,
    hasPersonalisedPanelOptions,
} from '../support/access';

context('Homepage', () => {
    it('Renders an on-campus undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');
        cy.wait(1000);

        // this type of user will see the following panels:
        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        // this type of user will see these options on the Mylibrary Button:
        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'espace',
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        // this type of user will see these lines in the Personalisation Panel
        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders an RHD home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s2222222', 'Jane');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'document-delivery',
            'espace',
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a remote undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s3333333', 'Juno');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'espace',
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-orcid', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a researcher home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqresearcher', 'John');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'espace',
            'print-balance',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-orcid', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        expectUserToDisplayCorrectFirstName('digiteamMember', 'Caroline');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'espace',
            'masquerade',
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqstaffnonpriv', 'UQ');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            // 'espace', // no author record
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a non-library staff member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqpkopit', 'Peter');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'espace',
            'print-balance',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emcommunity', 'Community');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions(['borrowing', 'print-balance', 'saved-items', 'saved-searches', 'feedback']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emalumni', 'Alumni');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions(['borrowing', 'print-balance', 'saved-items', 'saved-searches', 'feedback']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a Hospital EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhospital', 'Hospital');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'document-delivery',
            'print-balance',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Associate EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emassociate', 'Associate');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'document-delivery',
            'print-balance',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emfryer', 'Fryer');
        cy.wait(1000);

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasMyLibraryButtonOptions(['borrowing', 'print-balance', 'saved-items', 'saved-searches', 'feedback']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Honorary EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhonorary', 'Honorary');
        cy.wait(1000);

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            // 'espace', // no author record
            'print-balance',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a logged out user', () => {
        cy.visit('/?user=public');
        cy.wait(1000);
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Search');

        hasPanels(['computer-availability', 'library-hours', 'training', 'promo']);

        // no mylibrary button
        cy.get('button[data-testid="mylibrary-button"]').should('not.exist');
    });
});

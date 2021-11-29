import { expectUserToDisplayCorrectFirstName, hasPanels, hasPersonalisedPanelOptions } from '../../support/access';

// Note: the Mylibrary Button is supplied by reusable-webcomponents. Testing is done over there.

// we test that each user type gets the correct elements on the homepage
// we shouldnt test the mylibrary button here, same, as that is built in reusable-webcomponents
context('Personalised Homepage', () => {
    it('Renders an on-campus undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');

        // this type of user will see the following panels:
        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        // this type of user will see these lines in the Personalisation Panel
        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders an RHD home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s2222222', 'Jane');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a remote undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s3333333', 'Juno');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a researcher home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqresearcher', 'John');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-orcid', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        expectUserToDisplayCorrectFirstName('digiteamMember', 'Caroline');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqstaffnonpriv', 'UQ');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a non-library staff member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqpkopit', 'Peter');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['espace-possible', 'espace-ntro', 'fines', 'loans', 'papercut']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emcommunity', 'Community');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emalumni', 'Alumni');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a Hospital EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhospital', 'Hospital');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Associate EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emassociate', 'Associate');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emfryer', 'Fryer');

        hasPanels(['computer-availability', 'library-hours', 'library-services', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders an Honorary EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhonorary', 'Honorary');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a logged out user', () => {
        cy.visit('/?user=public');
        cy.wait(1000);
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Library hours');

        hasPanels(['computer-availability', 'library-hours', 'training', 'promo']);
    });

    it('Renders a Short Form Credential course student home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqsfc', 'SFC');

        hasPanels([
            'computer-availability',
            'course-resources',
            'library-hours',
            'library-services',
            'promo',
            'training',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });

    it('Renders a new user group home page correctly', () => {
        expectUserToDisplayCorrectFirstName('newUserGroup', 'New');

        hasPanels(['computer-availability', 'library-hours', 'promo', 'training']);

        hasPersonalisedPanelOptions(['fines', 'loans', 'papercut']);
    });
});

import {
    expectUserToDisplayCorrectFirstName,
    hasEspaceEntries,
    hasNoEspacePanel,
    hasPanels,
} from '../../support/access';

// we test that each user type gets the correct elements on the homepage
// we shouldn't test the mylibrary button here, same, as that is built in reusable-webcomponents
context('Personalised Homepage', () => {
    it("Renders an on-campus undergraduate student's home page correctly", () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');
        cy.viewport(1300, 1000);
        // this type of user will see the following panels:
        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace', 'readpublish']);

        // this type of user will see these lines in the espace panel
        hasEspaceEntries(['espace-possible', 'espace-ntro']);

        // as the user is logged in, they see nav panels with a h3
        cy.get('[data-testid="help-navigation-panel"]')
            .children()
            .eq(0)
            .find('h3')
            .should('exist');
    });

    it('Renders a logged out user', () => {
        // tests ?user=public
        cy.rendersALoggedoutUser();

        // as the user is logged out, they see nav panels with a h2
        cy.get('[data-testid="help-navigation-panel"]')
            .children()
            .eq(0)
            .find('h2')
            .should('exist');
    });

    it('Renders an RHD home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s2222222', 'Jane');

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('when session cookie auto expires the user logs out', () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');

        cy.clearCookie('UQLID');
        cy.rendersALoggedoutUser();
    });
    it('Renders a remote undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s3333333', 'Juno');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a researcher home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqresearcher', 'John');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace', 'readpublish']);

        hasEspaceEntries(['espace-possible', 'espace-orcid', 'espace-ntro']);
    });

    it('Renders a patron with no outstanding espace records correctly', () => {
        cy.visit('/?user=uqresearcher&responseType=nodatamissing'); // special mock data
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace', 'readpublish']);

        hasEspaceEntries(['espace-orcid']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        expectUserToDisplayCorrectFirstName('digiteamMember', 'Caroline');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace', 'readpublish']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqstaffnonpriv', 'UQ');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a non-library staff member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqpkopit', 'Peter');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace', 'readpublish']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emcommunity', 'Community');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emalumni', 'Alumni');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a Hospital EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhospital', 'Hospital');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders an Associate EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emassociate', 'Associate');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emfryer', 'Fryer');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders an Honorary EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhonorary', 'Honorary');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a Short Form Credential course student home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqsfc', 'SFC');

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'readpublish']);

        hasNoEspacePanel();
    });

    it('Renders a new user group home page correctly', () => {
        expectUserToDisplayCorrectFirstName('newUserGroup', 'New');

        hasPanels(['training', 'readpublish']);

        hasNoEspacePanel();
    });
});

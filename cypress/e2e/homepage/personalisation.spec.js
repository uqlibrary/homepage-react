import { hasEspaceEntries, hasNoEspacePanel, hasPanels } from '../../support/access';

// we test that each user type gets the correct elements on the homepage
// we shouldn't test the mylibrary button here, same, as that is built in reusable-webcomponents
context('Personalised Homepage', () => {
    it("Renders an on-campus undergraduate student's home page correctly", () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);
        // this type of user will see the following panels:
        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace']);

        // this type of user will see these lines in the Personalisation Panel
        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a logged out user', () => {
        // tests ?user=public
        cy.rendersALoggedoutUser();
    });

    it('Renders an RHD home page correctly', () => {
        cy.visit('/?user=s2222222');
        cy.viewport(1300, 1000);

        hasPanels(['training', 'espace']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('when session cookie auto expires the user logs out', () => {
        cy.visit('/?user=s1111111');
        cy.viewport(1300, 1000);

        cy.clearCookie('UQLID');
        cy.rendersALoggedoutUser();
    });
    it('Renders a remote undergraduate home page correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training']);

        hasNoEspacePanel();
    });

    it('Renders a researcher home page correctly', () => {
        cy.visit('/?user=uqresearcher');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace']);

        hasEspaceEntries(['espace-possible', 'espace-orcid', 'espace-ntro']);
    });

    it('Renders a patron with no outstanding espace records correctly', () => {
        cy.visit('/?user=uqresearcher&responseType=nodatamissing'); // special mock data
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace']);

        hasEspaceEntries(['espace-orcid']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        cy.visit('/?user=digiteamMember');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        cy.visit('/?user=uqstaffnonpriv');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training']);

        hasNoEspacePanel();
    });

    it('Renders a non-library staff member home page correctly', () => {
        cy.visit('/?user=uqpkopit');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training', 'espace']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        cy.visit('/?user=emcommunity');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        cy.visit('/?user=emalumni');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });

    it('Renders a Hospital EM member home page correctly', () => {
        cy.visit('/?user=emhospital');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });

    it('Renders an Associate EM member home page correctly', () => {
        cy.visit('/?user=emassociate');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        cy.visit('/?user=emfryer');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });

    it('Renders an Honorary EM member home page correctly', () => {
        cy.visit('/?user=emhonorary');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training']);

        hasNoEspacePanel();
    });

    it('Renders a Short Form Credential course student home page correctly', () => {
        cy.visit('/?user=uqsfc');
        cy.viewport(1300, 1000);

        hasPanels(['learning-resources', 'past-exam-papers', 'training']);

        hasNoEspacePanel();
    });

    it('Renders a new user group home page correctly', () => {
        cy.visit('/?user=newUserGroup');
        cy.viewport(1300, 1000);

        hasPanels(['training']);

        hasNoEspacePanel();
    });
});

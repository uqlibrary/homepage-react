import {
    expectUserToDisplayCorrectFirstName,
    hasEspaceEntries,
    hasNoEspacePanel,
    hasPanels,
    hasAccountPanelOptions,
    seesEndNoteInReferencing,
    noEndNoteInReferencing,
} from '../../support/access';

// we test that each user type gets the correct elements on the homepage
// we shouldn't test the mylibrary button here, same, as that is built in reusable-webcomponents
// everyone has catalogue and referencing
context('Personalised Homepage', () => {
    it("Renders an on-campus undergraduate student's home page correctly", () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');
        cy.viewport(1300, 1000);
        // this type of user will see the following panels:
        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'espace']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut', 'fines']);

        // the fine has the supplied value
        cy.get('[data-testid="show-fines"]')
            .should('exist')
            .contains('48.93');

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

    it('Renders an RHD who is only enrolled in a research subject home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s2222222', 'Jane');

        hasPanels(['catalogue', 'referencing', 'training', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut', 'fines']);

        // the fine has a special value
        cy.get('[data-testid="show-fines"]')
            .should('exist')
            .contains('65.97');

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders an RHD who has a non reserarch subject home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s6666666', 'Maryanne');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        // this would be odd, all rhds should automatically be setup as an author
        hasNoEspacePanel();
    });

    it('Renders an RHD with courses home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s5555555', 'Yvonne');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('when session cookie auto expires the user logs out', () => {
        expectUserToDisplayCorrectFirstName('s1111111', 'Michael');

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut', 'fines']);

        cy.clearCookie('UQLID');
        cy.rendersALoggedoutUser();
    });
    it('Renders a remote undergraduate home page correctly', () => {
        expectUserToDisplayCorrectFirstName('s3333333', 'Juno');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);
        // special loans & requests values
        cy.get('[data-testid="show-requests"] span')
            .should('exist')
            .contains('4');
        cy.get('[data-testid="show-loans"] span')
            .should('exist')
            .contains('0');

        hasNoEspacePanel();
    });

    it('Renders a researcher home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqresearcher', 'John');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);
        // special loans & requests values
        cy.get('[data-testid="show-requests"] span')
            .should('exist')
            .contains('0');
        cy.get('[data-testid="show-loans"] span')
            .should('exist')
            .contains('7');

        hasEspaceEntries(['espace-possible', 'espace-orcid', 'espace-ntro']);
    });

    it('Renders a patron with no outstanding espace records correctly', () => {
        cy.visit('/?user=uqresearcher&responseType=nodatamissing'); // special mock data
        cy.viewport(1300, 1000);

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasEspaceEntries(['espace-orcid']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        expectUserToDisplayCorrectFirstName('digiteamMember', 'Caroline');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqstaffnonpriv', 'UQ');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders a non-library staff member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqpkopit', 'Peter');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'espace', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasEspaceEntries(['espace-possible', 'espace-ntro']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emcommunity', 'Community');

        hasPanels(['catalogue', 'referencing']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emalumni', 'Alumni');

        hasPanels(['catalogue', 'referencing']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders a Hospital EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhospital', 'Hospital');

        hasPanels(['catalogue', 'referencing', 'training']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        // sees hospital training items
        cy.get('[data-testid="training-event-detail-button-0"]')
            .should('exist')
            .should('be.visible')
            .scrollIntoView()
            .contains('Planning your systematic review');

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders an Associate EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emassociate', 'Associate');

        hasPanels(['catalogue', 'referencing']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emfryer', 'Fryer');

        hasPanels(['catalogue', 'referencing']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders an Honorary EM member home page correctly', () => {
        expectUserToDisplayCorrectFirstName('emhonorary', 'Honorary');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('Renders a Short Form Credential course student home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqsfc', 'SFC');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });

    it('test and tag users see home page correctly', () => {
        expectUserToDisplayCorrectFirstName('uqtesttag', 'UQ');

        hasPanels(['catalogue', 'referencing', 'learning-resources', 'training', 'readpublish']);
        seesEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut', 'testntag']);

        hasNoEspacePanel();
    });

    it('Renders a new user group home page correctly', () => {
        expectUserToDisplayCorrectFirstName('newUserGroup', 'New');

        hasPanels(['catalogue', 'referencing']);
        noEndNoteInReferencing();

        hasAccountPanelOptions(['searchhistory', 'savedsearches', 'requests', 'loans', 'papercut']);

        hasNoEspacePanel();
    });
});

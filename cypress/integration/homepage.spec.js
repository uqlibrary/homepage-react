const hasPanels = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('computer-availability', 'Computer availability');
    availableOptions.set('course-resources', 'Course resources');
    availableOptions.set('feedback', 'Feedback');
    availableOptions.set('library-hours', 'Library hours');
    availableOptions.set('library-services', 'Library services');
    availableOptions.set('training', 'Training');

    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        expect([...availableOptions.keys()].includes(item), `option unexpectedly supplied for panel test: ${item}`).to
            .be.true;
    });

    // eslint-disable-next-line guard-for-in
    for (const [key, value] of availableOptions) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.not.equals(0);
        expect(typeof value).to.equal('string');
        expect(value.length).to.not.equals(0);

        const panelname = `${key}-panel`;
        const elementId = `div[data-testid="${panelname}"]`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking panel ${panelname} contains ${value}`);
            cy.get(elementId).contains(value);
        } else {
            cy.log(`checking panel ${panelname} is missing`);
            cy.get(elementId).should('not.exist');
        }
    }
};

const hasMyLibraryButtonOptions = optionsTheUserShouldSee => {
    cy.get('button[data-testid="mylibrary-button"]').should('exist');
    cy.get('button[data-testid="mylibrary-button"]').click();

    const availableOptions = new Map();
    availableOptions.set('borrowing', 'Borrowing');
    availableOptions.set('computer-availability', 'Computer');
    availableOptions.set('course-resources', 'Course resources');
    availableOptions.set('document-delivery', 'Document delivery');
    availableOptions.set('print-balance', 'Printing balance');
    availableOptions.set('publication-metrics', 'Publication metrics');
    availableOptions.set('room-bookings', 'Room bookings');
    availableOptions.set('library-hours', 'Hours');
    availableOptions.set('saved-items', 'Saved items');
    availableOptions.set('saved-searches', 'Saved searches');
    availableOptions.set('feedback', 'Feedback');
    availableOptions.set('masquerade', 'Masquerade');

    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        expect([...availableOptions.keys()].includes(item), `option unexpectedly supplied for mylibrary test: ${item}`)
            .to.be.true;
    });

    for (const [key, value] of availableOptions) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.not.equals(0);
        expect(typeof value).to.equal('string');
        expect(value.length).to.not.equals(0);

        const linkName = `mylibrary-${key}-link`;
        const elementId = `div[data-testid="${linkName}"]`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking panel ${linkName} contains ${value}`);
            cy.get(elementId).contains(value);
        } else {
            cy.log(`checking panel ${linkName} is missing`);
            cy.get(elementId).should('not.exist');
        }
    }
};

const hasPersonalisedPanelOptions = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('print-balance', 'Manage your print balance');
    availableOptions.set('loans', 'Manage your library loans');
    availableOptions.set('fines', 'Pay overdue fines');

    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        expect([...availableOptions.keys()].includes(item), `option unexpectedly supplied for panel test: ${item}`).to
            .be.true;
    });

    // eslint-disable-next-line guard-for-in
    for (const [key, value] of availableOptions) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.not.equals(0);
        expect(typeof value).to.equal('string');
        expect(value.length).to.not.equals(0);

        const entryname = `${key}-personalisation`;
        const elementId = `div[data-testid="${entryname}"]`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking personalisation line ${entryname} contains ${value}`);
            cy.get(elementId).contains(value);
        } else {
            cy.log(`checking personalisation line ${entryname} is missing`);
            cy.get(elementId).should('not.exist');
        }
    }
};

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

        // this type of user will see the following panels:
        hasPanels([
            'computer-availability',
            'course-resources',
            'feedback',
            'library-hours',
            'library-services',
            'training',
        ]);

        // this type of user will see these options on the Mylibrary Button:
        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'course-resources',
            'document-delivery',
            'print-balance',
            'room-bookings',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        // this type of user will see these lines in the Personalisation Panel
        hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
    });

    it('Renders an RHD home page correctly', () => {
        cy.visit('/?user=s2222222');
        cy.viewport(1300, 1000);

        cy.get('div[data-testid="personal-panel"]').contains('Jane');

        hasPanels(['feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'document-delivery',
            // 'print-balance', // TBA
            'publication-metrics',
            'room-bookings',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions([
            'fines',
            'loans',
            // 'print-balance', // TBA
        ]);
    });

    it('Renders a remote undergraduate home page correctly', () => {
        cy.visit('/?user=s3333333');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Juno');

        hasPanels([
            'computer-availability',
            'course-resources',
            'feedback',
            'library-hours',
            'library-services',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'course-resources',
            'document-delivery',
            'library-hours',
            'print-balance',
            'room-bookings',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
    });

    it('Renders a researcher home page correctly', () => {
        cy.visit('/?user=uqresearcher');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('John');

        hasPanels(['course-resources', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'print-balance',
            'publication-metrics',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['loans', 'print-balance']);
    });

    it('Renders a library staff administrator home page correctly', () => {
        cy.visit('/?user=digiteamMember');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Caroline');

        hasPanels([
            'computer-availability',
            'course-resources',
            'feedback',
            'library-hours',
            'library-services',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'course-resources',
            'document-delivery',
            'masquerade',
            'print-balance',
            'publication-metrics',
            'room-bookings',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['loans', 'print-balance']);
    });

    it('Renders a Library staff member (without admin privs) home page correctly', () => {
        cy.visit('/?user=uqstaffnonpriv');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('UQ');

        hasPanels([
            'computer-availability',
            'course-resources',
            'feedback',
            'library-hours',
            'library-services',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'course-resources',
            'document-delivery',
            'print-balance',
            'publication-metrics',
            'room-bookings',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['loans', 'print-balance']);
    });

    it('Renders a non-library staff member home page correctly', () => {
        cy.visit('/?user=uqpkopit');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Peter');

        hasPanels(['course-resources', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'course-resources',
            'document-delivery',
            'print-balance',
            'publication-metrics',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['loans', 'print-balance']);
    });

    it('Renders a paid Community EM member home page correctly', () => {
        cy.visit('/?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Community');

        hasPanels(['computer-availability', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans']);
    });

    it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
        cy.visit('/?user=emalumni');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Alumni');

        hasPanels(['computer-availability', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans']);
    });

    it('Renders a Hospital EM member home page correctly', () => {
        cy.visit('/?user=emhospital');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Hospital');

        hasPanels(['computer-availability', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'document-delivery',
            'print-balance',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
    });

    it('Renders an Associate EM member home page correctly', () => {
        cy.visit('/?user=emassociate');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Associate');

        hasPanels(['computer-availability', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'document-delivery',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans']);
    });

    it('Renders a Fryer Library EM member home page correctly', () => {
        cy.visit('/?user=emfryer');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Fryer');

        hasPanels(['computer-availability', 'feedback', 'library-hours', 'library-services', 'training']);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'library-hours',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions([
            'fines',
            'loans',
        ]);
    });

    it('Renders an Honorary EM member home page correctly', () => {
        cy.visit('/?user=emhonorary');
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personal-panel"]').contains('Honorary');

        hasPanels([
            'computer-availability',
            'course-resources',
            'feedback',
            'library-hours',
            'library-services',
            'training',
        ]);

        hasMyLibraryButtonOptions([
            'borrowing',
            'computer-availability',
            'course-resources',
            'document-delivery',
            'library-hours',
            'print-balance',
            'publication-metrics',
            'saved-items',
            'saved-searches',
            'feedback',
        ]);

        hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
    });
});

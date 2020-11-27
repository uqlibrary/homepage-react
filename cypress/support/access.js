export const expectUserToDisplayCorrectFirstName = (username, firstname) => {
    cy.visit(`/?user=${username}`);
    cy.viewport(1300, 1000);
    cy.get('div[data-testid="personalisedPanel"]').contains(firstname);
};
export const hasPanels = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('computer-availability', 'Computer availability');
    availableOptions.set('course-resources', 'Course resources');
    // availableOptions.set('feedback', 'Feedback');
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
export const hasMyLibraryButtonOptions = optionsTheUserShouldSee => {
    cy.get('button[data-testid="uq-site-header-mylibrary-button"]').should('exist');
    cy.get('button[data-testid="uq-site-header-mylibrary-button"]').click();

    const availableOptions = new Map();
    availableOptions.set('borrowing', 'Borrowing');
    // availableOptions.set('computer-availability', 'Computer');
    availableOptions.set('course-resources', 'Course resources');
    availableOptions.set('document-delivery', 'Document delivery');
    availableOptions.set('print-balance', 'Printing balance');
    availableOptions.set('publication-metrics', 'Publication metrics');
    availableOptions.set('room-bookings', 'Room bookings');
    // availableOptions.set('library-hours', 'Hours');
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
export const hasPersonalisedPanelOptions = optionsTheUserShouldSee => {
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

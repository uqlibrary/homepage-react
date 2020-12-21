export const expectUserToDisplayCorrectFirstName = (username, firstname) => {
    cy.visit(`/?user=${username}`);
    cy.viewport(1300, 1000);
    cy.get('div[data-testid="personalised-panel"]').contains(firstname);
};
export const hasPanels = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('computer-availability', 'Computer availability');
    availableOptions.set('course-resources', 'Course resources');
    // availableOptions.set('feedback', 'Feedback');
    availableOptions.set('library-hours', 'Library hours');
    availableOptions.set('library-services', 'Library services');
    availableOptions.set('training', 'Training');
    availableOptions.set('promo', 'n/a');

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
            if (key === 'promo') {
                // the promo panel is admin editable, so we cant just check the header. Just check it exists
                cy.get(elementId).length > 0;
            } else {
                cy.log(`checking panel ${panelname} contains ${value}`);
                cy.get(elementId).contains(value);
            }
        } else {
            cy.log(`checking panel ${panelname} is missing`);
            cy.get(elementId).should('not.exist');
        }
    }

    // if they have Library Services then the box should not be blank
    // but we dont test per type, because we would just be duplicating the data
    if (!!optionsTheUserShouldSee.services) {
        cy.get('div[data-testid=library-services-items]')
            .children()
            .length.to.be.greaterThan(0);
    }
};
export const hasMyLibraryButtonOptions = optionsTheUserShouldSee => {
    cy.get('button[data-testid="mylibrary-button"]').should('exist');
    cy.get('button[data-testid="mylibrary-button"]').click();

    const availableOptions = new Map();
    availableOptions.set('borrowing', 'Borrowing');
    // availableOptions.set('computer-availability', 'Computer');
    availableOptions.set('course-resources', 'Course resources');
    availableOptions.set('document-delivery', 'Document delivery');
    availableOptions.set('espace', 'eSpace dashboard');
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

        const linkName = `mylibrary-menuitem-${key}`;
        const elementId = `li[data-testid="${linkName}"]`;
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
    availableOptions.set('papercut', 'Manage your print balance');
    availableOptions.set('loans', 'Manage your library loans');
    availableOptions.set('fines', 'Manage your library fines');
    availableOptions.set('espace-possible', 'possible eSpace records');
    availableOptions.set('espace-orcid', 'Link ORCiD account to eSpace');
    availableOptions.set('espace-ntro', 'NTRO records in eSpace');

    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        expect([...availableOptions.keys()].includes(item), `option unexpectedly supplied for panel test: ${item}`).to
            .be.true;
    });

    for (const [key, value] of availableOptions) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.not.equals(0);
        expect(typeof value).to.equal('string');
        expect(value.length).to.not.equals(0);

        // Using the Collapse item in the Personalised Panel means all the items are always in the tree.
        // For items which should not appear, look for the 'hidden' class that stops it displaying
        const entryname = `pp-${key}-menu-button`;
        const elementId = `button[data-testid="${entryname}"]`;
        const elementIdFound = `#personalisedPanel :not(div[class*="MuiCollapse-hidden-"]) ${elementId}`;
        const elementIdMissing = `#personalisedPanel div[class*="MuiCollapse-hidden-"] ${elementId}`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking personalisation line ${entryname} contains ${value}`);
            cy.get(elementIdFound).contains(value);
            cy.get(elementIdMissing).should('not.exist');
        } else {
            cy.log(`checking personalisation line ${entryname} is hidden`);
            cy.get(elementIdMissing).should('exist');
        }
    }
};

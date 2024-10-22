export const expectUserToDisplayCorrectFirstName = (username, firstname) => {
    cy.visit(`/?user=${username}`);
    cy.viewport(1300, 1000);
    cy.get('[data-testid="homepage-user-greeting"]').contains(firstname);
};

export const hasPanels = optionsTheUserShouldSee => {
    const possiblePanels = new Map();
    possiblePanels.set('learning-resources', {
        title: 'Learning resources and past exam papers',
        content: 'Search by',
    });
    possiblePanels.set('library-services', { title: 'Library services', content: 'Services for' });
    possiblePanels.set('past-exam-papers', { title: 'Past exam papers', content: 'Search by' });
    possiblePanels.set('training', { title: 'Training', content: 'See all Training' });
    possiblePanels.set('espace', { title: 'UQ eSpace', content: 'Update the following items' });
    possiblePanels.set('readpublish', { title: 'Read and publish', content: 'Publish in the right journal' });
    possiblePanels.set('catalogue', { title: 'My library account', content: 'Search history' });
    possiblePanels.set('referencing', { title: 'Referencing', content: 'Referencing style guides' });
    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        expect([...possiblePanels.keys()].includes(item), `panel option unexpectedly supplied for panel test: ${item}`)
            .to.be.true;
    });

    // eslint-disable-next-line guard-for-in
    for (const [key, value] of possiblePanels) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.be.greaterThan(0);
        expect(typeof value.title).to.equal('string');
        expect(value.title.length).to.be.greaterThan(0);
        expect(typeof value.content).to.equal('string');
        expect(value.content.length).to.be.greaterThan(0);

        const panelname = `${key}-panel`;
        const titleSelector = `div[data-testid="${panelname}"] h3`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking panel ${panelname} contains ${value.title}`);
            cy.get(titleSelector).contains(value.title);
        } else {
            cy.log(`checking panel ${panelname} is missing`);
            cy.get(titleSelector).should('not.exist');
        }
        const contentSelector = `div[data-testid="${panelname}"]`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking panel ${panelname} contains ${value.content}`);
            cy.get(contentSelector).contains(value.content);
        }
    }

    // if they have Library Services then the box should not be blank
    // but we don't test per type, because we would just be duplicating the data
    if (!!optionsTheUserShouldSee.services) {
        cy.get('div[data-testid=library-services-items]')
            .children()
            .length.to.be.greaterThan(0);
    }
};
export const hasNoEspacePanel = () => {
    cy.get('[data-testid="espace-links-panel"]').should('not.exist');
};

export const hasEspaceEntries = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('espace-possible', 'records');
    availableOptions.set('espace-orcid', 'Link ORCiD account');
    availableOptions.set('espace-ntro', 'NTRO records');

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

        // Using the Link in the Personalised Panel means all the items are always in the tree.
        // For items which should not appear, look for the 'hidden' class that stops it displaying
        const entryname = `${key}`;
        const elementId = `[data-testid="${entryname}"]`;
        // the hidden class is not applied, so the element is visible
        // the hidden class IS applied, so the element is hidden
        // const elementIdMissing = `${elementId}`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking personalisation line ${entryname} contains ${value}`);
            cy.get(elementId).contains(value);
        } else {
            cy.log(`checking personalisation line ${entryname} is hidden`);
            cy.get(elementId).should('not.exist');
        }
    }
};

export const hasCatalogPanelOptions = optionsTheUserShouldSee => {
    const availableOptions = new Map();
    availableOptions.set('searchhistory', 'Search history');
    availableOptions.set('savedsearches', 'Saved searches');
    availableOptions.set('requests', 'Requests');
    availableOptions.set('loans', 'Loans');
    availableOptions.set('fines', 'Fines');
    availableOptions.set('papercut', 'Print balance');
    availableOptions.set('testntag', 'Test and tag');

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

        const entryname = `show-${key}`;
        const elementId = `[data-testid="${entryname}"]`;
        // the hidden class IS applied, so the element is hidden
        if (!!optionsTheUserShouldSee.includes(key)) {
            cy.log(`checking personalisation line ${entryname} contains ${value}`);
            cy.get(elementId)
                .should('exist')
                .contains(value);
        } else {
            cy.log(`checking personalisation line ${entryname} is hidden`);
            cy.get(elementId).should('not.exist');
        }
    }
};

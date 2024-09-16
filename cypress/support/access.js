export const hasPanels = optionsTheUserShouldSee => {
    const possiblePanels = new Map();
    possiblePanels.set('learning-resources', { title: 'Learning resources', content: 'Search by' });
    // probably not used - try without
    possiblePanels.set('library-services', { title: 'Library services', content: 'Services for' });
    possiblePanels.set('past-exam-papers', { title: 'Past exam papers', content: 'Search by' });
    possiblePanels.set('training', { title: 'Training', content: 'Online' });

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

import { promoPanel } from '../../src/modules/Index/components/subComponents/promoPanel.locale';

export const expectUserToDisplayCorrectFirstName = (username, firstname) => {
    cy.visit(`/?user=${username}`);
    cy.viewport(1300, 1000);
    cy.wait(1000);
    cy.get('div[data-testid="personalised-panel"]').contains(firstname);
};
export const hasPanels = (optionsTheUserShouldSee, loggedin = true) => {
    const availableOptions = new Map();
    availableOptions.set('computer-availability', { title: 'Computer availability', content: 'Architecture' });
    availableOptions.set('course-resources', { title: 'Course resources', content: 'Search by' });
    availableOptions.set('library-hours', { title: 'Library hours', content: 'Study space' });
    availableOptions.set('library-services', { title: 'Library services', content: 'Services for' });
    availableOptions.set('training', { title: 'Training', content: 'Online' });
    availableOptions.set('promo', 'n/a');

    // validate the input - all supplied entries should exist in the available options
    optionsTheUserShouldSee.map(item => {
        console.log('check', item);
        expect(
            [...availableOptions.keys()].includes(item),
            `panel option unexpectedly supplied for panel test: ${item}`,
        ).to.be.true;
    });

    // promo panel title is currently set in locale by end user
    // (there is a plan to make it api driven, then we can use mock here)
    const title = loggedin ? promoPanel.loggedin.title : promoPanel.loggedout.title;
    expect(typeof title).to.equal('string');
    expect(title.length).to.be.greaterThan(0);

    // eslint-disable-next-line guard-for-in
    for (const [key, value] of availableOptions) {
        expect(typeof key).to.equal('string');
        expect(key.length).to.be.greaterThan(0);
        if (key !== 'promo') {
            expect(typeof value.title).to.equal('string');
            expect(value.title.length).to.be.greaterThan(0);
            expect(typeof value.content).to.equal('string');
            expect(value.content.length).to.be.greaterThan(0);
        }

        const panelname = `${key}-panel`;
        const titleSelector = `div[data-testid="${panelname}"] h2`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            if (key === 'promo') {
                cy.get(titleSelector)
                    .should('exist')
                    .contains(title);
            } else {
                cy.log(`checking panel ${panelname} contains ${value.title}`);
                cy.get(titleSelector).contains(value.title);
            }
        } else {
            cy.log(`checking panel ${panelname} is missing`);
            cy.get(titleSelector).should('not.exist');
        }
        const contentSelector = `div[data-testid="${panelname}"]`;
        if (!!optionsTheUserShouldSee.includes(key)) {
            if (key !== 'promo') {
                cy.log(`checking panel ${panelname} contains ${value.content}`);
                cy.get(contentSelector).contains(value.content);
            }
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
        const elementId = `[data-testid="${entryname}"]`;
        // the hidden class is not applied, so the element is visible
        const elementIdFound = `#personalisedPanel :not(div.MuiCollapse-hidden) ${elementId}`;
        // the hidden class IS applied, so the element is hidden
        const elementIdMissing = `#personalisedPanel div.MuiCollapse-hidden ${elementId}`;
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

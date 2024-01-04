// this tests the little 'set a preferred campus' wiggler, and its associated display in panel headers
context('Location component', () => {
    const LOCATION_COOKIE_NAME = 'UQL_PREFERRED_LOCATION';

    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const USERNAME_VANILLA = 'ahupssh';
    const USERNAME_UQSTAFF = 'axzahmm';

    function assertCookieHas(cookie, expectedLocation, username = USERNAME_VANILLA) {
        const decodedValue = decodeURIComponent(cookie.value);
        const parsedValue = JSON.parse(decodedValue);
        if (expectedLocation === null) {
            expect(parsedValue).to.equal(null);
        } else {
            expect(parsedValue[username]).to.equal(expectedLocation);
        }
    }

    function cookieContents(username, location) {
        const cookieValue = {};
        cookieValue[username] = location;
        return JSON.stringify(cookieValue);
    }

    it('is accessible', () => {
        cy.visit('/?user=vanilla');
        cy.wait(3000);
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="personalised-panel"]').contains('Vanilla');
        cy.get('button[data-testid="location-button"]').contains('Set a preferred campus');

        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"]').contains('No preference');
        cy.wait(500);
        cy.checkA11y('div[data-testid="location-paper"]', {
            reportName: 'Location',
            scopeName: 'Menu',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('has a tooltip', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="location-button"]').should('be.visible');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.wait(1000);
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently');
    });

    it('location button use produces wigglers in panels', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);

        // page is initialised as default
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
        cy.get('[data-testid=computers-library-button-0]').contains('Architecture');
        cy.get('[data-testid=hours-item-0]').contains('Arch Music');

        // select a location in the Personalised Panel location selector
        cy.get('[data-testid=location]')
            .contains('Set a preferred campus')
            .click();
        cy.get('[data-testid=location-option-1]')
            .contains('St Lucia')
            .click();

        // a wiggling location button displays in both these subComponents
        cy.get('[data-testid=computers-wiggler]').should('exist');
        cy.get('[data-testid=hours-wiggler]').should('exist');

        // after a bit the wiggler goes away
        cy.wait(6000);
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
    });

    it('panels resort when preferred location changed', () => {
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="location-button"]').should('be.visible');

        cy.log('Should set the cookie to St Lucia');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-1"').click();

        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'St Lucia'));
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently St Lucia');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');

        cy.log('Should set the cookie to Gatton');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-2"').click();
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Gatton'));
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Gatton');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Gatton');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Gatton');

        cy.log('Should close when opened if clicking on body');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('body').type('{esc}');
        cy.get('div#location-paper').should('not.be.visible');

        cy.log('Should set the cookie to Herston');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-3"').click();
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Herston'));
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Herston');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Herston');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Herston');

        cy.log('Should set the cookie to Dutton Park');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-4"').click();
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Dutton Park'));

        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Dutton Park');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Dutton Park');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Dutton Park');

        cy.log('Should set the cookie to null');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"').click();
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, null));

        cy.get('body').type('{esc}');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');
    });

    it('a previously logged in user does not see panels that are reordered', () => {
        // set the cookie against a logged-in user
        cy.setCookie(LOCATION_COOKIE_NAME, cookieContents(USERNAME_UQSTAFF, 'Gatton'));

        // then load the page in the logged out mode
        cy.visit('/?user=public');
        cy.viewport(1300, 1000);

        // the cookie has not been wiped, despite being logged out
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Gatton', USERNAME_UQSTAFF));
        // but the panels do not resort while they are logged out
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture'); // not Gatton
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch'); // not Gatton
    });

    it('a user with an old style cookie gets a new one', () => {
        const OLD_COOKIE_NAME = 'location';
        cy.setCookie(OLD_COOKIE_NAME, 'Gatton');

        cy.visit('/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="location-button"]').should('exist'));

        // the new cookie is correct
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Gatton', USERNAME_UQSTAFF));
        // the old cookie has been removed
        cy.getAllCookies().then(cookies => {
            cookies.forEach(c => expect(c.name).not.to.equal(OLD_COOKIE_NAME));
        });
    });

    it('a user logs in and sets a location on a public machine and then another user logs in later, they dont see the old users location', () => {
        // a user logged in on this computer previously and set a location, and their cookie exists
        // (we don't remove it because its normal to log in and out on your own computer and maintain the location)
        cy.setCookie(LOCATION_COOKIE_NAME, cookieContents(USERNAME_UQSTAFF, 'Gatton'));

        // but it's a public computer - now someone else logs in
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="location-button"]').should('exist'));

        // the cookie from the previous user has been removed
        cy.getAllCookies().then(cookies => {
            cookies.forEach(c => expect(c.name).not.to.equal(LOCATION_COOKIE_NAME));
        });
    });

    it('a user who logs in again sees their old location', () => {
        // set the cookie against a logged-in user
        cy.setCookie(LOCATION_COOKIE_NAME, cookieContents(USERNAME_UQSTAFF, 'Gatton'));

        // then load the page in the logged out mode
        cy.visit('/?user=public');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="library-hours-panel"]').should('exist'));

        cy.visit('/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.waitUntil(() => cy.get('[data-testid="location-button"]').should('exist'));

        // the cookie has not been wiped, despite being logged out earlier
        cy.getCookie(LOCATION_COOKIE_NAME).then(cookie => assertCookieHas(cookie, 'Gatton', USERNAME_UQSTAFF));
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Gatton');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Gatton');
    });
});

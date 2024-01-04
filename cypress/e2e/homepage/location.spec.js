// this tests the little 'set a preferred campus' wiggler, and its associated display in panel headers
context('Location component', () => {
    const LOCATION_COOKIE_NAME = 'UQL_PREFERRED_LOCATION';

    it('Renders as expected', () => {
        cy.clearCookies();
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="location-button"]').should('be.visible');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.wait(1000);
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently');
    });

    it('Works as expected', () => {
        function assertCookieHas(cookie, expectedLocation, username = 'vanilla') {
            const decodedValue = decodeURIComponent(cookie.value);
            const parsedValue = JSON.parse(decodedValue);
            if (expectedLocation === null) {
                expect(parsedValue).to.equal(null);
            } else {
                expect(parsedValue[username]).to.equal(expectedLocation);
            }
        }

        cy.clearCookies();
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

    it('the logged out user does not see the cookie value', () => {
        cy.setCookie(LOCATION_COOKIE_NAME, 'Gatton');
        cy.visit('/?user=public');
        cy.viewport(1300, 1000);
        cy.getCookie(LOCATION_COOKIE_NAME).should('have.property', 'value', 'Gatton');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');
    });
});

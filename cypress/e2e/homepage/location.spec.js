// this tests the little 'set a preferred campus' wiggler, and its associated display in panel headers
context('Location component', () => {
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
        cy.clearCookies();
        cy.visit('/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="location-button"]').should('be.visible');

        cy.log('Should set the cookie to St Lucia');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-1"').click();
        cy.getCookie('location').should('have.property', 'value', 'St%20Lucia');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently St Lucia');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');

        cy.log('Should set the cookie to Gatton');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-2"').click();
        cy.getCookie('location').should('have.property', 'value', 'Gatton');
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
        cy.getCookie('location').should('have.property', 'value', 'Herston');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Herston');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Herston');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Herston');

        cy.log('Should set the cookie to Dutton Park');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-4"').click();
        cy.getCookie('location').should('have.property', 'value', 'Dutton%20Park');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Dutton Park');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Dutton Park');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Dutton Park');

        cy.log('Should set the cookie to null');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"').click();
        cy.getCookie('location').should('have.property', 'value', 'null');
        cy.get('body').type('{esc}');
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');
    });

    it('the logged out user does not see the cookie value', () => {
        cy.setCookie('location', 'Gatton');
        cy.visit('/?user=public');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="computer-row-0"]').should('contain', 'Architecture');
        cy.get('[data-testid="hours-item-0"]').should('contain', 'Arch');
    });
});

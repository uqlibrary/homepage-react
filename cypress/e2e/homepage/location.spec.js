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

        cy.log('Should set the cookie to Gatton');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-2"').click();
        cy.getCookie('location').should('have.property', 'value', 'Gatton');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Gatton');

        cy.log('Should close when opened if clicking on body');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('body').click();
        cy.get('div#location-paper').should('not.be.visible');

        cy.log('Should set the cookie to Herston');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-3"').click();
        cy.getCookie('location').should('have.property', 'value', 'Herston');
        cy.get('button[data-testid="location-button"]').trigger('mouseover');
        cy.get('div#location-tooltip').contains('Click to update your preferred campus, currently Herston');

        cy.log('Should set the cookie to null');
        cy.get('button[data-testid="location-button"]').click();
        cy.get('li[data-testid="location-option-0"').click();
        cy.getCookie('location').should('have.property', 'value', 'null');
        cy.get('body').click();
    });
});

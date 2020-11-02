context('Location component', () => {
    it('Renders as expected', () => {
        cy.clearCookies();
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Search');
        cy.log('Should write a null cookie value for location on load if one doesnt exist');
        cy.getCookie('location').should('exist');

        cy.get('button[data-testid="location-computerAvailability-button"]').trigger('mouseover');
        cy.get('div#location-computerAvailability-tooltip').contains('Current preferred location is not set');
    });

    it('Works as expected', () => {
        cy.clearCookies();
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Search');
        cy.getCookie('location').should('exist');

        cy.log('Should set the cookie to St Lucia');
        cy.get('button[data-testid="location-computerAvailability-button"]').click();
        cy.get('li[data-testid="location-computerAvailability-option-1"').click();
        cy.getCookie('location').should('have.property', 'value', 'St%20Lucia');
        cy.get('button[data-testid="location-computerAvailability-button"]').trigger('mouseover');
        cy.get('div#location-computerAvailability-tooltip').contains('Current preferred location is St Lucia');

        cy.log('Should set the cookie to Gatton');
        cy.get('button[data-testid="location-computerAvailability-button"]').click();
        cy.get('li[data-testid="location-computerAvailability-option-2"').click();
        cy.getCookie('location').should('have.property', 'value', 'Gatton');
        cy.get('button[data-testid="location-computerAvailability-button"]').trigger('mouseover');
        cy.get('div#location-computerAvailability-tooltip').contains('Current preferred location is Gatton');

        cy.log('Should set the cookie to Herston');
        cy.get('button[data-testid="location-computerAvailability-button"]').click();
        cy.get('li[data-testid="location-computerAvailability-option-3"').click();
        cy.getCookie('location').should('have.property', 'value', 'Herston');
        cy.get('button[data-testid="location-computerAvailability-button"]').trigger('mouseover');
        cy.get('div#location-computerAvailability-tooltip').contains('Current preferred location is Herston');

        cy.log('Should set the cookie to null');
        cy.get('button[data-testid="location-computerAvailability-button"]').click();
        cy.get('li[data-testid="location-computerAvailability-option-0"').click();
        cy.getCookie('location').should('have.property', 'value', 'null');
    });
});

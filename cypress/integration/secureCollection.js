context('Secure Collection', () => {
    it('a link to a non existant resource says so', () => {
        cy.visit('/collection?user=s1111111&collection=collection&file=doesntExist');
        cy.viewport(1300, 1000);
        cy.get('body').contains('This file does not exist or is unavailable.');
        cy.get('body').contains('Please check the link you have used.');
    });

    it('a link that returns an error from the api says so', () => {
        cy.visit('/collection?user=s1111111&collection=api&file=fails');
        cy.viewport(1300, 1000);
        cy.get('body').contains('System temporarily unavailable');
        cy.get('body').contains(
            "We're working on the issue and will have service restored as soon as possible. Please try again later.",
        );
    });

    it('a link that requires a commercial Copyright statement does so', () => {
        cy.visit('/collection?user=s1111111&collection=coursebank&file=111111111111111.pdf');
        cy.viewport(1300, 1000);
        cy.get('body').contains('WARNING');
        cy.get('body').contains('The material in this communication may be subject to copyright under the Act');
    });
});

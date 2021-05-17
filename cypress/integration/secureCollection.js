context('Secure Collection', () => {
    it('a link to a non existant resource says so', () => {
        cy.visit('/collection?user=s1111111&collection=collection&file=doesntExist');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Secure Collection');
        cy.checkA11y('[data-testid="secure-collection"]', {
            reportName: 'Secure Collection',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('body').contains('This file does not exist or is unavailable.');
        cy.get('body').contains('Please check the link you have used.');
    });

    it('a link that returns an error from the api says so', () => {
        cy.visit('/collection?user=s1111111&collection=api&file=fails');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Secure Collection');
        cy.checkA11y('[data-testid="secure-collection"]', {
            reportName: 'Secure Collection',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('body').contains('System temporarily unavailable');
        cy.get('body').contains(
            "We're working on the issue and will have service restored as soon as possible. Please try again later.",
        );
    });

    it('a link that requires a Statutory Copyright statement does so', () => {
        cy.visit('/collection?user=s1111111&collection=coursebank&file=111111111111111.pdf');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Secure Collection');
        cy.checkA11y('[data-testid="secure-collection"]', {
            reportName: 'Secure Collection',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('body').contains('WARNING');
        cy.get('body').contains('This material has been reproduced and communicated to you by or on behalf of The');
        cy.get('body')
            .find('[data-testid="fileExtension"]')
            .contains('Save the file with a name ending in')
            .find('b')
            .contains('.pdf');
    });

    it('a link that does not have a file extension doesnt display the file extension hint to the user', () => {
        cy.visit('/collection?user=s1111111&collection=coursebank&file=2222222');
        cy.viewport(1300, 1000);
        cy.get('body').contains('WARNING');
        cy.get('body').contains('The material in this communication may be subject to copyright under the Act');
        cy.get('body')
            .find('[data-testid="fileExtension"]')
            .should('not.exist');
    });

    it('a link that requires a Commercial Copyright statement does so', () => {
        cy.visit('/collection?user=s1111111&collection=bomdata&file=abcdef.zip');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Secure Collection');
        cy.checkA11y('[data-testid="secure-collection"]', {
            reportName: 'Secure Collection',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('body').contains('WARNING');
        cy.get('body').contains('This file is provided to support teaching and learning for the staff and students of');
        cy.get('body')
            .find('[data-testid="fileExtension"]')
            .contains('Save the file with a name ending in')
            .find('b')
            .contains('.zip');
    });
});

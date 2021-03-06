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

    it('a link that is missing the appropriate parameters displays a missing page', () => {
        cy.visit('/collection');
        cy.viewport(1300, 1000);
        cy.get('body')
            .find('h3')
            .contains('This file does not exist or is unavailable.');
        cy.get('body')
            .find('[data-testid="secure-collection"]')
            .contains('Please check the link you have used.');
    });

    it('a link that requires certain user types will give an error', () => {
        cy.visit(
            '/collection?user=emcommunity&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf',
        );
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Secure Collection');
        cy.checkA11y('[data-testid="secure-collection"]', {
            reportName: 'Secure Collection',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('body').contains('Access to this file is only available to UQ staff and students');
        cy.get('body').contains('If you have another UQ account');
    });

    it('a link that requires login will show the redirection message', () => {
        cy.visit(
            '/collection?user=public&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_EMuser.pdf',
        );
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.intercept(
            {
                url: 'https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php*',
            },
            {
                statusCode: 200,
                body: 'auth pages that forces the user to login',
            },
        );
        cy.wait(1500);
        cy.get('body').contains('auth pages that forces the user to login');
    });

    it('a link that does not require acknowledgement will redirect to the file', () => {
        cy.visit(
            '/collection?user=s1111111&collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf',
        );
        cy.viewport(1300, 1000);
        cy.intercept(
            'GET',
            'https://files.library.uq.edu.au/secure/thomson/classic_legal_texts/Thynne_Accountability_And_Control.pdf?Expires=1621380128&Signature=longstring&Key-Pair-Id=APKAJNDQICYW445PEOSA',
            {
                statusCode: 200,
                body: 'I am a file resource delivered to the user',
            },
        );
        // then check redirection
        cy.wait(1500);
        cy.get('body').contains('I am a file resource delivered to the user');
    });
});

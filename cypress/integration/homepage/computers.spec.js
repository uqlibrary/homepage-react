describe('Computer availability', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.viewport(1300, 1000);
    });
    context('Computer availability accessibility', () => {
        it('Computer availability is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.log('Computers');
            cy.get('button[data-testid="computers-library-button-0"]').contains('Architecture & Music Library');

            cy.log('Computers list');
            cy.checkA11y('div[data-testid="standard-card-computers"]', {
                reportName: 'Computers',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });

            cy.log('Level displayed');
            cy.get('button[data-testid="computers-library-button-0"]').click();
            cy.wait(500);
            cy.checkA11y('div[data-testid="standard-card-computers"]', {
                reportName: 'Computers',
                scopeName: 'Level expanded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });

            cy.log('Floor map');
            cy.get('button[data-testid="computers-library-0-level-3-button"]').click();
            cy.wait(500);
            cy.checkA11y('div[data-testid="computers-library-dialog"]', {
                reportName: 'Computers',
                scopeName: 'Level map',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has appropriate aria-labels', () => {
            cy.get('button[data-testid="computers-library-button-1"]').contains('Biological Sciences Library');
            cy.get('button[data-testid="computers-library-button-1"]')
                .should('have.attr', 'aria-label')
                .then(ariaLabel => {
                    expect(ariaLabel).to.contains(
                        'Biological Sciences Library - 108 free of 269. Click to review each level',
                    );
                });
            cy.get('button[data-testid="computers-library-button-1"]').click();

            cy.get('[data-testid="computers-library-1-level-4-button"]').contains('Level 4');
            cy.get('[data-testid="computers-library-1-level-4-button"]')
                .should('have.attr', 'aria-label')
                .then(ariaLabel => {
                    expect(ariaLabel).to.contains('Biological Sciences Library level 4. 72 free of 110 computers');
                });
        });
    });
    context('Minor functionality works', () => {
        it('the display label has the correct number of computers free', () => {
            cy.get('button[data-testid="computers-library-button-1"]').contains('Biological Sciences Library');
            cy.get('button[data-testid="computers-library-button-1"]').click();

            cy.get('[data-testid="computers-library-1-level-4-button"]').contains('Level 4');
            cy.get('[data-testid="computers-library-1-level-4-button"]')
                .parent()
                .parent()
                .find('div:nth-child(3)')
                .contains('72 free of 110');
        });
        it('close options for map and levels works', () => {
            cy.get('button[data-testid="computers-library-button-1"]')
                .should('exist')
                .contains('Biological Sciences Library')
                .click();
            // levels list opens
            cy.get('[data-testid="computers-library-1-level-4-button"]')
                .should('exist')
                .contains('Level 4')
                .click();
            // map loads
            cy.get('h3')
                .should('exist')
                .contains('Biological Sciences Library');
            // close map
            cy.get('[data-testid="computers-library-dialog-close-button"]').click();
            cy.get('h3').should('not.exist');
            // level list is open, click to close
            cy.get('[data-testid="computers-library-1-level-4-button"]').should('exist');
            cy.get('button[data-testid="computers-library-button-1"]').click();
            cy.get('[data-testid="computers-library-1-level-4-button"]').should('not.exist');
            cy.get('button[data-testid="computers-library-button-1"]')
                .should('exist')
                .contains('Biological Sciences Library');
        });
    });
});

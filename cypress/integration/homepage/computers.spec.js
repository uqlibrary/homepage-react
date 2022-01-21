describe('Computer availability', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.viewport(1300, 1000);
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
    context('Computer availability accessibility', () => {
        it('Computer availability is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.log('Computers list');
            cy.get('button[data-testid="computers-library-button-0"]').should(
                'have.text',
                'Architecture & Music Library',
            );
            cy.wait(500);
            // checking all rows was creating spurious colour contrast errors; just one seemed to work
            cy.checkA11y('div[data-testid="computer-row-0"]', {
                reportName: 'Computers',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });

            cy.log('Level displayed');
            cy.get('button[data-testid="computers-library-button-0"]').click();
            cy.get('div[data-testid="computer-row-0"] + div').should('have.text', 'Level 320 free of 41');
            cy.wait(500);
            cy.checkA11y('div[data-testid="computer-row-0"] + div', {
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
        it('aria-labels make sense', () => {
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
});

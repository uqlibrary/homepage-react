// context('ACCESSIBILITY', () => {
//     it('Spotlights', () => {
//         cy.visit('/');
//         cy.injectAxe();
//         cy.viewport(1300, 1000);
//         cy.log('Spootlights navigation tests');
//         cy.get(
//             '[alt="Academic Integrity Modules - Everything you need to know about academic integrity at UQ"]',
//         ).should('be.visible');
//
//         cy.get('div[aria-label="Slide 1"]').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 2"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 3"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 4"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//
//         cy.get('button[aria-label="Next Slide"]').click();
//         cy.get('div[aria-label="Slide 1"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 2"]').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 3"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 4"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//
//         cy.get('button[aria-label="Next Slide"]').click();
//         cy.get('div[aria-label="Slide 1"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 2"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 3"]').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 4"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//
//         cy.get('button[aria-label="Next Slide"]').click();
//         cy.get('div[aria-label="Slide 1"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 2"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 3"]').should('not.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//         cy.get('div[aria-label="Slide 4"]').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
//     });
// });

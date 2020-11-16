// context('ACCESSIBILITY', () => {
//     it('Location component', () => {
//         cy.clearCookies();
//         cy.visit('/');
//         cy.injectAxe();
//         cy.viewport(1300, 1000);
//         cy.get('button[data-testid="location-computerAvailability-button"]').should('be.visible');
//         cy.getCookie('location').should('exist');
//
//
//         cy.checkA11y('div[data-testid="location-computerAvailability"]', {
//             reportName: 'Location',
//             scopeName: 'Button',
//             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
//         });
//     });
// });

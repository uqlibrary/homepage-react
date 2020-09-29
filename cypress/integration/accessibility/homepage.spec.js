// context('ACCESSIBILITY', () => {
//     it('Homepage', () => {
//         cy.visit('/');
//         cy.injectAxe();
//         cy.viewport(1300, 1000);
//         cy.get('div#content-container').contains('Welcome to the new homepage.');
//         cy.log('Homepage');
//         cy.checkA11y('div#content-container', {
//             reportName: 'Homepage',
//             scopeName: 'Content',
//             includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
//         });
//     });
// });

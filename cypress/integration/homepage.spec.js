// import {
//     expectUserToDisplayCorrectFirstName,
//     hasMyLibraryButtonOptions,
//     hasPanels,
//     hasPersonalisedPanelOptions,
// } from '../support/access';
//
// context('Homepage', () => {
//     it('Renders an on-campus undergraduate home page correctly', () => {
//         expectUserToDisplayCorrectFirstName('s1111111', 'John');
//
//         // this type of user will see the following panels:
//         hasPanels([
//             'computer-availability',
//             'course-resources',
//             // 'feedback',
//             'library-hours',
//             'library-services',
//             'training',
//         ]);
//
//         // this type of user will see these options on the Mylibrary Button:
//         hasMyLibraryButtonOptions([
//             'borrowing',
//             // 'computer-availability',
//             'course-resources',
//             'document-delivery',
//             'print-balance',
//             'room-bookings',
//             // 'library-hours',
//             'saved-items',
//             'saved-searches',
//             'feedback',
//         ]);
//
//         // this type of user will see these lines in the Personalisation Panel
//         hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
//     });
//
//     // it('Renders an RHD home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('s2222222', 'Jane');
//     //
//     //     hasPanels([
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         'document-delivery',
//     //         // 'print-balance', // TBA
//     //         'publication-metrics',
//     //         'room-bookings',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions([
//     //         'fines',
//     //         'loans',
//     //         // 'print-balance', // TBA
//     //     ]);
//     // });
//     //
//     // it('Renders a remote undergraduate home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('s3333333', 'Juno');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'course-resources',
//     //         'document-delivery',
//     //         // 'library-hours',
//     //         'print-balance',
//     //         'room-bookings',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a researcher home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('uqresearcher', 'John');
//     //
//     //     hasPanels([
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         'course-resources',
//     //         'document-delivery',
//     //         'print-balance',
//     //         'publication-metrics',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a library staff administrator home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('digiteamMember', 'Caroline');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'course-resources',
//     //         'document-delivery',
//     //         'masquerade',
//     //         'print-balance',
//     //         'publication-metrics',
//     //         'room-bookings',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a Library staff member (without admin privs) home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('uqstaffnonpriv', 'UQ');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'course-resources',
//     //         'document-delivery',
//     //         'print-balance',
//     //         'publication-metrics',
//     //         'room-bookings',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a non-library staff member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('uqpkopit', 'Peter');
//     //
//     //     hasPanels([
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         'course-resources',
//     //         'document-delivery',
//     //         'print-balance',
//     //         'publication-metrics',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a paid Community EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emcommunity', 'Community');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans']);
//     // });
//     //
//     // it('Renders an Alumni (first year or paid) EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emalumni', 'Alumni');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans']);
//     // });
//     //
//     // it('Renders a Hospital EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emhospital', 'Hospital');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'document-delivery',
//     //         'print-balance',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
//     // });
//     //
//     // it('Renders an Associate EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emassociate', 'Associate');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'document-delivery',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans']);
//     // });
//     //
//     // it('Renders a Fryer Library EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emfryer', 'Fryer');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         // 'library-hours',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans']);
//     // });
//     //
//     // it('Renders an Honorary EM member home page correctly', () => {
//     //     expectUserToDisplayCorrectFirstName('emhonorary', 'Honorary');
//     //
//     //     hasPanels([
//     //         'computer-availability',
//     //         'course-resources',
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     hasMyLibraryButtonOptions([
//     //         'borrowing',
//     //         // 'computer-availability',
//     //         'course-resources',
//     //         'document-delivery',
//     //         // 'library-hours',
//     //         'print-balance',
//     //         'publication-metrics',
//     //         'saved-items',
//     //         'saved-searches',
//     //         'feedback',
//     //     ]);
//     //
//     //     hasPersonalisedPanelOptions(['fines', 'loans', 'print-balance']);
//     // });
//     //
//     // it('Renders a logged out user', () => {
//     //     cy.visit('/?user=public');
//     //     cy.viewport(1300, 1000);
//     //     cy.get('div#content-container').contains('Search');
//     //
//     //     hasPanels([
//     //         // 'feedback',
//     //         'library-hours',
//     //         'library-services',
//     //         'training',
//     //     ]);
//     //
//     //     // no mylibrary button
//     //     cy.get('button[data-testid="mylibrary-button"]').should('not.exist');
//     // });
// });

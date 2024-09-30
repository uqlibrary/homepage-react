/**
 * CKEditor-specific
 */

// USAGE : cy.typeCKEditor('.ckeditor[contentediable=true]', '<p>This is some text</p>');
// This is a workaround for type issue with CKEditor5 >= v35 https://github.com/ckeditor/ckeditor5/issues/12802
// Another solution is to install https://github.com/dmtrKovalenko/cypress-real-events and use realType
Cypress.Commands.add('typeCKEditor', (selector, content) => {
    return cy
        .get(selector)
        .should('exist')
        .then(el => {
            const editor = el[0].ckeditorInstance;
            editor.setData(content);
        });
});

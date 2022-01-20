// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { hasPanels } from './access';

Cypress.Commands.add('killWindowUnloadHandler', () => {
    cy.window().then(win => {
        win.onbeforeunload = undefined;
    });
});

/**
 * Enables access to redux store via cy.store().
 * Can dispatch actions like example:
 *   cy.store()
 *      .dispatch({
 *          type: 'SOMETHING_FAILED',
 *          payload: 'Simulated Error',
 *      });
 */
Cypress.Commands.add('store', () => {
    return cy.window().its('__store__');
});

// from https://github.com/cypress-io/cypress/issues/877#issuecomment-490504922
Cypress.Commands.add('isNotInViewport', element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add('isInViewport', element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state('window')).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
    });
});

// from https://gist.github.com/ZwaarContrast/00101934954980bcaa4ae70ac9930c60
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    // Code stolen from @nrutman here: https://github.com/cypress-io/cypress/issues/170
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

Cypress.Commands.add(
    'uploadFile',
    {
        prevSubject: 'element',
    },
    (subject, file, fileName) => {
        // we need access window to create a file below
        cy.window().then(window => {
            // line below could maybe be refactored to make use of Cypress.Blob.base64StringToBlob,
            // instead of this custom function.
            // inspired by @andygock, please refer to https://github.com/cypress-io/cypress/issues/170#issuecomment-389837191
            const blob = b64toBlob(file, '', 512);
            // Please note that we need to create a file using window.File,
            // cypress overwrites File and this is not compatible with our change handlers in React Code
            const testFile = new window.File([blob], fileName);
            cy.wrap(subject).trigger('drop', {
                dataTransfer: { files: [testFile], types: ['Files'] },
            });
        });
    },
);

Cypress.Commands.add('rendersALoggedoutUser', () => {
    cy.clearCookies();
    cy.visit('/?user=public');
    cy.wait(1000);
    cy.viewport(1300, 1000);
    cy.get('div#content-container').contains('Library hours');

    hasPanels(['computer-availability', 'library-hours', 'training', 'promo'], false);
});

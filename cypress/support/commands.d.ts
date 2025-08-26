/// <reference types="cypress" />

declare namespace Cypress {

    interface Chainable<Subject = any> {
        /**
         * Custom command to select DOM element by data-* attribute.
         * @param id The attribute value
         * @example cy.data('test-id')
         */
        data(id: string): Chainable<JQuery>

        /**
         * Custom command to select DOM element bt data-* attribute,
         * that *starts with* id. Also supports additional search 
         * parameters outside of the element select block.
         * @param id The attribute value
         * @param args The additional condition to use outside of the element select block e.g. div[id^=something]<additional condition here>
         * @example cy.data('test-id')
         */
        dataStartsWith(id: string, ...args: string[]): Chainable<JQuery>
        
        /**
         * Custom command to select specific DOM type elements by data-* attribute,
         * that *starts with* id. Also supports additional search
         * parameters outside of the element select block.
         * @param el The element tag, div, li, etc to query
         * @param id The beginning part of the attribute
         * @param args The additional condition to use outside of the element select block e.g. div[id^=something]<additional condition here>
         * @example cy.data('test-id')
         */
        dataByElementStartsWith(el:string, id: string, ...args: string[]): Chainable<JQuery>
    }
}
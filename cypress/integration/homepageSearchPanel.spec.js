describe('Homepage Search Panel', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="primo-search"]').contains('Search');
        cy.wait(1000);
    });
    context('Homepage Search Panel', () => {
        it('the search dropdown has the expected children', () => {
            // on first load, the library drop down displays "Library"
            cy.get('div[data-testid="primo-search-select"]').contains('Library');

            // there are a total of 9 options in the search dropdown
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-0"]')
                .parent()
                .find('li')
                .its('length')
                .should('eq', 9);

            // there are 4 links below the search text entry field, for Library
            cy.get('li[data-testid="primo-search-item-0"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 4 + 1);
        });

        it('Books search should have the expected items', () => {
            // main library search (choose Books)
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-1"]').click();

            // typing in the text area shows the correct entries from the api
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 10);
        });

        it('Databases should have the expected items', () => {
            // there are 2 links below the search text entry field, for Library
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-6"]').click();

            // there are two links below the search text area
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 2 + 1);

            //  (no suggestion api provided)
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-6"]').click();
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('history', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').should('not.exist');
        });

        it('Exams should have the expected items', () => {
            // item 8 in the drop down is exams
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-7"]').click();
            cy.get('div[data-testid="primo-search-links-6"] a')
                .should('have.attr', 'href')
                .and('include', 'exams');

            // typing in the text area shows the correct entries from the api
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 21);

            // there is one link below the search text area
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-7"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 1 + 1);
        });

        it('Course resources should have the expected items', () => {
            // item 9 in the drop down is course resources
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-8"]').click();
            cy.get('div[data-testid="primo-search-links-7"] a')
                .should('have.attr', 'href')
                .and('include', 'talis.com');

            // there is one link below the search text area
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 1 + 1);

            // typing in the text area shows the correct entries from the api
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 11);
        });
    });
});

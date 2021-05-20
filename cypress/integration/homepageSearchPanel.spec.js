describe('Homepage Search Panel', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    context('Homepage Search Panel', () => {
        it('the search dropdown has the expected children', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
            // on first load, the library drop down displays "Library"
            cy.get('div[data-testid="primo-search-select"]').contains('Library');

            // there are the correct number of options in the search dropdown
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-0"]')
                .parent()
                .find('li')
                .its('length')
                .should('eq', 9);

            // there are 4 links below the Library search text entry field
            cy.get('li[data-testid="primo-search-item-0"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 4 + 1);
        });

        it('Homepage Search accessibility', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('div#primo-search').contains('Search');
            cy.log('Primo Search - not yet touched');
            cy.checkA11y('div#primo-search', {
                reportName: 'Primo Search',
                scopeName: 'Pristine',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').contains('beard');
            cy.log('Primo Search - with autosuggestions present');
            cy.checkA11y('ul[data-testid="primo-search-autocomplete-listbox"]', {
                reportName: 'Primo Search',
                scopeName: 'Options list',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Books search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
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

            // there are 4 links below the books search text area
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-1"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 4 + 1);
        });

        it('Journal articles search should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
            // main library search (choose Journal articles)
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-2"]').click();

            // typing in the text area shows the correct entries from the api
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 10);
        });

        it('Databases should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-6"]').click();

            // there are two links below the search text area
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 2 + 1);

            //  no suggestion api available
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-6"]').click();
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('history', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').should('not.exist');

            // there are 2 links below the books search text area
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-6"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 2 + 1);
        });

        it('Exams should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
            // exams occurs in the dropdown
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-7"]').click();
            cy.get('div[data-testid="primo-search-links-6"] a')
                .should('have.attr', 'href')
                .and('include', 'exams');

            // typing in the exams text area shows the correct entries from the api
            cy.get('button[data-testid="primo-search-autocomplete-voice-clear"]').click();
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 21);

            // there is one link below the exams search text area
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-7"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 1 + 1);
        });

        it('Course resources should have the expected items', () => {
            cy.viewport(1300, 1000);
            cy.get('[data-testid="primo-search"]').contains('Search');
            cy.wait(1000);
            // course resources occurs in the dropdown
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-8"]').click();
            cy.get('div[data-testid="primo-search-links-7"] a')
                .should('have.attr', 'href')
                .and('include', 'talis.com');

            // there is one link below the course resources search text area
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 1 + 1);

            // typing in the course resources text area shows the correct entries from the api
            cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
            cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
                .find('li')
                .its('length')
                .should('eq', 11);

            // there is one link below the exams search text area
            cy.get('div[data-testid="primo-search-select"]').click();
            cy.get('li[data-testid="primo-search-item-7"]').click();
            cy.get('div[data-testid="primo-search-links"]')
                .find('div')
                .its('length')
                .should('eq', 1 + 1);
        });
    });
});

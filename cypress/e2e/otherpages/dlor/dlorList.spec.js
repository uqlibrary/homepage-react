describe('Digital Learning Hub', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const itemsPerPage = 10; // matches value in DLOList
    const extraRowCount = 2; // pagination row + hidden mobile filter icon
    context('desktop homepage visits', () => {
        beforeEach(() => {
            cy.visit('digital-learning-hub');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            // sometimes this fails locally after cypress has been open for a while - it doesn't fail on the server
            cy.injectAxe();

            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-homepage-list"] div:nth-child(2) article h2')
                    .should('exist')
                    .should('be.visible')
                    .should('contain', 'Accessibility - Digital Essentials'),
            );
            cy.get('h1').should('contain', 'Find a digital learning object');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Find a digital learning object');
            cy.get('[data-testid="dlor-homepage-list"')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            // hero card shows
            cy.get('[data-testid="hero-card-image"]')
                .should('exist')
                .should('be.visible')
                .should($img => {
                    const style = window.getComputedStyle($img[0]);
                    const width = parseInt(style.width, 10);
                    expect(width).to.be.gt(600); // vaguely check its nice and big
                });
            cy.get('[data-testid="hero-card-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Find a digital learning object');
            cy.get('[data-testid="hero-card-description"]')
                .should('exist')
                .should('be.visible')
                .contains('Use the Digital Learning Hub to find modules, videos and guides for teaching and study.');

            // sorts properly
            cy.get('[data-testid="dlor-homepage-list"] div:nth-child(2) article h2').should(
                'contain',
                'Accessibility - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-list"] div:nth-child(3) article h2').should(
                'contain',
                'UQ has a Blak History',
            );
            cy.get('[data-testid="dlor-homepage-list"] div:nth-child(4) article h2').should(
                'contain',
                'Advanced literature searching',
            );

            // article 1 contents correct
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] button').should('exist');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article header h2').should(
                'contain',
                'Accessibility - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866-cultural-advice"]').should('not.exist');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866-featured"]')
                .should('exist')
                .contains('Featured');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866-object_series_name"]')
                .should('exist')
                .contains('Series: Digital Essentials');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article header h2').should(
                'contain',
                '(Digital skills)',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article').should(
                'contain',
                'Understanding the importance of accessibility online and creating accessible content.',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article footer')
                .should('exist')
                .children()
                .should('have.length', 6); // 3 svg, 3 spans-with-text
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article footer').should('contain', 'Module');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article footer').should('contain', 'Video');
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article footer').should(
                'contain',
                'CC BY-NC Attribution NonCommercial',
            );

            // article 2 has CA
            cy.get('[data-testid="dlor-homepage-panel-kj5t_8yg4_kj4f-cultural-advice"]')
                .should('exist')
                .contains('Cultural advice');
            cy.get('[data-testid="dlor-homepage-panel-kj5t_8yg4_kj4f-featured"]')
                .should('exist')
                .contains('Featured');
            cy.get('[data-testid="dlor-homepage-panel-kj5t_8yg4_kj4f-object_series_name"]')
                .should('exist')
                .contains('Series: Indigenising curriculum');

            // article 3 contents correct
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] button').should('exist');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article header h2').should(
                'contain',
                'Advanced literature searching',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-cultural-advice"]').should('not.exist');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-featured"]').should('not.exist');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-object_series_name"]')
                .should('exist')
                .contains('Series: Advanced literature searching');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article header h2').should(
                'contain',
                '(Assignments, Research)',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article').should(
                'contain',
                'Using advanced searching techniques',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article footer')
                .should('exist')
                .children()
                .should('have.length', 6); // 3 svg, 3 spans-with-text
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-type"]').should('contain', 'Guide');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-media"]').should('contain', 'Pressbook');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-licence"]').should('contain', 'CC BY-NC');

            // fourth panel
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] button').should('exist');
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article header h2').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article header h2').should(
                'contain',
                '(Assignments, Software)',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article').should(
                'contain',
                'Types of AI, implications for society, using AI in your studies and how UQ is involved.',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article footer')
                .should('exist')
                .children()
                .should('have.length', 6); // 3 svg, 3 spans-with-text
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f-footer-type"]').should('contain', 'Module');
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f-footer-media"]').should('contain', 'H5P');
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f-footer-licence"]').should(
                'contain',
                'UQ copyright',
            );

            // filter sidebar
            cy.get('[data-testid="sidebar-panel-heading"] h2')
                .should('exist')
                .contains('Filters');

            // sidebar topic panel loads hidden
            cy.get('[data-testid="sidebar-panel-0"]')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander')
                .should('be.visible');

            // click button, hide panel
            cy.get('[data-testid="panel-minimisation-icon-0"]')
                .should('exist')
                .click();
            cy.get('[data-testid="sidebar-panel-0"]')
                .should('exist')
                .should('not.be.visible');

            // click button again, unhide
            cy.get('[data-testid="panel-minimisation-icon-0"]')
                .should('exist')
                .click();
            cy.get('[data-testid="sidebar-panel-0"]')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander')
                .should('be.visible');

            // filter item not in data is not in sidebar
            cy.get('[data-testid="panel-minimisation-icon-1"]') // Graduate Attributes
                .should('exist')
                .click();
            cy.get('[data-testid="sidebar-panel-1"]')
                .should('exist')
                .children()
                .should('have.length', 5); // one filter removed
            cy.get('[data-testid="checkbox-graduate_attributes-15"]') // Respectful leaders is missing as no data includes it
                .should('not.exist');
            cy.get('[data-testid="checkbox-graduate_attributes-14"]') // general check we haven't mucked it up completely - "Influential communicators" is still present
                .should('exist');

            cy.get('[data-testid="dlor-homepage-loginprompt"]').should('not.exist');

            // when the object doesn't have a particular facet type, it just doesn't appear in the panel footer item
            // (in practice, I think every object should have each of these)
            cy.get('[data-testid="dlor-homepage-panel-98j3-fgf95-8j34-footer-type"]').should('not.exist'); // MISSING FROM API RESULT
            cy.get('[data-testid="dlor-homepage-panel-98j3-fgf95-8j34-footer-media"]').should('contain', 'Pressbook');
            cy.get('[data-testid="dlor-homepage-panel-98j3-fgf95-8j34-footer-licence"]').should(
                'contain',
                'CC BY Attribution',
            );

            cy.visit('digital-learning-hub?user=public');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-loginprompt"]')
                .should('exist')
                .contains('Log in for extra features');
        });
        it('can filter panels', () => {
            // initially, all panels are showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            // select the "Assignments" checkbox
            cy.get('[data-testid="checkbox-topic-2"] input[type=checkbox]')
                .should('exist')
                // .should('be.visible')
                .should('not.be.checked')
                .check();

            // reduces panel count
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 4 + extraRowCount);

            // check can reduce with mutiple per "filter type
            // open the Licence type panel
            cy.get('[data-testid="panel-minimisation-icon-5"]')
                .should('exist')
                .should('have.attr', 'aria-label', 'Open this filter section');
            cy.get('[data-testid="panel-downarrow-5"]')
                .should('exist')
                .should('be.visible')
                .click();
            // check UQ copyright
            cy.get('[data-testid="checkbox-licence-51"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            // reduces panel count
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);
            // add another checkbox: CC BY-NC Attribution NonCommercial
            cy.get('[data-testid="checkbox-licence-45"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            // INCREASES panel count!!!
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3 + extraRowCount);
            // uncheck UQ copyright
            cy.get('[data-testid="checkbox-licence-51"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            // reduces panel count
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 2 + extraRowCount);
            // remove checkbox: CC BY-NC Attribution NonCommercial
            cy.get('[data-testid="checkbox-licence-45"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // open the Item type panel
            cy.get('[data-testid="panel-minimisation-icon-2"]')
                .should('exist')
                .should('have.attr', 'aria-label', 'Open this filter section');
            cy.get('[data-testid="panel-downarrow-2"]')
                .should('exist')
                .should('be.visible')
                .click();
            cy.get('[data-testid="panel-minimisation-icon-2"]')
                .should('exist')
                .should('have.attr', 'aria-label', 'Close this filter section');

            // check the "Item type, Module" checkbox
            cy.get('[data-testid="checkbox-item_type-18"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 3 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3 + extraRowCount);

            // UNcheck the "assignments" checkbox
            cy.get('[data-testid="checkbox-topic-2"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // 6 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 6 + extraRowCount);

            // UNcheck the "Media format, Module" checkbox
            cy.get('[data-testid="checkbox-item_type-18"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            // check the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-1"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // one panel showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);

            // UNcheck the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-1"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // all panels showing again
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            cy.get('[data-testid="dlor-homepage-keyword"]').type('a');
            // a single character does nothing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            // one more char
            cy.get('[data-testid="dlor-homepage-keyword"]').type('c');
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3 + extraRowCount);

            // check the "Assignments" checkbox
            cy.get('[data-testid="checkbox-topic-2"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // wipes all the panels
            cy.get('[data-testid="dlor-homepage-empty"]')
                .should('exist')
                .contains("Can't find what you are looking for?");

            // use the clear button
            cy.get('[data-testid="checkbox-topic-2"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="keyword-clear"]')
                .should('exist')
                .click();
            // all panels showing again & keyword search field empty
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('[data-testid="dlor-homepage-keyword"]').type('digital');
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 5 + extraRowCount);
        });
        it('keyword filters on each of the different options', () => {
            // "Implications" is found in the description of "Artificial Intelligence - Digital Essentials"
            cy.get('[data-testid="dlor-homepage-keyword"]').type('Implications');
            // now only one panel
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Artificial Intelligence - Digital Essentials');

            // use the clear button to clear the keyword
            cy.get('[data-testid="keyword-clear"]')
                .should('exist')
                .click();
            // all panels showing again & keyword search field empty
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('[data-testid="dlor-homepage-keyword"]').should('have.value', '');

            // "security" is found in the title of "Digital security  - Digital Essentials"
            cy.get('[data-testid="dlor-homepage-keyword"]').type('security');
            // now only one panel
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);
            cy.get('[data-testid="dlor-homepage-panel-98j3-fgf95-8j34"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Digital security - Digital Essentials');

            cy.get('[data-testid="dlor-homepage-keyword"]').type('{selectall}{backspace}');
            // all panels showing again & keyword search field empty
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('[data-testid="dlor-homepage-keyword"]').should('have.value', '');

            // "freeware" is found in the summary of "Choose the right tool - Digital Essentials"
            cy.get('[data-testid="dlor-homepage-keyword"]').type('freeware');
            // now only one panels
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);
            cy.get('[data-testid="dlor-homepage-panel-0h4y_87f3_6js7"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Choose the right tool - Digital Essentials');

            // clear form
            cy.get('[data-testid="keyword-clear"]')
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-homepage-keyword"]').type('dummy');
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button') // click pagination for page 2
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 5 + extraRowCount);
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button') // second page
                .should('exist')
                .should('have.class', 'Mui-selected');
            // when we change the search term it should return to page 1 of results
            cy.get('[data-testid="dlor-homepage-keyword"]')
                .clear()
                .type('acc');
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(3) button') // first page
                .should('exist')
                // .should('have.value', '1')
                .should('have.class', 'Mui-selected');
        });
        it('reset button works', () => {
            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(5) button') // page 3 button shows so all pages showing
                .should('exist')
                .should('be.visible');

            // check the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-1"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 1 panel showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);

            // Interactive not visible
            cy.get('[data-testid="checkbox-item_type-17"]')
                .should('exist')
                .should('not.be.visible');
            // expand a filter panel
            cy.get('[data-testid="panel-downarrow-2"]').click();
            // now the element appears
            cy.get('[data-testid="checkbox-item_type-17"]')
                .should('exist')
                .should('be.visible');

            cy.get('[data-testid="panel-help-close-1"]')
                .should('exist')
                .should('not.be.visible');
            cy.get('[data-testid="panel-help-icon-1"]')
                .should('exist')
                .click();
            cy.get('[data-testid="panel-help-close-1"]')
                .should('exist')
                .should('be.visible');

            // click reset
            cy.get('[data-testid="sidebar-filter-reset-button"]')
                .should('exist')
                .should('be.visible')
                .click({ force: true });

            // popup help closes
            cy.get('[data-testid="panel-help-close-1"]')
                .should('exist')
                .should('not.be.visible');

            // Interactive not visible
            cy.get('[data-testid="checkbox-item_type-17"]')
                .should('exist')
                .should('not.be.visible');
            cy.get('[data-testid="checkbox-topic-1"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked');
            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(5) button') // page 3 button shows so all pages showing
                .should('exist')
                .should('be.visible');

            // click reset
            cy.get('[data-testid="sidebar-filter-reset-button"]')
                .should('exist')
                .should('be.visible')
                .click({ force: true });

            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(5) button') // page 3 button shows so all pages showing
                .should('exist')
                .should('be.visible');

            // check the "CCO/Public domain" checkbox
            cy.get('[data-testid="panel-minimisation-icon-5"]').click();
            cy.get('[data-testid="checkbox-licence-50"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            // button for "go to first page of results" is highlighted
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(3) button') // first page
                .should('exist')
                // .should('have.value', '1')
                .should('have.class', 'Mui-selected');
            // change to pagination page 2
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button')
                .should('exist')
                .click();
            // button for "go to second page of results" is highlighted
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button') // second page
                .should('exist')
                .should('have.class', 'Mui-selected');

            // click reset
            cy.get('[data-testid="sidebar-filter-reset-button"]')
                .should('exist')
                .should('be.visible')
                .click({ force: true });
            // has reset pagination to page 1
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(3) button') // first page
                .should('exist')
                // .should('have.value', '1')
                .should('have.class', 'Mui-selected');
        });
        it('has working site navigation - can move around the pages', () => {
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] button')
                .should('exist')
                .click();
            // the first detail page loads
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Accessibility - Digital Essentials');
            cy.get('[data-testid="dlor-detailpage-sitelabel"] a')
                .should('exist')
                .should('have.attr', 'href', 'http://localhost:2020/digital-learning-hub')
                .click();
            // back to homepage
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Find a digital learning object');
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub');

            // check the second panel
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] button')
                .should('exist')
                .click();

            // the second detail page loads
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Advanced literature searching');

            // back to homepage
            cy.get('[data-testid="dlor-detailpage-sitelabel"] a')
                .should('exist')
                .should('have.attr', 'href', 'http://localhost:2020/digital-learning-hub')
                .click();
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Find a digital learning object');
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub');

            // check the fourth panel
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] button')
                .should('exist')
                .click();

            // the third detail page loads
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub/view/938h_4986_654f');
            cy.get('[data-testid="dlor-detailpage"] h1').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );

            // back button, alternate route back to homepage, works
            cy.go('back');
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Find a digital learning object');
            cy.url().should('include', 'http://localhost:2020/digital-learning-hub');
        });
        it('shows a previews appropriately', () => {
            // shows a preview when a youtube video is linked
            cy.visit('http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866');
            cy.get('[data-testid="detailpage-preview"]')
                .should('exist')
                .contains('Preview');
            cy.get('[data-testid="detailpage-preview"] iframe').should('exist');

            // does not show a preview for other links
            cy.visit('http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
            cy.get('[data-testid="detailpage-preview"]').should('not.exist');
            cy.get('[data-testid="detailpage-preview"] iframe').should('not.exist');
        });
        it('pagination works', () => {
            // no data-testids in pagination :(

            const numPages = 3;
            const numExtraButtons = 4; // first, prev, next, last

            // there are the expected number of buttons in pagination widget
            cy.get('nav[aria-label="pagination navigation"] li')
                .should('exist')
                .children()
                .should('have.length', numPages + numExtraButtons);

            // button for "go to first page of results" is highlighted
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(3) button') // first page
                .should('exist')
                // .should('have.value', '1')
                .should('have.class', 'Mui-selected');

            // the displayed entries are what is expected
            cy.get('[data-testid="dlor-homepage-list"] button:first-child')
                .should('exist')
                .should('be.visible');
            cy.get('[data-testid="dlor-homepage-list"] button:first-child article header h2').should(
                'contain',
                'Accessibility - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-list"] div:nth-child(11) article header h2').should(
                'contain',
                'Dummy entry to increase list size 2',
            );

            // click pagination for next page
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button')
                .should('exist')
                // .should('have.value', '2')
                .click();

            // the displayed entries have updated
            cy.get('[data-testid="dlor-homepage-list"] button:first-child')
                .should('exist')
                .should('be.visible');
            cy.get('[data-testid="dlor-homepage-list"] button:first-child article header h2').should(
                'contain',
                'Dummy entry to increase list size 3',
            );
            cy.get('[data-testid="dlor-homepage-list"] div:nth-child(11) article header h2').should(
                'contain',
                'Dummy entry to increase list size 12',
            );

            // click pagination to go to first page
            cy.get('nav[aria-label="pagination navigation"] li:first-child button')
                .should('exist')
                .click();

            // when we filter the content the number of pagination page buttons changes
            cy.get('[data-testid="dlor-homepage-keyword"]').type('digital');
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 5 + extraRowCount);
            // the number of available pages in pagination widget changes from 3 to 1
            cy.get('nav[aria-label="pagination navigation"] li')
                .should('exist')
                .children()
                .should('have.length', 1 + numExtraButtons);
        });
        it('contact us works', () => {
            cy.get('[data-testid="dlor-homepage-contact"]')
                .should('be.visible')
                .then($a => {
                    // Change the target attribute to _self for testing
                    $a.attr('target', '_self');
                })
                .click();
            cy.url().should('include', 'https://forms.office.com/');
        });
    });
    context('other homepage visits', () => {
        it('can handle an error', () => {
            cy.visit('digital-learning-hub?responseType=error');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-error"]')
                .should('exist')
                .contains('An error has occurred during the request and this request cannot be processed');
            cy.get('[data-testid="dlor-homepage-filter-error"]')
                .should('exist')
                .contains('Filters currently unavailable - please try again later.');
        });
        it('can handle an empty result', () => {
            // this should never happen. Maybe immediately after initial upload
            cy.visit('digital-learning-hub?responseType=emptyResult');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-noresult"]')
                .should('exist')
                .contains('We did not find any entries in the system - please try again later.');
        });
        it('mobile page works as expected', () => {
            cy.visit('digital-learning-hub');
            cy.viewport(800, 900);

            // tablet/phone hero images should be full width
            let bodyWidth;
            cy.get('body').should($elem => {
                bodyWidth = $elem.width();
            });
            cy.get('[data-testid="hero-card-image"]')
                .should('exist')
                .should('be.visible')
                .should($img => {
                    expect($img.width()).to.equal(bodyWidth);
                });
            cy.get('[data-testid="hero-card-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Find a digital learning object');
            cy.get('[data-testid="hero-card-description"]')
                .should('exist')
                .should('be.visible')
                .contains('Use the Digital Learning Hub to find modules, videos and guides for teaching and study.');

            // filters correctly
            cy.get('[data-testid="filterSidebar"]')
                .should('exist')
                .should('not.be.visible');

            cy.get('[data-testid="filterIconShowId"]')
                .should('exist')
                .should('be.visible')
                .find('button')
                .click();
            cy.get('[data-testid="filterSidebar"]').scrollIntoView();
            cy.get('[data-testid="filterIconShowId"]')
                .should('exist')
                .should('not.be.visible');

            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', itemsPerPage + extraRowCount);

            cy.get('[data-testid="checkbox-topic-1"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + extraRowCount);

            // hide the filter section
            cy.get('[data-testid="filterIconHideId"]')
                .should('exist')
                .should('be.visible')
                .find('button')
                .click();
            cy.get('[data-testid="filterSidebar"]')
                .should('exist')
                .should('not.be.visible');
        });
    });
});

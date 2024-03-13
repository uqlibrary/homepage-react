describe('Digital Object learning Repository (DLOR)', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    context('homepage', () => {
        it('is accessible', () => {
            cy.visit('dlor');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.get('[data-testid="dlor-homepage-list"')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);

            // first panel
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] a').should(
                'have.attr',
                'href',
                'http://localhost:2020/dlor/view/987y_isjgt_9866',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article header h2').should(
                'contain',
                'Accessibility - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article').should(
                'contain',
                'Understanding the importance of accessibility online and creating accessible content.',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] article footer')
                .should('exist')
                .children()
                .should('have.length', 3);

            // second panel
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] a').should(
                'have.attr',
                'href',
                'http://localhost:2020/dlor/view/98s0_dy5k3_98h4',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article header h2').should(
                'contain',
                'Advanced literature searching',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article').should(
                'contain',
                'Using advanced searching techniques',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article footer')
                .should('exist')
                .children()
                .should('have.length', 3);
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-type"]').should('contain', 'Guide');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-media"]').should('contain', 'Pressbook');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-licence"]').should('contain', 'CC BY-NC');

            // fourth panel
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] a').should(
                'have.attr',
                'href',
                'http://localhost:2020/dlor/view/938h_4986_654f',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article header h2').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article').should(
                'contain',
                'Types of AI, implications for society, using AI in your studies and how UQ is involved.',
            );
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] article footer')
                .should('exist')
                .children()
                .should('have.length', 3);
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

            cy.get('[data-testid="dlor-homepage-loginprompt"]').should('not.exist');

            cy.visit('dlor?user=public');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-loginprompt"]')
                .should('exist')
                .contains('Login for a better experience');
        });
        it('has a working sidebar filter', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);

            // initially, all panels are showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);

            // select the "Assignments" checkbox
            cy.get('[data-testid="checkbox-topic-assignments"] input[type=checkbox]')
                .should('exist')
                // .should('be.visible')
                .should('not.be.checked')
                .check();

            // reduces to 4 panels
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 4 + 1);

            // unhide the Item type panel
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
            cy.get('[data-testid="checkbox-item_type-module"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // some panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3 + 1);

            // UNcheck the "assignments" checkbox
            cy.get('[data-testid="checkbox-topic-assignments"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // many panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 7 + 1);

            // UNcheck the "Media format, Module" checkbox
            cy.get('[data-testid="checkbox-item_type-module"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);

            // check the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // one panel showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + 1);

            // UNcheck the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // all panels showing again
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);
        });
        it('can handle an error', () => {
            cy.visit('dlor?user=errorUser');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-error"]')
                .should('exist')
                .contains('Error has occurred during request');
            cy.get('[data-testid="dlor-homepage-filter-error"]')
                .should('exist')
                .contains('Filters currently unavailable - please try again later.');
        });
        it('can handle an empty result', () => {
            // this should never happen. Maybe immediately after intial upload
            cy.visit('dlor?user=emptyResult');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-empty"]')
                .should('exist')
                .contains('We did not find any entries in the system - please try again later.');
        });
        it('reset button works', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);
            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);

            // check the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 1 panel showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + 1);

            // interactive activity not visible
            cy.get('[data-testid="checkbox-item_type-type_interactive_activity"]')
                .should('exist')
                .should('not.be.visible');
            // expand a filter panel
            cy.get('[data-testid="panel-downarrow-2"]').click();
            // now the element appears
            cy.get('[data-testid="checkbox-item_type-type_interactive_activity"]')
                .should('exist')
                .should('be.visible');

            // click reset
            cy.get('[data-testid="sidebar-filter-reset-button"]')
                .should('exist')
                .should('be.visible')
                .click({ force: true });

            // interactive activity not visible
            cy.get('[data-testid="checkbox-item_type-type_interactive_activity"]')
                .should('exist')
                .should('not.be.visible');
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked');
            // all panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8 + 1);
        });
        it('still filters on mobile page', () => {
            cy.visit('dlor');
            cy.viewport(800, 900);

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
                .should('have.length', 8 + 1); // all panels plus filter button

            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1 + 1); // one panel plus filter button

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

    context('has working site navigation', () => {
        it('can move around the pages', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] a')
                .should('have.attr', 'href', 'http://localhost:2020/dlor/view/987y_isjgt_9866')
                .click();
            // the first detail page loads
            cy.url().should('include', 'http://localhost:2020/dlor/view/987y_isjgt_9866');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Accessibility - Digital Essentials');
            cy.get('[data-testid="dlor-detailpage-sitelabel"] a')
                .should('exist')
                .should('have.attr', 'href', 'http://localhost:2020/dlor')
                .click();
            // back to homepage
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', 'http://localhost:2020/dlor');

            // check the second panel
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] a')
                .should('have.attr', 'href', 'http://localhost:2020/dlor/view/98s0_dy5k3_98h4')
                .click();

            // the second detail page loads
            cy.url().should('include', 'http://localhost:2020/dlor/view/98s0_dy5k3_98h4');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Advanced literature searching');

            // back to homepage
            cy.get('[data-testid="dlor-detailpage-sitelabel"] a')
                .should('exist')
                .should('have.attr', 'href', 'http://localhost:2020/dlor')
                .click();
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', 'http://localhost:2020/dlor');

            // check the fourth panel
            cy.get('[data-testid="dlor-homepage-panel-938h_4986_654f"] a')
                .should('have.attr', 'href', 'http://localhost:2020/dlor/view/938h_4986_654f')
                .click();

            // the third detail page loads
            cy.url().should('include', 'http://localhost:2020/dlor/view/938h_4986_654f');
            cy.get('[data-testid="dlor-detailpage"] h1').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );

            // back button, alternate route back to homepage, works
            cy.go('back');
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', 'http://localhost:2020/dlor');
        });
    });

    context('details page', () => {
        it('is accessible', () => {
            cy.visit('dlor/view/98s0_dy5k3_98h4');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="dlor-detailpage"] h1').should('exist'));
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Advanced literature searching');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            cy.intercept('GET', 'https://uq.h5p.com/content/1291624610498497569', {
                statusCode: 200,
                body: 'user has navigated to pressbook link',
            });

            cy.visit('dlor/view/938h_4986_654f');
            // body contewnt is as expected
            cy.get('[data-testid="dlor-detailpage"] h1').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );
            cy.get('[data-testid="dlor-detailpage-description"]').should(
                'contain',
                'Types of AI, implications for society, using AI in your studies and how UQ is involved. (longer lines)',
            );
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'How to use this module');
            cy.get('[data-testid="dlor-detailpage"] div:first-child > p').should(
                'contain',
                'Download the Common Cartridge file and H5P quiz to embed in Blackboard',
            );

            // meta data in sidebar is as expected
            cy.get('[data-testid="detailpage-filter-topic"] h3')
                .should('exist')
                .contains('Topic');
            cy.get('[data-testid="detailpage-filter-topic"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-topic"] ul li:first-child')
                .should('exist')
                .should('contain', 'Software');
            cy.get('[data-testid="detailpage-filter-topic"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Assignments');

            cy.get('[data-testid="detailpage-filter-item_type"] h3')
                .should('exist')
                .contains('Item type');
            cy.get('[data-testid="detailpage-filter-item_type"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-item_type"] ul li:first-child')
                .should('exist')
                .should('contain', 'Module');

            cy.get('[data-testid="detailpage-filter-media_format"] h3')
                .should('exist')
                .contains('Media format');
            cy.get('[data-testid="detailpage-filter-media_format"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-media_format"] ul li:first-child')
                .should('exist')
                .should('contain', 'H5P');

            cy.get('[data-testid="detailpage-filter-subject"] h3')
                .should('exist')
                .contains('Subject');
            cy.get('[data-testid="detailpage-filter-subject"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-subject"] ul li:first-child')
                .should('exist')
                .should('contain', 'Health; Behavioural Sciences');
            cy.get('[data-testid="detailpage-filter-subject"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Medicine; Biomedical Sciences');

            cy.get('[data-testid="detailpage-filter-licence"] h3')
                .should('exist')
                .contains('Licence');
            cy.get('[data-testid="detailpage-filter-licence"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-licence"] ul li:first-child')
                .should('exist')
                .should('contain', 'UQ copyright');

            cy.get('[data-testid="detailpage-filter-graduate_attributes"] h3')
                .should('exist')
                .contains('Graduate attributes');
            cy.get('[data-testid="detailpage-filter-graduate_attributes"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-graduate_attributes"] ul li:first-child')
                .should('exist')
                .should('contain', 'Influential communicators');
            cy.get('[data-testid="detailpage-filter-graduate_attributes"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Accomplished scholars');

            // the link can be clicked
            cy.get('[data-testid="dlor-detailpage"] a').should('contain', 'Access the module');
            cy.get('[data-testid="dlor-detailpage"] a')
                .should('exist')
                .should('contain', 'Access the module')
                .click();
            cy.get('body').contains('user has navigated to pressbook link');
        });
        it('can handle an error', () => {
            cy.visit('dlor/view/98s0_dy5k3_98h4?user=errorUser');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-error"]')
                .should('exist')
                .contains('Error has occurred during request');
        });
        it('can handle an empty result', () => {
            // this should never happen. Maybe immediately after intial upload
            cy.visit('dlor/view/not-found?user=emptyResult');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-empty"]')
                .should('exist')
                .contains('We could not find the requested entry - please check the web address.');
        });
    });
});
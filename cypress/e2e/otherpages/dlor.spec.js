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
                .should('have.length', 3);

            // first panel
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] a').should(
                'have.attr',
                'href',
                '/dlor/view/987y_isjgt_9866',
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
                .should('have.length', 1);

            // second panel
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] a').should(
                'have.attr',
                'href',
                '/dlor/view/98s0_dy5k3_98h4',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article header h2').should(
                'contain',
                'Advanced literature searching',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article').should(
                'contain',
                'This tutorial covers the advanced searching techniques that can be used for all topics',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] article footer')
                .should('exist')
                .children()
                .should('have.length', 3);
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-type"]').should('contain', 'Guide');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-media"]').should('contain', 'Pressbook');
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4-footer-licence"]').should('contain', 'CC BY-NC');

            // third panel
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff"] a').should(
                'have.attr',
                'href',
                '/dlor/view/9jkh_9j4ld_0dff',
            );
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff"] article header h2').should(
                'contain',
                'Advanced literature searching for health and medicine',
            );
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff"] article').should(
                'contain',
                'Learn how to conduct advanced literature searching for health and medicine.',
            );
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff"] article footer')
                .should('exist')
                .children()
                .should('have.length', 3);
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff-footer-type"]').should('contain', 'Module');
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff-footer-media"]').should('contain', 'H5P');
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff-footer-licence"]').should(
                'contain',
                'UQ copyright',
            );

            // filter sidebar
            cy.get('[data-testid="sidebar-panel-heading"] h2')
                .should('exist')
                .contains('Filters');

            // sidebar panel loads open
            cy.get('[data-testid="sidebar-panel-1"]')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander')
                .should('be.visible');

            // click button, close panel
            cy.get('[data-testid="panel-minimisation-icon-1"]')
                .should('exist')
                .click();
            cy.get('[data-testid="sidebar-panel-1"]')
                .should('exist')
                .should('not.be.visible');

            // click button again, reopen
            cy.get('[data-testid="panel-minimisation-icon-1"]')
                .should('exist')
                .click();
            cy.get('[data-testid="sidebar-panel-1"]')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander')
                .should('be.visible');
        });
        it('has a working sidebar filter', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);

            // 3 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3);

            // check the "Assignments" checkbox
            cy.get('[data-testid="checkbox-topic-Assignments"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 2 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 2);

            // check the "Digital" checkbox
            cy.get('[data-testid="checkbox-topic-digital_skills"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 2 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 2);

            // check the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();

            // 3 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3);

            // UNcheck the "Digital" checkbox
            cy.get('[data-testid="checkbox-topic-digital_skills"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // 3 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3);

            // UNcheck the "Assignments" checkbox
            cy.get('[data-testid="checkbox-topic-Assignments"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // 1 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 1);

            // UNcheck the "ATSIC" checkbox
            cy.get('[data-testid="checkbox-topic-aboriginal_and_torres_strait_islander"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();

            // original 3 panels showing
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 3);
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
    });

    context('has working site navigation', () => {
        it('can move around the pages', () => {
            cy.visit('dlor');
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('[data-testid="dlor-homepage-panel-987y_isjgt_9866"] a')
                .should('have.attr', 'href', '/dlor/view/987y_isjgt_9866')
                .click();
            // the first detail page loads
            cy.url().should('include', '/dlor/view/987y_isjgt_9866');
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'Accessibility - Digital Essentials');
            cy.get('h1 a')
                .should('exist')
                .should('have.attr', 'href', '/dlor')
                .click();
            // back to homepage
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', '/dlor');

            // check the second panel
            cy.get('[data-testid="dlor-homepage-panel-98s0_dy5k3_98h4"] a')
                .should('have.attr', 'href', '/dlor/view/98s0_dy5k3_98h4')
                .click();

            // the second detail page loads
            cy.url().should('include', '/dlor/view/98s0_dy5k3_98h4');
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'Advanced literature searching');

            // back to homepage
            cy.get('h1 a')
                .should('exist')
                .should('have.attr', 'href', '/dlor')
                .click();
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', '/dlor');

            // check the third panel
            cy.get('[data-testid="dlor-homepage-panel-9jkh_9j4ld_0dff"] a')
                .should('have.attr', 'href', '/dlor/view/9jkh_9j4ld_0dff')
                .click();

            // the third detail page loads
            cy.url().should('include', '/dlor/view/9jkh_9j4ld_0dff');
            cy.get('[data-testid="dlor-detailpage"] h2').should(
                'contain',
                'Advanced literature searching for health and medicine',
            );

            // back button works
            cy.go('back');
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning objects');
            cy.url().should('include', '/dlor');
        });
    });

    context('details page', () => {
        it('is accessible', () => {
            cy.visit('dlor/view/98s0_dy5k3_98h4');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="dlor-detailpage"] h2').should('exist'));
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'Advanced literature searching');
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

            cy.visit('dlor/view/9jkh_9j4ld_0dff');
            // body contewnt is as expected
            cy.get('[data-testid="dlor-detailpage"] h2').should(
                'contain',
                'Advanced literature searching for health and medicine',
            );
            cy.get('[data-testid="dlor-detailpage-description"]').should(
                'contain',
                'Learn how to conduct advanced literature searching for health and medicine',
            );
            cy.get('[data-testid="dlor-detailpage"] h3').should('contain', 'How to use this module');
            cy.get('[data-testid="dlor-detailpage"] div:first-child > p').should(
                'contain',
                'Download the Common Cartridge file and H5P quiz to embed in Blackboard',
            );

            // meta data in sidebar is as expected
            cy.get('[data-testid="detailpage-filter-topic"] h4')
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

            cy.get('[data-testid="detailpage-filter-media_format"] h4')
                .should('exist')
                .contains('Media format');
            cy.get('[data-testid="detailpage-filter-media_format"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-media_format"] ul li:first-child')
                .should('exist')
                .should('contain', 'H5P');

            cy.get('[data-testid="detailpage-filter-subject"] h4')
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

            cy.get('[data-testid="detailpage-filter-licence"] h4')
                .should('exist')
                .contains('Licence');
            cy.get('[data-testid="detailpage-filter-licence"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-licence"] ul li:first-child')
                .should('exist')
                .should('contain', 'UQ copyright');

            cy.get('[data-testid="detailpage-filter-item_type"] h4')
                .should('exist')
                .contains('Item type');
            cy.get('[data-testid="detailpage-filter-item_type"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-item_type"] ul li:first-child')
                .should('exist')
                .should('contain', 'Module');

            cy.get('[data-testid="detailpage-filter-graduate_attributes"] h4')
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

describe('Digital Learning Hub View page', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    context('details page', () => {
        it('appears as expected', () => {
            cy.visit('digital-learning-hub/view/938h_4986_654f');
            // body content is as expected
            cy.get('[data-testid="dlor-detailpage"] h1').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );
            cy.get('[data-testid="dlor-detailpage-description"]').should(
                'contain',
                'Types of AI, implications for society, using AI in your studies and how UQ is involved. (longer lines)',
            );
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'How to use this object');
            // cy.get('[data-testid="dlor-massaged-download-instructions"]').should(
            //     'contain',
            //     'Download the Common Cartridge file and H5P quiz to embed in Blackboard',
            // );

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
                .should('contain', 'Assignments');
            cy.get('[data-testid="detailpage-filter-topic"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Software');

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
                .should('contain', 'Accomplished scholars');
            cy.get('[data-testid="detailpage-filter-graduate_attributes"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Influential communicators');

            cy.get('[data-testid="detailpage-metadata-keywords"]')
                .should('exist')
                .within(() => {
                    cy.get('h3').should('contain', 'Keywords');
                    cy.get('ul')
                        .children()
                        .should('have.length', 8);
                    cy.get('li:first-child').contains('Generative AI');
                });

            // the link can be clicked
            cy.intercept('GET', 'https://uq.h5p.com/content/1291624610498497569', {
                statusCode: 200,
                body: 'user has navigated to pressbook link',
            });
            cy.get('[data-testid="detailpage-getit-button"] a')
                .should('exist')
                .should('contain', 'Access the object')
                .click();
            cy.get('body').contains('user has navigated to pressbook link');
        });
        it('is accessible', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4');
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
        it('a view page without keywords has a sensible sidebar', () => {
            cy.visit('digital-learning-hub/view/9k45_hgr4_876h');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'EndNote 20: Getting started');
            cy.get('[data-testid="detailpage-metadata-keywords"]').should('not.exist');
        });
        it('markdown translation works', () => {
            cy.visit('digital-learning-hub/view/987y_isjgt_9866');
            cy.viewport(1300, 1000);
            // cy.get('[data-testid="dlor-massaged-download-instructions"] a')
            //     .should('exist')
            //     .contains('example link')
            //     .should('have.attr', 'href', 'http://example.com');
        });
        it('can handle an error', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?responseType=error');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-error"]')
                .should('exist')
                .contains('An error has occurred during the request and this request cannot be processed');
        });
        it('can handle an empty result', () => {
            // this should never happen. Maybe immediately after initial upload
            cy.visit('digital-learning-hub/view/missingRecord');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-empty"]')
                .should('exist')
                .contains('We could not find the requested entry - please check the web address.');
        });
    });
    context('"Access it" units show properly', () => {
        it('A watchable object shows the correct units on the Get It button', () => {
            cy.visit('digital-learning-hub/view/987y_isjgt_9866');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-getit-button"] a')
                .should('exist')
                .should('have.text', 'Access the object (video 47m 44s)');
        });

        it('A downloadable object shows the correct units on the Get It button', () => {
            cy.visit('digital-learning-hub/view/9bc192a8-324c-4f6b-ac50-07e7ff2df240');

            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-getit-button"] a')
                .should('exist')
                .should('have.text', 'Access the object (XLS 3.4 GB)');
        });

        it('A neither watchable nor downloadable object shows just "Accesss the object" on the Get It button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-getit-button"] a')
                .should('exist')
                .should('have.text', 'Access the object');
        });
    });
    context('Access', () => {
        it('the non-logged in user is prompted to login', () => {
            cy.visit('digital-learning-hub/view/987y_isjgt_9866?user=public');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-homepage-loginprompt"]')
                .should('exist')
                .contains('Log in for the full experience');
        });
        it('Admin sees an edit button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?user=dloradmn');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-admin-edit-button"]')
                .should('exist')
                .contains('Edit');
            cy.get('[data-testid="detailpage-admin-edit-button"]').click();
            cy.url().should('eq', 'http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=dloradmn');
        });
        it('Non-Admin does NOT see an edit button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-detailpage"]')
                    .should('exist')
                    .contains('Advanced literature searching'),
            );
            cy.get('[data-testid="detailpage-admin-edit-button"]').should('not.exist');
        });
    });
});
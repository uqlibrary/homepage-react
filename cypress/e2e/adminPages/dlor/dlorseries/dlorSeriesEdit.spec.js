import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Series management - edit item', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Series management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('loads as expected', () => {
            // series name shows correctly
            cy.get('[data-testid="object_series_name"] input')
                .should('exist')
                .should('have.value', 'Advanced literature searching');
            // linked
            cy.get('[data-testid="object_series_order-98s0_dy5k3_98h4"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 1);
            cy.get('[data-testid="object_series_order-9bc1894a-8b0d-46da-a25e-02d26e2e056c"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 2);
            // unaffiliated
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-01"] input')
                .should('exist')
                .should('have.value', '');
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-01"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(false);
            });
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-02"] input')
                .should('exist')
                .should('have.value', '');
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(false);
            });
            // there are more, but thats probably enough
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Series');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor series management edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('functions as expected', () => {
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(false);
            });
            cy.get('[data-testid="admin-dlor-series-summary-button"]').click();

            // Now, the div should be visible
            cy.get('[data-testid="object_series_order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(true);
            });
        });
        it('has a working "view a dlor" button', () => {
            cy.get('a[target="_blank"][data-testid="dlor-series-edit-view-2"]')
                .should('be.visible')
                .then($a => {
                    // Change the target attribute to _self for testing
                    $a.attr('target', '_self');
                })
                .click();

            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
        });
    });
    context('successfully mock to db', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });

        it('saves correctly', () => {
            cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                expect(cookie).to.exist;
                expect(cookie.value).to.equal('active');
            });
            cy.get('[data-testid="object_series_name"] input').type(' xxx');
            cy.get('[data-testid="admin-dlor-series-form-save-button"]')
                .should('exist')
                .click();

            const expectedValues = {
                series_name: 'Advanced literature searching xxx',
                series_list: [
                    {
                        object_uuid: '98s0_dy5k3_98h4',
                        object_series_order: 1,
                    },
                    {
                        object_uuid: '9bc1894a-8b0d-46da-a25e-02d26e2e056c',
                        object_series_order: 2,
                    },
                ],
            };
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                console.log('sentValues=', sentValues);
                console.log('expectedValues=', expectedValues);

                // had trouble comparing the entire structure
                const sentFacets = sentValues.facets;
                const expectedFacets = expectedValues.facets;
                const sentKeywords = sentValues.object_keywords;
                const expectedKeywords = expectedValues.object_keywords;
                delete sentValues.facets;
                delete expectedValues.facets;
                // delete sentValues.object_description;
                // delete expectedValues.object_description;
                delete sentValues.object_keywords;
                delete expectedValues.object_keywords;
                delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                delete expectedValues.object_review_date_next;

                console.log('Comparison', sentValues, expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);
                expect(sentFacets).to.deep.equal(expectedFacets);
                expect(sentKeywords).to.deep.equal(expectedKeywords);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/edit/1?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/edit/1?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Series');
        });
    });
});

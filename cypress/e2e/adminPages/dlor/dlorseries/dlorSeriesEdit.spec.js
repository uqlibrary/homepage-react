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
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub admin');
                });
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Edit Series');

            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('a[data-testid="dlor-breadcrumb-series-management-link-0"]')
                .contains('Series management')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="dlor-breadcrumb-edit-series-label-1"]').contains(
                'Edit series: Advanced literature searching',
            );

            // series name shows correctly
            cy.get('[data-testid="series-name"] input')
                .should('exist')
                .should('have.value', 'Advanced literature searching');
            // linked
            cy.get('[data-testid="object-series-order-98s0-dy5k3-98h4"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 1);
            cy.get('[data-testid="object-series-order-9bc1894a-8b0d-46da-a25e-02d26e2e056c"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 2);
            cy.get('[data-testid="dlor-series-edit-draggable-title-9bc1894a-8b0d-46da-a25e-02d26e2e056c"]')
                .should('exist')
                .contains('(Deprecated)');
            // unaffiliated
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-01"] input')
                .should('exist')
                .should('have.value', '');
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-01"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(false);
            });
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input')
                .should('exist')
                .should('have.value', '');
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
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
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(false);
            });
            cy.get('[data-testid="admin-dlor-series-summary-button"]').click();

            // Now, the div should be visible
            cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
                const isVisible = $el[0].checkVisibility();
                expect(isVisible).to.eq(true);
            });
        });
        it('has a working "cancel edit" button', () => {
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="admin-dlor-series-form-button-cancel"]')
                    .should('exist')
                    .contains('Cancel'),
            );
            cy.get('[data-testid="admin-dlor-series-form-button-cancel"]').click();
            cy.waitUntil(() => cy.get('[data-testid="dlor-serieslist-edit-1"]').should('exist'));
            cy.url().should('eq', `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
        });
        it('has a working "view a dlor" button', () => {
            cy.get('a[target="_blank"][data-testid="dlor-series-edit-view-2"]')
                .should('be.visible')
                .then($a => {
                    // Change the target attribute to _self for testing
                    $a.attr('target', '_self');
                })
                .click();

            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4?user=dloradmn');
        });
    });
    context('successfully mock to db', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });

        it('saves correctly with reload form', () => {
            cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                expect(cookie).to.exist;
                expect(cookie.value).to.equal('active');
            });

            cy.waitUntil(() =>
                cy.get('[data-testid="series-name"] input').should('have.value', 'Advanced literature searching'),
            );
            cy.get('[data-testid="series-name"] input').type(' xxx');
            cy.get('[data-testid="admin-dlor-series-form-save-button"]')
                .should('exist')
                .click();

            const expectedValues = {
                series_name: 'Advanced literature searching xxx',
                series_list: [
                    {
                        object_public_uuid: '98s0_dy5k3_98h4',
                        object_series_order: 1,
                    },
                    {
                        object_public_uuid: '9bc1894a-8b0d-46da-a25e-02d26e2e056c',
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

                console.log('Comparison', sentValues, expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            // prompted when save succeeds
            cy.get('[data-testid="dialogbox-dlor-series-save-outcome"] h2').contains('Changes have been saved');
            cy.get('[data-testid="confirm-dlor-series-save-outcome"]')
                .should('exist')
                .contains('Return to Admin Series page');
            cy.get('[data-testid="cancel-dlor-series-save-outcome"]')
                .should('exist')
                .contains('Re-edit Series');

            // choose to re-edit series
            cy.get('[data-testid="cancel-dlor-series-save-outcome"]')
                .should('exist')
                .click();

            // form reloads
            cy.url().should('eq', `http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital Learning Hub - Edit Series');
            cy.get('[data-testid="series-name"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'Advanced literature searching');
        });
        it('saves correctly with return to list', () => {
            cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                expect(cookie).to.exist;
                expect(cookie.value).to.equal('active');
            });

            cy.waitUntil(() =>
                cy.get('[data-testid="series-name"] input').should('have.value', 'Advanced literature searching'),
            );
            cy.get('[data-testid="series-name"] input').type(' yyy');
            cy.get('[data-testid="admin-dlor-series-form-save-button"]')
                .should('exist')
                .click();

            const expectedValues = {
                series_name: 'Advanced literature searching yyy',
                series_list: [
                    {
                        object_public_uuid: '98s0_dy5k3_98h4',
                        object_series_order: 1,
                    },
                    {
                        object_public_uuid: '9bc1894a-8b0d-46da-a25e-02d26e2e056c',
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

                console.log('Comparison', sentValues, expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            // prompted when save succeeds
            cy.get('[data-testid="dialogbox-dlor-series-save-outcome"] h2').contains('Changes have been saved');
            cy.get('[data-testid="confirm-dlor-series-save-outcome"]')
                .should('exist')
                .contains('Return to Admin Series page');
            cy.get('[data-testid="cancel-dlor-series-save-outcome"]')
                .should('exist')
                .contains('Re-edit Series');

            // choose to return to list page
            cy.get('[data-testid="confirm-dlor-series-save-outcome"]')
                .should('exist')
                .click();

            // list page loads
            cy.url().should('eq', `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital Learning Hub - Series management');
        });
    });

    context('failures', () => {
        it('a failed save shows correctly', () => {
            cy.visit(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}&responseType=saveError`);
            cy.viewport(1300, 1000);

            cy.get('[data-testid="series-name"] input').type(' yyy');
            cy.get('[data-testid="admin-dlor-series-form-save-button"]')
                .should('exist')
                .click();

            // it failed! just what we wanted :)
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-series-save-outcome"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-series-save-outcome"] h2').contains(
                'An error has occurred during the request and this request cannot be processed.',
            );
            cy.get('[data-testid="cancel-dlor-series-save-outcome"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-series-save-outcome"]')
                .should('exist')
                .contains('Close');
            cy.get('[data-testid="confirm-dlor-series-save-outcome"]').click();
        });
        it('a failed api load shows correctly', () => {
            cy.visit(
                `http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}&responseType=fullListError`,
            );
            cy.waitUntil(() => cy.get('[data-testid="dlor-seriesItem-error"]').should('exist'));
            cy.get('[data-testid="dlor-seriesItem-error"]').contains('An error has occurred during the request');
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

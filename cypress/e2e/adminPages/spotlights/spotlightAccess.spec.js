import { FILTER_STORAGE_NAME } from '../../../support/spotlights';
describe('access to Spotlight Admin is controlled', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    context('Spotlight Admin public access blocked', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/spotlights?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/spotlights?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('add page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/spotlights/add?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/spotlights/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('edit page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/spotlights?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/spotlights/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('clone page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/spotlights?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/spotlights/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('view page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/spotlights?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/spotlights/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });

    context('Spotlight Admin non admin access blocked', () => {
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('add page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('edit page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/spotlights/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('clone page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/spotlights/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('view page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/spotlights/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });
});

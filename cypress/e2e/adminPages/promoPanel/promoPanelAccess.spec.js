describe('access to Promopanel Admin is controlled', () => {
    context('Promo Panel public access blocked', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('add page displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('edit page displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/edit/1?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('clone page displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/clone/1?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });

    context('PromoPanel Admin non admin access blocked', () => {
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('add page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('edit page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/edit/1?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('clone page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/clone/1?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });

    context('PromoPanel Admin access allowed for admins', () => {
        it('displays correct page for admin users (list)', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
        });
        it('add page displays to authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
        });
        it('edit page displays to authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/edit/1?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
        });
        it('clone page displays to authorised users', () => {
            cy.visit('http://localhost:2020/admin/promopanel/clone/1?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
        });
    });
});

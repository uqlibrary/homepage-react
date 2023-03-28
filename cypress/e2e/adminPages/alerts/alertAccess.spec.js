describe('Alerts Admin Page access', () => {
    context('Alert Admin public access blocked', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/alerts?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/alerts?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('add page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/alerts?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/alerts/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('edit page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/alerts?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('clone page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/alerts?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('view page displays an "unauthorised" page to public users', () => {
            cy.visit('/admin/alerts?user=uqstaff');
            cy.wait(10);
            cy.visit('http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });

    context('Alert Admin non admin access blocked', () => {
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('add page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('edit page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('clone page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('view page displays an "unauthorised" page to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });
});

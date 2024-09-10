describe('Chatbot', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('chatbot', () => {
        beforeEach(() => {
            cy.visit('chatbot.html');
            cy.viewport(1300, 1000);
        });
        it('works as expected', () => {
            cy.waitUntil(() => cy.get('article').should('exist'));
            cy.contains('article', 'provide your name');

            cy.window().then(win => {
                const value = win.sessionStorage.getItem('directLineToken');
                expect(value).to.not.be.null; // for comparison with other test
            });
        });
    });
    context('chatbot without session storage', () => {
        const testCookieName = 'SESSIONSTORAGE_BLOCKED';
        beforeEach(() => {
            cy.setCookie(testCookieName, 'active');

            cy.visit('chatbot.html');
            cy.viewport(1300, 1000);
        });
        it('works without session storage', () => {
            cy.getCookie(testCookieName).then(cookie => {
                console.log(cookie);
            });

            cy.waitUntil(() => cy.get('article').should('exist'));
            cy.contains('article', 'provide your name');

            cy.log('testCookieName=', testCookieName);
            cy.getCookie(testCookieName).then(cookie => {
                expect(cookie).to.exist;
            });
            cy.window().then(win => {
                const value = win.sessionStorage.getItem('directLineToken');
                expect(value).to.be.null; // did not use staorage
            });
        });
    });
});

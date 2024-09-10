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
            cy.contains('article', 'Hi, I’m the DEV Library Chatbot.');
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
            let oldCookie = { value: '' };
            console.log('oldCookie=', oldCookie);
            cy.getCookie(testCookieName).then(cookie => {
                console.log('1 cookie=', cookie);
                oldCookie = cookie;
            });
            // cy.waitUntil(() =>
            //     cy.getCookie(testCookieName).then(cookie => {
            console.log('2 oldCookie=', oldCookie);
            //         console.log('cookie=', cookie);
            //         return oldCookie.value !== cookie.value;
            //     }),
            // );

            cy.waitUntil(() => cy.get('article').should('exist'));
            cy.contains('article', 'Hi, I’m the DEV Library Chatbot.');

            cy.log('testCookieName=', testCookieName);
            cy.getCookie(testCookieName).then(cookie => {
                console.log('cookie=', cookie);
                expect(cookie).to.exist;
            });
        });
    });
});

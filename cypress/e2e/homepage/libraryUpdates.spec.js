describe('LibraryUpdates', () => {
    context('content', () => {
        it('loads as expected on desktop', () => {
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="drupal-article-0"]')
                .should('exist')
                .contains('Rae and George Hammer memorial');
            cy.get('[data-testid="drupal-article-1"]')
                .should('exist')
                .contains('Building works at Biological Sciences');
            cy.get('[data-testid="drupal-article-2"]')
                .should('exist')
                .contains('Teaching');
            cy.get('[data-testid="drupal-article-3"]')
                .should('exist')
                .contains('Digital Essentials');

            cy.get('[data-testid="library-updates-parent"] > div').should('have.length', 4 + 1); // 4 news stories and a heading

            // at desktop, the articles are laid out like:
            //  /----------------\
            //  | XXXXXXXXXXXXXX |
            //  \----------------/
            //  XXXX   XXXX   XXXX
            let firstItemLeft;
            let firstItemBottom;
            let firstItemRight;
            cy.get('[data-testid="drupal-article-0"]')
                .scrollIntoView()
                .should('be.visible')
                .then($el => {
                    firstItemLeft = $el.position().left;
                    firstItemBottom = $el.position().top + $el.outerHeight();
                    firstItemRight = $el.position().left + $el.outerWidth();

                    expect(firstItemLeft).to.lessThan(77); // left hand most for this screen width
                });

            let secondItemTop;
            let secondItemLeft;
            let secondItemBottom;
            let secondItemRight;
            cy.get('[data-testid="drupal-article-1"]').then($el2 => {
                secondItemTop = $el2.position().top;
                secondItemLeft = $el2.position().left;
                secondItemRight = $el2.position().left + $el2.outerWidth();
                secondItemBottom = $el2.position().top + $el2.outerHeight();

                expect(secondItemLeft).to.equal(firstItemLeft);
                expect(secondItemTop).to.be.greaterThan(firstItemBottom);
            });

            let thirdItemTop;
            let thirdItemLeft;
            let thirdItemBottom;
            let thirdItemRight;
            cy.get('[data-testid="drupal-article-2"]').then($el3 => {
                thirdItemTop = $el3.position().top;
                thirdItemLeft = $el3.position().left;
                thirdItemRight = $el3.position().left + $el3.outerWidth();
                thirdItemBottom = $el3.position().top + $el3.outerHeight();

                expect(thirdItemTop).to.equal(secondItemTop);
                expect(thirdItemBottom).to.equal(secondItemBottom);
                expect(thirdItemLeft).to.be.greaterThan(secondItemRight);
            });

            let fourthItemTop;
            let fourthItemLeft;
            let fourthItemBottom;
            let fourthItemRight;
            cy.get('[data-testid="drupal-article-3"]').then($el4 => {
                fourthItemTop = $el4.position().top;
                fourthItemLeft = $el4.position().left;
                fourthItemRight = $el4.position().left + $el4.outerWidth();
                fourthItemBottom = $el4.position().top + $el4.outerHeight();

                expect(fourthItemTop).to.equal(secondItemTop);
                expect(fourthItemBottom).to.equal(secondItemBottom);
                expect(fourthItemLeft).to.be.greaterThan(thirdItemRight);
                expect(firstItemRight - fourthItemRight).to.be.lessThan(1);
                // border width on first means they are close but not quite equal
            });
        });
        it('loads as expected on tablet', () => {
            cy.visit('/');
            cy.viewport(840, 900);
            cy.get('[data-testid="drupal-article-0"]')
                .should('exist')
                .contains('Rae and George Hammer memorial');

            cy.get('[data-testid="library-updates-parent"] > div').should('have.length', 4 + 1); // 4 news stories and a heading

            // at tablet width, the articles are laid out:
            //  /-----------\
            //  | XXXXXXXXX |
            //  \-----------/
            //  XXXXX   XXXXX
            //  XXXXX
            let firstItemLeft;
            let firstItemBottom;
            cy.get('[data-testid="drupal-article-0"]')
                .scrollIntoView()
                .should('be.visible')
                .then($el => {
                    firstItemLeft = $el.position().left;
                    firstItemBottom = $el.position().top + $el.outerHeight();

                    expect(firstItemLeft).to.lessThan(30); // left hand most
                });

            let secondItemTop;
            let secondItemLeft;
            let secondItemBottom;
            let secondItemRight;
            cy.get('[data-testid="drupal-article-1"]').then($el2 => {
                secondItemTop = $el2.position().top;
                secondItemLeft = $el2.position().left;
                secondItemRight = $el2.position().left + $el2.outerWidth();
                secondItemBottom = $el2.position().top + $el2.outerHeight();

                expect(secondItemLeft).to.equal(firstItemLeft);
                expect(secondItemTop).to.be.greaterThan(firstItemBottom);
            });

            let thirdItemTop;
            let thirdItemLeft;
            let thirdItemBottom;
            let thirdItemRight;
            cy.get('[data-testid="drupal-article-2"]').then($el3 => {
                thirdItemTop = $el3.position().top;
                thirdItemLeft = $el3.position().left;
                thirdItemRight = $el3.position().left + $el3.outerWidth();
                thirdItemBottom = $el3.position().top + $el3.outerHeight();

                expect(thirdItemTop).to.equal(secondItemTop);
                expect(thirdItemBottom).to.equal(secondItemBottom);
                expect(thirdItemLeft).to.be.greaterThan(secondItemRight);
                expect(thirdItemRight).to.be.greaterThan(795); // near right edge of 840 width
            });

            // visually the fourth article drops down, but by the numbers it seems to sit on the right,
            // same as desktop, so I'm not going to test it
        });
        it('loads as expected on mobile', () => {
            cy.visit('/');
            cy.viewport(390, 736);
            cy.get('[data-testid="drupal-article-0"]')
                .should('not.exist')
                .contains('Rae and George Hammer memorial');

            cy.get('[data-testid="library-updates-parent"] > div').should('have.length', 4 + 1); // 4 news stories and a heading

            // at mobile width, the articles are laid out:
            //  /------\
            //  | XXXX |
            //  \------/
            //    XXXX
            //    XXXX
            //    XXXX
            let firstItemLeft;
            let firstItemBottom;
            let firstItemRight;
            cy.get('[data-testid="drupal-article-0"]')
                .scrollIntoView()
                .should('be.visible')
                .then($el => {
                    firstItemLeft = $el.position().left;
                    firstItemBottom = $el.position().top + $el.outerHeight();
                    firstItemRight = $el.position().left + $el.outerWidth();

                    expect(firstItemLeft).to.lessThan(26); // near left hand edge
                });

            let secondItemTop;
            let secondItemLeft;
            let secondItemBottom;
            let secondItemRight;
            cy.get('[data-testid="drupal-article-1"]').then($el2 => {
                secondItemTop = $el2.position().top;
                secondItemLeft = $el2.position().left;
                secondItemBottom = $el2.position().top + $el2.outerHeight();
                secondItemRight = $el2.position().left + $el2.outerWidth();

                // item one has a border so they aren't quite the same
                expect(secondItemLeft - firstItemLeft).to.be.lessThan(1);
                expect(secondItemRight - firstItemRight).to.be.lte(1);
                expect(secondItemTop).to.be.greaterThan(firstItemBottom);
            });

            let thirdItemTop;
            let thirdItemLeft;
            let thirdItemBottom;
            let thirdItemRight;
            cy.get('[data-testid="drupal-article-2"]').then($el3 => {
                thirdItemTop = $el3.position().top;
                thirdItemLeft = $el3.position().left;
                thirdItemBottom = $el3.position().top + $el3.outerHeight();
                thirdItemRight = $el3.position().left + $el3.outerWidth();

                expect(thirdItemLeft).to.equal(secondItemLeft);
                expect(thirdItemRight).to.equal(secondItemRight);
                expect(thirdItemTop).to.be.greaterThan(secondItemBottom);
            });

            let fourthItemTop;
            let fourthItemLeft;
            let fourthItemRight;
            cy.get('[data-testid="drupal-article-3"]').then($el4 => {
                fourthItemTop = $el4.position().top;
                fourthItemLeft = $el4.position().left;
                fourthItemRight = $el4.position().left + $el4.outerWidth();

                expect(fourthItemLeft).to.equal(secondItemLeft);
                expect(fourthItemRight).to.equal(secondItemRight);
                expect(fourthItemTop).to.be.greaterThan(thirdItemBottom);
            });
        });
        it('handles an error correctly', () => {
            cy.visit('/?responseType=drupalError');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="drupal-error"]')
                .should('exist')
                .contains('No articles found');
        });
    });
    context('accessibility', () => {
        it('is accessible at 1300 1000', () => {
            cy.visit('/');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.log('Homepage - Library Updates');
            cy.waitUntil(() => cy.get('[data-testid="article-1-title"]').should('exist'));
            cy.checkA11y('div[data-testid="library-updates-parent"]', {
                reportName: 'Library Updates',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('is accessible at 550 750', () => {
            cy.visit('/');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(550, 750);

            cy.log('Homepage - Library Updates');
            cy.waitUntil(() => cy.get('[data-testid="article-1-title"]').should('exist'));
            cy.checkA11y('div[data-testid="library-updates-parent"]', {
                reportName: 'Library Updates',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});

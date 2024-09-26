describe('header', () => {
    context('Big 6 Nav', () => {
        context('displays correctly', () => {
            it('desktop displays correctly', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(1300, 1000);

                cy.get('[data-testid="help-navigation-panel"]').within(() => {
                    // Check that there are 6 items
                    cy.get('li').should('have.length', 6);

                    // we have a 3 x 2 grid at desktop
                    cy.get('li')
                        .eq(0)
                        .should('be.visible')
                        .then($el => {
                            const firstItemTop = $el.position().top;
                            const firstItemLeft = $el.position().left;
                            const firstItemBottom = $el.position().top + $el.outerHeight();
                            const firstItemRight = $el.position().left + $el.outerWidth();

                            let secondItemLeft;
                            let secondItemRight;
                            cy.get('li')
                                .eq(1)
                                .then($el2 => {
                                    const secondItemTop = $el2.position().top;
                                    secondItemLeft = $el2.position().left;
                                    secondItemRight = $el2.position().left + $el2.outerWidth();

                                    // Ensure the second item is on the same row as the first
                                    expect(secondItemTop).to.equal(firstItemTop);
                                    expect(secondItemLeft).to.be.greaterThan(firstItemLeft);
                                });

                            let thirdItemLeft;
                            let thirdtemRight;
                            cy.get('li')
                                .eq(2)
                                .then($el3 => {
                                    const thirdItemTop = $el3.position().top;
                                    thirdItemLeft = $el3.position().left;
                                    thirdtemRight = $el3.position().left + $el3.outerWidth();

                                    // Ensure the third item is on the same row as the first
                                    expect(thirdItemTop).to.equal(firstItemTop);
                                    expect(thirdItemLeft).to.be.greaterThan(firstItemLeft);
                                });

                            cy.get('li')
                                .eq(3)
                                .should('be.visible')
                                .then($el4 => {
                                    const fourthItemTop = $el4.position().top;
                                    const fourthItemLeft = $el4.position().left;
                                    const fourthItemRight = $el4.position().left + $el4.outerWidth();

                                    // Ensure the fourth item is on the next row, with a gap
                                    expect(fourthItemTop).to.be.greaterThan(firstItemTop);
                                    expect(fourthItemLeft).to.equal(firstItemLeft);
                                    expect(fourthItemRight).to.equal(firstItemRight);
                                    expect(fourthItemTop).to.be.greaterThan(firstItemBottom + 20);
                                });

                            cy.get('li')
                                .eq(4)
                                .should('be.visible')
                                .then($el5 => {
                                    const fifthItemTop = $el5.position().top;
                                    const fifthItemLeft = $el5.position().left;
                                    const fifthItemRight = $el5.position().left + $el5.outerWidth();

                                    // Ensure the fifth item is on the next row
                                    expect(fifthItemTop).to.be.greaterThan(firstItemTop);
                                    expect(fifthItemLeft).to.equal(secondItemLeft);
                                    expect(fifthItemRight).to.equal(secondItemRight);
                                });

                            cy.get('li')
                                .eq(5)
                                .should('be.visible')
                                .then($el6 => {
                                    const sixthItemTop = $el6.position().top;
                                    const sixthItemLeft = $el6.position().left;
                                    const sixthItemRight = $el6.position().left + $el6.outerWidth();

                                    // Ensure the sixth item is on the next row
                                    expect(sixthItemTop).to.be.greaterThan(firstItemTop);
                                    expect(sixthItemLeft).to.equal(thirdItemLeft);
                                    expect(sixthItemRight).to.equal(thirdtemRight);
                                });
                        });
                });
            });
            it('tablet displays correctly', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(840, 900);

                cy.get('[data-testid="help-navigation-panel"]').within(() => {
                    // Check that there are 6 items
                    cy.get('li').should('have.length', 6);

                    // we have a 2 x 3 grid at tablet
                    cy.get('li')
                        .eq(0)
                        .find('div')
                        .should('be.visible')
                        .then($el => {
                            const firstItemTop = $el.position().top;
                            const firstItemLeft = $el.position().left;
                            const firstItemBottom = $el.position().top + $el.outerHeight();
                            const firstItemRight = $el.position().left + $el.outerWidth();

                            let secondItemTop;
                            let secondItemLeft;
                            let secondItemRight;
                            cy.get('li')
                                .eq(1)
                                .find('div')
                                .then($el2 => {
                                    secondItemTop = $el2.position().top;
                                    secondItemLeft = $el2.position().left;
                                    secondItemRight = $el2.position().left + $el2.outerWidth();

                                    // Ensure the second item is on the same row as the first
                                    expect(secondItemTop).to.equal(firstItemTop);
                                    expect(secondItemLeft).to.be.greaterThan(firstItemLeft);
                                });

                            let thirdItemTop;
                            cy.get('li')
                                .eq(2)
                                .find('div')
                                .then($el3 => {
                                    thirdItemTop = $el3.position().top;
                                    const thirdItemLeft = $el3.position().left;
                                    const thirdItemRight = $el3.position().left + $el3.outerWidth();

                                    // Ensure the third item is on the second row
                                    expect(thirdItemTop).to.be.greaterThan(firstItemTop);
                                    expect(thirdItemLeft).to.equal(firstItemLeft);
                                    expect(thirdItemRight).to.equal(firstItemRight);
                                });

                            let fourthItemLeft;
                            cy.get('li')
                                .eq(3)
                                .find('div')
                                .should('be.visible')
                                .then($el4 => {
                                    const fourthItemTop = $el4.position().top;
                                    fourthItemLeft = $el4.position().left;
                                    const fourthItemRight = $el4.position().left + $el4.outerWidth();

                                    // Ensure the fourth item is on the second row, with a gap
                                    expect(fourthItemTop).to.equal(thirdItemTop);
                                    expect(fourthItemLeft).to.equal(secondItemLeft);
                                    expect(fourthItemTop).to.be.greaterThan(firstItemBottom + 20);
                                    expect(fourthItemRight).to.equal(secondItemRight);
                                });

                            let fifthItemTop;
                            cy.get('li')
                                .eq(4)
                                .find('div')
                                .should('be.visible')
                                .then($el5 => {
                                    fifthItemTop = $el5.position().top;
                                    const fifthItemLeft = $el5.position().left;
                                    const fifthItemRight = $el5.position().left + $el5.outerWidth();

                                    // Ensure the fifth item is on the third row
                                    expect(fifthItemTop).to.be.greaterThan(secondItemTop);
                                    expect(fifthItemLeft).to.equal(firstItemLeft);
                                    expect(fifthItemRight).to.equal(firstItemRight);
                                });

                            cy.get('li')
                                .eq(5)
                                .find('div')
                                .should('be.visible')
                                .then($el6 => {
                                    const sixthItemTop = $el6.position().top;
                                    const sixthItemLeft = $el6.position().left;
                                    const sixthItemRight = $el6.position().left + $el6.outerWidth();

                                    // Ensure the sixth item is on the third row
                                    expect(sixthItemTop).to.equal(fifthItemTop);
                                    expect(sixthItemLeft).to.equal(fourthItemLeft);
                                    expect(sixthItemRight).to.equal(secondItemRight);
                                });
                        });
                });
            });
            it('mobile displays correctly', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(320, 480);

                cy.get('[data-testid="help-navigation-panel"]')
                    .scrollIntoView()
                    .within(() => {
                        // Check that there are 6 items
                        cy.get('li').should('have.length', 6);

                        // we have a 6 x 1 grid at mobile
                        cy.get('li')
                            .eq(0)
                            .should('be.visible')
                            .then($el => {
                                const firstItemTop = $el.position().top;
                                const firstItemLeft = $el.position().left;

                                let secondItemTop;
                                let secondItemLeft;
                                cy.get('li')
                                    .eq(1)
                                    .then($el2 => {
                                        secondItemTop = $el2.position().top;
                                        secondItemLeft = $el2.position().left;

                                        // Ensure the second item is below the first
                                        expect(secondItemTop).to.be.greaterThan(firstItemTop);
                                        expect(secondItemLeft).to.equal(firstItemLeft);
                                    });

                                let thirdItemTop;
                                let thirdItemBottom;
                                cy.get('li')
                                    .eq(2)
                                    .then($el3 => {
                                        thirdItemTop = $el3.position().top;
                                        const thirdItemLeft = $el3.position().left;
                                        thirdItemBottom = $el3.position().top + $el3.outerHeight();
                                        // Ensure the third item is below the second
                                        expect(thirdItemTop).to.be.greaterThan(secondItemTop);
                                        expect(thirdItemLeft).to.equal(firstItemLeft);
                                    });

                                let fourthItemTop;
                                cy.get('li')
                                    .eq(3)
                                    .should('be.visible')
                                    .then($el4 => {
                                        fourthItemTop = $el4.position().top;

                                        // Ensure the fourth item is below the third, with a gap
                                        expect(fourthItemTop).to.be.greaterThan(thirdItemTop);
                                        expect(fourthItemTop).to.be.greaterThan(thirdItemBottom + 20);
                                    });

                                let fifthItemTop;
                                cy.get('li')
                                    .eq(4)
                                    .should('be.visible')
                                    .then($el5 => {
                                        fifthItemTop = $el5.position().top;
                                        const fifthItemLeft = $el5.position().left;

                                        // Ensure the fifth item is on below the fourth
                                        expect(fifthItemTop).to.be.greaterThan(fourthItemTop);
                                        expect(fifthItemLeft).to.equal(firstItemLeft);
                                    });

                                cy.get('li')
                                    .eq(5)
                                    .should('be.visible')
                                    .then($el6 => {
                                        const sixthItemTop = $el6.position().top;
                                        const sixthItemLeft = $el6.position().left;

                                        // Ensure the sixth item is on below the fifth
                                        expect(sixthItemTop).to.be.greaterThan(fifthItemTop);
                                        expect(sixthItemLeft).to.equal(firstItemLeft);
                                    });
                            });
                    });
            });
        });
        context('is accessible', () => {
            it('at desktop', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist'));
                cy.get('[data-testid="help-navigation-panel"]').scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Edit',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('at tablet', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(1000, 900);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist'));
                cy.get('[data-testid="help-navigation-panel"]').scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Tablet',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('at mobile', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(320, 480);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist'));
                cy.get('[data-testid="help-navigation-panel"]').scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Mobile',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
        });
    });
});

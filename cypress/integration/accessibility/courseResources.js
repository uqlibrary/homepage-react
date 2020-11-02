context('ACCESSIBILITY', () => {
    it('User with classes', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="course-resources"]').contains('My courses');
        cy.log('Course Resources');
        cy.checkA11y('div[data-testid="course-resources"]', {
            reportName: 'Course Resources',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('User without classes', () => {
        cy.visit('/courseresources?user=s2222222');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="course-resources"]').contains('My courses');
        cy.log('Course Resources');
        cy.checkA11y('div[data-testid="course-resources"]', {
            reportName: 'Course Resources',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Responsive display', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.injectAxe();
        cy.viewport(414, 736);
        cy.get('div[data-testid="course-resources"]').contains('My courses');
        cy.log('Course Resources');
        cy.checkA11y('div[data-testid="course-resources"]', {
            reportName: 'Course Resources',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});

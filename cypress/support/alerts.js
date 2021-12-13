import { clickButton } from './helpers';

export function hasAWorkingHelpButton() {
    cy.wait(100);
    cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
    clickButton('[data-testid="admin-alerts-help-button"]');
    cy.get('[data-testid="admin-alerts-help-example"]').should('be.visible');
    cy.get('button:contains("Close")').click();
    cy.get('[data-testid="admin-alerts-help-example"]').should('not.exist');
}

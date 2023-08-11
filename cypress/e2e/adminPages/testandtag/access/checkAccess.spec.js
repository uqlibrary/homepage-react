describe('Test and Tag Access', () => {
    beforeEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
    });
    const visitDashboardPage = user => {
        cy.visit(`/admin/testntag?user=${user}`);
    };
    const getTestPanel = () => {
        return cy.data('dashboard-new-inspection-panel');
    };
    const getAssetsPanel = () => {
        return cy.data('dashboard-assets-due-inspection-panel');
    };
    const getTestDevicePanel = () => {
        return cy.data('dashboard-devices-due-recalibration-panel');
    };
    const getReportingPanel = () => {
        return cy.data('dashboard-reporting-panel');
    };

    const getManagementPanel = () => {
        return cy.data('dashboard-management-panel');
    };
    it('Dashboard has relevant items for all perms', () => {
        visitDashboardPage('uqtesttag');
        getTestPanel().should('exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('exist');
        getManagementPanel().should('exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('exist');
        cy.data('dashboard-assets-due-inspection-link').should('exist');
        cy.data('dashboard-devices-due-recalibration-link').should('exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('exist');
        cy.data('dashboard-management-inspections-link').should('exist');
        cy.data('dashboard-management-inspection-devices-link').should('exist');
        cy.data('dashboard-management-locations-link').should('exist');
        cy.data('dashboard-management-users-link').should('exist');
    });
    it('Dashboard has relevant items for admin only user', () => {
        visitDashboardPage('uqttadmin');
        getTestPanel().should('exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('exist');
        getManagementPanel().should('exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('exist');
        cy.data('dashboard-assets-due-inspection-link').should('exist');
        cy.data('dashboard-devices-due-recalibration-link').should('exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('exist');
        cy.data('dashboard-management-inspections-link').should('exist');
        cy.data('dashboard-management-inspection-devices-link').should('exist');
        cy.data('dashboard-management-locations-link').should('exist');
        cy.data('dashboard-management-users-link').should('exist');
    });
});

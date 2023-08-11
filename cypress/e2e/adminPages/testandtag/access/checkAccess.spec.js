describe('Test and Tag Dashboard Access', () => {
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
        getTestPanel().should('not.exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('not.exist');
        getManagementPanel().should('exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('not.exist');
        cy.data('dashboard-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-devices-due-recalibration-link').should('not.exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('not.exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('not.exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('not.exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('not.exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('not.exist');
        cy.data('dashboard-management-inspections-link').should('not.exist');
        cy.data('dashboard-management-inspection-devices-link').should('not.exist');
        cy.data('dashboard-management-locations-link').should('exist');
        cy.data('dashboard-management-users-link').should('exist');
    });
    it('Dashboard has relevant items for report only user', () => {
        visitDashboardPage('uqttreport');
        getTestPanel().should('not.exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('exist');
        getManagementPanel().should('not.exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('not.exist');
        cy.data('dashboard-assets-due-inspection-link').should('exist');
        cy.data('dashboard-devices-due-recalibration-link').should('exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('not.exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('not.exist');
        cy.data('dashboard-management-inspections-link').should('not.exist');
        cy.data('dashboard-management-inspection-devices-link').should('not.exist');
        cy.data('dashboard-management-locations-link').should('not.exist');
        cy.data('dashboard-management-users-link').should('not.exist');
    });
    it('Dashboard has relevant items for inspect only user', () => {
        visitDashboardPage('uqttinspect');
        getTestPanel().should('exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('not.exist');
        getManagementPanel().should('exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('exist');
        cy.data('dashboard-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-devices-due-recalibration-link').should('not.exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('not.exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('not.exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('not.exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('exist');
        cy.data('dashboard-management-inspections-link').should('exist');
        cy.data('dashboard-management-inspection-devices-link').should('exist');
        cy.data('dashboard-management-locations-link').should('not.exist');
        cy.data('dashboard-management-users-link').should('not.exist');
    });
    it('Dashboard has relevant items for alter only user', () => {
        visitDashboardPage('uqttalter');
        getTestPanel().should('not.exist');
        getAssetsPanel().should('exist');
        getTestDevicePanel().should('exist');
        getReportingPanel().should('not.exist');
        getManagementPanel().should('exist');
        // check top panels links
        cy.data('dashboard-new-inspection-link').should('not.exist');
        cy.data('dashboard-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-devices-due-recalibration-link').should('not.exist');
        // check base panels links - reporting
        cy.data('dashboard-reporting-assets-due-inspection-link').should('not.exist');
        cy.data('dashboard-reporting-assets-inspected-link').should('not.exist');
        cy.data('dashboard-reporting-inspections-by-user-link').should('not.exist');
        cy.data('dashboard-reporting-devices-due-recalibration-link').should('not.exist');
        // check base panels links - management
        cy.data('dashboard-management-asset-types-link').should('not.exist');
        cy.data('dashboard-management-bulk-asset-update-link').should('exist');
        cy.data('dashboard-management-inspections-link').should('not.exist');
        cy.data('dashboard-management-inspection-devices-link').should('exist');
        cy.data('dashboard-management-locations-link').should('not.exist');
        cy.data('dashboard-management-users-link').should('not.exist');
    });
});
describe('Test and Tag Page Access', () => {
    beforeEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
    });
    const visitTestTagInspect = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/inspect?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitInspectionDueReport = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/report/inspectionsdue?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitInspectionDevicesRecalibration = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/report/recalibrationsdue?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitAssetsByFilterReport = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/report/assetsbyfilter?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitTestsByLicencedUserReport = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/report/inspectionsbylicenceduser?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitManageAssetTypes = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/manage/assettypes?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitBulkAssetUpdate = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/manage/bulkassetupdate?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitManageInspectionDetails = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/manage/inspectiondetails?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitManageLocations = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/manage/locations?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };
    const visitManageUsers = (user, expectedAllowed = true) => {
        cy.visit(`/admin/testntag/manage/users?user=${user}`);
        cy.data('StandardPage').should('contain', `${!!expectedAllowed ? 'for Library' : 'Page unavailable'}`);
    };

    it('verify default user pages', () => {
        // Reporting
        visitInspectionDueReport('uqtesttag', true);
        visitInspectionDevicesRecalibration('uqtesttag', true);
        visitAssetsByFilterReport('uqtesttag', true);
        visitTestsByLicencedUserReport('uqtesttag', true);
        // Management
        visitTestTagInspect('uqtesttag', true);
        visitManageAssetTypes('uqtesttag', true);
        visitBulkAssetUpdate('uqtesttag', true);
        visitManageInspectionDetails('uqtesttag', true);
        visitManageLocations('uqtesttag', true);
        visitManageUsers('uqtesttag', true);
    });
    it('verify admin only rejected pages', () => {
        // Reporting
        visitTestTagInspect('uqttadmin', false);
        visitInspectionDueReport('uqttadmin', false);
        visitInspectionDevicesRecalibration('uqttadmin', false);
        visitAssetsByFilterReport('uqttadmin', false);
        visitTestsByLicencedUserReport('uqttadmin', false);
        // Management
        visitManageAssetTypes('uqttadmin', false);
        visitBulkAssetUpdate('uqttadmin', false);
        visitManageInspectionDetails('uqttadmin', false);
    });
    it('verify reporting only rejected pages', () => {
        // Management
        visitManageAssetTypes('uqttreport', false);
        visitBulkAssetUpdate('uqttreport', false);
        visitManageInspectionDetails('uqttreport', false);
    });
    it('verify inspect only rejected pages', () => {
        // Management
        visitInspectionDueReport('uqttinspect', false);
        visitInspectionDevicesRecalibration('uqttinspect', false);
        visitAssetsByFilterReport('uqttinspect', false);
        visitTestsByLicencedUserReport('uqttinspect', false);
    });
});

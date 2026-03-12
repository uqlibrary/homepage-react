import { test, expect, Page } from '@uq/pw/test';

test.describe('Test and Tag Dashboard Access', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    const visitDashboardPage = async (page: Page, user: string) => {
        await page.goto(`/admin/testntag?user=${user}`);
    };

    const getTestPanel = (page: Page) => page.getByTestId('dashboard-new-inspection-panel');

    const getAssetsPanel = (page: Page) => page.getByTestId('dashboard-assets-due-inspection-panel');

    const getTestDevicePanel = (page: Page) => page.getByTestId('dashboard-devices-due-recalibration-panel');

    const getReportingPanel = (page: Page) => page.getByTestId('dashboard-reporting-panel');

    const getManagementPanel = (page: Page) => page.getByTestId('dashboard-management-panel');

    test('Dashboard has relevant items for all perms', async ({ page }) => {
        await visitDashboardPage(page, 'uqtesttag');
        await expect(getTestPanel(page)).toBeVisible();
        await expect(getAssetsPanel(page)).toBeVisible();
        await expect(getTestDevicePanel(page)).toBeVisible();
        await expect(getReportingPanel(page)).toBeVisible();
        await expect(getManagementPanel(page)).toBeVisible();

        // check top panels links
        await expect(page.getByTestId('dashboard-new-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-assets-due-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-devices-due-recalibration-link')).toBeVisible();

        // check base panels links - reporting
        await expect(page.getByTestId('dashboard-reporting-assets-due-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-assets-inspected-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-inspections-by-user-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-devices-due-recalibration-link')).toBeVisible();

        // check base panels links - management
        await expect(page.getByTestId('dashboard-management-asset-types-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-bulk-asset-update-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspections-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspection-devices-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-locations-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-users-link')).toBeVisible();
    });

    test('Dashboard has relevant items for admin only user', async ({ page }) => {
        await visitDashboardPage(page, 'uqttadmin');
        await expect(getTestPanel(page)).not.toBeVisible();
        await expect(getAssetsPanel(page)).toBeVisible();
        await expect(getTestDevicePanel(page)).toBeVisible();
        await expect(getReportingPanel(page)).not.toBeVisible();
        await expect(getManagementPanel(page)).toBeVisible();

        // check top panels links
        await expect(page.getByTestId('dashboard-new-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - reporting
        await expect(page.getByTestId('dashboard-reporting-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-assets-inspected-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-inspections-by-user-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - management
        await expect(page.getByTestId('dashboard-management-asset-types-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-bulk-asset-update-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspections-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspection-devices-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-locations-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-users-link')).toBeVisible();
    });

    test('Dashboard has relevant items for report only user', async ({ page }) => {
        await visitDashboardPage(page, 'uqttreport');
        await expect(getTestPanel(page)).not.toBeVisible();
        await expect(getAssetsPanel(page)).toBeVisible();
        await expect(getTestDevicePanel(page)).toBeVisible();
        await expect(getReportingPanel(page)).toBeVisible();
        await expect(getManagementPanel(page)).not.toBeVisible();

        // check top panels links
        await expect(page.getByTestId('dashboard-new-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-assets-due-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-devices-due-recalibration-link')).toBeVisible();

        // check base panels links - reporting
        await expect(page.getByTestId('dashboard-reporting-assets-due-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-assets-inspected-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-inspections-by-user-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-devices-due-recalibration-link')).toBeVisible();

        // check base panels links - management
        await expect(page.getByTestId('dashboard-management-asset-types-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-bulk-asset-update-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspections-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspection-devices-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-locations-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-users-link')).not.toBeVisible();
    });

    test('Dashboard has relevant items for inspect only user', async ({ page }) => {
        await visitDashboardPage(page, 'uqttinspect');
        await expect(getTestPanel(page)).toBeVisible();
        await expect(getAssetsPanel(page)).toBeVisible();
        await expect(getTestDevicePanel(page)).toBeVisible();
        await expect(getReportingPanel(page)).not.toBeVisible();
        await expect(getManagementPanel(page)).toBeVisible();

        // check top panels links
        await expect(page.getByTestId('dashboard-new-inspection-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - reporting
        await expect(page.getByTestId('dashboard-reporting-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-assets-inspected-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-inspections-by-user-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - management
        await expect(page.getByTestId('dashboard-management-asset-types-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-bulk-asset-update-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspections-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspection-devices-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-locations-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-users-link')).not.toBeVisible();
    });

    test('Dashboard has relevant items for alter only user', async ({ page }) => {
        await visitDashboardPage(page, 'uqttalter');
        await expect(getTestPanel(page)).not.toBeVisible();
        await expect(getAssetsPanel(page)).toBeVisible();
        await expect(getTestDevicePanel(page)).toBeVisible();
        await expect(getReportingPanel(page)).not.toBeVisible();
        await expect(getManagementPanel(page)).toBeVisible();

        // check top panels links
        await expect(page.getByTestId('dashboard-new-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - reporting
        await expect(page.getByTestId('dashboard-reporting-assets-due-inspection-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-assets-inspected-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-inspections-by-user-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-reporting-devices-due-recalibration-link')).not.toBeVisible();

        // check base panels links - management
        await expect(page.getByTestId('dashboard-management-asset-types-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-bulk-asset-update-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspections-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-inspection-devices-link')).toBeVisible();
        await expect(page.getByTestId('dashboard-management-locations-link')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-management-users-link')).not.toBeVisible();
    });
});

test.describe('Test and Tag Page Access', () => {
    const visitTestTagInspect = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/inspect?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitInspectionDueReport = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/report/inspectionsdue?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitInspectionDevicesRecalibration = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/report/recalibrationsdue?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitAssetsByFilterReport = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/report/assetsbyfilter?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitTestsByLicencedUserReport = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/report/inspectionsbylicenceduser?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitManageAssetTypes = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/manage/assettypes?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitBulkAssetUpdate = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/manage/bulkassetupdate?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitManageInspectionDetails = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/manage/inspectiondetails?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitManageLocations = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/manage/locations?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    const visitManageUsers = async (page: Page, user: string, expectedAllowed = true) => {
        await page.goto(`/admin/testntag/manage/users?user=${user}`);
        const standardPage = page.getByTestId('StandardPage');
        await expect(
            standardPage.getByText(expectedAllowed ? 'for Work Station Support (Library)' : 'Page unavailable'),
        ).toBeVisible();
    };

    test('verify default user pages', async ({ page }) => {
        // Reporting
        await visitInspectionDueReport(page, 'uqtesttag', true);
        await visitInspectionDevicesRecalibration(page, 'uqtesttag', true);
        await visitAssetsByFilterReport(page, 'uqtesttag', true);
        await visitTestsByLicencedUserReport(page, 'uqtesttag', true);
        // Management
        await visitTestTagInspect(page, 'uqtesttag', true);
        await visitManageAssetTypes(page, 'uqtesttag', true);
        await visitBulkAssetUpdate(page, 'uqtesttag', true);
        await visitManageInspectionDetails(page, 'uqtesttag', true);
        await visitManageLocations(page, 'uqtesttag', true);
        await visitManageUsers(page, 'uqtesttag', true);
    });

    test('verify admin only rejected pages', async ({ page }) => {
        // Reporting
        await visitTestTagInspect(page, 'uqttadmin', false);
        await visitInspectionDueReport(page, 'uqttadmin', false);
        await visitInspectionDevicesRecalibration(page, 'uqttadmin', false);
        await visitAssetsByFilterReport(page, 'uqttadmin', false);
        await visitTestsByLicencedUserReport(page, 'uqttadmin', false);
        // Management
        await visitManageAssetTypes(page, 'uqttadmin', false);
        await visitBulkAssetUpdate(page, 'uqttadmin', false);
        await visitManageInspectionDetails(page, 'uqttadmin', false);
    });

    test('verify reporting only rejected pages', async ({ page }) => {
        // Management
        await visitManageAssetTypes(page, 'uqttreport', false);
        await visitBulkAssetUpdate(page, 'uqttreport', false);
        await visitManageInspectionDetails(page, 'uqttreport', false);
    });

    test('verify inspect only rejected pages', async ({ page }) => {
        // Management
        await visitInspectionDueReport(page, 'uqttinspect', false);
        await visitInspectionDevicesRecalibration(page, 'uqttinspect', false);
        await visitAssetsByFilterReport(page, 'uqttinspect', false);
        await visitTestsByLicencedUserReport(page, 'uqttinspect', false);
    });
});

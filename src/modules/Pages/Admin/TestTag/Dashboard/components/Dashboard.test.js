import React from 'react';
import Dashboard from './Dashboard';
import { renderWithRouter, WithReduxStore, act, fireEvent, waitFor } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../../data/mock/data/testAndTag/testTagOnLoadDashboard';
import userData from '../../../../../../data/mock/data/testAndTag/testTagUser';

import { default as localeData } from '../../testTag.locale.js';
import { getUserPermissions } from '../../helpers/auth';
import { PERMISSIONS } from '../../config/auth';

const redHex = '#951126';

function setup(testProps = {}, renderer = renderWithRouter) {
    const {
        state = {},
        actions = {},
        dashboardConfig = configData,
        dashboardConfigLoading = false,
        dashboardConfigError = null,
        user = { ...userData },
        locale = { ...localeData },
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadDashboardReducer: {
            dashboardConfig: configData,
            dashboardConfigLoading: false,
            dashboardConfigLoaded: true,
        },
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: userData,
            privilege: getUserPermissions(user.privileges ?? {}),
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <Dashboard
                actions={actions}
                locale={locale}
                dashboardConfig={dashboardConfig}
                dashboardConfigLoading={dashboardConfigLoading}
                dashboardConfigError={dashboardConfigError}
                user={user}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('Dashboard component', () => {
    it('renders skeleton loaders', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            dashboardConfigLoading: true,
            actions: { loadDashboard: loadDashboardFn },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();
        // skeletons replace panels when loading
        expect(queryByTestId('dashboard-new-inspection-panel')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-reporting-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-assets-due-inspection-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-devices-due-recalibration-link')).not.toBeInTheDocument();

        expect(getByTestId('dashboard-new-inspection-skeleton')).toBeInTheDocument();
        expect(getByTestId('dashboard-assets-due-inspection-skeleton')).toBeInTheDocument();
        expect(getByTestId('dashboard-devices-due-recalibration-skeleton')).toBeInTheDocument();
        expect(getByTestId('dashboard-reporting-skeleton')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-skeleton')).toBeInTheDocument();
    });

    it('renders error message if load fails', async () => {
        const loadDashboardFn = jest.fn();
        const clearDashboardErrorFn = jest.fn();
        const { getByTestId, getByText, getByTitle, queryByTestId } = setup({
            dashboardConfigError: 'test error message',
            actions: { loadDashboard: loadDashboardFn, clearDashboardError: clearDashboardErrorFn },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('test error message');
        act(() => {
            fireEvent.click(getByTitle('Close'));
        });

        await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());
        expect(clearDashboardErrorFn).toHaveBeenCalled();
    });

    it('renders component for non-admin', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({ actions: { loadDashboard: loadDashboardFn } });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();
        // default test user has all perms except admin
        expect(getByTestId('dashboard-new-inspection-panel')).toBeInTheDocument();
        expect(getByTestId('dashboard-reporting-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-assets-due-inspection-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-devices-due-recalibration-link')).toBeInTheDocument();
        expect(queryByTestId('dashboard-management-locations-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-users-link')).not.toBeInTheDocument();

        // assets and devices shouldnt be in red as they're not overdue by default
        expect(getByTestId('dashboard-assets-due-inspection-overdue-amount')).not.toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-assets-due-inspection-overdue-text')).not.toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-devices-due-recalibration-overdue-amount')).not.toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-devices-due-recalibration-overdue-text')).not.toHaveStyle(`color: ${redHex}`);
    });
    it('renders overdue inspection and calibration figures in red', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            dashboardConfig: {
                ...configData,
                recalibration: {
                    soon: 1,
                    overdue: 1,
                },
                retest: {
                    soon: 3,
                    overdue: 1,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();
        expect(getByTestId('dashboard-assets-due-inspection-overdue-amount')).toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-assets-due-inspection-overdue-text')).toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-devices-due-recalibration-overdue-amount')).toHaveStyle(`color: ${redHex}`);
        expect(getByTestId('dashboard-devices-due-recalibration-overdue-text')).toHaveStyle(`color: ${redHex}`);
    });

    it('renders component for admin-only', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            user: {
                ...userData,
                privileges: {
                    can_admin: 1,
                    can_inspect: 0,
                    can_alter: 0,
                    can_see_reports: 0,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();

        expect(getByTestId('dashboard-management-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-locations-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-users-link')).toBeInTheDocument();
        expect(queryByTestId('dashboard-management-bulk-asset-update-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-inspection-devices-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-asset-types-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-inspections-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-new-inspection-panel')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-reporting-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-assets-due-inspection-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-devices-due-recalibration-link')).not.toBeInTheDocument();
    });

    it('renders component for inspect-only', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            user: {
                ...userData,
                privileges: {
                    can_admin: 0,
                    can_inspect: 1,
                    can_alter: 0,
                    can_see_reports: 0,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();

        expect(getByTestId('dashboard-new-inspection-panel')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-bulk-asset-update-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-inspection-devices-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-asset-types-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-inspections-link')).toBeInTheDocument();
        expect(queryByTestId('dashboard-management-locations-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-users-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-reporting-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-assets-due-inspection-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-devices-due-recalibration-link')).not.toBeInTheDocument();
    });

    it('renders component for alter-only', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            user: {
                ...userData,
                privileges: {
                    can_admin: 0,
                    can_inspect: 0,
                    can_alter: 1,
                    can_see_reports: 0,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();

        expect(getByTestId('dashboard-management-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-bulk-asset-update-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-management-inspection-devices-link')).toBeInTheDocument();
        expect(queryByTestId('dashboard-management-asset-types-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-inspections-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-locations-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-users-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-new-inspection-panel')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-reporting-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-assets-due-inspection-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-devices-due-recalibration-link')).not.toBeInTheDocument();
    });

    it('renders component for reports-only', () => {
        const loadDashboardFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            user: {
                ...userData,
                privileges: {
                    can_admin: 0,
                    can_inspect: 0,
                    can_alter: 0,
                    can_see_reports: 1,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();

        expect(getByTestId('dashboard-reporting-panel-header')).toBeInTheDocument();
        expect(getByTestId('dashboard-assets-due-inspection-link')).toBeInTheDocument();
        expect(getByTestId('dashboard-devices-due-recalibration-link')).toBeInTheDocument();
        expect(queryByTestId('dashboard-management-panel-header')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-bulk-asset-update-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-inspection-devices-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-asset-types-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-inspections-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-locations-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-management-users-link')).not.toBeInTheDocument();
        expect(queryByTestId('dashboard-new-inspection-panel')).not.toBeInTheDocument();
    });

    it('renders links with or without permission check (coverage)', () => {
        const loadDashboardFn = jest.fn();
        const newLocale = { ...localeData };
        const firstManagementLink = newLocale.pages.dashboard.panel.management.links[0];
        delete firstManagementLink.permissions;
        newLocale.pages.dashboard.panel.management.links[0] = firstManagementLink;

        newLocale.pages.dashboard.panel.reporting.links[0].permissions = [PERMISSIONS.can_admin];

        const { getByTestId, queryByTestId, getByText } = setup({
            actions: { loadDashboard: loadDashboardFn },
            user: {
                ...userData,
                locale: newLocale,
                privileges: {
                    can_admin: 0,
                    can_inspect: 1,
                    can_alter: 0,
                    can_see_reports: 1,
                },
            },
        });

        expect(getByText('Dashboard for Library')).toBeInTheDocument();

        // link should be visible as no permissions are needed other than to see the panel itself
        expect(getByTestId('dashboard-management-asset-types-link')).toBeInTheDocument();
        // link should not now be visible
        expect(queryByTestId('dashboard-reporting-assets-due-inspection-link')).not.toBeInTheDocument();
    });
});

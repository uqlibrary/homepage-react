import React from 'react';
import moment from 'moment';
import Immutable from 'immutable';

import { rtlRender, WithReduxStore, userEvent, within, waitFor } from 'test-utils';

import { mui1theme } from 'config/theme';
import { breadcrumbs } from 'config/routes';
import * as alertActions from 'data/actions/alertsActions';
import * as routes from 'repositories/routes';
import { default as AlertsList } from './AlertsListContainer';
import { formatAlert } from './AlertsList';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

jest.mock('./AlertsListAsTable', () => {
    const React = jest.requireActual('react');

    return ({ rows = [], headertag, alertsLoading, alertOrder, deleteAlert }) => (
        <div
            data-testid={`alerts-table-${headertag.toLowerCase().replace(' ', '-')}`}
            aria-busy={alertsLoading}
            data-alert-order={alertOrder}
        >
            {rows.map(alert => (
                <div
                    key={alert.id}
                    data-testid={`alert-row-${alert.id}`}
                    data-start-date-display={alert.startDateDisplay}
                    data-end-date-display={alert.endDateDisplay}
                    data-start-date-long={alert.startDateLong}
                    data-end-date-long={alert.endDateLong}
                >
                    {alert.message}
                    <button type="button" onClick={() => deleteAlert(alert.id)}>
                        Delete alert {alert.id}
                    </button>
                </div>
            ))}
        </div>
    );
});

function setup(testProps = {}) {
    const initialState = Immutable.Map({
        alertsReducer: {
            alerts: testProps.alerts ?? null,
            alertsLoading: testProps.alertsLoading ?? null,
            alertsError: testProps.alertsError ?? null,
        },
        alertReducer: testProps.alertState || {
            alert: null,
            alertStatus: null,
            alertError: null,
        },
    });
    return rtlRender(
        <WithReduxStore initialState={initialState}>
            <AlertsList />
        </WithReduxStore>,
    );
}

const formatInputDate = date => date.format('YYYY-MM-DD HH:mm:ss');
let actionSpies = [];

const spyOnAlertAction = actionName => {
    const actionSpy = jest.spyOn(alertActions, actionName);
    actionSpies.push(actionSpy);
    return actionSpy;
};

describe('AlertsList', () => {
    let siteHeader;

    beforeEach(() => {
        actionSpies = [];
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        actionSpies.forEach(actionSpy => actionSpy.mockRestore());
        siteHeader?.remove();
        mockNavigate.mockReset();
        mockApi.reset();
    });

    it('shows mobile guidance below the small-screen breakpoint only', () => {
        const originalInnerWidth = window.innerWidth;
        const smallBreakpoint = mui1theme.breakpoints.values.sm;

        window.innerWidth = smallBreakpoint - 1;
        const { getByText } = setup({ alerts: [] });

        expect(getByText('Mobile? You might want to turn your phone sideways!')).toBeVisible();

        window.innerWidth = originalInnerWidth;
    });

    it('loads alerts when data is not available and updates the site header', async () => {
        const loadAllAlertsSpy = spyOnAlertAction('loadAllAlerts');
        const alertsApiUrl = routes.ALERTS_ALL_API().apiUrl;
        mockApi.onGet(alertsApiUrl).reply(200, []);

        siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        const { getByTestId, getByText } = setup();

        expect(getByText('Mobile? You might want to turn your phone sideways!')).toBeInTheDocument();
        expect(getByTestId('alerts-table-current-alerts')).toHaveAttribute('aria-busy', 'true');
        await waitFor(() => {
            expect(getByTestId('alerts-table-current-alerts')).toHaveAttribute('aria-busy', 'false');
        });
        expect(loadAllAlertsSpy).toHaveBeenCalledTimes(1);
        expect(siteHeader.getAttribute('secondleveltitle')).toBe(breadcrumbs.alertsadmin.title);
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe(breadcrumbs.alertsadmin.pathname);
    });

    it('renders an error page when loading alerts fails', () => {
        const loadAllAlertsSpy = spyOnAlertAction('loadAllAlerts');
        const { getByTestId, getByText } = setup({ alertsError: 'Unable to load alerts' });

        expect(getByTestId('admin-alerts-list-error')).toBeInTheDocument();
        expect(getByText(/Please try again later/)).toBeInTheDocument();
        expect(loadAllAlertsSpy).not.toHaveBeenCalled();
    });

    it('passes the loading state to each alert table without reloading alerts', () => {
        const loadAllAlertsSpy = spyOnAlertAction('loadAllAlerts');
        const { getByTestId } = setup({ alertsLoading: true });

        ['current-alerts', 'scheduled-alerts', 'past-alerts'].forEach(table => {
            expect(getByTestId(`alerts-table-${table}`)).toHaveAttribute('aria-busy', 'true');
        });
        expect(loadAllAlertsSpy).not.toHaveBeenCalled();
    });

    it('deletes an alert through the connected delete action', async () => {
        const deleteAlertSpy = spyOnAlertAction('deleteAlert');
        const alertId = 'alert-to-delete';
        const deleteApiUrl = routes.ALERT_DELETE_API({ id: alertId }).apiUrl;
        mockApi.onDelete(deleteApiUrl).reply(200, {});

        const { getByRole } = setup({
            alerts: [
                {
                    id: alertId,
                    start: formatInputDate(moment().add(1, 'day')),
                    end: formatInputDate(moment().add(2, 'days')),
                    body: 'Scheduled alert',
                },
            ],
        });

        await userEvent.click(getByRole('button', { name: `Delete alert ${alertId}` }));
        expect(deleteAlertSpy).toHaveBeenCalledWith(alertId);
    });

    it('groups alerts by date and prepares their display values', () => {
        const now = moment();
        const pastStart = now.clone().subtract(3, 'days').hour(8).minute(0).second(0);
        const pastEnd = now.clone().subtract(2, 'days').hour(9).minute(30).second(0);
        const currentStart = now.clone().subtract(1, 'hour').minute(0).second(0);
        const currentEnd = now.clone().add(1, 'hour').minute(30).second(0);
        const futureStart = now.clone().add(1, 'day').hour(10).minute(30).second(0);
        const futureEnd = now.clone().add(2, 'days').hour(11).minute(0).second(0);

        const { getByTestId } = setup({
            alerts: [
                {
                    id: 'past',
                    start: formatInputDate(pastStart),
                    end: formatInputDate(pastEnd),
                    body: 'Past alert',
                },
                {
                    id: 'current',
                    start: formatInputDate(currentStart),
                    end: formatInputDate(currentEnd),
                    body: 'Current alert',
                },
                {
                    id: 'future',
                    start: formatInputDate(futureStart),
                    end: formatInputDate(futureEnd),
                    body: 'Scheduled alert',
                },
            ],
        });

        const pastRow = within(getByTestId('alerts-table-past-alerts')).getByTestId('alert-row-past');
        const currentRow = within(getByTestId('alerts-table-current-alerts')).getByTestId('alert-row-current');
        const futureRow = within(getByTestId('alerts-table-scheduled-alerts')).getByTestId('alert-row-future');

        expect(pastRow).toHaveTextContent('Past alert');
        expect(pastRow).toHaveAttribute('data-start-date-display', pastStart.format('ddd D MMM YYYY [\n]ha'));
        expect(pastRow).toHaveAttribute('data-start-date-long', pastStart.format('dddd D MMMM YYYY h.mma'));
        expect(currentRow).toHaveTextContent('Current alert');
        expect(currentRow).toHaveAttribute('data-start-date-display', currentStart.format('ddd D MMM [\n]ha'));
        expect(futureRow).toHaveTextContent('Scheduled alert');
        expect(futureRow).toHaveAttribute('data-start-date-display', futureStart.format('ddd D MMM [\n]h.mma'));
    });

    describe('formatAlert', () => {
        it('formats dates and strips markdown links across past and upcoming alerts', () => {
            const now = moment();
            const cases = [
                {
                    alert: {
                        id: 'past-on-hour',
                        start: formatInputDate(now.clone().subtract(3, 'days').hour(8).minute(0).second(0)),
                        end: formatInputDate(now.clone().subtract(2, 'days').hour(9).minute(30).second(0)),
                        body: 'Notice [read more](https://example.com) now',
                    },
                    startDisplayFormat: 'ddd D MMM YYYY [\n]ha',
                    endDisplayFormat: 'ddd D MMM YYYY [\n]h.mma',
                    message: 'Notice now',
                },
                {
                    alert: {
                        id: 'past-during-hour',
                        start: formatInputDate(now.clone().subtract(2, 'days').hour(8).minute(30).second(0)),
                        end: formatInputDate(now.clone().subtract(1, 'day').hour(9).minute(0).second(0)),
                        body: 'No link here',
                    },
                    startDisplayFormat: 'ddd D MMM YYYY [\n]h.mma',
                    endDisplayFormat: 'ddd D MMM YYYY [\n]ha',
                    message: 'No link here',
                },
                {
                    alert: {
                        id: 'current-on-hour',
                        start: formatInputDate(now.clone().subtract(1, 'hour').minute(0).second(0)),
                        end: formatInputDate(now.clone().add(1, 'hour').minute(30).second(0)),
                        body: 'Current [details](https://example.com) notice',
                    },
                    startDisplayFormat: 'ddd D MMM [\n]ha',
                    endDisplayFormat: 'ddd D MMM [\n]h.mma',
                    message: 'Current notice',
                },
                {
                    alert: {
                        id: 'future-during-hour',
                        start: formatInputDate(now.clone().add(1, 'day').hour(10).minute(30).second(0)),
                        end: formatInputDate(now.clone().add(2, 'days').hour(11).minute(0).second(0)),
                        body: 'Scheduled alert',
                    },
                    startDisplayFormat: 'ddd D MMM [\n]h.mma',
                    endDisplayFormat: 'ddd D MMM [\n]ha',
                    message: 'Scheduled alert',
                },
            ];

            cases.forEach(({ alert, startDisplayFormat, endDisplayFormat, message }) => {
                const start = moment(alert.start);
                const end = moment(alert.end);

                expect(formatAlert(alert)).toEqual({
                    ...alert,
                    startDateDisplay: start.format(startDisplayFormat),
                    endDateDisplay: end.format(endDisplayFormat),
                    startDateLong: start.format('dddd D MMMM YYYY h.mma'),
                    endDateLong: end.format('dddd D MMMM YYYY h.mma'),
                    message,
                });
            });
        });
    });
});

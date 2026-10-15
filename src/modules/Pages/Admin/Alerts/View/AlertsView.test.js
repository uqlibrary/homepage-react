import React from 'react';
import Immutable from 'immutable';
import { rtlRender, WithReduxStore, userEvent, waitFor } from 'test-utils';
import { breadcrumbs } from 'config/routes';
import * as alertActions from 'data/actions/alertsActions';
import * as routes from 'repositories/routes';
import { default as AlertsView } from './AlertsViewContainer';
import { displayPreview } from './AlertsView';
import { makePreviewActionButtonJustNotifyUser, manuallyMakeWebComponentBePermanent } from '../alerthelpers';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../alerthelpers', () => {
    const actual = jest.requireActual('../alerthelpers');
    return {
        ...actual,
        makePreviewActionButtonJustNotifyUser: jest.fn(),
        manuallyMakeWebComponentBePermanent: jest.fn((alertElement, body) => {
            alertElement.setAttribute('alertmessage', body.replace('[permanent]', ''));
        }),
    };
});

window.scrollTo = jest.fn();

function setup(testProps = {}) {
    const initialState = Immutable.Map({
        alertReducer: {
            alert: testProps.alert ?? null,
            alertStatus: testProps.alertStatus ?? null,
            alertError: null,
        },
    });
    return rtlRender(
        <WithReduxStore initialState={initialState}>
            <AlertsView />
        </WithReduxStore>,
    );
}

describe('AlertsView', () => {
    let siteHeader;
    let loadAlertSpy;

    beforeEach(() => {
        mockUseParams.mockReturnValue({});
        loadAlertSpy = null;
        mockApi = setupMockAdapter();
        makePreviewActionButtonJustNotifyUser.mockClear();
        manuallyMakeWebComponentBePermanent.mockClear();
    });

    afterEach(() => {
        loadAlertSpy?.mockRestore();
        siteHeader?.remove();
        siteHeader = null;
        mockNavigate.mockReset();
        mockApi.reset();
    });

    it('shows a loader and requests the alert while loading', () => {
        loadAlertSpy = jest.spyOn(alertActions, 'loadAnAlert');
        mockUseParams.mockReturnValue({ alertid: 'alert-1' });
        mockApi.onGet(routes.ALERT_BY_ID_API({ id: 'alert-1' }).apiUrl).reply(200, {
            id: 'alert-1',
            start: '2025-01-01 09:00:00',
            end: '2025-01-02 10:00:00',
            title: 'Loaded alert',
            body: 'Loaded body',
            priority_type: 'urgent',
            systems: ['homepage'],
        });
        const { getByText, queryByTestId } = setup({ alertStatus: 'loading' });

        expect(getByText('Loading')).toBeInTheDocument();
        expect(queryByTestId('admin-alerts-view-button-block')).not.toBeInTheDocument();
        expect(loadAlertSpy).toHaveBeenCalledWith('alert-1');
        return waitFor(() => {
            expect(queryByTestId('admin-alerts-view-button-block')).toBeInTheDocument();
        });
    });

    it('renders fallback values when no alert is available', () => {
        mockUseParams.mockReturnValue({});
        loadAlertSpy = jest.spyOn(alertActions, 'loadAnAlert');
        const { getByTestId, getByText, queryByTestId } = setup({ alert: null });

        expect(loadAlertSpy).not.toHaveBeenCalled();
        expect(getByTestId('admin-alerts-view-title').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-body').querySelector('textarea')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-start-date').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-end-date').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-checkbox-linkrequired')).not.toBeChecked();
        expect(getByTestId('admin-alerts-view-checkbox-permanent')).not.toBeChecked();
        expect(getByText('This alert appeared on all systems')).toBeInTheDocument();
        expect(queryByTestId('admin-alerts-view-created-by')).not.toBeInTheDocument();
        expect(queryByTestId('admin-alerts-view-updated-by')).not.toBeInTheDocument();
    });

    it('renders a permanent linked alert and builds its preview', () => {
        siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);
        const alert = {
            id: 'alert-1',
            title: 'Maintenance notice',
            start: '2025-01-01 09:00:00',
            end: '2025-01-02 10:00:00',
            body: 'Notice [permanent][Read more](https://example.com)',
            priority_type: 'urgent',
            systems: ['homepage'],
            created_by: 'uqtest1',
            updated_by: 'uqtest2',
        };
        const { getByTestId, getByText, container } = setup({ alert });
        const preview = container.querySelector('#alert-preview');

        expect(siteHeader.getAttribute('secondleveltitle')).toBe(breadcrumbs.alertsadmin.title);
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe(breadcrumbs.alertsadmin.pathname);
        expect(getByText('View alert')).toBeInTheDocument();
        expect(getByTestId('admin-alerts-view-title').querySelector('input')).toHaveValue('Maintenance notice');
        expect(getByTestId('admin-alerts-view-body').querySelector('textarea')).toHaveValue('Notice ');
        expect(getByTestId('admin-alerts-view-start-date').querySelector('input')).toHaveValue('2025-01-01T09:00');
        expect(getByTestId('admin-alerts-view-end-date').querySelector('input')).toHaveValue('2025-01-02T10:00');
        expect(getByTestId('admin-alerts-view-checkbox-linkrequired').querySelector('input')).toBeChecked();
        expect(getByTestId('admin-alerts-view-checkbox-permanent').querySelector('input')).toBeChecked();
        expect(getByTestId('admin-alerts-view-link-title').querySelector('input')).toHaveValue('Read more');
        expect(getByTestId('admin-alerts-view-link-url').querySelector('input')).toHaveValue('https://example.com');
        expect(getByTestId('admin-alerts-view-select-priority-type')).toHaveClass('Mui-disabled');
        expect(getByTestId('admin-alerts-view-checkbox-system-homepage')).toBeInTheDocument();
        expect(getByTestId('admin-alerts-view-created-by')).toHaveTextContent('Created by: uqtest1');
        expect(getByTestId('admin-alerts-view-updated-by')).toHaveTextContent('Last Updated by: uqtest2');
        expect(preview).toHaveAttribute('alerttitle', 'Maintenance notice');
        expect(preview).toHaveAttribute('priorityType', 'urgent');
        expect(manuallyMakeWebComponentBePermanent).toHaveBeenCalledWith(
            preview,
            'Notice [permanent][Read more](https://example.com)',
        );
        expect(makePreviewActionButtonJustNotifyUser).toHaveBeenCalledWith({
            ...alert,
            linkUrl: 'https://example.com',
        });
    });

    it('sets a regular preview message when the alert body has no link or permanent marker', () => {
        const { container, getByTestId, getByText, queryByTestId } = setup({
            alert: {
                id: 'alert-2',
                title: 'Standard notice',
                start: '2025-02-03 11:30:00',
                end: '2025-02-04 12:45:00',
                body: 'A regular message',
                priority_type: 'info',
                systems: [],
            },
        });
        const preview = container.querySelector('#alert-preview');

        expect(preview).toHaveAttribute('id', 'alert-preview');
        expect(preview).toHaveAttribute('alerttitle', 'Standard notice');
        expect(preview).toHaveAttribute('priorityType', 'info');
        expect(preview).toHaveAttribute('alertmessage', 'A regular message');
        expect(manuallyMakeWebComponentBePermanent).not.toHaveBeenCalled();
        expect(makePreviewActionButtonJustNotifyUser).not.toHaveBeenCalled();
        expect(getByText('View alert')).toBeInTheDocument();
        expect(getByTestId('admin-alerts-view-title').querySelector('input')).toHaveValue('Standard notice');
        expect(getByTestId('admin-alerts-view-body').querySelector('textarea')).toHaveValue('A regular message');
        expect(getByTestId('admin-alerts-view-start-date').querySelector('input')).toHaveValue('2025-02-03T11:30');
        expect(getByTestId('admin-alerts-view-end-date').querySelector('input')).toHaveValue('2025-02-04T12:45');
        expect(getByTestId('admin-alerts-view-checkbox-linkrequired').querySelector('input')).not.toBeChecked();
        expect(getByTestId('admin-alerts-view-checkbox-permanent').querySelector('input')).not.toBeChecked();
        expect(getByTestId('admin-alerts-view-link-title').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-link-url').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-view-select-priority-type')).toHaveClass('Mui-disabled');
        expect(getByText('This alert appeared on all systems')).toBeInTheDocument();
        expect(queryByTestId('admin-alerts-view-created-by')).not.toBeInTheDocument();
        expect(queryByTestId('admin-alerts-view-updated-by')).not.toBeInTheDocument();
    });

    it('navigates to the alert list and clone routes from the footer buttons', async () => {
        const alertId = 'alert-1';
        mockUseParams.mockReturnValue({ alertid: alertId });
        mockApi.onGet(routes.ALERT_BY_ID_API({ id: alertId }).apiUrl).reply(200, {
            id: alertId,
            start: '2025-01-01 09:00:00',
            end: '2025-01-02 10:00:00',
            title: 'Loaded alert',
            body: 'Loaded body',
            priority_type: 'urgent',
            systems: ['homepage'],
        });
        const { getByTestId } = setup({ alert: null });
        await waitFor(() => expect(getByTestId('admin-alerts-view-button-block')).toBeInTheDocument());

        await userEvent.click(getByTestId('admin-alerts-view-button-cancel'));
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');

        await userEvent.click(getByTestId('admin-alerts-view-button-save'));
        expect(mockNavigate).toHaveBeenCalledWith(`/admin/alerts/clone/${alertId}`);
    });

    describe('displayPreview', () => {
        beforeEach(() => {
            makePreviewActionButtonJustNotifyUser.mockClear();
            manuallyMakeWebComponentBePermanent.mockClear();
        });

        it('sets a regular preview message without calling optional alert helpers', () => {
            const previewWrapper = document.createElement('div');
            previewWrapper.id = 'previewWrapper';
            document.body.appendChild(previewWrapper);

            try {
                displayPreview({
                    title: 'Standard notice',
                    priority_type: 'info',
                    body: 'A regular message',
                });

                expect(previewWrapper.querySelector('#alert-preview')).toHaveAttribute(
                    'alertmessage',
                    'A regular message',
                );
                expect(manuallyMakeWebComponentBePermanent).not.toHaveBeenCalled();
                expect(makePreviewActionButtonJustNotifyUser).not.toHaveBeenCalled();
            } finally {
                previewWrapper.remove();
            }
        });

        it('clears prior preview content and configures a permanent linked alert', () => {
            const previewWrapper = document.createElement('div');
            previewWrapper.id = 'previewWrapper';
            previewWrapper.innerHTML = '<span>old preview</span>';
            document.body.appendChild(previewWrapper);
            const alert = {
                title: 'Maintenance notice',
                priority_type: 'urgent',
                body: 'Notice [permanent][Read more](https://example.com)',
            };

            try {
                expect(displayPreview(alert)).toBeNull();
                const preview = previewWrapper.querySelector('#alert-preview');
                expect(previewWrapper).not.toHaveTextContent('old preview');
                expect(preview).toHaveAttribute('alerttitle', 'Maintenance notice');
                expect(preview).toHaveAttribute('priorityType', 'urgent');
                expect(manuallyMakeWebComponentBePermanent).toHaveBeenCalledWith(
                    preview,
                    'Notice [permanent][Read more](https://example.com)',
                );
                expect(makePreviewActionButtonJustNotifyUser).toHaveBeenCalledWith({
                    ...alert,
                    linkUrl: 'https://example.com',
                });
            } finally {
                previewWrapper.remove();
            }
        });

        describe('coverage', () => {
            it('returns null when the alert custom element cannot be created', () => {
                const previewWrapper = document.createElement('div');
                previewWrapper.id = 'previewWrapper';
                previewWrapper.innerHTML = '<span>old preview</span>';
                document.body.appendChild(previewWrapper);
                const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(null);

                try {
                    expect(displayPreview({ title: 'Unavailable preview' })).toBeNull();
                    expect(previewWrapper).toBeEmptyDOMElement();
                } finally {
                    createElementSpy.mockRestore();
                    previewWrapper.remove();
                }
            });
        });
    });

    describe('coverage', () => {
        it('returns without appending a preview if the alert custom element cannot be created', () => {
            const originalCreateElement = document.createElement.bind(document);
            const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(tagName => {
                if (tagName === 'uq-alert') {
                    return null;
                }
                return originalCreateElement(tagName);
            });

            try {
                const { container } = setup({
                    alert: { id: 'alert-3', title: 'Unavailable preview', body: 'Message' },
                });

                expect(container.querySelector('#alert-preview')).not.toBeInTheDocument();
            } finally {
                createElementSpy.mockRestore();
            }
        });
    });
});

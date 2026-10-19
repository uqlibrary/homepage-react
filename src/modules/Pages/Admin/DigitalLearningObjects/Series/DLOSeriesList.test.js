import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router';
import { useAccountContext } from 'context';
import { rtlRender, WithRouter } from '../../../../../../utils/test-utils';

import { DLOSeriesList } from './DLOSeriesList';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ title, children }) => <div data-testid="standard-page" data-title={title}>{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ confirmationBoxId, isOpen, locale, onAction, onCancelAction, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid={`dialogbox-${confirmationBoxId}`}>
                <button type="button" onClick={onAction}>{locale.confirmButtonLabel}</button>
                {!locale.hideCancelButton && !!locale.cancelButtonLabel && (
                    <button type="button" onClick={onCancelAction}>{locale.cancelButtonLabel}</button>
                )}
                <button type="button" onClick={onClose}>Close</button>
            </div>
        );
    },
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => <div data-testid="breadcrumbs">{breadCrumbList?.map(item => item.title).join(', ')}</div>,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/ObjectListItem', () => ({
    ObjectListItem: ({ object }) => <div data-testid={`series-object-${object?.object_public_uuid}`}>{object?.object_title}</div>,
}));

const sampleDlorList = [
    {
        object_id: 1,
        object_public_uuid: 'uuid-1',
        object_title: 'Alpha object',
        object_series_id: 7,
    },
    {
        object_id: 2,
        object_public_uuid: 'uuid-2',
        object_title: 'Unassigned object',
        object_series_id: null,
    },
];

const sampleSeriesList = [
    {
        series_id: 7,
        series_name: 'Alpha series',
        objects_count: 1,
    },
    {
        series_id: null,
        series_name: 'Not in a series',
        objects_count: 1,
    },
];

const renderSeriesList = (props = {}) => {
    const actions = {
        loadDlorSeriesList: jest.fn(() => Promise.resolve()),
        loadAllDLORs: jest.fn(() => Promise.resolve()),
        deleteDlorSeries: jest.fn(() => Promise.resolve()),
        ...(props.actions || {}),
    };

    const mergedProps = {
        actions,
        dlorSeriesList: sampleSeriesList,
        dlorSeriesListLoading: false,
        dlorSeriesListError: null,
        dlorList: sampleDlorList,
        dlorListLoading: false,
        dlorListError: null,
        dlorSeriesDeleting: false,
        dlorSeriesDeleted: null,
        dlorSeriesDeleteError: null,
        ...props,
    };

    rtlRender(
        <WithRouter>
            <DLOSeriesList {...mergedProps} />
        </WithRouter>,
    );

    return actions;
};

describe('DLOSeriesList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(jest.fn());
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('shows the loading state while the series list is loading', () => {
        renderSeriesList({ dlorSeriesListLoading: true, dlorSeriesList: null });

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('shows the error state when the series list fails to load', () => {
        renderSeriesList({ dlorSeriesListError: 'Failed to load series list', dlorSeriesList: null });

        expect(screen.getByTestId('dlor-serieslist-error')).toHaveTextContent('Failed to load series list');
    });

    it('shows the empty-state message when there are no series entries', () => {
        renderSeriesList({ dlorSeriesList: [] });

        expect(screen.getByTestId('dlor-serieslist-noresult')).toHaveTextContent(
            'We did not find any entries in the system - please try again later.',
        );
    });

    it('loads the required data on mount when series and DLO data are not already loaded', () => {
        const actions = renderSeriesList({ dlorSeriesList: null, dlorList: null });

        expect(actions.loadDlorSeriesList).toHaveBeenCalledTimes(1);
        expect(actions.loadAllDLORs).toHaveBeenCalledTimes(1);
    });

    it('renders the series list and navigates to the edit page when the edit button is clicked', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        renderSeriesList();

        expect(screen.getByText('Alpha series')).toBeInTheDocument();
        expect(screen.getByText('1 Object')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dlor-serieslist-edit-7'));

        expect(navigate).toHaveBeenCalledWith('/admin/dlor/series/edit/7');
    });

    it('opens the delete confirmation and calls the delete action when confirmed', async () => {
        const actions = renderSeriesList({
            dlorSeriesList: [
                { series_id: 7, series_name: 'Alpha series', objects_count: 0 },
            ],
            dlorList: [],
        });

        fireEvent.click(screen.getByTestId('dlor-serieslist-delete-7'));

        expect(screen.getByTestId('dialogbox-dlor-series-delete-confirm')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(actions.deleteDlorSeries).toHaveBeenCalledWith(7);
        });
        await waitFor(() => {
            expect(actions.loadDlorSeriesList).toHaveBeenCalledTimes(1);
        });
    });

    it('closes the delete modal when a failure result is confirmed', () => {
        renderSeriesList({
            dlorSeriesList: [{ series_id: 7, series_name: 'Alpha series', objects_count: 0 }],
            dlorList: [],
            dlorSeriesDeleteError: 'Delete failed',
        });

        fireEvent.click(screen.getByTestId('dlor-serieslist-delete-7'));
        fireEvent.click(screen.getAllByText('Close')[0]);

        expect(screen.queryByTestId('dialogbox-dlor-series-delete-confirm')).not.toBeInTheDocument();
    });

    it('reopens the modal after a successful delete when the completion state is returned', async () => {
        const actions = {
            loadDlorSeriesList: jest.fn(() => Promise.resolve()),
            loadAllDLORs: jest.fn(() => Promise.resolve()),
            deleteDlorSeries: jest.fn(() => Promise.resolve()),
        };
        const props = {
            actions,
            dlorSeriesList: [{ series_id: 7, series_name: 'Alpha series', objects_count: 0 }],
            dlorList: [],
            dlorSeriesDeleting: false,
            dlorSeriesDeleted: null,
            dlorSeriesDeleteError: null,
        };

        const { rerender } = rtlRender(
            <WithRouter>
                <DLOSeriesList {...props} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('dlor-serieslist-delete-7'));
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => expect(actions.deleteDlorSeries).toHaveBeenCalledWith(7));
        fireEvent.click(screen.getByText('Close'));

        rerender(
            <WithRouter>
                <DLOSeriesList {...props} dlorSeriesDeleted={[]} dlorSeriesDeleting={false} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dialogbox-dlor-series-delete-confirm')).toBeInTheDocument();
        });
    });

    it('reopens the modal after a failed delete when the error state is returned', async () => {
        const actions = {
            loadDlorSeriesList: jest.fn(() => Promise.resolve()),
            loadAllDLORs: jest.fn(() => Promise.resolve()),
            deleteDlorSeries: jest.fn(() => Promise.reject(new Error('Delete failed'))),
        };
        const props = {
            actions,
            dlorSeriesList: [{ series_id: 7, series_name: 'Alpha series', objects_count: 0 }],
            dlorList: [],
            dlorSeriesDeleting: false,
            dlorSeriesDeleted: null,
            dlorSeriesDeleteError: null,
        };

        const { rerender } = rtlRender(
            <WithRouter>
                <DLOSeriesList {...props} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('dlor-serieslist-delete-7'));
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => expect(actions.deleteDlorSeries).toHaveBeenCalledWith(7));
        fireEvent.click(screen.getByText('Close'));

        rerender(
            <WithRouter>
                <DLOSeriesList {...props} dlorSeriesDeleteError="Delete failed" />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dialogbox-dlor-series-delete-confirm')).toBeInTheDocument();
        });
    });
});

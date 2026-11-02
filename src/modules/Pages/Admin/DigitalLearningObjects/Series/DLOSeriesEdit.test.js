import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';
import { rtlRender, WithRouter } from '../../../../../../utils/test-utils';

import { DLOSeriesEdit } from './DLOSeriesEdit';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('react-dnd', () => ({
    DndProvider: ({ children }) => <>{children}</>,
    useDrag: () => [{ isDragging: false }, () => ({})],
    useDrop: () => [{}, () => ({})],
}));

jest.mock('react-dnd-html5-backend', () => ({
    HTML5Backend: {},
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ title, children }) => <div data-testid="standard-page" data-title={title}>{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onCancelAction, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="confirmation-box">
                <button type="button" onClick={onAction}>{locale.confirmButtonLabel}</button>
                <button type="button" onClick={onCancelAction}>{locale.cancelButtonLabel}</button>
                <button type="button" onClick={onClose}>Close</button>
            </div>
        );
    },
}));

jest.mock('modules/SharedComponents/RichTextEditor', () => ({
    RichTextEditor: ({ id, testId, value, onChange }) => (
        <textarea id={id} data-testid={testId} value={value || ''} onChange={e => onChange(e.target.value)} />
    ),
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => <div data-testid="breadcrumbs">{breadCrumbList?.map(item => item.title).join(', ')}</div>,
}));

const getFieldInput = testId => {
    const element = screen.getByTestId(testId);
    return element.querySelector('input, textarea') || element;
};

const renderSeriesEdit = (props = {}) => {
    const actions = {
        loadAllDLORs: jest.fn(),
        loadDlorSeries: jest.fn(),
        updateDlorSeries: jest.fn(),
        createDlorSeries: jest.fn(),
        ...(props.actions || {}),
    };

    const mergedProps = {
        actions,
        dlorItemUpdating: false,
        dlorUpdatedItemError: null,
        dlorUpdatedItem: null,
        dlorList: [],
        dlorListLoading: false,
        dlorListError: null,
        dlorSeries: {
            series_name: 'Initial series',
            series_description: 'Original description',
        },
        mode: 'EDIT',
        ...props,
    };

    rtlRender(
        <WithRouter>
            <DLOSeriesEdit {...mergedProps} actions={actions} />
        </WithRouter>,
    );

    return actions;
};

const sampleDlorList = [
    {
        object_id: 101,
        object_public_uuid: 'uuid-101',
        object_title: 'Alpha',
        object_status: 'current',
        object_series_id: 7,
        object_series_order: 1,
        object_series_name: 'Initial series',
        object_series_description: 'Original description',
    },
    {
        object_id: 202,
        object_public_uuid: 'uuid-202',
        object_title: 'Bravo',
        object_status: 'new',
        object_series_id: 0,
        object_series_order: 0,
    },
    {
        object_id: 303,
        object_public_uuid: 'uuid-303',
        object_title: 'Charlie',
        object_status: 'current',
        object_series_id: 0,
        object_series_order: 0,
    },
];

describe('DLOSeriesEdit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(jest.fn());
        useParams.mockReturnValue({ dlorSeriesId: '7' });
        useCookies.mockReturnValue([{}, jest.fn()]);
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('shows the loading state while DLO series data is still loading', () => {
        renderSeriesEdit({
            dlorListLoading: true,
            dlorList: null,
            dlorSeries: null,
        });

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('shows an error when the series list fails to load', () => {
        renderSeriesEdit({
            dlorListError: 'Failed to load series list',
            dlorList: null,
            dlorSeries: null,
        });

        expect(screen.getByTestId('dlor-seriesItem-error')).toHaveTextContent('Failed to load series list');
    });

    it('loads series data on mount and renders the edit form with the saved values', async () => {
        const actions = renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        await waitFor(() => {
            expect(getFieldInput('series-name')).toHaveValue('Initial series');
        });

        expect(screen.getByTestId('object-description')).toHaveValue('Original description');
        expect(screen.getByTestId('admin-dlor-series-form-save-button')).not.toBeDisabled();
        expect(actions.loadAllDLORs).not.toHaveBeenCalled();
    });

    it('validates the series name and blocks save when it is blank', () => {
        renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        fireEvent.change(getFieldInput('series-name'), { target: { value: '   ' } });

        expect(screen.getByTestId('error-message-series-name')).toHaveTextContent('This series name is not valid.');
        expect(screen.getByTestId('admin-dlor-series-form-save-button')).toBeDisabled();
    });

    it('updates the series description and saves the full payload', () => {
        const actions = renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        fireEvent.change(screen.getByTestId('object-description'), { target: { value: '<p>Updated description</p>' } });
        fireEvent.change(getFieldInput('series-name'), { target: { value: 'Revised series' } });
        fireEvent.click(screen.getByTestId('admin-dlor-series-form-save-button'));

        expect(actions.updateDlorSeries).toHaveBeenCalledWith(
            '7',
            expect.objectContaining({
                series_name: 'Revised series',
                series_description: '<p>Updated description</p>',
            }),
        );
    });

    it('opens the save-confirmation dialog and navigates back to the admin series page', async () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        const series = { series_name: 'Initial series', series_description: 'Original description' };
        const actions = {
            loadAllDLORs: jest.fn(),
            loadDlorSeries: jest.fn(),
            updateDlorSeries: jest.fn(),
            createDlorSeries: jest.fn(),
        };

        const view = rtlRender(
            <WithRouter>
                <DLOSeriesEdit
                    actions={actions}
                    dlorItemUpdating={false}
                    dlorUpdatedItemError={null}
                    dlorUpdatedItem={null}
                    dlorList={sampleDlorList}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSeries={series}
                    mode="EDIT"
                />
            </WithRouter>,
        );

        view.rerender(
            <WithRouter>
                <DLOSeriesEdit
                    actions={actions}
                    dlorItemUpdating={false}
                    dlorUpdatedItemError={null}
                    dlorUpdatedItem={{ series_id: '7' }}
                    dlorList={sampleDlorList}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorSeries={series}
                    mode="EDIT"
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('confirmation-box')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: 'Return to Admin Series page' }));

        expect(navigate).toHaveBeenCalledWith('/admin/dlor/series/manage');
    });

    it('loads the DLO list and series when the list is not already populated', () => {
        const actions = {
            loadAllDLORs: jest.fn(),
            loadDlorSeries: jest.fn(),
            updateDlorSeries: jest.fn(),
            createDlorSeries: jest.fn(),
        };

        renderSeriesEdit({
            actions,
            dlorList: null,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        expect(actions.loadAllDLORs).toHaveBeenCalledTimes(1);
        expect(actions.loadDlorSeries).toHaveBeenCalledWith('7');
    });

    it('adds an object to the linked series list and saves the updated ordering', () => {
        const actions = renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        fireEvent.click(screen.getByTestId('admin-series-add-object-button-303'));

        expect(screen.getByTestId('dlor-series-edit-draggable-title-uuid-303')).toBeInTheDocument();

        fireEvent.change(getFieldInput('series-name'), { target: { value: 'Updated series' } });
        fireEvent.click(screen.getByTestId('admin-dlor-series-form-save-button'));

        expect(actions.updateDlorSeries).toHaveBeenCalledWith(
            '7',
            expect.objectContaining({
                series_name: 'Updated series',
                series_list: expect.arrayContaining([
                    expect.objectContaining({
                        object_public_uuid: 'uuid-101',
                        object_series_order: 1,
                    }),
                    expect.objectContaining({
                        object_public_uuid: 'uuid-303',
                        object_series_order: 2,
                    }),
                ]),
            }),
        );
    });

    it('removes an object from the series and re-displays it as available', () => {
        renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        fireEvent.click(screen.getByTestId('admin-series-remove-object-button-0'));

        expect(screen.getByTestId('admin-series-add-object-button-101')).toBeInTheDocument();
    });

    it('navigates back to the series home page when cancel is clicked', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        renderSeriesEdit({
            dlorList: sampleDlorList,
            dlorSeries: { series_name: 'Initial series', series_description: 'Original description' },
        });

        fireEvent.click(screen.getByTestId('admin-dlor-series-form-button-cancel'));

        expect(navigate).toHaveBeenCalledWith('/admin/dlor/series/manage');
    });

    it('creates a new series in add mode and saves it without updating an existing series', () => {
        const actions = renderSeriesEdit({
            mode: 'ADD',
            dlorList: sampleDlorList,
            dlorSeries: { series_name: '', series_description: '' },
            dlorItemUpdating: false,
        });

        fireEvent.change(getFieldInput('series-name'), { target: { value: 'New series' } });
        fireEvent.click(screen.getByTestId('admin-dlor-series-form-save-button'));

        expect(actions.createDlorSeries).toHaveBeenCalledWith(
            expect.objectContaining({
                series_name: 'New series',
                series_list: expect.any(Array),
            }),
        );
        expect(actions.updateDlorSeries).not.toHaveBeenCalled();
    });
});

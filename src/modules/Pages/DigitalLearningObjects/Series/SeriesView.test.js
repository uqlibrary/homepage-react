import React from 'react';
import { MemoryRouter, useParams } from 'react-router';
import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useAccountContext } from 'context';
import { SeriesView } from './SeriesView';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    // eslint-disable-next-line react/prop-types
    StandardPage: ({ children }) => <div data-testid="standard-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    ContentLoader: () => <div data-testid="content-loader">Loading</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    ...jest.requireActual('modules/Pages/DigitalLearningObjects/dlorHelpers'),
    getDlorViewPageUrl: uuid => `#${uuid}`,
}));

const series = {
    series_id: 1,
    series_name: 'Series Name',
    series_description: '<p>Series overview</p>',
};

const makeObject = (overrides = {}) => ({
    object_id: 1,
    object_public_uuid: 'series-object-1',
    object_series_id: 1,
    object_series_order: 1,
    object_title: 'Series object',
    object_summary: 'Series object summary',
    object_restrict_to: 'none',
    object_is_featured: 0,
    object_cultural_advice: false,
    object_series_name: '',
    object_filters: [],
    ...overrides,
});

const defaultActions = () => ({
    loadDlorSeries: jest.fn(),
    loadCurrentDLORs: jest.fn(),
});

const renderSeries = (overrides = {}) => {
    const actions = { ...defaultActions(), ...(overrides.actions || {}) };
    const props = {
        dlorSeries: series,
        dlorSeriesLoading: false,
        dlorSeriesError: null,
        dlorList: [makeObject()],
        dlorListError: null,
        dlorListLoading: false,
        ...overrides,
        actions,
    };

    const view = rtlRender(
        <MemoryRouter>
            <SeriesView {...props} />
        </MemoryRouter>,
    );

    return { ...view, actions, props };
};

describe('SeriesView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ seriesId: '1' });
        useAccountContext.mockReturnValue({ account: null });
        window.history.replaceState({}, '', '/');
        document.title = '';
    });

    it('loads series and object data, reloading the series only when its id changes', async () => {
        const { actions, props, rerender } = renderSeries({ dlorList: null });

        await waitFor(() => {
            expect(actions.loadDlorSeries).toHaveBeenCalledWith('1');
            expect(actions.loadCurrentDLORs).toHaveBeenCalledTimes(1);
        });
        expect(document.title).toBe('Series Name');

        rerender(
            <MemoryRouter>
                <SeriesView {...props} />
            </MemoryRouter>,
        );
        expect(actions.loadDlorSeries).toHaveBeenCalledTimes(1);

        useParams.mockReturnValue({ seriesId: '2' });
        rerender(
            <MemoryRouter>
                <SeriesView {...props} />
            </MemoryRouter>,
        );

        await waitFor(() => expect(actions.loadDlorSeries).toHaveBeenLastCalledWith('2'));
        expect(actions.loadDlorSeries).toHaveBeenCalledTimes(2);
    });

    it.each([
        ['list missing', { dlorList: null }, 1],
        ['list error', { dlorList: null, dlorListError: 'List failed' }, 0],
        ['list loading', { dlorList: null, dlorListLoading: true }, 0],
        ['empty list', { dlorList: [] }, 0],
    ])('requests current objects only when the %s needs loading', (_state, props, expectedCalls) => {
        const { actions } = renderSeries(props);

        expect(actions.loadCurrentDLORs).toHaveBeenCalledTimes(expectedCalls);
    });

    it('shows the series loading error and the fallback document title', () => {
        renderSeries({
            dlorSeries: null,
            dlorSeriesError: 'An error has occurred during the request and this request cannot be processed',
            dlorList: [],
        });

        expect(document.title).toBe('Digital Learning Object Series');
        expect(screen.getByTestId('dlor-seriespage-loadError')).toHaveTextContent(
            'An error has occurred during the request and this request cannot be processed',
        );
        expect(screen.queryByTestId('dlor-seriespage')).not.toBeInTheDocument();
    });

    it('shows a loader while the object list is loading and hides the series content while it loads', () => {
        renderSeries({
            dlorSeriesLoading: true,
            dlorListLoading: true,
        });

        expect(screen.getByTestId('content-loader')).toHaveTextContent('Loading');
        expect(screen.queryByTestId('dlor-seriespage')).not.toBeInTheDocument();
    });

    it('renders the series description, ordered objects, tags, and facet labels', () => {
        const lateObject = makeObject({
            object_id: 2,
            object_public_uuid: 'late-object',
            object_title: 'Later object',
            object_series_order: 2,
            object_filters: [
                { filter_key: 'item_type', filter_values: [{ id: 1, name: 'Guide' }] },
                { filter_key: 'media_format', filter_values: [{ id: 2, name: 'PDF' }] },
                { filter_key: 'topic', filter_values: [{ id: 3, name: 'Study skills' }] },
            ],
        });
        const earlyObject = makeObject({
            object_id: 3,
            object_public_uuid: 'early-object',
            object_title: 'First object',
            object_series_order: 1,
            object_is_featured: 1,
            object_cultural_advice: true,
            object_series_name: 'Related collection',
            object_filters: [
                { filter_key: 'item_type', filter_values: [{ id: 4, name: 'Module' }] },
                { filter_key: 'media_format', filter_values: [{ id: 5, name: 'Video' }] },
                { filter_key: 'topic', filter_values: [{ id: 6, name: 'Accessibility' }] },
            ],
        });
        const unrelatedObject = makeObject({
            object_id: 4,
            object_public_uuid: 'other-series-object',
            object_title: 'Other series object',
            object_series_id: 2,
        });

        renderSeries({ dlorList: [lateObject, unrelatedObject, earlyObject] });

        expect(document.title).toBe('Series Name');
        expect(screen.getByTestId('dlor-seriespage-description')).toHaveTextContent('Series overview');
        expect(screen.getByTestId('dlor-homepage-panel-early-object')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-panel-late-object')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-other-series-object')).not.toBeInTheDocument();
        expect(screen.getByText('Featured')).toBeInTheDocument();
        expect(screen.getByText('Cultural advice')).toBeInTheDocument();
        expect(screen.getByText('Series: Related collection')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-panel-early-object-footer-type')).toHaveTextContent('Module');
        expect(screen.getByTestId('dlor-homepage-panel-early-object-footer-media')).toHaveTextContent('Video');
        expect(screen.getByTestId('dlor-homepage-panel-early-object-footer-topic')).toHaveTextContent('Accessibility');

        const earlyCard = screen.getByTestId('dlor-homepage-panel-early-object');
        const lateCard = screen.getByTestId('dlor-homepage-panel-late-object');
        expect(earlyCard.compareDocumentPosition(lateCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('shows the fallback description when the series has no detailed description', () => {
        renderSeries({
            dlorSeries: {
                ...series,
                series_description: '',
            },
            dlorList: [],
        });

        expect(screen.getByTestId('dlor-seriespage-description')).toHaveTextContent(
            'This series does not have a detailed description at this time.',
        );
    });

    it('shows restricted-object messages and prevents navigation for a public user', () => {
        useAccountContext.mockReturnValue({ account: { id: 'public-user', user_group: 'COMMU' } });
        useParams.mockReturnValue({ seriesId: '9' });
        renderSeries({
            dlorList: [
                makeObject({
                    object_public_uuid: 'uqstaff-object',
                    object_title: 'Staff Restricted Object',
                    object_series_id: 9,
                    object_restrict_to: 'uqstaff',
                }),
                makeObject({
                    object_public_uuid: 'library-object',
                    object_title: 'Staff (library) Restricted Object',
                    object_series_id: 9,
                    object_restrict_to: 'uqlibrarystaff',
                }),
                makeObject({
                    object_public_uuid: 'uq-only-object',
                    object_title: 'UQ Only Restricted Object',
                    object_series_id: 9,
                    object_restrict_to: 'uquser',
                }),
                makeObject({
                    object_public_uuid: 'public-object',
                    object_title: 'Publicly available object',
                    object_series_id: 9,
                }),
            ],
        });

        expect(
            screen.getByRole('button', { name: /Staff Restricted Object - You need to be UQ staff/ }),
        ).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('button', {
                name: /Staff \(library\) Restricted Object - You need to be UQ Library staff/,
            }),
        ).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('button', {
                name: /UQ Only Restricted Object - You need to be a UQ staff or student/,
            }),
        ).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(screen.getByRole('button', { name: /Staff Restricted Object/ }));
        expect(window.location.hash).toBe('');
        fireEvent.click(screen.getByRole('button', { name: /Publicly available object/ }));
        expect(window.location.hash).toBe('#public-object');
    });

    it('allows library staff to open staff, library, and UQ-restricted objects', () => {
        useAccountContext.mockReturnValue({ account: { id: 'library-staff', user_group: 'LIBRARYSTAFFB' } });
        useParams.mockReturnValue({ seriesId: '9' });
        renderSeries({
            dlorList: [
                makeObject({ object_public_uuid: 'staff', object_series_id: 9, object_restrict_to: 'uqstaff' }),
                makeObject({
                    object_public_uuid: 'library',
                    object_series_id: 9,
                    object_restrict_to: 'uqlibrarystaff',
                }),
                makeObject({ object_public_uuid: 'uq', object_series_id: 9, object_restrict_to: 'uquser' }),
            ],
        });

        expect(screen.getByTestId('dlor-homepage-panel-staff').querySelector('button')).toHaveAttribute(
            'aria-disabled',
            'false',
        );
        expect(screen.getByTestId('dlor-homepage-panel-library').querySelector('button')).toHaveAttribute(
            'aria-disabled',
            'false',
        );
        expect(screen.getByTestId('dlor-homepage-panel-uq').querySelector('button')).toHaveAttribute(
            'aria-disabled',
            'false',
        );
    });
});

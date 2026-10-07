import React from 'react';
import { rtlRender, WithRouter, screen } from 'test-utils';
import { useAccountContext } from 'context';
import { useTitle } from 'hooks';
import { BookableSpacesDetailPage } from './BookableSpacesDetailPage';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('hooks', () => ({
    useTitle: jest.fn(),
}));

jest.mock('modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView', () => ({
    __esModule: true,
    default: ({ selectedSpace, isFavourite, showMap }) => (
        <div data-testid="journey-space-details-view">
            <span>{selectedSpace?.space_name}</span>
            <span data-testid="is-favourite-value">{String(Boolean(isFavourite))}</span>
            {showMap ? <span data-testid="show-map">map</span> : null}
        </div>
    ),
}));

jest.mock('../SpacesListPage/SimpleListPage/components/JourneyBreadcrumbs', () => ({
    __esModule: true,
    default: () => <div data-testid="journey-breadcrumbs">Breadcrumbs</div>,
}));

const buildDetailResult = overrides => ({
    data: {
        space_id: 42,
        space_name: 'Study room alpha',
        ...overrides,
    },
});

const defaultActions = {
    loadABookableSpacesRoom: jest.fn(),
    loadWeeklyHours: jest.fn(),
    loadSpacesFavourites: jest.fn(),
};

function setup({
    actions = defaultActions,
    bookableSpaceGetting = false,
    bookableSpaceGetError = false,
    bookableSpaceGetResult = buildDetailResult(),
    spacesFavouritesList = [],
    spacesFavouritesError = false,
    weeklyHours = { locations: [] },
    weeklyHoursLoading = false,
    weeklyHoursError = false,
    route = '/spaces/details/:spaceUuid',
    initialEntries = ['/spaces/details/space-1'],
} = {}) {
    return rtlRender(
        <WithRouter route={route} initialEntries={initialEntries}>
            <BookableSpacesDetailPage
                actions={actions}
                weeklyHours={weeklyHours}
                weeklyHoursLoading={weeklyHoursLoading}
                weeklyHoursError={weeklyHoursError}
                bookableSpaceGetting={bookableSpaceGetting}
                bookableSpaceGetError={bookableSpaceGetError}
                bookableSpaceGetResult={bookableSpaceGetResult}
                spacesFavouritesList={spacesFavouritesList}
                spacesFavouritesError={spacesFavouritesError}
            />
        </WithRouter>,
    );
}

describe('Spaces Detail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: null });
        Object.defineProperty(window, 'scrollTo', {
            value: jest.fn(),
            writable: true,
            configurable: true,
        });
        Object.defineProperty(window.history, 'scrollRestoration', {
            value: 'auto',
            writable: true,
            configurable: true,
        });
    });

    it('shows loading indicator when space is loading', () => {
        const { getByRole } = setup({
            bookableSpaceGetting: true,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: null,
        });

        expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('loads the space and weekly hours, and loads favourites only for logged-in users', () => {
        const actions = { ...defaultActions };
        useAccountContext.mockReturnValue({ account: { id: 42 } });

        setup({
            actions,
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: buildDetailResult({ space_id: 99, space_name: 'Logged in space' }),
            spacesFavouritesList: [{ space_id: 99 }],
        });

        expect(actions.loadABookableSpacesRoom).toHaveBeenCalledWith('space-1');
        expect(actions.loadWeeklyHours).toHaveBeenCalledTimes(1);
        expect(actions.loadSpacesFavourites).toHaveBeenCalledTimes(1);
        expect(useTitle).toHaveBeenCalledWith('Space Details - UQ Library');
    });

    it('does not load favourites when there is no account context', () => {
        const actions = { ...defaultActions };

        setup({
            actions,
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: buildDetailResult({ space_id: 7, space_name: 'Public space' }),
        });

        expect(actions.loadABookableSpacesRoom).toHaveBeenCalledWith('space-1');
        expect(actions.loadWeeklyHours).toHaveBeenCalledTimes(1);
        expect(actions.loadSpacesFavourites).not.toHaveBeenCalled();
    });

    it('does not load the page data when the route does not include a space uuid', () => {
        const actions = { ...defaultActions };

        setup({
            actions,
            route: '/spaces',
            initialEntries: ['/spaces'],
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: buildDetailResult({ space_name: 'No route match' }),
        });

        expect(actions.loadABookableSpacesRoom).not.toHaveBeenCalled();
        expect(actions.loadWeeklyHours).not.toHaveBeenCalled();
        expect(actions.loadSpacesFavourites).not.toHaveBeenCalled();
    });

    it('shows the unavailable message when the space fetch has an error', () => {
        setup({
            bookableSpaceGetting: false,
            bookableSpaceGetError: true,
            bookableSpaceGetResult: { data: {} },
        });

        expect(
            screen.getByText('Details of this Space are currently unavailable - please try again later.'),
        ).toBeInTheDocument();
    });

    it('shows the not found message when the returned space is empty or invalid', () => {
        setup({
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: { data: {} },
        });

        expect(screen.getByText('That Space does not seem to exist')).toBeInTheDocument();
    });

    it('renders the space details view and breadcrumb for a valid space', () => {
        setup({
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: buildDetailResult({ space_id: 12, space_name: 'Detail room' }),
            spacesFavouritesList: [{ space_id: 12 }],
        });

        expect(screen.getByTestId('journey-breadcrumbs')).toBeInTheDocument();
        expect(screen.getByTestId('journey-space-details-view')).toBeInTheDocument();
        expect(screen.getByText('Detail room')).toBeInTheDocument();
        expect(screen.getByTestId('is-favourite-value')).toHaveTextContent('true');
        expect(screen.getByTestId('show-map')).toBeInTheDocument();
    });

    it('resets scroll position and restores history scroll behavior on unmount', () => {
        const scrollToMock = jest.fn().mockImplementationOnce(() => {
            throw new Error('scroll error');
        });
        Object.defineProperty(window, 'scrollTo', {
            value: scrollToMock,
            writable: true,
            configurable: true,
        });

        const { unmount } = setup({
            bookableSpaceGetting: false,
            bookableSpaceGetError: false,
            bookableSpaceGetResult: buildDetailResult({ space_id: 5, space_name: 'Scroll room' }),
        });

        expect(scrollToMock).toHaveBeenCalled();
        expect(window.history.scrollRestoration).toBe('manual');

        unmount();
        expect(window.history.scrollRestoration).toBe('auto');
    });
});

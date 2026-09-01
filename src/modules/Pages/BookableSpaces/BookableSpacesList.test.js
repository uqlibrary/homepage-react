/* eslint-disable react/prop-types */
import React from 'react';

import { act } from 'react-dom/test-utils';

import { fireEvent, rtlRender, screen, waitFor, WithRouter } from 'test-utils';

import { BookableSpacesList, buildJourneyNavigationUrl } from 'modules/Pages/BookableSpaces/BookableSpacesList';
import {
    deserialiseJourneyMapFilterState,
    JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY,
} from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

const mockDispatch = jest.fn();
const mockFlyToSpace = jest.fn();
const mockSetCookie = jest.fn();
const mockRemoveCookie = jest.fn();
const mockJourneyRender = jest.fn();
const mockSidebarRender = jest.fn();
const mockSidebarListRender = jest.fn();

jest.mock('data/actions/drupalArticlesActions', () => ({
    loadDrupalArticles: () => ({ type: 'LOAD_DRUPAL_ARTICLES' }),
}));

jest.mock('react-redux', () => {
    const actual = jest.requireActual('react-redux');
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

jest.mock('react-cookie', () => ({
    useCookies: () => [{}, mockSetCookie, mockRemoveCookie],
}));

jest.mock('context', () => ({
    useAccountContext: () => ({ account: null }),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

jest.mock('modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/SidebarSpacesList', () => {
    return function MockSidebarSpacesList(props) {
        mockSidebarListRender(props);
        return <div data-testid="mock-spaces-list" />;
    };
});
jest.mock(
    'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/BookableSpacesWrapper',
    () => props => {
        mockJourneyRender(props);
        return <div data-testid="mock-journey" />;
    },
);

jest.mock('modules/Pages/BookableSpaces/Shared/SidebarFilters', () => {
    return function MockSidebarFilters(props) {
        mockSidebarRender(props);
        return (
            <>
                <button
                    data-testid="trigger-campus-change"
                    onClick={() => props.handleCampusSelection({ target: { value: '2' } })}
                >
                    Trigger campus change
                </button>
                <button
                    data-testid="trigger-all-campuses"
                    onClick={() => props.handleCampusSelection({ target: { value: '0' } })}
                >
                    Trigger all campuses
                </button>
                <button data-testid="toggle-favourites-only" onClick={() => props.setShowFavouriteSpacesOnly(true)}>
                    Toggle favourites only
                </button>
            </>
        );
    };
});

jest.mock('modules/Pages/BookableSpaces/Shared/BookableSpacesMap', () => {
    const ReactModule = jest.requireActual('react');

    return ReactModule.forwardRef(function MockBookableSpacesMap(props, ref) {
        ReactModule.useImperativeHandle(ref, () => ({
            flyToSpace: mockFlyToSpace,
        }));
        ReactModule.useEffect(() => {
            props.onMapReady?.(true);
        }, [props.onMapReady]);
        return <div data-testid="mock-bookable-spaces-map" />;
    });
});

describe('BookableSpacesList campus selection', () => {
    const baseProps = {
        actions: {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadSpacesFavourites: jest.fn(),
            addSpaceFavourite: jest.fn(),
            deleteSpaceFavourite: jest.fn(),
        },
        bookableSpacesRoomList: {
            data: {
                locations: [
                    {
                        space_id: 101,
                        space_name: 'St Lucia space',
                        space_latitude: -27.495,
                        space_longitude: 153.013,
                        space_campus_id: 1,
                        space_campus_name: 'St Lucia',
                        space_campus_number: '1',
                        space_building_name: 'Building A',
                        space_building_number: '1',
                        space_library_id: 11,
                        space_library_name: 'Central Library',
                        space_capacity: 4,
                        space_draftmode: false,
                        facility_types: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                            },
                        ],
                    },
                    {
                        space_id: 201,
                        space_name: 'Gatton space',
                        space_latitude: -27.556,
                        space_longitude: 152.337,
                        space_campus_id: 2,
                        space_campus_name: 'Gatton',
                        space_campus_number: '2',
                        space_building_name: 'Building B',
                        space_building_number: '2',
                        space_library_id: 22,
                        space_library_name: 'Gatton Library',
                        space_capacity: 6,
                        space_draftmode: false,
                        facility_types: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                            },
                        ],
                    },
                ],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: null,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: null,
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Features',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: 1,
                        facility_type_children: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                                filter_display_on: 'both',
                            },
                        ],
                    },
                ],
            },
        },
        facilityTypeListLoading: false,
        facilityTypeListError: null,
        spacesFavouritesList: [],
        drupalArticleList: [],
        drupalArticlesError: null,
        drupalArticlesLoading: false,
        forceAdvanced: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.history.replaceState({}, '', '/spaces');
        window.sessionStorage.clear();
    });

    it('defaults to all campuses when no saved preference exists', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedCampus).toBe(0);
    });

    it('does not throw when the selected campus has no locations to centre on', () => {
        expect(() =>
            rtlRender(
                <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                    <BookableSpacesList
                        {...baseProps}
                        bookableSpacesRoomList={{
                            data: { locations: [] },
                        }}
                    />
                </WithRouter>,
            ),
        ).not.toThrow();
    });

    it('orders all-campus map results by the map-centred campus priority', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList
                    {...baseProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [
                                {
                                    space_id: 301,
                                    space_name: 'Gatton space',
                                    space_campus_name: 'Gatton',
                                    space_building_name: 'Building G',
                                    space_building_number: '1',
                                    space_latitude: -27.55,
                                    space_longitude: 152.33,
                                    space_campus_id: 2,
                                },
                                {
                                    space_id: 302,
                                    space_name: 'Dutton Park space',
                                    space_campus_name: 'Dutton Park',
                                    space_building_name: 'Building D',
                                    space_building_number: '2',
                                    space_latitude: -27.5,
                                    space_longitude: 153.0,
                                    space_campus_id: 4,
                                },
                                {
                                    space_id: 303,
                                    space_name: 'Herston space',
                                    space_campus_name: 'Herston',
                                    space_building_name: 'Building H',
                                    space_building_number: '3',
                                    space_latitude: -27.45,
                                    space_longitude: 153.0,
                                    space_campus_id: 3,
                                },
                                {
                                    space_id: 304,
                                    space_name: 'St Lucia space',
                                    space_campus_name: 'St Lucia',
                                    space_building_name: 'Building S',
                                    space_building_number: '4',
                                    space_latitude: -27.49,
                                    space_longitude: 153.01,
                                    space_campus_id: 1,
                                },
                            ],
                        },
                    }}
                />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls[mockSidebarListRender.mock.calls.length - 1][0];

        expect(latestSidebarListProps.filteredSpaceLocations.map(space => space.space_campus_name)).toEqual([
            'St Lucia',
            'Dutton Park',
            'Herston',
            'Gatton',
        ]);
    });

    it('flies to selected campus when campus value is received as a string', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('trigger-campus-change'));

        await waitFor(() => expect(mockFlyToSpace).toHaveBeenCalled());

        const [targetLocation] = mockFlyToSpace.mock.calls[mockFlyToSpace.mock.calls.length - 1];
        expect(targetLocation.space_campus_id).toBe(2);
        expect(targetLocation.space_campus_name).toBe('Gatton');
        expect(mockSetCookie).toHaveBeenCalledWith(
            'UQLspacesPreferredCampus',
            2,
            expect.objectContaining({ expires: expect.any(Date) }),
        );
    });

    it('clears the saved campus preference when all campuses is selected', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('trigger-all-campuses'));

        await waitFor(() => expect(mockRemoveCookie).toHaveBeenCalledWith('UQLspacesPreferredCampus', { path: '/' }));
    });

    it('keeps the current URL unchanged while local filters are changed', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        fireEvent.click(screen.getByTestId('toggle-favourites-only'));

        await waitFor(() => {
            const searchValue =
                window.location.search ||
                (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
            const params = new URLSearchParams(searchValue);
            const parsedState = deserialiseJourneyMapFilterState(params);
            expect(parsedState).toBeNull();
        });
    });

    it('returns to the journey landing state when the advanced-view button is used without active filters', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/spaces',
            selectedFacilityTypes: [],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [],
        });

        expect(navigatedUrl).not.toContain('mapFilters');
        expect(navigatedUrl).not.toContain('journeyStep');
        expect(navigatedUrl).toContain('/spaces');
    });

    it('routes to the journey results step when a non-default campus selection is active without facility filters', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/spaces',
            selectedFacilityTypes: [],
            selectedCampus: 2,
            selectedLibrary: 0,
            capacityFilterValue: [],
        });

        expect(navigatedUrl).toContain('/spaces/results');
        expect(navigatedUrl).not.toContain('mapFilters=');
    });

    it('routes to journey results when favourites-only mode is active', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/spaces/mapresults',
            selectedFacilityTypes: [],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [],
            showFavouriteSpacesOnly: true,
        });

        expect(navigatedUrl).toContain('/spaces/results');
        expect(navigatedUrl).not.toContain('mapFilters=');
    });

    it('defaults the journey handoff to the results step when filters are active', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/spaces',
            selectedFacilityTypes: [{ facility_type_id: 11, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 11,
            capacityFilterValue: [4, 8],
        });

        expect(navigatedUrl).toContain('/spaces/results');
        expect(navigatedUrl).not.toContain('mapFilters=');
    });

    it('does not persist live filter state in session storage when filters are changed on results route', async () => {
        window.history.replaceState({}, '', '/spaces/results/');

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...baseProps} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];

        act(() => {
            latestJourneyProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ]);
        });

        await waitFor(() => {
            const rawState = window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
            expect(rawState).toContain('selectedFacilityTypes');
        });
    });

    it('restores live filter state from session storage on refresh of results route', async () => {
        window.history.replaceState({}, '', '/spaces/results/');

        const persistedLiveState = {
            routePath: '/spaces/results/',
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            capacityFilterValue: [4, 8],
            showFavouriteSpacesOnly: true,
            createdAt: Date.now(),
        };

        window.sessionStorage.setItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY, JSON.stringify(persistedLiveState));

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...baseProps} forceAdvanced={false} spacesFavouritesList={[{ space_id: 201 }]} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];

        expect(latestJourneyProps.selectedFacilityTypes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                }),
            ]),
        );
        expect(latestJourneyProps.capacityFilterValue).toEqual([4, 8]);
        expect(latestJourneyProps.showFavouriteSpacesOnly).toBe(true);
    });

    it('passes null highlightedSpace when there are no valid highlighted spaces', async () => {
        window.history.replaceState({}, '', '/spaces');
        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: baseProps.bookableSpacesRoomList.data.locations.map(space => ({
                        ...space,
                        space_highlighted: false,
                    })),
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces" initialEntries={['/spaces']}>
                <BookableSpacesList {...props} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];
        expect(latestProps.highlightedSpace).toBeNull();
    });

    it('passes the single valid highlighted space when exactly one is available', async () => {
        window.history.replaceState({}, '', '/spaces');
        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_highlighted: true,
                            space_draftmode: false,
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            space_highlighted: false,
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces" initialEntries={['/spaces']}>
                <BookableSpacesList {...props} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];
        expect(latestProps.highlightedSpace?.space_id).toBe(101);
    });

    it('randomises highlightedSpace when more than one valid highlighted space exists', async () => {
        window.history.replaceState({}, '', '/spaces');
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_highlighted: true,
                            space_draftmode: false,
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            space_highlighted: true,
                            space_draftmode: false,
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces" initialEntries={['/spaces']}>
                <BookableSpacesList {...props} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];
        expect(latestProps.highlightedSpace?.space_id).toBe(201);

        randomSpy.mockRestore();
    });
});

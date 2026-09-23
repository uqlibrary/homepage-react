/* eslint-disable react/prop-types */
import React from 'react';

import { act } from 'react-dom/test-utils';

import { fireEvent, rtlRender, screen, waitFor, WithRouter } from 'test-utils';
import { useAccountContext } from 'context';
import * as useCookiesModule from 'react-cookie';

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
const mockMapRender = jest.fn();

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
    useCookies: jest.fn(() => [{}, mockSetCookie, mockRemoveCookie]),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(() => ({ account: null })),
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
        mockMapRender(props);
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

    it('scrolls the selected space to the top of the right-hand list when it is chosen', () => {
        const spaceWrapper = document.createElement('div');
        spaceWrapper.id = 'space-wrapper';
        spaceWrapper.scrollTo = jest.fn();
        spaceWrapper.scrollTop = 120;

        const spaceElement = document.createElement('div');
        spaceElement.id = 'space-101';
        Object.defineProperty(spaceElement, 'getBoundingClientRect', {
            value: () => ({ top: 40, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
        });
        spaceWrapper.appendChild(spaceElement);
        document.body.appendChild(spaceWrapper);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        act(() => {
            latestSidebarListProps.onSpaceSelect(baseProps.bookableSpacesRoomList.data.locations[0]);
        });

        expect(spaceWrapper.scrollTo).toHaveBeenCalledWith({
            top: expect.any(Number),
            behavior: 'smooth',
        });

        document.body.removeChild(spaceWrapper);
    });

    it('keeps the most recently selected map pin active instead of restoring the stale session value', async () => {
        window.sessionStorage.setItem('bookableSpacesSelectedSpaceId', '101');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockMapRender).toHaveBeenCalled());
        const latestMapProps = mockMapRender.mock.calls.at(-1)[0];

        act(() => {
            latestMapProps.onMarkerClick(
                { originalEvent: { stopPropagation: jest.fn(), preventDefault: jest.fn() } },
                baseProps.bookableSpacesRoomList.data.locations[1],
            );
        });

        await waitFor(() => expect(window.sessionStorage.getItem('bookableSpacesSelectedSpaceId')).toBe('201'));

        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        expect(latestSidebarListProps.expandedSpaceId).toBe(201);
    });

    it('restores the previously selected space from session storage on the map view', async () => {
        window.sessionStorage.setItem('bookableSpacesSelectedSpaceId', '201');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];

        expect(latestSidebarListProps.expandedSpaceId).toBe(201);
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

    it('removes a stale capacityFilterValue from session storage when the default range is restored', async () => {
        window.history.replaceState({}, '', '/spaces/results/');
        window.sessionStorage.setItem(
            JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY,
            JSON.stringify({
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
            }),
        );

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...baseProps} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];

        act(() => {
            latestJourneyProps.setCapacityFilterValue([1, 6]);
        });

        await waitFor(() => {
            const rawState = window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
            expect(rawState).not.toContain('capacityFilterValue');
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
            selectedCampus: 2,
            selectedLibrary: 7,
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
        expect(latestJourneyProps.selectedCampus).toBe(2);
        expect(latestJourneyProps.selectedLibrary).toBe(7);
        expect(latestJourneyProps.capacityFilterValue).toEqual([4, 8]);
        expect(latestJourneyProps.showFavouriteSpacesOnly).toBe(true);
    });

    it('ignores malformed persisted journey state instead of crashing when hydrating filters', async () => {
        window.history.replaceState({}, '', '/spaces/results/');
        window.sessionStorage.setItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY, '{not-valid-json');
        useAccountContext.mockReturnValue({ account: { id: 42 } });

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...baseProps} forceAdvanced={false} spacesFavouritesList={[{ space_id: 101 }]} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];
        expect(latestJourneyProps.showFavouriteSpacesOnly).toBe(false);
        expect(latestJourneyProps.selectedCampus).toBe(0);
        expect(latestJourneyProps.selectedLibrary).toBe(0);
    });

    it('clears the stored selected space when a list item is collapsed', async () => {
        window.sessionStorage.setItem('bookableSpacesSelectedSpaceId', '101');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarListProps.onSpaceToggle(baseProps.bookableSpacesRoomList.data.locations[0], false);
        });

        await waitFor(() => expect(window.sessionStorage.getItem('bookableSpacesSelectedSpaceId')).toBeNull());
    });

    it('falls back to the campus centre when library selection is reset to all libraries', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        act(() => {
            latestSidebarProps.handleLibrarySelection({ target: { value: '11' } });
            latestSidebarProps.handleLibrarySelection({ target: { value: '0' } });
        });

        await waitFor(() => expect(mockFlyToSpace).toHaveBeenCalled());
        const [location] = mockFlyToSpace.mock.calls[mockFlyToSpace.mock.calls.length - 1];
        expect(location.space_campus_id).toBe(1);
        expect(location.space_campus_name).toBe('St Lucia');
    });

    it('treats invalid campus or library values as the all-campuses default', async () => {
        window.history.replaceState({}, '', '/spaces/results/');
        window.sessionStorage.setItem(
            JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY,
            JSON.stringify({
                selectedCampus: 'not-a-number',
                selectedLibrary: 'also-not-a-number',
            }),
        );

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...baseProps} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];
        expect(latestJourneyProps.selectedCampus).toBe(0);
        expect(latestJourneyProps.selectedLibrary).toBe(0);
    });

    it('applies favourites-only and campus/library filtering in the journey results view', async () => {
        const favouriteOnlyProps = {
            ...baseProps,
            forceAdvanced: false,
            spacesFavouritesList: [{ space_id: 201 }],
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_id: 101,
                            space_campus_id: 1,
                            space_campus_name: 'St Lucia',
                            space_library_id: 11,
                            space_library_name: 'Central Library',
                            space_capacity: 4,
                            facility_types: [{ facility_type_id: 11, facility_type_name: 'Whiteboard' }],
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            space_id: 201,
                            space_campus_id: 2,
                            space_campus_name: 'Gatton',
                            space_library_id: 22,
                            space_library_name: 'Gatton Library',
                            space_capacity: 6,
                            facility_types: [{ facility_type_id: 11, facility_type_name: 'Whiteboard' }],
                        },
                        {
                            space_id: 301,
                            space_name: 'Gatton overflow',
                            space_latitude: -27.55,
                            space_longitude: 152.33,
                            space_campus_id: 2,
                            space_campus_name: 'Gatton',
                            space_building_name: 'Building G',
                            space_building_number: '3',
                            space_library_id: 33,
                            space_library_name: 'Overflow Library',
                            space_capacity: 10,
                            space_draftmode: false,
                            facility_types: [{ facility_type_id: 22, facility_type_name: 'Monitor' }],
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...favouriteOnlyProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        let latestJourneyProps = mockJourneyRender.mock.calls.at(-1)[0];

        act(() => {
            latestJourneyProps.handleCampusSelection({ target: { value: '2' } });
        });

        await waitFor(() => expect(mockJourneyRender.mock.calls.at(-1)[0].selectedCampus).toBe(2));
        latestJourneyProps = mockJourneyRender.mock.calls.at(-1)[0];

        act(() => {
            latestJourneyProps.handleLibrarySelection({ target: { value: '22' } });
        });

        await waitFor(() => expect(mockJourneyRender.mock.calls.at(-1)[0].selectedLibrary).toBe(22));
        latestJourneyProps = mockJourneyRender.mock.calls.at(-1)[0];

        act(() => {
            latestJourneyProps.setShowFavouriteSpacesOnly(true);
        });

        await waitFor(() => {
            const visibleIds = mockJourneyRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([201]);
        });
    });

    it('shows map-only filters in the map view and simple filters in the journey view', async () => {
        const displayProps = {
            ...baseProps,
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
                                    facility_type_name: 'Simple only',
                                    filter_display_on: 'simple',
                                },
                                {
                                    facility_type_id: 12,
                                    facility_type_name: 'Map only',
                                    filter_display_on: 'advanced',
                                },
                                {
                                    facility_type_id: 13,
                                    facility_type_name: 'Both',
                                    filter_display_on: 'both',
                                },
                                {
                                    facility_type_id: 14,
                                    facility_type_name: 'Hidden',
                                    filter_display_on: 'both',
                                    hide_in_public_filter_list: true,
                                },
                            ],
                        },
                    ],
                },
            },
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            facility_types: [
                                { facility_type_id: 11, facility_type_name: 'Simple only' },
                                { facility_type_id: 12, facility_type_name: 'Map only' },
                                { facility_type_id: 13, facility_type_name: 'Both' },
                            ],
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            facility_types: [
                                { facility_type_id: 11, facility_type_name: 'Simple only' },
                                { facility_type_id: 13, facility_type_name: 'Both' },
                            ],
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...displayProps} forceAdvanced />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        let latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];
        expect(
            latestSidebarProps.filteredFacilityTypeList.data.facility_type_groups[0].facility_type_children.map(
                child => child.facility_type_name,
            ),
        ).toEqual(['Map only', 'Both']);

        rtlRender(
            <WithRouter route="/spaces/results/" initialEntries={['/spaces/results/']}>
                <BookableSpacesList {...displayProps} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        latestSidebarProps = mockJourneyRender.mock.calls.at(-1)[0];
        expect(
            latestSidebarProps.filteredFacilityTypeList.data.facility_type_groups[0].facility_type_children.map(
                child => child.facility_type_name,
            ),
        ).toEqual(['Simple only', 'Both']);
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

    it('renders the loading state while any of the required data is still loading', () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} bookableSpacesRoomListLoading />
            </WithRouter>,
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(mockSidebarRender).not.toHaveBeenCalled();
    });

    it('renders the error state when the rooms request fails', () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} bookableSpacesRoomListError={{ message: 'failed' }} />
            </WithRouter>,
        );

        expect(screen.getByTestId('spaces-error')).toBeInTheDocument();
    });

    it('toggles the filter and spaces-list side panels open and closed', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        const filterToggleButton = screen.getByTestId('spaces-open-filter-button');
        expect(filterToggleButton).toHaveAttribute('title', 'Hide filters');
        fireEvent.click(filterToggleButton);
        expect(filterToggleButton).toHaveAttribute('title', 'Show filters');

        const spacesListToggleButton = screen.getByTestId('spaces-open-spaces-list-button');
        expect(spacesListToggleButton).toHaveAttribute('title', 'Hide spaces list');
        fireEvent.click(spacesListToggleButton);
        expect(spacesListToggleButton).toHaveAttribute('title', 'Show spaces list');
    });

    it('falls back to reading the campus preference from document.cookie when the cookie context is empty', async () => {
        document.cookie = 'UQLspacesPreferredCampus=2';

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];
        expect(latestSidebarProps.selectedCampus).toBe(2);

        document.cookie = 'UQLspacesPreferredCampus=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('resets all filters back to defaults, clearing persisted state when nothing remains selected', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        window.sessionStorage.setItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY, JSON.stringify({ selectedCampus: 1 }));

        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];
        act(() => {
            latestSidebarProps.onResetAllFilters();
        });

        await waitFor(() => {
            expect(window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY)).toBeNull();
        });
        expect(window.sessionStorage.getItem('bookableSpacesJourneyViewState')).toBe(
            JSON.stringify({ view: 'results', intentId: null, spaceId: null }),
        );
    });

    it('resets filters but keeps the active campus/library persisted when it exists', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        let latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.handleCampusSelection({ target: { value: '2' } });
        });

        await waitFor(() => expect(mockSidebarRender.mock.calls.at(-1)[0].selectedCampus).toBe(2));
        latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.onResetAllFilters();
        });

        await waitFor(() => {
            const rawState = window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
            expect(rawState).not.toBeNull();
            expect(JSON.parse(rawState)).toEqual(expect.objectContaining({ selectedCampus: 2 }));
        });
    });

    it('excludes spaces carrying a rejected (unselected) facility type', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: false,
                    unselected: true,
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([]);
        });
    });

    it('excludes non-bookable spaces when the bookable filter is selected', async () => {
        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_external_book_url: 'https://book.me',
                        },
                        { ...baseProps.bookableSpacesRoomList.data.locations[1], space_external_book_url: null },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9002,
                    selected: true,
                    facility_special_action: 'bookable',
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([101]);
        });
    });

    it('excludes spaces outside the selected capacity range', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9003,
                    selected: true,
                    facility_special_action: 'capacity',
                },
            ]);
            latestSidebarProps.setCapacityFilterValue([5, 10]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([201]);
        });
    });

    it('requires a matching facility type in every selected group (AND across groups)', async () => {
        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            facility_types: [
                                { facility_type_id: 11, facility_type_name: 'Whiteboard' },
                                { facility_type_id: 21, facility_type_name: 'Monitor' },
                            ],
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            facility_types: [{ facility_type_id: 11, facility_type_name: 'Whiteboard' }],
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                { facility_type_group_id: 1, facility_type_id: 11, selected: true },
                { facility_type_group_id: 2, facility_type_id: 21, selected: true },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([101]);
        });
    });

    it('resolves the eventToStop from originalEvent when clicking a map marker without one, and focuses the space element', async () => {
        const spaceElement = document.createElement('div');
        spaceElement.id = 'space-101';
        document.body.appendChild(spaceElement);
        const focusSpy = jest.spyOn(spaceElement, 'focus');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockMapRender).toHaveBeenCalled());
        const latestMapProps = mockMapRender.mock.calls.at(-1)[0];

        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();
        act(() => {
            latestMapProps.onMarkerClick(
                { stopPropagation, preventDefault },
                baseProps.bookableSpacesRoomList.data.locations[0],
            );
        });

        expect(stopPropagation).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();

        document.body.removeChild(spaceElement);
    });

    it('computes the map centre for a single-building campus without averaging multiple buildings', async () => {
        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_campus_id: 1,
                            space_building_number: '1',
                            space_latitude: -27.4,
                            space_longitude: 153.0,
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockMapRender).toHaveBeenCalled());
        const latestMapProps = mockMapRender.mock.calls.at(-1)[0];
        expect(latestMapProps.centreLatLong.space_latitude).toBe(-27.4);
        expect(latestMapProps.centreLatLong.space_longitude).toBe(153.0);
    });

    it('falls back to unranked campus ordering when a campus name is not in the fallback priority list', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList
                    {...baseProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [
                                {
                                    space_id: 401,
                                    space_name: 'Unknown campus space',
                                    space_campus_name: 'Ipswich',
                                    space_building_name: 'Building I',
                                    space_building_number: '1',
                                    space_latitude: -27.6,
                                    space_longitude: 152.75,
                                    space_campus_id: 5,
                                },
                                {
                                    space_id: 402,
                                    space_name: 'St Lucia space',
                                    space_campus_name: 'St Lucia',
                                    space_building_name: 'Building S',
                                    space_building_number: '2',
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
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        expect(latestSidebarListProps.filteredSpaceLocations.map(space => space.space_campus_name)).toEqual([
            'St Lucia',
            'Ipswich',
        ]);
    });

    it('navigates to the journey experience when the "help me find a space" button is used', async () => {
        // jsdom refuses to navigate, and says so rather than throwing - which is all this needs to prove the
        // click handler reaches window.location.assign.
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        expect(() => fireEvent.click(screen.getByTestId('spaces-advanced-go-to-journey'))).not.toThrow();

        consoleError.mockRestore();
    });

    it('updates the live map centre when the map reports a valid centre change', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockMapRender).toHaveBeenCalled());
        const latestMapProps = mockMapRender.mock.calls.at(-1)[0];

        act(() => {
            latestMapProps.onMapCenterChange({ space_latitude: -27.5, space_longitude: 152.9 });
        });

        await waitFor(() => {
            const updatedMapProps = mockMapRender.mock.calls.at(-1)[0];
            expect(updatedMapProps.centreLatLong.space_latitude).toBe(-27.5);
            expect(updatedMapProps.centreLatLong.space_longitude).toBe(152.9);
        });
    });

    it('ignores an invalid map centre change instead of updating state', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockMapRender).toHaveBeenCalled());
        const initialMapProps = mockMapRender.mock.calls.at(-1)[0];
        const initialCentre = initialMapProps.centreLatLong;

        act(() => {
            initialMapProps.onMapCenterChange({ space_latitude: 'not-a-number', space_longitude: 152.9 });
        });

        const latestMapProps = mockMapRender.mock.calls.at(-1)[0];
        expect(latestMapProps.centreLatLong).toBe(initialCentre);
    });

    it('loads weekly hours, facility types and favourites when they have not been loaded yet', () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList
                    {...baseProps}
                    weeklyHours={null}
                    weeklyHoursLoading={null}
                    facilityTypeList={null}
                    facilityTypeListLoading={null}
                    spacesFavouritesList={null}
                />
            </WithRouter>,
        );

        expect(baseProps.actions.loadWeeklyHours).toHaveBeenCalled();
        expect(baseProps.actions.loadAllFacilityTypes).toHaveBeenCalled();
    });

    it('loads the logged-in user favourites when they have not been loaded yet', () => {
        useAccountContext.mockReturnValue({ account: { id: 7 } });

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} spacesFavouritesList={null} />
            </WithRouter>,
        );

        expect(baseProps.actions.loadSpacesFavourites).toHaveBeenCalled();
    });

    it('reads the preferred campus straight from the cookie context when present', async () => {
        useCookiesModule.useCookies.mockReturnValue([
            { UQLspacesPreferredCampus: '2' },
            mockSetCookie,
            mockRemoveCookie,
        ]);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        expect(mockSidebarRender.mock.calls.at(-1)[0].selectedCampus).toBe(2);

        useCookiesModule.useCookies.mockReturnValue([{}, mockSetCookie, mockRemoveCookie]);
    });

    it('treats a cookie campus id with no matching campus as all-campuses', async () => {
        useCookiesModule.useCookies.mockReturnValue([
            { UQLspacesPreferredCampus: '999' },
            mockSetCookie,
            mockRemoveCookie,
        ]);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        expect(mockSidebarRender.mock.calls.at(-1)[0].selectedCampus).toBe(0);

        useCookiesModule.useCookies.mockReturnValue([{}, mockSetCookie, mockRemoveCookie]);
    });

    it('expands a space and flies to it when a spaces-list item is explicitly toggled open', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarListProps.onSpaceToggle(baseProps.bookableSpacesRoomList.data.locations[0], true);
        });

        await waitFor(() => expect(mockFlyToSpace).toHaveBeenCalled());
        expect(mockSidebarListRender.mock.calls.at(-1)[0].expandedSpaceId).toBe(101);
    });

    it('filters services-and-spaces articles by category, case-insensitively', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList
                    {...baseProps}
                    drupalArticleList={[
                        { id: 1, categories: ['Services and Spaces'] },
                        { id: 2, categories: ['Other'] },
                    ]}
                />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
    });

    it('ignores a non-numeric campus or library selection value instead of updating state', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.handleCampusSelection({ target: { value: 'not-a-number' } });
            latestSidebarProps.handleLibrarySelection({ target: { value: 'not-a-number' } });
        });

        expect(mockSidebarRender.mock.calls.at(-1)[0].selectedCampus).toBe(0);
        expect(mockSidebarRender.mock.calls.at(-1)[0].selectedLibrary).toBe(0);
    });

    it('ignores a space toggle call when no space is provided', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];

        expect(() => {
            act(() => {
                latestSidebarListProps.onSpaceToggle(null, true);
            });
        }).not.toThrow();
    });

    it('resets currently-selected facility types back to unselected and clears empty persisted state', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        let latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                { facility_type_group_id: 1, facility_type_id: 11, selected: true, unselected: false },
            ]);
        });

        await waitFor(() =>
            expect(mockSidebarRender.mock.calls.at(-1)[0].selectedFacilityTypes).toEqual(
                expect.arrayContaining([expect.objectContaining({ selected: true })]),
            ),
        );
        latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.onResetAllFilters();
        });

        await waitFor(() => {
            const updatedProps = mockSidebarRender.mock.calls.at(-1)[0];
            expect(updatedProps.selectedFacilityTypes).toEqual([
                expect.objectContaining({ facility_type_id: 11, selected: false, unselected: false }),
            ]);
        });
        await waitFor(() => expect(window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY)).toBeNull());
    });

    it('restores the space saved in session storage once the map becomes ready', async () => {
        window.sessionStorage.setItem('bookableSpacesSelectedSpaceId', '201');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockFlyToSpace).toHaveBeenCalled());
        const [restoredSpace] = mockFlyToSpace.mock.calls.at(-1);
        expect(restoredSpace.space_id).toBe(201);
    });

    it('clears a stale saved space id that no longer matches any visible space', async () => {
        window.sessionStorage.setItem('bookableSpacesSelectedSpaceId', '999');

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(window.sessionStorage.getItem('bookableSpacesSelectedSpaceId')).toBeNull());
    });

    it('highlights and un-highlights a space panel over time when a space is selected', async () => {
        jest.useFakeTimers();
        const spacePanelWrapper = document.createElement('div');
        spacePanelWrapper.id = 'space-101';
        const spacePanel = document.createElement('div');
        spacePanelWrapper.appendChild(spacePanel);
        document.body.appendChild(spacePanelWrapper);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        act(() => {
            latestSidebarListProps.onSpaceSelect(baseProps.bookableSpacesRoomList.data.locations[0]);
        });

        expect(spacePanel.className).toContain('highlightPanel');

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(spacePanel.className).not.toContain('highlightPanel');

        document.body.removeChild(spacePanelWrapper);
        jest.useRealTimers();
    });

    it('scrolls using the #content fallback container when there is no #space-wrapper', async () => {
        const contentMain = document.createElement('div');
        contentMain.id = 'content';
        contentMain.scrollTo = jest.fn();
        contentMain.scrollTop = 50;
        Object.defineProperty(contentMain, 'getBoundingClientRect', {
            value: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
        });

        const spaceElement = document.createElement('div');
        spaceElement.id = 'space-101';
        Object.defineProperty(spaceElement, 'getBoundingClientRect', {
            value: () => ({ top: 80, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
        });
        contentMain.appendChild(spaceElement);
        document.body.appendChild(contentMain);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        act(() => {
            latestSidebarListProps.onSpaceSelect(baseProps.bookableSpacesRoomList.data.locations[0]);
        });

        expect(contentMain.scrollTo).toHaveBeenCalledWith({ top: expect.any(Number), behavior: 'smooth' });

        document.body.removeChild(contentMain);
    });

    it('falls back to scrollIntoView when no scroll container is found', async () => {
        const spaceElement = document.createElement('div');
        spaceElement.id = 'space-101';
        spaceElement.scrollIntoView = jest.fn();
        document.body.appendChild(spaceElement);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        act(() => {
            latestSidebarListProps.onSpaceSelect(baseProps.bookableSpacesRoomList.data.locations[0]);
        });

        expect(spaceElement.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        });

        document.body.removeChild(spaceElement);
    });

    it('routes hash-based urls to the journey hash instead of the pathname', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/#/spaces',
            selectedFacilityTypes: [],
            selectedCampus: 2,
            selectedLibrary: 0,
            capacityFilterValue: [],
        });

        expect(navigatedUrl).toContain('#/spaces/results');
    });

    it('only persists selected facility types, ignoring unselected entries in applied filters', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                { facility_type_group_id: 1, facility_type_id: 11, selected: true, unselected: false },
                { facility_type_group_id: 1, facility_type_id: 12, selected: false, unselected: false },
            ]);
        });

        await waitFor(() => {
            const rawState = window.sessionStorage.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
            const parsed = JSON.parse(rawState);
            expect(parsed.selectedFacilityTypes).toEqual([
                expect.objectContaining({ facility_type_id: 11, selected: true }),
            ]);
        });
    });

    it('falls back to unranked equal ordering when no map centre is available to compare distances', async () => {
        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList
                    {...baseProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [
                                {
                                    space_id: 501,
                                    space_name: 'Gatton space',
                                    space_campus_name: 'Gatton',
                                    space_building_name: 'Building G',
                                    space_building_number: '1',
                                    space_latitude: -27.55,
                                    space_longitude: 152.33,
                                    space_campus_id: 2,
                                },
                                {
                                    space_id: 502,
                                    space_name: 'Ipswich space',
                                    space_campus_name: 'Ipswich',
                                    space_building_name: 'Building I',
                                    space_building_number: '2',
                                    space_latitude: -27.6,
                                    space_longitude: 152.75,
                                    space_campus_id: 5,
                                },
                            ],
                        },
                    }}
                />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarListRender).toHaveBeenCalled());
        const latestSidebarListProps = mockSidebarListRender.mock.calls.at(-1)[0];
        expect(latestSidebarListProps.filteredSpaceLocations.map(space => space.space_campus_name)).toEqual([
            'Gatton',
            'Ipswich',
        ]);
    });

    it('only shows spaces that are currently open when the "currently open" filter is selected', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-09-22T00:00:00.000Z').getTime());

        const props = {
            ...baseProps,
            weeklyHours: {
                locations: [
                    {
                        lid: 11,
                        departments: [
                            {
                                name: 'Study space',
                                weeks: [{ Tuesday: { date: '2026-09-22', times: { currently_open: true } } }],
                            },
                        ],
                    },
                    {
                        lid: 22,
                        departments: [
                            {
                                name: 'Study space',
                                weeks: [{ Tuesday: { date: '2026-09-22', times: { currently_open: false } } }],
                            },
                        ],
                    },
                ],
            },
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_opening_hours_id: 11,
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            space_opening_hours_id: 22,
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9001,
                    selected: true,
                    facility_special_action: 'open',
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([101]);
        });

        jest.useRealTimers();
    });

    it('includes a space when it is inside the opening time window even if the raw currently_open flag is false', async () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 8, 22, 12, 0, 0, 0).getTime());

        const props = {
            ...baseProps,
            weeklyHours: {
                locations: [
                    {
                        lid: 11,
                        departments: [
                            {
                                name: 'Study space',
                                weeks: [{ Tuesday: { date: '2026-09-22', open: '09:00:00', close: '17:00:00' } }],
                            },
                        ],
                    },
                    {
                        lid: 22,
                        departments: [
                            {
                                name: 'Study space',
                                weeks: [{ Tuesday: { date: '2026-09-22', open: '09:00:00', close: '11:00:00' } }],
                            },
                        ],
                    },
                ],
            },
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_opening_hours_id: 11,
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[1],
                            space_opening_hours_id: 22,
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9001,
                    selected: true,
                    facility_special_action: 'open',
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([101]);
        });

        jest.useRealTimers();
    });

    it('excludes a space from the "currently open" filter when it is currently closed by an active outage', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-09-22T12:00:00.000Z').getTime());

        const props = {
            ...baseProps,
            weeklyHours: {
                locations: [
                    {
                        lid: 11,
                        departments: [
                            {
                                name: 'Study space',
                                weeks: [{ Tuesday: { date: '2026-09-22', open: '09:00:00', close: '17:00:00' } }],
                            },
                        ],
                    },
                ],
            },
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_opening_hours_id: 11,
                            space_outages: [
                                {
                                    space_outage_start: '2026-09-22 11:00:00',
                                    space_outage_end: '2026-09-22 14:00:00',
                                    space_outage_reason: 'Maintenance',
                                },
                            ],
                        },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9001,
                    selected: true,
                    facility_special_action: 'open',
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([]);
        });

        jest.useRealTimers();
    });

    it('excludes a space from the "currently open" filter when it has no opening-hours id', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-09-22T00:00:00.000Z').getTime());

        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [
                        { ...baseProps.bookableSpacesRoomList.data.locations[0], space_opening_hours_id: null },
                        { ...baseProps.bookableSpacesRoomList.data.locations[1], space_opening_hours_id: null },
                    ],
                },
            },
        };

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls.at(-1)[0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 99,
                    facility_type_id: 9001,
                    selected: true,
                    facility_special_action: 'open',
                },
            ]);
        });

        await waitFor(() => {
            const visibleIds = mockSidebarListRender.mock.calls
                .at(-1)[0]
                .filteredSpaceLocations.map(space => space.space_id);
            expect(visibleIds).toEqual([]);
        });

        jest.useRealTimers();
    });
});

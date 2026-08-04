/* eslint-disable react/prop-types */
import React from 'react';

import { act } from 'react-dom/test-utils';

import { fireEvent, rtlRender, screen, waitFor, WithRouter } from 'test-utils';

import { BookableSpacesList, buildJourneyNavigationUrl } from 'modules/Pages/BookableSpaces/BookableSpacesList';
import { deserialiseJourneyMapFilterState } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

const mockDispatch = jest.fn();
const mockFlyToSpace = jest.fn();
const mockSetCookie = jest.fn();
const mockRemoveCookie = jest.fn();
const mockJourneyRender = jest.fn();
const mockSidebarRender = jest.fn();

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

jest.mock('modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/SidebarSpacesList', () => () => (
    <div data-testid="mock-spaces-list" />
));
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

    it('does not restore a specific campus from mapFilters when all campuses is selected', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [],
                selectedCampus: 1,
                selectedLibrary: 0,
                capacityFilterValue: [1, 50],
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedCampus).toBe(0);
    });

    it('keeps the favourites-only filter enabled when the URL does not explicitly carry that state', async () => {
        const { rerender } = rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        fireEvent.click(screen.getByTestId('toggle-favourites-only'));

        await waitFor(() => {
            const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];
            expect(latestSidebarProps.showFavouriteSpacesOnly).toBe(true);
        });

        rerender(
            <WithRouter route="/spaces/mapresults" initialEntries={['/spaces/mapresults?mapFilters=abc']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => {
            const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];
            expect(latestSidebarProps.showFavouriteSpacesOnly).toBe(true);
        });
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

    it('keeps a manually selected campus when journey map filters are present in the URL', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [],
                selectedCampus: 1,
                selectedLibrary: 0,
                capacityFilterValue: [1, 50],
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('trigger-campus-change'));

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedCampus).toBe(2);
    });

    it('applies journey map filter state once facility filters become available', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [
                    { facility_type_id: 11, selected: true, unselected: false, facility_special_action: null },
                ],
                selectedCampus: 1,
                selectedLibrary: 11,
                capacityFilterValue: [4, 8],
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        const { rerender } = rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} facilityTypeList={{ data: { facility_type_groups: [] } }} />
            </WithRouter>,
        );

        rerender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedFacilityTypes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                }),
            ]),
        );
    });

    it('applies journey map filter state from the URL to the legacy map/list view', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [
                    { facility_type_id: 11, selected: true, unselected: false, facility_special_action: null },
                ],
                selectedCampus: 2,
                selectedLibrary: 22,
                capacityFilterValue: [4, 8],
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedCampus).toBe(0);
        expect(latestSidebarProps.selectedLibrary).toBe(22);
        expect(latestSidebarProps.capacityFilterValue).toEqual([4, 8]);
        expect(latestSidebarProps.selectedFacilityTypes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                }),
            ]),
        );
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
        expect(navigatedUrl).toContain('mapFilters=');
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
        expect(navigatedUrl).toContain('mapFilters=');
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
        expect(navigatedUrl).toContain('mapFilters=');
    });

    it('preserves a branch prefix when the journey handoff uses hash routing', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/feature-uqslanca-2/#/spaces/mapresults?mapFilters=abc',
            selectedFacilityTypes: [{ facility_type_id: 11, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 11,
            capacityFilterValue: [4, 8],
        });

        const parsedUrl = new URL(navigatedUrl);
        expect(parsedUrl.pathname).toBe('/feature-uqslanca-2/');
        expect(parsedUrl.hash).toContain('#/spaces/results');
    });

    it('drops mapFilters but preserves autoSelectFirstSpace when no active filters are present', () => {
        const navigatedUrl = buildJourneyNavigationUrl({
            currentUrl: 'http://localhost/feature-uqslanca-2/#/spaces/mapresults?mapFilters=abc&autoSelectFirstSpace=1',
            selectedFacilityTypes: [],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [],
        });

        expect(navigatedUrl).not.toContain('mapFilters=abc');
        expect(navigatedUrl).toContain('autoSelectFirstSpace=1');
    });

    it('auto-selects the only visible space in the advanced view', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [
                    { facility_type_id: 11, selected: true, unselected: false, facility_special_action: null },
                ],
                selectedCampus: 1,
                selectedLibrary: 11,
                capacityFilterValue: [4, 8],
            }),
        );

        const props = {
            ...baseProps,
            bookableSpacesRoomList: {
                data: {
                    locations: [baseProps.bookableSpacesRoomList.data.locations[0]],
                },
            },
        };

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(mockFlyToSpace).toHaveBeenCalledWith(
                expect.objectContaining({ space_id: 101, space_name: 'St Lucia space' }),
                expect.any(Number),
            );
        });
    });

    it('keeps URL-backed facility selections selected when the advanced view first renders', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [29, 31, 23],
                selectedCampus: 1,
                selectedLibrary: 0,
                capacityFilterValue: [1, 24],
            }),
        );

        const props = {
            ...baseProps,
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: 1,
                            facility_type_children: [
                                {
                                    facility_type_id: 29,
                                    facility_type_name: 'Recharge Station',
                                    filter_display_on: 'advanced',
                                },
                                {
                                    facility_type_id: 31,
                                    facility_type_name: 'Self-printing & scanning',
                                    filter_display_on: 'advanced',
                                },
                                {
                                    facility_type_id: 23,
                                    facility_type_name: 'Toilets, female',
                                    filter_display_on: 'advanced',
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
                                { facility_type_id: 29, facility_type_name: 'Recharge Station' },
                                { facility_type_id: 31, facility_type_name: 'Self-printing & scanning' },
                                { facility_type_id: 23, facility_type_name: 'Toilets, female' },
                            ],
                        },
                    ],
                },
            },
        };

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...props} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.selectedFacilityTypes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ facility_type_id: 29, selected: true, unselected: false }),
                expect.objectContaining({ facility_type_id: 31, selected: true, unselected: false }),
                expect.objectContaining({ facility_type_id: 23, selected: true, unselected: false }),
            ]),
        );
    });

    it('keeps local filter edits when mapFilters state is present in the URL', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [
                    { facility_type_id: 11, selected: true, unselected: false, facility_special_action: null },
                ],
                selectedCampus: 1,
                selectedLibrary: 11,
                capacityFilterValue: [4, 8],
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        act(() => {
            latestSidebarProps.setSelectedFacilityTypes([
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: false,
                    unselected: false,
                    facility_special_action: null,
                },
            ]);
        });

        await waitFor(() => {
            const updatedSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];
            expect(updatedSidebarProps.selectedFacilityTypes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        facility_type_id: 11,
                        selected: false,
                        unselected: false,
                    }),
                ]),
            );
        });
    });

    it('applies advanced-only map filters in journey results view', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [57],
                selectedCampus: 1,
                selectedLibrary: 0,
                capacityFilterValue: [1, 24],
            }),
        );

        const props = {
            ...baseProps,
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Advanced facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: 1,
                            facility_type_children: [
                                {
                                    facility_type_id: 57,
                                    facility_type_name: 'Wireless charger',
                                    filter_display_on: 'advanced',
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
                            space_id: 301,
                            space_name: 'St Lucia space with charger',
                            facility_types: [{ facility_type_id: 57, facility_type_name: 'Wireless charger' }],
                        },
                        {
                            ...baseProps.bookableSpacesRoomList.data.locations[0],
                            space_id: 302,
                            space_name: 'St Lucia space without charger',
                            facility_types: [{ facility_type_id: 11, facility_type_name: 'Whiteboard' }],
                        },
                    ],
                },
            },
        };

        window.history.replaceState({}, '', `/spaces/results?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/results" initialEntries={[`/spaces/results?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...props} forceAdvanced={false} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockJourneyRender).toHaveBeenCalled());
        const latestJourneyProps = mockJourneyRender.mock.calls[mockJourneyRender.mock.calls.length - 1][0];

        expect(latestJourneyProps.filteredSpaceLocations).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    space_id: 301,
                    space_name: 'St Lucia space with charger',
                }),
            ]),
        );
        expect(latestJourneyProps.filteredSpaceLocations).toHaveLength(1);
    });

    it('restores favourites-only mode from mapFilters state in the URL', async () => {
        const encodedState = encodeURIComponent(
            JSON.stringify({
                selectedFacilityTypes: [],
                selectedCampus: 1,
                selectedLibrary: 0,
                capacityFilterValue: [1, 50],
                showFavouriteSpacesOnly: true,
            }),
        );

        window.history.replaceState({}, '', `/spaces/mapresults?mapFilters=${encodedState}`);

        rtlRender(
            <WithRouter route="/spaces/mapresults" initialEntries={[`/spaces/mapresults?mapFilters=${encodedState}`]}>
                <BookableSpacesList {...baseProps} spacesFavouritesList={[{ space_id: 101 }]} />
            </WithRouter>,
        );

        await waitFor(() => expect(mockSidebarRender).toHaveBeenCalled());
        const latestSidebarProps = mockSidebarRender.mock.calls[mockSidebarRender.mock.calls.length - 1][0];

        expect(latestSidebarProps.showFavouriteSpacesOnly).toBe(true);
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

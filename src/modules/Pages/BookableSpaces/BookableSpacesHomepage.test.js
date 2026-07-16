import React from 'react';

import { waitFor } from '@testing-library/react';

import { fireEvent, rtlRender, screen, WithRouter } from 'test-utils';

jest.mock(
    '../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg',
    () => 'mock-journey-hero-image',
);
jest.mock('../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-journey-detail-image');

import BookableSpacesHomepage from './BookableSpacesHomepage';
import { buildLegacyBrowseNavigationUrl } from './BookableSpacesHomepage';
import SidebarFilters from './SidebarFilters';
import {
    deserialiseJourneyMapFilterState,
    parseJourneyStateFromUrl,
    serialiseJourneyMapFilterState,
    serialiseJourneyUrl,
} from './journeyHelpers';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: jest.fn(() => true),
    };
});

jest.mock('modules/Pages/BookableSpaces/BookableSpacesMap', () => {
    return function MockBookableSpacesMap() {
        return <div data-testid="mock-bookable-spaces-map" />;
    };
});

describe('BookableSpacesHomepage browser back navigation', () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    afterAll(() => {
        window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    });

    const baseSpace = {
        space_id: 101,
        space_uuid: 'test-space-uuid-1234',
        space_name: 'Quiet Study Room A',
        space_library_name: 'Central Library',
        space_type: 'Silent study',
        space_type_details: {
            space_type_name: 'Silent study',
            space_type_description: 'Designed for quiet independent study.',
        },
        space_description: 'A very quiet area for focused work.',
        space_capacity: 8,
        space_latitude: -27.5,
        space_longitude: 153.0,
        space_campus_id: 1,
        space_external_book_url: 'https://example.com/book/quiet-room-a',
        facility_types: [{ facility_type_id: 11, facility_type_name: 'Quiet' }],
    };

    const defaultProps = {
        filteredSpaceLocations: [baseSpace],
        totalSpaceCount: 1,
        highlightedSpace: baseSpace,
        selectedFacilityTypes: [],
        setSelectedFacilityTypes: jest.fn(),
        filteredFacilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeListLoading: false,
        facilityTypeListError: null,
        minimumSpaceCapacity: 1,
        maximumSpaceCapacity: 20,
        capacityFilterValue: [1, 20],
        setCapacityFilterValue: jest.fn(),
        campusList: [{ campus_id: 1, campus_name: 'St Lucia' }],
        selectedCampus: 1,
        handleCampusSelection: jest.fn(),
        activeFilterCount: 0,
        librariesForCampus: [{ library_id: 1, library_name: 'Central Library' }],
        selectedLibrary: 1,
        handleLibrarySelection: jest.fn(),
        weeklyHours: null,
        weeklyHoursLoading: false,
        weeklyHoursError: null,
    };

    beforeEach(() => {
        window.history.replaceState({}, '', '/#/spaces');
    });

    const renderJourney = props =>
        rtlRender(
            <WithRouter>
                <BookableSpacesHomepage {...props} />
            </WithRouter>,
        );

    const renderSidebarFilters = props =>
        rtlRender(
            <SidebarFilters
                facilityTypeList={{
                    data: {
                        facility_type_groups: [
                            {
                                facility_type_group_id: 1,
                                facility_type_group_name: 'Facilities',
                                facility_type_group_order: 1,
                                facility_type_group_loads_open: true,
                                facility_type_children: [],
                            },
                        ],
                    },
                }}
                filteredFacilityTypeList={{
                    data: {
                        facility_type_groups: [
                            {
                                facility_type_group_id: 1,
                                facility_type_group_name: 'Facilities',
                                facility_type_group_order: 1,
                                facility_type_group_loads_open: true,
                                facility_type_children: [],
                            },
                        ],
                    },
                }}
                facilityTypeListLoading={false}
                facilityTypeListError={false}
                selectedFacilityTypes={[]}
                setSelectedFacilityTypes={jest.fn()}
                minimumSpaceCapacity={1}
                maximumSpaceCapacity={20}
                capacityFilterValue={[1, 20]}
                setCapacityFilterValue={jest.fn()}
                campusList={[]}
                selectedCampus={1}
                handleCampusSelection={jest.fn()}
                activeFilterCount={0}
                librariesForCampus={[]}
                selectedLibrary={1}
                handleLibrarySelection={jest.fn()}
                suppliedClassName="journeyFilterSidebar"
                showBottomActionButtons={false}
                {...props}
            />,
        );

    // it('keeps browser back navigation inside journey steps before leaving the page', () => {
    //     const pushStateSpy = jest.spyOn(window.history, 'pushState');
    //
    //     rtlRender(<BookableSpacesHomepage {...defaultProps} />);
    //
    //     fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
    //     expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();
    //
    //     fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));
    //     expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();
    //
    //     fireEvent.click(screen.getByRole('button', { name: /quiet study room a/i }));
    //     expect(screen.getByRole('heading', { level: 3, name: /space details/i })).toBeInTheDocument();
    //
    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'results' } }));
    //     });
    //     expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();
    //
    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'intent' } }));
    //     });
    //     expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();
    //
    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'landing' } }));
    //     });
    //     expect(screen.getByTestId('spaces-journey-landing-get-started')).toBeInTheDocument();
    //
    //     expect(pushStateSpy).toHaveBeenCalledTimes(3);
    //     pushStateSpy.mockRestore();
    // });

    it.skip('writes permalink query params as users progress through the journey', () => {
        renderJourney(defaultProps);

        fireEvent.click(screen.getByTestId('spaces-journey-intent-card-quiet'));
        expect(window.location.pathname).toBe('/spaces/results/filters=quiet');

        fireEvent.click(screen.getByTestId('spaces-result-list-item-101'));
        expect(window.location.pathname).toBe(`/spaces/detail/${baseSpace.space_uuid}`);
    });

    it('restores results and selected intent from permalink params', () => {
        window.history.replaceState({}, '', '/spaces/results/filters=quiet');

        renderJourney(defaultProps);

        expect(screen.getByText('Quiet Study Room A')).toBeInTheDocument();
    });

    it('restores details view and selected space from permalink params', () => {
        window.history.replaceState({}, '', `/spaces/detail/${baseSpace.space_uuid}`);

        renderJourney(defaultProps);

        expect(screen.getByText(/space details/i)).toBeInTheDocument();
        expect(screen.getByText('Quiet Study Room A')).toBeInTheDocument();
    });

    it('restores results from a path-based hash URL when running under hash routing', () => {
        window.history.replaceState({}, '', '/#/spaces/results/filters=quiet');

        const parsedState = parseJourneyStateFromUrl([{ id: 'quiet' }]);

        expect(parsedState).toEqual({ view: 'results', intentId: 'quiet', spaceId: null });
    });

    it('treats the map-results path as a results route when parsing the URL', () => {
        window.history.replaceState({}, '', '/#/spaces/mapresults');

        const parsedState = parseJourneyStateFromUrl([{ id: 'quiet' }]);

        expect(parsedState).toEqual({ view: 'results', intentId: null, spaceId: null });
    });

    it('does not treat the legacy results/map path as a results route', () => {
        window.history.replaceState({}, '', '/#/spaces/results/map');

        const parsedState = parseJourneyStateFromUrl([{ id: 'quiet' }]);

        expect(parsedState).toEqual({ view: 'landing', intentId: null, spaceId: null });
    });

    it('shows a booking link in results for bookable spaces', () => {
        renderJourney(defaultProps);

        fireEvent.click(screen.getByRole('link', { name: /quiet space/i }));

        const bookLink = screen.getByRole('link', { name: /book this space/i });
        expect(bookLink).toHaveAttribute('href', baseSpace.space_external_book_url);
        expect(bookLink).toHaveAttribute('target', '_blank');
    });

    it('shows favourites on the landing page even when the current campus-filtered list is empty', () => {
        renderJourney({
            ...defaultProps,
            isLoggedIn: true,
            filteredSpaceLocations: [],
            allSpaceLocations: [baseSpace],
            spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Favourite study room' }],
        });

        expect(screen.getByText('Your favourite spaces')).toBeInTheDocument();
        expect(screen.getByText('Quiet Study Room A')).toBeInTheDocument();
    });

    it('serialises and deserialises journey filter state for the map view', () => {
        const encodedState = serialiseJourneyMapFilterState({
            selectedFacilityTypes: [
                {
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
                {
                    facility_type_id: 12,
                    selected: false,
                    unselected: true,
                    facility_special_action: null,
                },
            ],
            selectedCampus: 2,
            selectedLibrary: 3,
            capacityFilterValue: [4, 8],
        });

        const decodedState = decodeURIComponent(encodedState);
        expect(decodedState).toContain('"selectedFacilityTypes":[11,12]');

        const params = new URLSearchParams(`mapFilters=${encodedState}`);
        const parsedState = deserialiseJourneyMapFilterState(params);

        expect(parsedState.selectedCampus).toBe(2);
        expect(parsedState.selectedLibrary).toBe(3);
        expect(parsedState.capacityFilterValue).toEqual([4, 8]);
        expect(parsedState.selectedFacilityTypes).toEqual([
            {
                facility_type_id: 11,
                selected: true,
                unselected: false,
                facility_special_action: null,
            },
            {
                facility_type_id: 12,
                selected: false,
                unselected: true,
                facility_special_action: null,
            },
        ]);
    });

    it('applies an intent filter when the current filter list is empty on initial load', async () => {
        const setSelectedFacilityTypes = jest.fn();

        window.history.replaceState({}, '', '/#/spaces/results/filters=quiet');
        rtlRender(
            <WithRouter>
                <BookableSpacesHomepage
                    {...defaultProps}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={setSelectedFacilityTypes}
                    filteredFacilityTypeList={{
                        data: {
                            facility_type_groups: [
                                {
                                    facility_type_group_id: 1,
                                    facility_type_group_name: 'Facilities',
                                    facility_type_group_order: 1,
                                    facility_type_group_loads_open: true,
                                    facility_type_children: [
                                        { facility_type_id: 11, facility_type_name: 'Low noise level' },
                                    ],
                                },
                            ],
                        },
                    }}
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(setSelectedFacilityTypes).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ facility_type_id: 11, selected: true, unselected: false }),
                ]),
            );
        });
    });

    it('preserves a manual filter change after an intent is restored from the URL', () => {
        const Harness = () => {
            const [filters, setFilters] = React.useState([
                { facility_type_id: 11, selected: false, unselected: false },
                { facility_type_id: 12, selected: false, unselected: false },
            ]);

            return (
                <>
                    <button
                        type="button"
                        onClick={() =>
                            setFilters(prev =>
                                prev.map(filter =>
                                    filter.facility_type_id === 12
                                        ? { ...filter, selected: true, unselected: false }
                                        : filter,
                                ),
                            )
                        }
                    >
                        add extra filter
                    </button>
                    <div data-testid="current-filters">{JSON.stringify(filters)}</div>
                    <BookableSpacesHomepage
                        {...defaultProps}
                        filteredFacilityTypeList={{
                            data: {
                                facility_type_groups: [
                                    {
                                        facility_type_group_id: 1,
                                        facility_type_group_name: 'Facilities',
                                        facility_type_group_order: 1,
                                        facility_type_group_loads_open: true,
                                        facility_type_children: [
                                            { facility_type_id: 11, facility_type_name: 'Quiet' },
                                            { facility_type_id: 12, facility_type_name: 'Accessible' },
                                        ],
                                    },
                                ],
                            },
                        }}
                        selectedFacilityTypes={filters}
                        setSelectedFacilityTypes={setFilters}
                    />
                </>
            );
        };

        window.history.replaceState({}, '', '/spaces/results/filters=quiet');
        rtlRender(
            <WithRouter>
                <Harness />
            </WithRouter>,
        );

        fireEvent.click(screen.getByRole('button', { name: /add extra filter/i }));

        expect(screen.getByTestId('current-filters')).toHaveTextContent('"facility_type_id":12');
        expect(screen.getByTestId('current-filters')).toHaveTextContent('"selected":true');
    });

    it('builds browser-router map URL with encoded mapFilters and autoSelectFirstSpace', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/spaces/results/filters=quiet',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        expect(nextUrl).toContain('/spaces/mapresults?');
        expect(nextUrl).toContain('mapFilters=');
        expect(nextUrl).toContain('autoSelectFirstSpace=1');
    });

    it('builds hash-router map URL with encoded mapFilters and autoSelectFirstSpace', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/#/spaces/results/filters=quiet',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        expect(nextUrl).toContain('#/spaces/mapresults?');
        expect(nextUrl).toContain('mapFilters=');
        expect(nextUrl).toContain('autoSelectFirstSpace=1');
    });

    it('preserves a branch prefix when building a hash-router map URL', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/feature-uqslanca-2/#/spaces/results/filters=quiet',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        const parsedUrl = new URL(nextUrl);
        expect(parsedUrl.pathname).toBe('/feature-uqslanca-2/');
        expect(parsedUrl.hash).toContain('#/spaces/mapresults?');
    });

    it('returns a path-relative URL for browser-router links', () => {
        window.history.replaceState({}, '', '/spaces');

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toBe('/spaces/detail/space-123');
    });

    it('preserves mapFilters when serialising the journey URL between views', () => {
        window.history.replaceState({}, '', '/#/spaces/results?mapFilters=abc123&autoSelectFirstSpace=1');

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toContain('mapFilters=abc123');
        expect(nextUrl).toContain('autoSelectFirstSpace=1');
    });

    it('hides the landing highlighted space block when no highlighted space is available', () => {
        renderJourney({ ...defaultProps, highlightedSpace: null });

        expect(screen.queryByTestId('spaces-journey-landing-highlight-panel')).not.toBeInTheDocument();
    });

    it('renders a campus dropdown with available campuses and omits blank campus options', async () => {
        renderSidebarFilters({
            campusList: [
                { campus_id: 1, campus_name: 'St Lucia', campus_space_count: 1 },
                { campus_id: 2, campus_name: 'Gatton', campus_space_count: 1 },
                { campus_id: 999, campus_name: '', campus_space_count: 0 },
            ],
        });

        const campusFilter = await screen.findByRole('combobox');
        expect(campusFilter).toBeInTheDocument();
        fireEvent.mouseDown(campusFilter);
        expect(await screen.findByRole('option', { name: 'St Lucia' })).toBeInTheDocument();
        expect(await screen.findByRole('option', { name: 'Gatton' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '' })).not.toBeInTheDocument();
    });

    it('does not show campuses that have no spaces in the inline campus dropdown', async () => {
        renderSidebarFilters({
            campusList: [
                { campus_id: 1, campus_name: 'St Lucia', campus_space_count: 10 },
                { campus_id: 2, campus_name: 'Gatton', campus_space_count: 4 },
                { campus_id: 3, campus_name: 'Dutton Park', campus_space_count: 0 },
            ],
        });

        fireEvent.mouseDown(await screen.findByRole('combobox'));
        expect(await screen.findByRole('option', { name: 'St Lucia' })).toBeInTheDocument();
        expect(await screen.findByRole('option', { name: 'Gatton' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Dutton Park' })).not.toBeInTheDocument();
    });
});

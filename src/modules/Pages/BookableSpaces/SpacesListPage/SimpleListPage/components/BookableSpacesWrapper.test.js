import React from 'react';
import MockDate from 'mockdate';

import { waitFor } from '@testing-library/react';

import { fireEvent, rtlRender, screen, WithRouter } from 'test-utils';

if (typeof globalThis.Request === 'undefined') {
    globalThis.Request = class Request {
        constructor(input, init) {
            this.url = typeof input === 'string' ? input : input?.url || '';
            this.method = (init?.method || 'GET').toUpperCase();
            this.headers = init?.headers || {};
        }
    };
}

jest.mock(
    '../../../../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg',
    () => 'mock-journey-hero-image',
);
jest.mock(
    '../../../../../../../public/images/digital-learning-hub-hero-shot-wide.png',
    () => 'mock-journey-detail-image',
);

import BookableSpacesWrapper, {
    applyJourneyIntentFilters,
    buildLegacyBrowseNavigationUrl,
    resolveJourneyIntentFilters,
} from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/BookableSpacesWrapper';
import {
    JourneyResultsView,
    applyJourneySidebarFilters,
    clampJourneyPage,
    getJourneyDetailUrl,
    getJourneyResultSummary,
    getJourneySpaceDetailId,
    handleJourneySidebarToggle,
    toggleJourneySidebarFilter,
} from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/JourneyResultsView';
import { StyledJourneyPanelSection } from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/journeyViewStyles';

import OpenSpaceDetailsButton from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/OpenSpaceDetailsButton';

import SidebarFilters from 'modules/Pages/BookableSpaces/Shared/SidebarFilters';
import {
    deserialiseJourneyMapFilterState,
    parseJourneyStateFromUrl,
    serialiseJourneyMapFilterState,
    serialiseJourneyUrl,
} from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: jest.fn(() => true),
    };
});

jest.mock('modules/Pages/BookableSpaces/Shared/BookableSpacesMap', () => {
    return function MockBookableSpacesMap() {
        return <div data-testid="mock-bookable-spaces-map" />;
    };
});

describe('BookableSpacesWrapper browser back navigation', () => {
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
        space_name: 'Space999',
        space_library_name: 'Central Library',
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

    const mockUsers = {
        loggedOut: { id: null, label: 'Guest' },
        noFavourites: { id: 101, label: 'No favourites user' },
        withFavourites: { id: 202, label: 'Favourite user' },
    };

    beforeEach(() => {
        MockDate.reset();
        window.history.replaceState({}, '', '/#/spaces');
        window.sessionStorage.clear();
    });

    it('covers the exported journey result helper branches', () => {
        expect(clampJourneyPage(4, 3)).toBe(3);
        expect(clampJourneyPage(2, 3)).toBe(2);

        expect(getJourneyResultSummary(4, 10)).toBe('4 of 10');
        expect(getJourneyResultSummary(4)).toBe('4');

        expect(getJourneySpaceDetailId({ space_uuid: 'abc-123', space_id: 998 })).toBe('abc-123');
        expect(getJourneySpaceDetailId({ space_id: 998 })).toBe('998');
        expect(getJourneySpaceDetailId({})).toBe('');

        expect(getJourneyDetailUrl({ space_uuid: 'abc-123' })).toContain('/spaces/detail/abc-123');
        expect(getJourneyDetailUrl({ space_id: 998 })).toContain('/spaces/detail/998');

        document.body.innerHTML = '<div id="filterSidebar" class="mobileHidden"></div>';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(true);
        expect(document.getElementById('filterSidebar').classList.contains('mobileHidden')).toBe(false);

        document.body.innerHTML = '<div id="filterSidebar"></div>';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(false);
        expect(document.getElementById('filterSidebar').classList.contains('mobileHidden')).toBe(true);

        document.body.innerHTML = '';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(false);

        document.body.innerHTML = '<div id="filterSidebar" class="mobileHidden"></div>';
        expect(handleJourneySidebarToggle()).toBe(true);
        expect(document.getElementById('filterSidebar').classList.contains('mobileHidden')).toBe(false);

        const setShowAdvancedFilters = jest.fn();
        applyJourneySidebarFilters({ isDesktopResultsLayout: false, setShowAdvancedFilters });
        expect(setShowAdvancedFilters).toHaveBeenCalledWith(false);

        applyJourneySidebarFilters({ isDesktopResultsLayout: true, setShowAdvancedFilters });
        expect(setShowAdvancedFilters).toHaveBeenCalledTimes(1);
    });

    it('covers the remaining default, fallback, and invalid-value intent filter branches', () => {
        const quietIntent = { id: 'quiet', matchers: [/quiet/i, /low noise/i] };
        const facilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 10,
                        facility_type_group_name: 'Features',
                        facility_type_children: [
                            { facility_type_id: 39, facility_type_name: 'Power points' },
                            { facility_type_id: 8, facility_type_name: 'Quiet study' },
                        ],
                    },
                ],
            },
        };
        const mixedList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 10,
                        facility_type_group_name: 'Features',
                        facility_type_children: {
                            invalid: true,
                        },
                    },
                    {
                        facility_type_group_id: 12,
                        facility_type_group_name: 'Study types',
                        facility_type_children: [
                            { facility_type_id: 'not-a-number', facility_type_name: undefined },
                            { facility_type_id: 8, facility_type_name: 'Quiet study' },
                        ],
                    },
                ],
            },
        };

        const defaultCallSetSelectedFacilityTypes = jest.fn();
        const defaultResult = applyJourneyIntentFilters({
            intent: quietIntent,
            facilityTypeList,
            setSelectedFacilityTypes: defaultCallSetSelectedFacilityTypes,
        });
        expect(defaultResult.applied).toBe(true);
        expect(defaultResult.lastAppliedIntentId).toBe('quiet');

        const fallbackResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: null,
            facilityTypeList: mixedList,
            setSelectedFacilityTypes: jest.fn(),
        });
        expect(fallbackResult.applied).toBe(true);
        expect(fallbackResult.nextFilters).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ facility_type_id: 8, facility_type_name: 'Quiet study', selected: true }),
            ]),
        );

        const noNameResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: [
                { facility_type_id: 8, facility_type_name: null, selected: false, unselected: false },
            ],
            facilityTypeList: mixedList,
            replaceExistingFilters: true,
            setSelectedFacilityTypes: jest.fn(),
        });
        expect(noNameResult.applied).toBe(true);
        expect(noNameResult.nextFilters[0]).toMatchObject({ facility_type_id: 8, facility_type_name: 'Quiet study' });
    });

    it('covers the exported intent filter helper branches and the landing guard', () => {
        const facilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 10,
                        facility_type_group_name: 'Features',
                        facility_type_children: [
                            { facility_type_id: 39, facility_type_name: 'Power points' },
                            { facility_type_id: 8, facility_type_name: 'Quiet study' },
                        ],
                    },
                ],
            },
        };
        const unmatchedFacilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 10,
                        facility_type_group_name: 'Features',
                        facility_type_children: [{ facility_type_id: 39, facility_type_name: 'Power points' }],
                    },
                ],
            },
        };

        const quietIntent = { id: 'quiet', matchers: [/quiet/i, /low noise/i] };
        const setSelectedFacilityTypes = jest.fn();

        expect(
            resolveJourneyIntentFilters({
                intent: quietIntent,
                facilityTypeList: { data: { facility_type_groups: [] } },
                setSelectedFacilityTypes,
            }),
        ).toMatchObject({ applied: false, lastAppliedIntentId: null });

        const defaultArgResult = resolveJourneyIntentFilters({ intent: quietIntent, facilityTypeList });
        expect(defaultArgResult.applied).toBe(true);
        expect(defaultArgResult.lastAppliedIntentId).toBe('quiet');

        const selectedResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 10,
                    facility_type_id: 8,
                    facility_type_name: 'Quiet study',
                    selected: false,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            facilityTypeList,
            replaceExistingFilters: false,
            setSelectedFacilityTypes,
        });
        expect(selectedResult.applied).toBe(true);
        expect(selectedResult.lastAppliedIntentId).toBe('quiet');

        const mismatchResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 10,
                    facility_type_id: 39,
                    facility_type_name: 'Power points',
                    selected: false,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            facilityTypeList,
            replaceExistingFilters: true,
            setSelectedFacilityTypes,
        });
        expect(mismatchResult.applied).toBe(true);
        expect(mismatchResult.lastAppliedIntentId).toBe('quiet');

        const noMatchResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 10,
                    facility_type_id: 39,
                    facility_type_name: 'Power points',
                    selected: false,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            facilityTypeList: unmatchedFacilityTypeList,
            replaceExistingFilters: true,
            setSelectedFacilityTypes,
        });
        expect(noMatchResult.applied).toBe(false);
        expect(noMatchResult.lastAppliedIntentId).toBe(null);

        const unchangedResult = resolveJourneyIntentFilters({
            intent: quietIntent,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 10,
                    facility_type_id: 8,
                    facility_type_name: 'Quiet study',
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            facilityTypeList,
            replaceExistingFilters: false,
            setSelectedFacilityTypes,
        });
        expect(unchangedResult.applied).toBe(true);
        expect(unchangedResult.lastAppliedIntentId).toBe('quiet');

        renderJourney({
            ...defaultProps,
            initialView: 'landing',
            showFavouriteSpacesOnly: true,
            selectedFacilityTypes: [],
            facilityTypeListError: false,
        });
        expect(screen.getByText('Bookable Spaces')).toBeInTheDocument();
    });

    const renderJourney = props => {
        const currentHashRoute = window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '';
        const currentRoute = currentHashRoute || window.location.pathname || '/spaces';
        const routeForProps = props?.initialView === 'results' ? '/spaces/results' : currentRoute;

        return rtlRender(
            <WithRouter route="*" initialEntries={[routeForProps]}>
                <BookableSpacesWrapper {...props} />
            </WithRouter>,
        );
    };

    it('renders the journey panel with and without top spacing', () => {
        const { rerender } = rtlRender(
            <StyledJourneyPanelSection data-testid="journey-panel-no-spacing" hasTopSpacing={false} />,
        );
        expect(screen.getByTestId('journey-panel-no-spacing')).toBeInTheDocument();

        rerender(<StyledJourneyPanelSection data-testid="journey-panel-with-spacing" hasTopSpacing />);
        expect(screen.getByTestId('journey-panel-with-spacing')).toBeInTheDocument();
    });

    it('renders fallback result content and the empty-state message for no results', () => {
        const fallbackSpace = {
            ...baseSpace,
            space_name: '',
            space_uuid: undefined,
            space_description: '',
            space_external_book_url: undefined,
            space_type_details: {
                space_type_name: 'Study space',
                space_type_description: '',
            },
            space_outages: [],
        };

        const { rerender } = rtlRender(
            <WithRouter>
                <JourneyResultsView
                    intentSpaceLocations={[fallbackSpace]}
                    totalSpaceCount={1}
                    handleClearJourneyFilters={jest.fn()}
                    goToLegacyBrowse={jest.fn()}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={jest.fn()}
                    filteredFacilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeListLoading={false}
                    facilityTypeListError={null}
                    minimumSpaceCapacity={1}
                    maximumSpaceCapacity={20}
                    capacityFilterValue={[1, 20]}
                    setCapacityFilterValue={jest.fn()}
                    campusList={[]}
                    selectedCampus={0}
                    handleCampusSelection={jest.fn()}
                    activeFilterCount={0}
                    librariesForCampus={[]}
                    selectedLibrary={0}
                    handleLibrarySelection={jest.fn()}
                    shouldShowAdvancedFilters={false}
                    isDesktopResultsLayout={false}
                    setShowAdvancedFilters={jest.fn()}
                    weeklyHours={null}
                    weeklyHoursLoading={false}
                    weeklyHoursError={null}
                    isFavouriteActionInProgress={false}
                    onFavouriteToggle={jest.fn()}
                    spacesFavouritesList={[]}
                />
            </WithRouter>,
        );

        expect(screen.getByText(/Unnamed space/i)).toBeInTheDocument();
        expect(screen.queryByText('No results match your criteria')).not.toBeInTheDocument();

        rerender(
            <WithRouter>
                <JourneyResultsView
                    intentSpaceLocations={[]}
                    totalSpaceCount={0}
                    handleClearJourneyFilters={jest.fn()}
                    goToLegacyBrowse={jest.fn()}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={jest.fn()}
                    filteredFacilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeListLoading={false}
                    facilityTypeListError={null}
                    minimumSpaceCapacity={1}
                    maximumSpaceCapacity={20}
                    capacityFilterValue={[1, 20]}
                    setCapacityFilterValue={jest.fn()}
                    campusList={[]}
                    selectedCampus={0}
                    handleCampusSelection={jest.fn()}
                    activeFilterCount={0}
                    librariesForCampus={[]}
                    selectedLibrary={0}
                    handleLibrarySelection={jest.fn()}
                    shouldShowAdvancedFilters={false}
                    isDesktopResultsLayout={false}
                    setShowAdvancedFilters={jest.fn()}
                    weeklyHours={null}
                    weeklyHoursLoading={false}
                    weeklyHoursError={null}
                    isFavouriteActionInProgress={false}
                    onFavouriteToggle={jest.fn()}
                    spacesFavouritesList={[]}
                />
            </WithRouter>,
        );

        expect(screen.getByText('No results match your criteria')).toBeInTheDocument();
    });

    it('exercises the mobile sidebar toggle helper directly for hidden, shown, and missing sidebar states', () => {
        document.body.innerHTML = '<div id="filterSidebar" class="mobileHidden"></div>';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(true);
        expect(document.getElementById('filterSidebar').classList.contains('mobileHidden')).toBe(false);

        document.body.innerHTML = '<div id="filterSidebar"></div>';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(false);
        expect(document.getElementById('filterSidebar').classList.contains('mobileHidden')).toBe(true);

        document.body.innerHTML = '';
        expect(toggleJourneySidebarFilter('filterSidebar')).toBe(false);
    });

    const mockUserScenarios = [
        {
            name: 'logged out user',
            state: { isLoggedIn: false, spacesFavouritesList: [] },
            expectHeading: false,
            expectEmptyState: false,
            expectFavouriteCard: false,
        },
        {
            name: 'logged in user with no favourites',
            state: { isLoggedIn: true, spacesFavouritesList: [] },
            expectHeading: true,
            expectEmptyState: true,
            expectFavouriteCard: false,
        },
        {
            name: 'logged in user with favourites',
            state: {
                isLoggedIn: true,
                spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Space999' }],
                filteredSpaceLocations: [baseSpace],
                allSpaceLocations: [baseSpace],
                highlightedSpace: baseSpace,
            },
            expectHeading: true,
            expectEmptyState: false,
            expectFavouriteCard: true,
        },
    ];

    it.each(mockUserScenarios)(
        'renders the landing state for a $name',
        ({ state, expectHeading, expectEmptyState, expectFavouriteCard }) => {
            renderJourney({
                ...defaultProps,
                ...state,
            });

            expect(screen.getByText('Find library study spaces')).toBeInTheDocument();

            if (expectHeading) {
                expect(screen.getByText('Your favourite spaces')).toBeInTheDocument();
            } else {
                expect(screen.queryByText('Your favourite spaces')).not.toBeInTheDocument();
            }

            if (expectEmptyState) {
                expect(screen.getByTestId('spaces-homepage-favourites-empty-state')).toBeInTheDocument();
            }

            if (expectFavouriteCard) {
                expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
            }
        },
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
    //     rtlRender(<BookableSpacesWrapper {...defaultProps} />);
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
        expect(window.location.pathname).toBe('/spaces/results/');

        fireEvent.click(screen.getByTestId('spaces-result-list-item-101'));
        expect(window.location.pathname).toBe(`/spaces/detail/${baseSpace.space_uuid}`);
    });

    it('scrolls to the top when the detail route is active', async () => {
        const scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        rtlRender(
            <WithRouter route="*" initialEntries={['/spaces/detail/test-space-uuid-1234']}>
                <BookableSpacesWrapper {...defaultProps} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
        });
    });

    it('scrolls to the top when the results route is active', async () => {
        const scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        rtlRender(
            <WithRouter route="*" initialEntries={['/spaces/results']}>
                <BookableSpacesWrapper {...defaultProps} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
        });
    });

    it('scrolls to the top when the landing route is active', async () => {
        const scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        rtlRender(
            <WithRouter route="*" initialEntries={['/spaces']}>
                <BookableSpacesWrapper {...defaultProps} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
        });
    });

    it('scrolls to the top when a hash-based detail route is active', async () => {
        const scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        rtlRender(
            <WithRouter route="*" initialEntries={['/#/spaces/detail/test-space-uuid-1234']}>
                <BookableSpacesWrapper {...defaultProps} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
        });
    });

    it('renders the empty favourites state for a logged-in user with no favourites', () => {
        const user = mockUsers.noFavourites;

        renderJourney({
            ...defaultProps,
            isLoggedIn: !!user.id,
            spacesFavouritesList: [],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
        });

        expect(screen.getByText(/Click the star icon next to a space/i)).toBeInTheDocument();
        expect(screen.queryByTestId('spaces-homepage-favourites-all-link')).not.toBeInTheDocument();
    });

    it('renders the favourites block for a logged-in user with saved spaces', () => {
        const user = mockUsers.withFavourites;

        renderJourney({
            ...defaultProps,
            isLoggedIn: !!user.id,
            spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Space999' }],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
        });

        expect(screen.getByText('Your favourite spaces')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-homepage-favourites-all-link')).toBeInTheDocument();
    });

    it('does not render the favourites UI for a logged-out user', () => {
        const user = mockUsers.loggedOut;

        renderJourney({
            ...defaultProps,
            isLoggedIn: !!user.id,
            spacesFavouritesList: [],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
        });

        expect(screen.queryByText('Your favourite spaces')).not.toBeInTheDocument();
        expect(screen.queryByTestId('spaces-homepage-favourites-empty-state')).not.toBeInTheDocument();
        expect(screen.queryByTestId('spaces-homepage-favourites-all-link')).not.toBeInTheDocument();
    });

    it('keeps the original results list when there are no valid campus assignments', () => {
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            initialView: 'results',
            campusList: [
                { campus_id: null, campus_name: 'Missing id', campus_space_count: 5 },
                { campus_id: 300, campus_name: '', campus_space_count: 5 },
            ],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
        });

        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
    });

    it('ignores restored intent filters when the facility groups list is empty', async () => {
        const setSelectedFacilityTypes = jest.fn();

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            setSelectedFacilityTypes,
            selectedFacilityTypes: [],
            filteredFacilityTypeList: { data: { facility_type_groups: [] } },
            facilityTypeList: { data: { facility_type_groups: [] } },
        });

        await waitFor(() => {
            expect(setSelectedFacilityTypes).not.toHaveBeenCalled();
        });
    });

    it('does not apply any intent filters when the available facility ids are invalid', async () => {
        const setSelectedFacilityTypes = jest.fn();

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            setSelectedFacilityTypes,
            selectedFacilityTypes: [],
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: null, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: null, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
        });

        await waitFor(() => {
            expect(setSelectedFacilityTypes).not.toHaveBeenCalled();
        });
    });

    it('leaves filters unselected when the restored intent matches no facility names', async () => {
        const setSelectedFacilityTypes = jest.fn();

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            setSelectedFacilityTypes,
            selectedFacilityTypes: [],
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Power points' }],
                        },
                    ],
                },
            },
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Power points' }],
                        },
                    ],
                },
            },
        });

        await waitFor(() => {
            expect(setSelectedFacilityTypes).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ facility_type_id: 11, selected: false, unselected: false }),
                ]),
            );
        });
    });

    it('ignores malformed persisted journey state instead of crashing', () => {
        window.sessionStorage.setItem('bookableSpacesJourneyViewState', '{not valid json');
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            initialView: 'results',
            filteredSpaceLocations: [baseSpace],
        });

        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
    });

    it('uses the controlled favourite filter prop without mutating local state', () => {
        const setControlledShowFavouriteSpacesOnly = jest.fn();

        renderJourney({
            ...defaultProps,
            initialView: 'results',
            isLoggedIn: true,
            showFavouriteSpacesOnly: true,
            setShowFavouriteSpacesOnly: setControlledShowFavouriteSpacesOnly,
            spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Space999' }],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
        });

        fireEvent.click(screen.getByRole('checkbox', { name: /your favourites/i }));

        expect(setControlledShowFavouriteSpacesOnly).toHaveBeenCalledWith(false);
    });

    it('does not reset scroll state when the current route is outside the journey', () => {
        const scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        rtlRender(
            <WithRouter route="*" initialEntries={['/library']}>
                <BookableSpacesWrapper {...defaultProps} />
            </WithRouter>,
        );

        expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('activates the favourites-only flow when the favourite intent is selected', () => {
        const setSelectedFacilityTypes = jest.fn();

        renderJourney({
            ...defaultProps,
            isLoggedIn: true,
            setSelectedFacilityTypes,
            spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Space999' }],
            filteredSpaceLocations: [baseSpace],
            highlightedSpace: baseSpace,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
        });

        fireEvent.click(screen.getByTestId('spaces-homepage-favourites-all-link'));

        expect(screen.getByTestId('bookable-spaces-journey-results-view')).toBeInTheDocument();
        const favouritesToggle = screen.getByRole('checkbox', { name: /your favourites/i });
        expect(favouritesToggle).toBeChecked();
    });

    it('clears the journey state when the user chooses see all spaces from the landing page', () => {
        const onResetAllFilters = jest.fn();

        renderJourney({
            ...defaultProps,
            onResetAllFilters,
            isLoggedIn: true,
            spacesFavouritesList: [{ space_id: baseSpace.space_id, label: 'Space999' }],
        });

        fireEvent.click(screen.getByRole('link', { name: /see all spaces/i }));

        expect(onResetAllFilters).toHaveBeenCalled();
    });

    it('uses a simple results link for the landing card without encoding intent in the URL', () => {
        window.history.replaceState({}, '', '/spaces');

        renderJourney({
            ...defaultProps,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Acceptable noise',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
        });

        const quietLink = screen.getByTestId('spaces-journey-intent-card-quiet');
        const hrefValue = quietLink.getAttribute('href');
        expect(hrefValue).toBe('/spaces/results');

        const parsedUrl = new URL(hrefValue, 'http://localhost:2020');
        expect(parsedUrl.pathname).toBe('/spaces/results');
        expect(parsedUrl.search).toBe('');
        expect(deserialiseJourneyMapFilterState(parsedUrl.searchParams)).toBeNull();
    });

    it('applies the matching intent filters when an intent card is clicked', () => {
        const setSelectedFacilityTypes = jest.fn();
        window.history.replaceState({}, '', '/spaces');

        renderJourney({
            ...defaultProps,
            setSelectedFacilityTypes,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Acceptable noise',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                        },
                    ],
                },
            },
        });

        fireEvent.click(screen.getByTestId('spaces-journey-intent-card-quiet'));

        expect(screen.getByTestId('bookable-spaces-journey-results-view')).toBeInTheDocument();
        expect(setSelectedFacilityTypes).toHaveBeenCalled();

        const appliedFilters = setSelectedFacilityTypes.mock.calls.at(-1)[0];
        expect(appliedFilters).toEqual(
            expect.arrayContaining([expect.objectContaining({ facility_type_id: 11, selected: true })]),
        );
    });

    it('stores the selected intent id in journey state when an intent card is clicked', () => {
        window.sessionStorage.clear();
        window.history.replaceState({}, '', '/spaces');

        renderJourney(defaultProps);

        fireEvent.click(screen.getByTestId('spaces-journey-intent-card-quiet'));

        const storedState = window.sessionStorage.getItem('bookableSpacesJourneyViewState');
        expect(storedState).toBeTruthy();
        expect(JSON.parse(storedState)).toEqual({ view: 'results', intentId: 'quiet', spaceId: null });
    });

    it('keeps the selected campus and library when capacity is reset after choosing a different intent', () => {
        const facilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Acceptable noise',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                    },
                ],
            },
        };

        const defaultSessionState = {
            selectedFacilityTypes: [{ facility_type_id: 11, selected: true, unselected: false }],
            selectedCampus: 2,
            selectedLibrary: 7,
            capacityFilterValue: [4, 8],
        };

        window.sessionStorage.setItem('bookableSpacesJourneyLiveFilterState', JSON.stringify(defaultSessionState));
        window.history.replaceState({}, '', '/spaces');

        renderJourney({
            ...defaultProps,
            selectedCampus: 2,
            selectedLibrary: 7,
            filteredFacilityTypeList: facilityTypeList,
            facilityTypeList,
            selectedFacilityTypes: defaultSessionState.selectedFacilityTypes,
        });

        fireEvent.click(screen.getByTestId('spaces-journey-intent-card-quiet'));

        const storedState = JSON.parse(window.sessionStorage.getItem('bookableSpacesJourneyLiveFilterState'));
        expect(storedState.selectedCampus).toBe(2);
        expect(storedState.selectedLibrary).toBe(7);
        expect(storedState.capacityFilterValue).toBeUndefined();
    });

    it('restores results and selected intent from session state', () => {
        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/spaces/results');

        renderJourney(defaultProps);

        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
    });

    it('restores the favourites-only filter when loading the favourite route directly', async () => {
        window.history.replaceState({}, '', '/#/spaces/results');
        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'favourite', spaceId: null }),
        );

        const favouriteSpace = {
            ...baseSpace,
            space_id: 101,
            space_name: 'Fav888',
            space_type_details: { space_type_name: 'favspace' },
        };
        const otherSpace = {
            ...baseSpace,
            space_id: 102,
            space_name: 'Space123',
            space_type_details: { space_type_name: 'otherspace' },
        };

        renderJourney({
            ...defaultProps,
            isLoggedIn: true,
            spacesFavouritesList: [{ space_id: 101, label: 'Fav888' }],
            filteredSpaceLocations: [favouriteSpace, otherSpace],
            highlightedSpace: favouriteSpace,
        });

        await waitFor(() => {
            expect(screen.getByText('favspace Fav888')).toBeInTheDocument();
        });
    });

    it('preserves the favourites-only sidebar filter after loading the favourite route directly', async () => {
        window.history.replaceState({}, '', '/#/spaces/results');
        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'favourite', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');
        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'favourite', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        const favouriteSpace = {
            ...baseSpace,
            space_id: 101,
            space_name: 'Fav888',
            space_type_details: { space_type_name: 'favspace' },
        };
        const otherSpace = {
            ...baseSpace,
            space_id: 102,
            space_name: 'Space123',
            space_type_details: { space_type_name: 'otherspace' },
        };

        renderJourney({
            ...defaultProps,
            isLoggedIn: true,
            spacesFavouritesList: [{ space_id: 101, label: 'Fav888' }],
            filteredSpaceLocations: [favouriteSpace, otherSpace],
            highlightedSpace: favouriteSpace,
        });

        const favouritesCheckbox = screen.getByRole('checkbox', { name: /your favourites/i });

        fireEvent.click(favouritesCheckbox);

        await waitFor(() => {
            expect(screen.getByText('favspace Fav888')).toBeInTheDocument();
            expect(screen.queryByText('otherspace Space123')).not.toBeInTheDocument();
        });
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

    it('shows a booking link in results for bookable spaces', async () => {
        renderJourney({
            ...defaultProps,
            initialView: 'results',
        });

        await waitFor(() => {
            const bookLink = screen.getByRole('link', { name: /book this space/i });
            expect(bookLink).toHaveAttribute('href', baseSpace.space_external_book_url);
            expect(bookLink).toHaveAttribute('target', '_blank');
        });
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
        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
    });

    it('lets users show only their favourite spaces from the sidebar filters', () => {
        const otherSpace = {
            ...baseSpace,
            space_id: 102,
            space_uuid: 'test-space-uuid-5678',
            space_name: 'Space123',
            space_type_details: { space_type_name: 'A type' },
        };

        renderJourney({
            ...defaultProps,
            initialView: 'results',
            isLoggedIn: true,
            filteredSpaceLocations: [baseSpace, otherSpace],
            spacesFavouritesList: [
                {
                    space_id: baseSpace.space_id,
                    label: 'Space999',
                    space_type_details: { space_type_name: 'Silent study' },
                },
            ],
        });

        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
        expect(screen.getByText('A type Space123')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('checkbox', { name: /your favourites/i }));

        expect(screen.getByText('Silent study Space999')).toBeInTheDocument();
        expect(screen.queryByText('A type Space123')).not.toBeInTheDocument();
    });

    it('includes the favourites-only filter when navigating from journey results to the map view', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'https://example.com/spaces/results',
            selectedFacilityTypes: [],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 20],
            showFavouriteSpacesOnly: true,
        });

        expect(nextUrl).toBe('https://example.com/spaces/mapresults');
    });

    it('serialises and deserialises journey mapFilters state for the map view', () => {
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

        expect(encodedState.startsWith('b64.')).toBe(true);

        const params = new URLSearchParams(`mapFilters=${encodedState}`);
        const parsedState = deserialiseJourneyMapFilterState(params);

        expect(parsedState.selectedCampus).toBe(2);
        expect(parsedState.selectedLibrary).toBe(3);
        expect(parsedState.capacityFilterValue).toEqual([4, 8]);
        expect(parsedState.selectedFacilityTypes).toEqual([
            {
                facility_type_id: 11,
                selected: true,
                facility_special_action: null,
            },
        ]);
    });

    it('applies an intent filter when the current filter list is empty on initial load', async () => {
        const setSelectedFacilityTypes = jest.fn();

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');
        rtlRender(
            <WithRouter route="/spaces/results" initialEntries={['/spaces/results']}>
                <BookableSpacesWrapper
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

    it('retries applying an intent filter after the filter list loads if the user clicked too early', async () => {
        const placeholderFacilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 99,
                        facility_type_group_name: 'Open',
                        facility_type_group_order: -999,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9001,
                                facility_type_name: 'Currently open',
                                facility_special_action: 'open',
                            },
                        ],
                    },
                ],
            },
        };
        const delayedFacilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                    },
                ],
            },
        };

        const Harness = () => {
            const [filters, setFilters] = React.useState([]);
            const [availableFilters, setAvailableFilters] = React.useState(placeholderFacilityTypeList);

            return (
                <>
                    <button type="button" onClick={() => setAvailableFilters(delayedFacilityTypeList)}>
                        load facility filters
                    </button>
                    <BookableSpacesWrapper
                        {...defaultProps}
                        selectedFacilityTypes={filters}
                        setSelectedFacilityTypes={setFilters}
                        filteredFacilityTypeList={availableFilters}
                        facilityTypeList={availableFilters}
                    />
                </>
            );
        };

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        rtlRender(
            <WithRouter route="*" initialEntries={['/spaces/results']}>
                <Harness />
            </WithRouter>,
        );

        fireEvent.click(screen.getByRole('button', { name: /load facility filters/i }));

        await waitFor(() => {
            expect(screen.getByTestId('button-deselect-selected-11')).toBeInTheDocument();
        });
    });

    it('opens the selected filter group when intent-selected filters are present in journey results', async () => {
        const facilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: false,
                        facility_type_children: [
                            { facility_type_id: 11, facility_type_name: 'Low noise level' },
                            { facility_type_id: 12, facility_type_name: 'Natural light' },
                        ],
                    },
                ],
            },
        };

        const Harness = () => {
            const [filters, setFilters] = React.useState([
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
                {
                    facility_type_group_id: 1,
                    facility_type_id: 12,
                    selected: false,
                    unselected: false,
                    facility_special_action: null,
                },
            ]);

            return (
                <BookableSpacesWrapper
                    {...defaultProps}
                    facilityTypeListError={false}
                    selectedFacilityTypes={filters}
                    setSelectedFacilityTypes={setFilters}
                    filteredFacilityTypeList={facilityTypeList}
                    facilityTypeList={facilityTypeList}
                />
            );
        };

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        rtlRender(
            <WithRouter route="/spaces/results" initialEntries={['/spaces/results']}>
                <Harness />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('button-deselect-selected-11')).toBeInTheDocument();
            expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });
            expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'none' });
        });
    });

    it('allows clearing an intent-selected filter in results without it being reapplied', async () => {
        const facilityTypeList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [{ facility_type_id: 11, facility_type_name: 'Low noise level' }],
                    },
                ],
            },
        };

        const Harness = () => {
            const [filters, setFilters] = React.useState([
                {
                    facility_type_group_id: 1,
                    facility_type_id: 11,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ]);

            return (
                <>
                    <div data-testid="current-filters">{JSON.stringify(filters)}</div>
                    <BookableSpacesWrapper
                        {...defaultProps}
                        facilityTypeListError={false}
                        selectedFacilityTypes={filters}
                        setSelectedFacilityTypes={setFilters}
                        filteredFacilityTypeList={facilityTypeList}
                        facilityTypeList={facilityTypeList}
                    />
                </>
            );
        };

        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        rtlRender(
            <WithRouter route="/spaces/results" initialEntries={['/spaces/results']}>
                <Harness />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('button-deselect-selected-11')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('button-deselect-selected-11'));

        await waitFor(() => {
            expect(screen.queryByTestId('button-deselect-selected-11')).not.toBeInTheDocument();
            expect(screen.getByTestId('current-filters')).toHaveTextContent('"selected":false');
        });
    });

    it('applies the selected journey intent and clears prior selections when mapFilters state is present', async () => {
        const setSelectedFacilityTypes = jest.fn();
        const preselectedFilters = [
            {
                facility_type_group_id: 10,
                facility_type_id: 39,
                selected: true,
                unselected: false,
                facility_special_action: null,
            },
            {
                facility_type_group_id: 10,
                facility_type_id: 8,
                selected: true,
                unselected: false,
                facility_special_action: null,
            },
        ];
        window.sessionStorage.setItem(
            'bookableSpacesJourneyViewState',
            JSON.stringify({ view: 'results', intentId: 'quiet', spaceId: null }),
        );
        window.history.replaceState({}, '', '/#/spaces/results');

        renderJourney({
            ...defaultProps,
            selectedFacilityTypes: preselectedFilters,
            setSelectedFacilityTypes,
            hasJourneyMapFilterState: true,
            facilityTypeListError: false,
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 10,
                            facility_type_group_name: 'Features',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: 1,
                            facility_type_children: [
                                {
                                    facility_type_id: 39,
                                    facility_type_name: 'Power points',
                                    filter_display_on: 'both',
                                },
                                {
                                    facility_type_id: 8,
                                    facility_type_name: 'Whiteboards',
                                    filter_display_on: 'both',
                                },
                            ],
                        },
                    ],
                },
            },
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 10,
                            facility_type_group_name: 'Features',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: 1,
                            facility_type_children: [
                                {
                                    facility_type_id: 39,
                                    facility_type_name: 'Power points',
                                    filter_display_on: 'both',
                                },
                                {
                                    facility_type_id: 8,
                                    facility_type_name: 'Whiteboards',
                                    filter_display_on: 'both',
                                },
                            ],
                        },
                    ],
                },
            },
        });

        await waitFor(() => expect(screen.getByTestId('bookable-spaces-journey-results-view')).toBeInTheDocument());
        expect(setSelectedFacilityTypes).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ facility_type_id: 39, selected: false, unselected: false }),
                expect.objectContaining({ facility_type_id: 8, selected: false, unselected: false }),
            ]),
        );
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
                    <BookableSpacesWrapper
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

        window.history.replaceState({}, '', '/spaces/results');
        rtlRender(
            <WithRouter>
                <Harness />
            </WithRouter>,
        );

        fireEvent.click(screen.getByRole('button', { name: /add extra filter/i }));

        expect(screen.getByTestId('current-filters')).toHaveTextContent('"facility_type_id":12');
        expect(screen.getByTestId('current-filters')).toHaveTextContent('"selected":true');
    });

    it('uses the shared journey URL serializer for the details link in hash routing', () => {
        window.history.replaceState({}, '', '/#/spaces/results');

        rtlRender(
            <WithRouter>
                <OpenSpaceDetailsButton spaceDetails={baseSpace} />
            </WithRouter>,
        );

        expect(screen.getByRole('link', { name: /open space Space999 details/i })).toHaveAttribute(
            'href',
            '#/spaces/detail/test-space-uuid-1234',
        );
    });

    it('uses the shared journey URL serializer for results-card detail links in hash routing', () => {
        window.history.replaceState({}, '', '/#/spaces/results');

        rtlRender(
            <WithRouter>
                <JourneyResultsView
                    intentSpaceLocations={[baseSpace]}
                    totalSpaceCount={1}
                    handleClearJourneyFilters={jest.fn()}
                    goToLegacyBrowse={jest.fn()}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={jest.fn()}
                    filteredFacilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeListLoading={false}
                    facilityTypeListError={null}
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
                    shouldShowAdvancedFilters={false}
                    isDesktopResultsLayout
                    setShowAdvancedFilters={jest.fn()}
                    weeklyHours={null}
                    weeklyHoursLoading={false}
                    weeklyHoursError={null}
                    isFavouriteActionInProgress={false}
                    onFavouriteToggle={jest.fn()}
                    spacesFavouritesList={[]}
                />
            </WithRouter>,
        );

        expect(screen.getByTestId('spaces-result-list-item-101')).toHaveAttribute(
            'href',
            '#/spaces/detail/test-space-uuid-1234',
        );
    });

    it('shows outage notices for current and upcoming closures in the journey results list', () => {
        MockDate.set('2026-04-24T10:00:00');

        const currentOutageSpace = {
            ...baseSpace,
            space_id: 102,
            space_uuid: 'current-outage-space-uuid',
            space_name: 'Current outage space',
            space_outages: [
                {
                    space_outage_id: 1,
                    space_outage_start: '2026-04-24 09:00:00',
                    space_outage_end: '2026-04-24 18:00:00',
                    space_outage_reason: 'Maintenance',
                },
            ],
        };
        const upcomingOutageSpace = {
            ...baseSpace,
            space_id: 103,
            space_uuid: 'upcoming-outage-space-uuid',
            space_name: 'Upcoming outage space',
            space_outages: [
                {
                    space_outage_id: 2,
                    space_outage_start: '2026-04-30 09:00:00',
                    space_outage_end: '2026-04-30 17:00:00',
                    space_outage_reason: 'Lift works',
                },
            ],
        };

        rtlRender(
            <WithRouter>
                <JourneyResultsView
                    intentSpaceLocations={[currentOutageSpace, upcomingOutageSpace]}
                    totalSpaceCount={2}
                    handleClearJourneyFilters={jest.fn()}
                    goToLegacyBrowse={jest.fn()}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={jest.fn()}
                    filteredFacilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeListLoading={false}
                    facilityTypeListError={null}
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
                    shouldShowAdvancedFilters={false}
                    isDesktopResultsLayout
                    setShowAdvancedFilters={jest.fn()}
                    weeklyHours={null}
                    weeklyHoursLoading={false}
                    weeklyHoursError={null}
                    isFavouriteActionInProgress={false}
                    onFavouriteToggle={jest.fn()}
                    spacesFavouritesList={[]}
                />
            </WithRouter>,
        );

        expect(screen.queryByText('Current closure')).not.toBeInTheDocument();
        expect(screen.queryByText('Upcoming closure')).not.toBeInTheDocument();
        expect(screen.getByTestId('space-102-outage-message')).toHaveTextContent('Currently unavailable');
        expect(screen.getByTestId('space-103-outage-message')).toHaveTextContent('Unavailable 9:00am to 5:00pm');
    });

    it('paginates long spaces lists in the journey results view', () => {
        const manySpaces = Array.from({ length: 25 }, (_, index) => ({
            ...baseSpace,
            space_id: 100 + index,
            space_name: `Space ${index + 1}`,
            space_uuid: `space-uuid-${index + 1}`,
        }));

        rtlRender(
            <WithRouter>
                <JourneyResultsView
                    intentSpaceLocations={manySpaces}
                    totalSpaceCount={manySpaces.length}
                    handleClearJourneyFilters={jest.fn()}
                    goToLegacyBrowse={jest.fn()}
                    selectedFacilityTypes={[]}
                    setSelectedFacilityTypes={jest.fn()}
                    filteredFacilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeList={{ data: { facility_type_groups: [] } }}
                    facilityTypeListLoading={false}
                    facilityTypeListError={null}
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
                    shouldShowAdvancedFilters={false}
                    isDesktopResultsLayout
                    setShowAdvancedFilters={jest.fn()}
                    weeklyHours={null}
                    weeklyHoursLoading={false}
                    weeklyHoursError={null}
                    isFavouriteActionInProgress={false}
                    onFavouriteToggle={jest.fn()}
                    spacesFavouritesList={[]}
                />
            </WithRouter>,
        );

        expect(screen.getByText(/1-10 of 25 spaces/i)).toBeInTheDocument();
        expect(screen.getByTestId('spaces-result-list-item-100')).toBeInTheDocument();
        expect(screen.queryByTestId('spaces-result-list-item-120')).not.toBeInTheDocument();

        const firstPageButton = screen.getByRole('button', { name: /page 1/i });
        const secondPageButton = screen.getByRole('button', { name: /page 2/i });

        expect(firstPageButton).toHaveAttribute('aria-current', 'page');
        expect(secondPageButton).not.toHaveAttribute('aria-current');

        fireEvent.click(secondPageButton);

        expect(screen.getByText(/11-20 of 25 spaces/i)).toBeInTheDocument();
        expect(screen.getByTestId('spaces-result-list-item-110')).toBeInTheDocument();
        expect(screen.queryByTestId('spaces-result-list-item-100')).not.toBeInTheDocument();
        expect(secondPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('builds browser-router map URL with encoded mapFilters and autoSelectFirstSpace', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/spaces/results',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        expect(nextUrl).toBe('http://localhost:2020/spaces/mapresults');
    });

    it('builds hash-router map URL with encoded mapFilters and autoSelectFirstSpace', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/#/spaces/results',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        expect(nextUrl).toBe('http://localhost:2020/#/spaces/mapresults');
    });

    it('preserves a branch prefix when building a hash-router map URL', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/feature-uqslanca-2/#/spaces/results',
            selectedFacilityTypes: [{ facility_type_id: 10, selected: true, unselected: false }],
            selectedCampus: 1,
            selectedLibrary: 0,
            capacityFilterValue: [1, 24],
        });

        const parsedUrl = new URL(nextUrl);
        expect(parsedUrl.pathname).toBe('/feature-uqslanca-2/');
        expect(parsedUrl.hash).toBe('#/spaces/mapresults');
    });

    it('returns a path-relative URL for browser-router links', () => {
        window.history.replaceState({}, '', '/spaces');
        window.location.hash = '';

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toBe('/spaces/detail/space-123');
    });

    it('returns a plain detail URL when serialising the journey URL between views', () => {
        window.history.replaceState({}, '', '/#/spaces/results');
        window.location.hash = '';

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toBe('/spaces/detail/space-123');
    });

    it('preserves a branch prefix when serialising detail links for hash routing', () => {
        window.history.replaceState({}, '', '/feature-branch/');
        window.location.hash = '#/spaces/results';

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toBe('/feature-branch/#/spaces/detail/space-123');
    });

    it('returns a plain detail URL when serialising the journey URL without query params', () => {
        window.history.replaceState({}, '', '/#/spaces/results');
        window.location.hash = '';

        const nextUrl = serialiseJourneyUrl({ view: 'details', intentId: null, spaceId: 'space-123' });

        expect(nextUrl).toBe('/spaces/detail/space-123');
    });

    it('builds a plain hash-router map URL', () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: 'http://localhost:2020/#/spaces/results',
            selectedFacilityTypes: [],
            selectedCampus: null,
            selectedLibrary: null,
            capacityFilterValue: null,
        });

        expect(nextUrl).toBe('http://localhost:2020/#/spaces/mapresults');
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

    it('preserves default filter-group open state when mapFilters state exists', async () => {
        renderSidebarFilters({
            hasJourneyMapFilterState: true,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 39,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            facilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [
                                {
                                    facility_type_id: 39,
                                    facility_type_name: 'Power points',
                                    filter_display_on: 'both',
                                },
                            ],
                        },
                    ],
                },
            },
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [
                                {
                                    facility_type_id: 39,
                                    facility_type_name: 'Power points',
                                    filter_display_on: 'both',
                                },
                            ],
                        },
                    ],
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });
            expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'none' });
        });
    });
});

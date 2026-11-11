import { buildSpacesActiveFilters, trackSpacesNavigationClick, trackSpacesPageView } from './spacesAnalytics';

describe('trackSpacesPageView', () => {
    beforeEach(() => {
        delete window.dataLayer;
    });

    it('initializes the data layer and pushes a Spaces pageview', () => {
        trackSpacesPageView('Bookable Spaces - UQ Library');

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces - UQ Library',
            },
        ]);
    });

    it('appends the pageview to an existing data layer', () => {
        window.dataLayer = [{ event: 'existing event' }];

        trackSpacesPageView('Bookable Spaces search results - UQ Library');

        expect(window.dataLayer).toEqual([
            { event: 'existing event' },
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces search results - UQ Library',
            },
        ]);
    });

    it('pushes only once for the same router location key', () => {
        trackSpacesPageView('Bookable Spaces search results - UQ Library', 'location-1');
        trackSpacesPageView('Bookable Spaces search results - UQ Library', 'location-1');

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces search results - UQ Library',
            },
        ]);
    });

    it('pushes navigation click events with the Spaces event defaults', () => {
        trackSpacesNavigationClick({
            click_label: 'Log in',
            click_class: 'dlor-homepage-loginprompt',
            click_url: 'https://auth.library.uq.edu.au/login',
            click_campus: 'St Lucia',
        });

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces click',
                click_category: 'navigation',
                click_action: 'click',
                click_space_name: null,
                click_campus: 'St Lucia',
                click_library: null,
                click_active_filters: {},
                click_label: 'Log in',
                click_class: 'dlor-homepage-loginprompt',
                click_url: 'https://auth.library.uq.edu.au/login',
            },
        ]);
    });

    it('groups selected filters under each normalized group name', () => {
        expect(
            buildSpacesActiveFilters({
                facilityTypeGroups: [
                    {
                        facility_type_group_id: 3,
                        facility_type_group_name: 'Study Environment',
                        facility_type_children: [{ facility_type_id: 31, facility_type_name: 'Window seating' }],
                    },
                    {
                        facility_type_group_id: 8,
                        facility_type_group_name: 'Availability',
                        facility_type_children: [
                            { facility_type_id: 9001, facility_type_name: 'Currently open' },
                            { facility_type_id: 9002, facility_type_name: 'Bookable' },
                            { facility_type_id: 9003, facility_type_name: 'Space capacity' },
                        ],
                    },
                ],
                selectedFacilityTypes: [
                    {
                        facility_type_group_id: 3,
                        facility_type_id: 31,
                        selected: true,
                    },
                    {
                        facility_type_group_id: 8,
                        facility_type_id: 9001,
                        facility_type_name: 'Currently open',
                        facility_special_action: 'open',
                        selected: true,
                    },
                    {
                        facility_type_group_id: 8,
                        facility_type_id: 9002,
                        facility_type_name: 'Bookable',
                        facility_special_action: 'bookable',
                        selected: true,
                    },
                    {
                        facility_type_group_id: 8,
                        facility_type_id: 9003,
                        facility_type_name: 'Space capacity',
                        facility_special_action: 'capacity',
                        selected: true,
                    },
                ],
                capacityFilterValue: [1, 6],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                showFavouriteSpacesOnly: true,
            }),
        ).toEqual({
            study_environment: ['Window seating'],
            availability: ['Currently open', 'Bookable'],
            capacity: { min: 1, max: 6 },
            favourites: true,
        });
    });

    it('uses stable fallback keys when selected filters have no group names', () => {
        expect(
            buildSpacesActiveFilters({
                selectedFacilityTypes: [
                    {
                        facility_type_group_id: 17,
                        facility_type_id: 31,
                        facility_type_name: 'Grouped filter',
                        selected: true,
                    },
                    {
                        facility_type_group_id: 17,
                        facility_type_id: 33,
                        selected: true,
                    },
                    {
                        facility_type_id: 32,
                        facility_type_name: 'Ungrouped filter',
                        selected: true,
                    },
                ],
            }),
        ).toEqual({
            group_17: ['Grouped filter', '33'],
            other: ['Ungrouped filter'],
        });
    });

    it('returns an empty object when no filter context is provided', () => {
        expect(buildSpacesActiveFilters()).toEqual({});
    });
});

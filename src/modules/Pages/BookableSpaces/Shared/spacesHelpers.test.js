import {
    FILTER_BOOKABLE_TYPE_ID,
    FILTER_CAPACITY_TYPE_ID,
    FILTER_DISPLAY_ON_BOTH,
    FILTER_DISPLAY_ON_MAP,
    FILTER_DISPLAY_ON_SIMPLE,
    deserialiseJourneyMapFilterState,
    getActiveSelectedFacilityTypes,
    getFriendlyFloorName,
    getFriendlyLocationDescription,
    getJourneySearchParams,
    getOrdinalSuffixFor,
    getSpaceIdentifier,
    isBookable,
    isInt,
    normalizeFilterDisplayOn,
    parseJourneyStateFromUrl,
    serialiseJourneyMapFilterState,
    serialiseJourneyUrl,
    findSpaceById,
    getFlatFacilityTypeList,
    spaceOpeningHours,
} from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

describe('spaces helpers', () => {
    it('creates ordinal numbers correctly', () => {
        expect(getOrdinalSuffixFor(0)).toEqual('th');
        expect(getOrdinalSuffixFor(1)).toEqual('st');
        expect(getOrdinalSuffixFor(2)).toEqual('nd');
        expect(getOrdinalSuffixFor(3)).toEqual('rd');
        expect(getOrdinalSuffixFor(4)).toEqual('th');
        expect(getOrdinalSuffixFor(5)).toEqual('th');
        expect(getOrdinalSuffixFor(6)).toEqual('th');
        expect(getOrdinalSuffixFor(7)).toEqual('th');
        expect(getOrdinalSuffixFor(8)).toEqual('th');
        expect(getOrdinalSuffixFor(9)).toEqual('th');
        expect(getOrdinalSuffixFor(10)).toEqual('th');
        expect(getOrdinalSuffixFor(11)).toEqual('th');
        expect(getOrdinalSuffixFor(12)).toEqual('th');
        expect(getOrdinalSuffixFor(13)).toEqual('th');
        expect(getOrdinalSuffixFor(14)).toEqual('th');
        expect(getOrdinalSuffixFor(15)).toEqual('th');
        expect(getOrdinalSuffixFor(16)).toEqual('th');
        expect(getOrdinalSuffixFor(17)).toEqual('th');
        expect(getOrdinalSuffixFor(18)).toEqual('th');
        expect(getOrdinalSuffixFor(19)).toEqual('th');
        expect(getOrdinalSuffixFor(20)).toEqual('th');
        expect(getOrdinalSuffixFor(21)).toEqual('st');
        expect(getOrdinalSuffixFor(22)).toEqual('nd');
        expect(getOrdinalSuffixFor(23)).toEqual('rd');
        expect(getOrdinalSuffixFor(24)).toEqual('th');
        expect(getOrdinalSuffixFor(25)).toEqual('th');
        expect(getOrdinalSuffixFor(26)).toEqual('th');
        expect(getOrdinalSuffixFor(27)).toEqual('th');
        expect(getOrdinalSuffixFor(28)).toEqual('th');
        expect(getOrdinalSuffixFor(29)).toEqual('th');
        expect(getOrdinalSuffixFor(30)).toEqual('th');
        expect(getOrdinalSuffixFor(31)).toEqual('st');
        expect(getOrdinalSuffixFor(32)).toEqual('nd');
        expect(getOrdinalSuffixFor(33)).toEqual('rd');
        expect(getOrdinalSuffixFor(34)).toEqual('th');
        expect(getOrdinalSuffixFor(35)).toEqual('th');
        expect(getOrdinalSuffixFor(36)).toEqual('th');
        expect(getOrdinalSuffixFor(37)).toEqual('th');
        expect(getOrdinalSuffixFor(38)).toEqual('th');
        expect(getOrdinalSuffixFor(39)).toEqual('th');
        expect(getOrdinalSuffixFor(40)).toEqual('th');
        expect(getOrdinalSuffixFor(41)).toEqual('st');
        expect(getOrdinalSuffixFor(42)).toEqual('nd');
        expect(getOrdinalSuffixFor(43)).toEqual('rd');
        expect(getOrdinalSuffixFor(44)).toEqual('th');
        expect(getOrdinalSuffixFor(45)).toEqual('th');
        expect(getOrdinalSuffixFor(46)).toEqual('th');
        expect(getOrdinalSuffixFor(47)).toEqual('th');
        expect(getOrdinalSuffixFor(48)).toEqual('th');
        expect(getOrdinalSuffixFor(49)).toEqual('th');
        expect(getOrdinalSuffixFor(50)).toEqual('th');
        expect(getOrdinalSuffixFor(51)).toEqual('st');
        expect(getOrdinalSuffixFor(52)).toEqual('nd');
        expect(getOrdinalSuffixFor(53)).toEqual('rd');
        expect(getOrdinalSuffixFor(54)).toEqual('th');
        expect(getOrdinalSuffixFor(55)).toEqual('th');
        expect(getOrdinalSuffixFor(56)).toEqual('th');
        expect(getOrdinalSuffixFor(57)).toEqual('th');
        expect(getOrdinalSuffixFor(58)).toEqual('th');
        expect(getOrdinalSuffixFor(59)).toEqual('th');
        expect(getOrdinalSuffixFor(60)).toEqual('th');
        expect(getOrdinalSuffixFor(61)).toEqual('st');
        expect(getOrdinalSuffixFor(62)).toEqual('nd');
        expect(getOrdinalSuffixFor(63)).toEqual('rd');
        expect(getOrdinalSuffixFor(64)).toEqual('th');
        expect(getOrdinalSuffixFor(65)).toEqual('th');
        expect(getOrdinalSuffixFor(66)).toEqual('th');
        expect(getOrdinalSuffixFor(67)).toEqual('th');
        expect(getOrdinalSuffixFor(68)).toEqual('th');
        expect(getOrdinalSuffixFor(69)).toEqual('th');
        expect(getOrdinalSuffixFor(70)).toEqual('th');
        expect(getOrdinalSuffixFor(71)).toEqual('st');
        expect(getOrdinalSuffixFor(72)).toEqual('nd');
        expect(getOrdinalSuffixFor(73)).toEqual('rd');
        expect(getOrdinalSuffixFor(74)).toEqual('th');
        expect(getOrdinalSuffixFor(75)).toEqual('th');
        expect(getOrdinalSuffixFor(76)).toEqual('th');
        expect(getOrdinalSuffixFor(77)).toEqual('th');
        expect(getOrdinalSuffixFor(78)).toEqual('th');
        expect(getOrdinalSuffixFor(79)).toEqual('th');
        expect(getOrdinalSuffixFor(80)).toEqual('th');
        expect(getOrdinalSuffixFor(81)).toEqual('st');
        expect(getOrdinalSuffixFor(82)).toEqual('nd');
        expect(getOrdinalSuffixFor(83)).toEqual('rd');
        expect(getOrdinalSuffixFor(84)).toEqual('th');
        expect(getOrdinalSuffixFor(85)).toEqual('th');
        expect(getOrdinalSuffixFor(86)).toEqual('th');
        expect(getOrdinalSuffixFor(87)).toEqual('th');
        expect(getOrdinalSuffixFor(88)).toEqual('th');
        expect(getOrdinalSuffixFor(89)).toEqual('th');
        expect(getOrdinalSuffixFor(90)).toEqual('th');
        expect(getOrdinalSuffixFor(91)).toEqual('st');
        expect(getOrdinalSuffixFor(92)).toEqual('nd');
        expect(getOrdinalSuffixFor(93)).toEqual('rd');
        expect(getOrdinalSuffixFor(94)).toEqual('th');
        expect(getOrdinalSuffixFor(95)).toEqual('th');
        expect(getOrdinalSuffixFor(96)).toEqual('th');
        expect(getOrdinalSuffixFor(97)).toEqual('th');
        expect(getOrdinalSuffixFor(98)).toEqual('th');
        expect(getOrdinalSuffixFor(99)).toEqual('th');
        expect(getOrdinalSuffixFor(100)).toEqual('th');
        expect(getOrdinalSuffixFor(101)).toEqual('st');
        expect(getOrdinalSuffixFor(102)).toEqual('nd');
        expect(getOrdinalSuffixFor(103)).toEqual('rd');
        expect(getOrdinalSuffixFor(104)).toEqual('th');
        expect(getOrdinalSuffixFor(105)).toEqual('th');
        expect(getOrdinalSuffixFor(106)).toEqual('th');
        expect(getOrdinalSuffixFor(107)).toEqual('th');
        expect(getOrdinalSuffixFor(108)).toEqual('th');
        expect(getOrdinalSuffixFor(109)).toEqual('th');
        expect(getOrdinalSuffixFor(110)).toEqual('th');
        expect(getOrdinalSuffixFor(111)).toEqual('th');
        expect(getOrdinalSuffixFor(112)).toEqual('th');
        expect(getOrdinalSuffixFor(113)).toEqual('th');
        expect(getOrdinalSuffixFor(114)).toEqual('th');
        expect(getOrdinalSuffixFor(115)).toEqual('th');
        expect(getOrdinalSuffixFor(115)).toEqual('th');
        expect(getOrdinalSuffixFor(116)).toEqual('th');
        expect(getOrdinalSuffixFor(117)).toEqual('th');
        expect(getOrdinalSuffixFor(118)).toEqual('th');
        expect(getOrdinalSuffixFor(119)).toEqual('th');
        expect(getOrdinalSuffixFor(120)).toEqual('th');
        expect(getOrdinalSuffixFor(121)).toEqual('st');
        expect(getOrdinalSuffixFor(122)).toEqual('nd');
    });

    it('is an integer', () => {
        expect(isInt(0)).toEqual(true);
        expect(isInt(1)).toEqual(true);
        expect(isInt(2)).toEqual(true);
        expect(isInt(3)).toEqual(true);
        expect(isInt(4)).toEqual(true);
        expect(isInt('2a')).toEqual(false);
        expect(isInt('4')).toEqual(true);
    });

    it('has a friendly floor name', () => {
        expect(getFriendlyFloorName({ space_floor_name: '3' })).toEqual('Level 3');
        expect(getFriendlyFloorName({ space_floor_name: '2A' })).toEqual('Level 2A');
        expect(getFriendlyFloorName({ space_floor_name: '3', space_is_ground_floor: false })).toEqual('Level 3');
        expect(getFriendlyFloorName({ space_is_ground_floor: true })).toEqual('Ground floor');
        expect(getFriendlyFloorName({ space_floor_name: '3A', space_is_ground_floor: true })).toEqual('Ground floor');
    });

    it('normalizes filter display on values', () => {
        // Valid values should pass through
        expect(normalizeFilterDisplayOn(FILTER_DISPLAY_ON_SIMPLE)).toEqual(FILTER_DISPLAY_ON_SIMPLE);
        expect(normalizeFilterDisplayOn(FILTER_DISPLAY_ON_MAP)).toEqual(FILTER_DISPLAY_ON_MAP);
        expect(normalizeFilterDisplayOn(FILTER_DISPLAY_ON_BOTH)).toEqual(FILTER_DISPLAY_ON_BOTH);

        // Invalid values should default to both
        expect(normalizeFilterDisplayOn(null)).toEqual(FILTER_DISPLAY_ON_BOTH);
        expect(normalizeFilterDisplayOn(undefined)).toEqual(FILTER_DISPLAY_ON_BOTH);
        expect(normalizeFilterDisplayOn('')).toEqual(FILTER_DISPLAY_ON_BOTH);
        expect(normalizeFilterDisplayOn('invalid')).toEqual(FILTER_DISPLAY_ON_BOTH);
        expect(normalizeFilterDisplayOn('Simple')).toEqual(FILTER_DISPLAY_ON_BOTH); // case sensitive
        expect(normalizeFilterDisplayOn('ADVANCED')).toEqual(FILTER_DISPLAY_ON_BOTH); // case sensitive
    });

    it('collapses the capacity filter into the bookable selection for active counts', () => {
        const selectedFacilityTypes = [
            {
                facility_type_id: FILTER_BOOKABLE_TYPE_ID,
                selected: true,
            },
            {
                facility_type_id: FILTER_CAPACITY_TYPE_ID,
                selected: true,
            },
        ];

        expect(getActiveSelectedFacilityTypes(selectedFacilityTypes)).toEqual([
            {
                facility_type_id: FILTER_BOOKABLE_TYPE_ID,
                selected: true,
            },
        ]);
    });

    it('supports friendly location description and bookable helpers', () => {
        const expanded = getFriendlyLocationDescription({
            space_name: 'Room 1',
            space_library_name: 'Library',
            space_campus_name: 'St Lucia',
            space_building_name: 'Building',
            space_building_number: '42',
            space_floor_name: '3',
            space_is_ground_floor: false,
        });
        expect(expanded.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        const collapsed = getFriendlyLocationDescription({ space_library_name: 'Library' }, true);
        expect(collapsed.props.children).toContain('Library');

        expect(isBookable({ space_external_book_url: 'https://example.com' })).toBe(true);
        expect(isBookable({ space_external_book_url: 'nope' })).toBe(false);
        expect(findSpaceById([{ space_id: 3 }, { space_uuid: 'abc' }], 'abc')).toEqual({ space_uuid: 'abc' });
        expect(findSpaceById([{ space_id: 3 }], 3)).toEqual({ space_id: 3 });
        expect(getSpaceIdentifier({ space_uuid: 'abc' })).toBe('abc');
        expect(getSpaceIdentifier({ space_id: 12 })).toBe(12);
    });

    it('handles flat facility lists and opening hours', () => {
        const facilityGroups = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_children: [
                            {
                                facility_type_id: 10,
                                facility_type_name: 'Whiteboard',
                                filter_display_on: 'simple',
                                facility_special_action: 'booking',
                            },
                        ],
                    },
                ],
            },
        };

        expect(getFlatFacilityTypeList(facilityGroups)).toEqual([
            {
                facility_type_group_id: 1,
                facility_type_id: 10,
                facility_type_name: 'Whiteboard',
                facility_special_action: 'booking',
                hide_in_public_filter_list: undefined,
                filter_display_on: 'simple',
            },
        ]);

        const today = new Date();
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const hours = {
            locations: [
                {
                    departments: [
                        {
                            lid: 77,
                            weeks: [
                                {
                                    [dayName]: {
                                        date: formatDate(today),
                                        open: '09:00:00',
                                        close: '17:00:00',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        expect(spaceOpeningHours({ space_opening_hours_id: 77 }, hours)).toHaveLength(1);
        expect(spaceOpeningHours({ space_opening_hours_id: 99 }, hours)).toEqual([]);
    });

    it('serialises and parses journey query state for map and hash routes', () => {
        const url = new URL('https://example.com/spaces/results/filters=bookable?journeyStep=results');
        expect(getJourneySearchParams(url)).toMatchObject({ usesHashQuery: false });

        const serialised = serialiseJourneyMapFilterState({
            selectedFacilityTypes: [{ facility_type_id: FILTER_BOOKABLE_TYPE_ID, selected: true }],
            selectedCampus: 'St Lucia',
            selectedLibrary: 'Library',
            capacityFilterValue: [10, 20],
            showFavouriteSpacesOnly: true,
        });
        expect(serialised).toContain('b64.');

        const searchParams = new URLSearchParams();
        searchParams.set('mapFilters', serialised);
        expect(deserialiseJourneyMapFilterState(searchParams)).toMatchObject({
            selectedCampus: 'St Lucia',
            selectedLibrary: 'Library',
            showFavouriteSpacesOnly: true,
        });

        window.history.pushState({}, '', '/');
        expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'landing' });

        window.history.pushState({}, '', '/spaces/detail/99');
        expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'details', spaceId: '99' });

        expect(serialiseJourneyUrl({ view: 'details', spaceId: 99 })).toBe('/spaces/detail/99');
    });
});

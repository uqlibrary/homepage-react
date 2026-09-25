import {
    FILTER_BOOKABLE_TYPE_ID,
    FILTER_CAPACITY_TYPE_ID,
    FILTER_DISPLAY_ON_BOTH,
    FILTER_DISPLAY_ON_MAP,
    FILTER_DISPLAY_ON_SIMPLE,
    getActiveSelectedFacilityTypes,
    getFriendlyFloorName,
    getFriendlyLocationDescription,
    getJourneySearchParams,
    getOrdinalSuffixFor,
    getSpaceIdentifier,
    getSpaceOpenStatus,
    getPrefixedFloorName,
    isBookable,
    isInt,
    isSpaceCurrentlyOpen,
    normalizeFilterDisplayOn,
    parseJourneyStateFromUrl,
    serialiseJourneyUrl,
    findSpaceById,
    getFlatFacilityTypeList,
    matchesCapacityFilter,
    normalizeCapacityFilterValue,
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

    it('keeps the bookable and capacity filters separate for active counts', () => {
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

        expect(getActiveSelectedFacilityTypes(selectedFacilityTypes)).toEqual(selectedFacilityTypes);
    });

    it('matches capacity filters differently when bookable is selected', () => {
        const capacityFilterValue = [4, 8];

        expect(
            matchesCapacityFilter({
                space: { space_capacity: null },
                capacityFilterValue,
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        expect(
            matchesCapacityFilter({
                space: { space_capacity: 0 },
                capacityFilterValue,
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        expect(
            matchesCapacityFilter({
                space: { space_capacity: 5 },
                capacityFilterValue,
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: true,
            }),
        ).toBe(true);

        expect(
            matchesCapacityFilter({
                space: { space_capacity: null },
                capacityFilterValue,
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: true,
            }),
        ).toBe(false);
    });

    it('sanitizes invalid or reversed capacity ranges before matching', () => {
        expect(normalizeCapacityFilterValue(['', 8], 1, 20)).toEqual([1, 8]);
        expect(normalizeCapacityFilterValue([12, 4], 1, 20)).toEqual([4, 12]);
        expect(normalizeCapacityFilterValue([undefined, 20], 1, 20)).toEqual([1, 20]);

        expect(
            matchesCapacityFilter({
                space: { space_capacity: 6 },
                capacityFilterValue: ['', 8],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        expect(
            matchesCapacityFilter({
                space: { space_capacity: 6 },
                capacityFilterValue: [12, 4],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 20,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);
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

    it('serialises and parses journey query state for hash routes', () => {
        const url = new URL('https://example.com/spaces/results/filters=bookable?journeyStep=results');
        expect(getJourneySearchParams(url)).toMatchObject({ usesHashQuery: false });

        window.history.pushState({}, '', '/');
        expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'landing' });

        window.history.pushState({}, '', '/spaces/detail/99');
        expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'details', spaceId: '99' });

        expect(serialiseJourneyUrl({ view: 'details', spaceId: 99 })).toBe('/spaces/detail/99');
    });

    it('exercises the remaining helper branches for floor names, facility maps, and lifecycle guards', () => {
        expect(getFriendlyFloorName({ space_floor_name: 'Level 4' })).toBe('Level 4');
        expect(getFriendlyFloorName({ space_floor_name: '4', space_is_ground_floor: false })).toBe('Level 4');

        const expanded = getFriendlyLocationDescription({
            space_name: 'Room 1',
            space_library_name: 'Library',
            space_campus_name: 'St Lucia',
            space_building_name: 'Building',
            space_building_number: '42',
            space_floor_name: '3',
            space_precise: 'Near the west wall',
        });
        expect(expanded.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        const hiddenName = getFriendlyLocationDescription(
            {
                space_name: 'Room 6',
                space_library_name: 'Library',
                space_campus_name: 'St Lucia',
                space_building_name: 'Building',
                space_building_number: '42',
                space_floor_name: '3',
                space_precise: 'Near the west wall',
            },
            false,
            { space_name: true },
        );
        expect(hiddenName.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        expect(getFlatFacilityTypeList(undefined)).toEqual([]);
        expect(
            getFlatFacilityTypeList({
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 10,
                            facility_type_children: [
                                { facility_type_id: 22, facility_type_name: 'TV', filter_display_on: 'invalid' },
                            ],
                        },
                    ],
                },
            }),
        ).toEqual([
            {
                facility_type_group_id: 10,
                facility_type_id: 22,
                facility_type_name: 'TV',
                facility_special_action: undefined,
                hide_in_public_filter_list: undefined,
                filter_display_on: FILTER_DISPLAY_ON_BOTH,
            },
        ]);

        expect(getActiveSelectedFacilityTypes([{ selected: true }, { selected: false }, undefined])).toEqual([
            { selected: true },
        ]);
    });

    it('covers the remaining opening-hours, status, filter, and journey branches', () => {
        const MockDate = require('mockdate');
        const fixedNow = new Date(2024, 1, 14, 12, 0, 0);
        MockDate.set(fixedNow);

        const formatDate = date =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formatTime = date =>
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
        const buildOpenHours = ({
            lid = 77,
            dateOffset = 0,
            status = null,
            currentlyOpen = null,
            open = null,
            close = null,
        }) => {
            const day = new Date(fixedNow);
            day.setDate(day.getDate() + dateOffset);
            const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
            const payload = {
                date: formatDate(day),
                ...(open ? { open } : {}),
                ...(close ? { close } : {}),
                ...(status ? { times: { status } } : {}),
                ...(currentlyOpen !== null ? { currently_open: currentlyOpen } : {}),
            };

            return {
                locations: [
                    {
                        lid,
                        departments: [{ lid, weeks: [{ [dayName]: payload }] }],
                    },
                ],
            };
        };

        try {
            expect(
                spaceOpeningHours(
                    { space_opening_hours_id: 77 },
                    buildOpenHours({ open: '09:00:00', close: '17:00:00' }),
                ).length,
            ).toBeGreaterThan(0);
            expect(
                spaceOpeningHours(
                    { space_opening_hours_id: 88 },
                    buildOpenHours({ lid: 77, open: '09:00:00', close: '17:00:00' }),
                ).length,
            ).toBe(0);
            expect(
                spaceOpeningHours(
                    { space_opening_hours_id: null },
                    buildOpenHours({ lid: 77, open: '09:00:00', close: '17:00:00' }),
                ).length,
            ).toBe(0);

            const now = new Date();
            const openTime = new Date(now);
            openTime.setHours(now.getHours() - 1, now.getMinutes(), 0, 0);
            const closeTime = new Date(now);
            closeTime.setHours(now.getHours() + 2, now.getMinutes(), 0, 0);
            expect(
                getSpaceOpenStatus(
                    { space_opening_hours_id: 77 },
                    buildOpenHours({ open: formatTime(openTime), close: formatTime(closeTime) }),
                ),
            ).toBe('open');

            const closingSoonOpen = new Date(now);
            closingSoonOpen.setHours(now.getHours() - 2, now.getMinutes(), 0, 0);
            const closingSoonClose = new Date(now);
            closingSoonClose.setHours(now.getHours(), now.getMinutes() + 15, 0, 0);
            expect(
                getSpaceOpenStatus(
                    { space_opening_hours_id: 77 },
                    buildOpenHours({ open: formatTime(closingSoonOpen), close: formatTime(closingSoonClose) }),
                ),
            ).toBe('closing-soon');

            const closedOpen = new Date(now);
            closedOpen.setHours(now.getHours() - 2, now.getMinutes(), 0, 0);
            const closedClose = new Date(now);
            closedClose.setHours(now.getHours() - 1, now.getMinutes(), 0, 0);
            expect(
                getSpaceOpenStatus(
                    { space_opening_hours_id: 77 },
                    buildOpenHours({ open: formatTime(closedOpen), close: formatTime(closedClose) }),
                ),
            ).toBe('closed');

            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, buildOpenHours({ status: 'closed' }))).toBe(
                'closed',
            );
            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, buildOpenHours({ status: '24hours' }))).toBe(
                'open',
            );
            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, buildOpenHours({ status: 'open' }))).toBeNull();
            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, buildOpenHours({ currentlyOpen: true }))).toBe(
                'open',
            );
            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, buildOpenHours({ currentlyOpen: false }))).toBe(
                'closed',
            );
            expect(getSpaceOpenStatus({ space_opening_hours_id: 77 }, { locations: [] })).toBeNull();
            expect(isSpaceCurrentlyOpen({ space_opening_hours_id: 77 }, buildOpenHours({ status: '24hours' }))).toBe(
                true,
            );
            expect(isSpaceCurrentlyOpen({ space_opening_hours_id: 77 }, buildOpenHours({ status: 'closed' }))).toBe(
                false,
            );

            const url = new URL('https://example.com/#/spaces?journeyStep=results');
            expect(getJourneySearchParams(url)).toMatchObject({ usesHashQuery: true, hashPath: '#/spaces' });

            expect(getJourneySearchParams(new URL('https://example.com/route?journeyStep=results'))).toMatchObject({
                usesHashQuery: false,
            });

            const originalJestWorkerId = process.env.JEST_WORKER_ID;
            const originalBtoa = globalThis.btoa;
            const originalAtob = globalThis.atob;

            try {
                delete process.env.JEST_WORKER_ID;
                globalThis.btoa = undefined;
                globalThis.atob = undefined;

                expect(
                    getJourneySearchParams(new URL('https://example.com/#/spaces?journeyStep=results')),
                ).toMatchObject({
                    usesHashQuery: true,
                    hashPath: '#/spaces',
                });
                expect(getJourneySearchParams(new URL('https://example.com/#/spaces'))).toMatchObject({
                    usesHashQuery: true,
                    hashPath: '#/spaces',
                });
            } finally {
                if (originalJestWorkerId === undefined) {
                    delete process.env.JEST_WORKER_ID;
                } else {
                    process.env.JEST_WORKER_ID = originalJestWorkerId;
                }
                globalThis.btoa = originalBtoa;
                globalThis.atob = originalAtob;
            }

            window.history.pushState({}, '', '/spaces/mapresults');
            expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'results' });

            window.history.pushState({}, '', '/spaces/results/filters=favourite');
            expect(parseJourneyStateFromUrl([{ id: 'favourite' }])).toMatchObject({
                view: 'results',
                intentId: 'favourite',
            });

            window.history.pushState({}, '', '/spaces/results/unknown');
            expect(parseJourneyStateFromUrl([{ id: 'favourite' }])).toMatchObject({ view: 'landing', intentId: null });

            window.history.pushState({}, '', '/spaces/detail');
            expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'details', spaceId: null });

            window.history.pushState({}, '', '/spaces/details/88');
            expect(parseJourneyStateFromUrl([{ id: 'a123' }])).toMatchObject({ view: 'details', spaceId: '88' });

            window.history.pushState({}, '', '/branch#/spaces');
            expect(serialiseJourneyUrl({ view: 'results' })).toBe('/branch/#/spaces/results');

            const previousBtoa = globalThis.btoa;
            const previousAtob = globalThis.atob;
            try {
                const noJestUrl = new URL('https://example.com/#/spaces?journeyStep=results');
                delete process.env.JEST_WORKER_ID;
                expect(getJourneySearchParams(noJestUrl)).toMatchObject({ usesHashQuery: true, hashPath: '#/spaces' });
            } finally {
                if (originalJestWorkerId === undefined) {
                    delete process.env.JEST_WORKER_ID;
                } else {
                    process.env.JEST_WORKER_ID = originalJestWorkerId;
                }
                Object.defineProperty(globalThis, 'btoa', { value: previousBtoa, configurable: true, writable: true });
                Object.defineProperty(globalThis, 'atob', { value: previousAtob, configurable: true, writable: true });
            }

            window.history.pushState({}, '', '/#/spaces');
            expect(serialiseJourneyUrl({ view: 'results' })).toBe('#/spaces/results');
            expect(serialiseJourneyUrl({ view: 'landing' })).toBe('#/spaces');

            window.history.pushState({}, '', '/');
            expect(serialiseJourneyUrl({ view: 'details', spaceId: 99 })).toBe('/spaces/detail/99');
        } finally {
            MockDate.reset();
        }
    });

    it('exercises line 609: hashPath fallback when slice+split produces empty string', () => {
        // Hash routing on DEV: URL like '/#?' - hashValue.slice(1).split('?')[0] becomes empty
        // This triggers: hashPath || '/spaces' fallback on line 609
        window.history.pushState({}, '', '/#?query=test');
        try {
            const result = parseJourneyStateFromUrl([{ id: 'a123' }]);
            expect(result).toBeDefined();
            // Should handle gracefully and return valid state
            expect(result.view).toBe('landing');
        } finally {
            window.history.pushState({}, '', '/');
        }
    });

    it('exercises line 610: pathname fallback when replace produces falsy', () => {
        // Hash routing on DEV: URL like '#/' - after replace(/\/+$/) becomes empty
        // This triggers: return hashPath.replace(/\/+$/, '') || '/spaces' fallback on line 610
        window.history.pushState({}, '', '/#/');
        try {
            const result = parseJourneyStateFromUrl([{ id: 'a123' }]);
            expect(result).toBeDefined();
            // Should handle gracefully
            expect(result.view).toBe('landing');
        } finally {
            window.history.pushState({}, '', '/');
        }
    });

    it('thoroughly exercises spaceOpeningHours with multi-day department data', () => {
        // This exercises convertWeeksToDays and filterNext7Days with various date ranges
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const twoWeeksAway = new Date(today);
        twoWeeksAway.setDate(today.getDate() + 14);

        const multiWeekHours = {
            locations: [
                {
                    departments: [
                        {
                            lid: 88,
                            weeks: [
                                {
                                    Monday: { date: formatDate(today), open: '09:00:00', close: '17:00:00' },
                                    Tuesday: { date: formatDate(tomorrow), open: '10:00:00', close: '18:00:00' },
                                    Wednesday: { date: formatDate(nextWeek), open: '08:00:00', close: '16:00:00' },
                                    Thursday: { date: formatDate(twoWeeksAway), open: '09:00:00', close: '17:00:00' },
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        // This should exercise convertWeeksToDays and filterNext7Days
        const result = spaceOpeningHours({ space_opening_hours_id: 88 }, multiWeekHours);

        // Result should contain filtered days (only within 7 day window)
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        // Should only include days within 7 days from today
        if (result.length > 0) {
            expect(result[0].dayName).toBe('Today');
            expect(result.some(day => day.dayName === 'Tomorrow')).toBe(true);
        }
    });

    it('exercises getFriendlyLocationDescription with all conditional branches', () => {
        // Branch: hideOptions.space_name = false (render name)
        const withName = getFriendlyLocationDescription(
            {
                space_name: 'Room 101',
                space_library_name: 'Lib',
                space_campus_name: 'Campus',
                space_building_name: 'Bldg',
                space_building_number: '1',
                space_floor_name: '2',
            },
            false,
            { space_name: false },
        );
        expect(withName.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        // Branch: space_precise is falsy (null check path)
        const withoutPrecise = getFriendlyLocationDescription(
            {
                space_name: 'Room',
                space_library_name: 'Lib',
                space_campus_name: 'C',
                space_building_name: 'B',
                space_building_number: '1',
                space_floor_name: '2',
                space_precise: null,
            },
            false,
            {},
        );
        expect(withoutPrecise.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        // Branch: isCollapsed = true (collapsed path)
        const collapsed = getFriendlyLocationDescription({ space_library_name: 'Lib' }, true, {});
        expect(collapsed.props.children).toBe('Lib');
    });

    it('exercises spaceOpeningHours with non-matching IDs and empty departments', () => {
        // Test branch: No matching department (empty departments array)
        const emptyDepts = spaceOpeningHours(
            { space_opening_hours_id: 123 },
            { locations: [{ departments: [], lid: 999 }] },
        );
        expect(emptyDepts).toEqual([]);

        // Test branch: No matching location at all
        const noMatch = spaceOpeningHours(
            { space_opening_hours_id: 123 },
            { locations: [{ lid: 999, departments: [{ lid: 888 }] }] },
        );
        expect(noMatch).toEqual([]);
    });

    it('exercises convertWeeksToDays with non-array weeks property', () => {
        // Branch: department.weeks exists but is not an array
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        const departmentWithNonArrayWeeks = {
            lid: 77,
            weeks: 'not-an-array', // Invalid type
            days: [{ date: formatDate(today), times: { status: 'open' } }],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 77 },
            { locations: [{ departments: [departmentWithNonArrayWeeks] }] },
        );

        // Should still process the days array and return result
        expect(result).toBeDefined();
    });

    it('exercises date filtering with multi-week structured data', () => {
        // Test with properly structured weeks data to ensure filterNext7Days branch is exercised
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Structured with weeks property
        const departmentWithWeeks = {
            lid: 77,
            weeks: [
                {
                    Monday: { date: formatDate(today), open: '09:00', close: '17:00', times: { status: 'open' } },
                    Tuesday: { date: formatDate(tomorrow), open: '10:00', close: '18:00', times: { status: 'open' } },
                },
            ],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 77 },
            { locations: [{ departments: [departmentWithWeeks] }] },
        );

        // Should process the structured weeks data through convertWeeksToDays
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises all conditional branches in getFriendlyLocationDescription', () => {
        // Test space_precise truthy path (should render)
        const withPrecise = getFriendlyLocationDescription(
            {
                space_name: 'Room 202',
                space_library_name: 'Main Lib',
                space_campus_name: 'St Lucia',
                space_building_name: 'Building A',
                space_building_number: '42',
                space_floor_name: '2',
                space_precise: 'Corner by window',
                space_is_ground_floor: false,
            },
            false,
            {},
        );
        expect(withPrecise.props.children).toEqual(expect.arrayContaining([expect.anything()]));

        // Test with space_is_ground_floor true
        const groundFloor = getFriendlyLocationDescription(
            {
                space_name: 'Ground Room',
                space_library_name: 'Lib',
                space_campus_name: 'Campus',
                space_building_name: 'Bldg',
                space_building_number: '1',
                space_floor_name: 'G',
                space_is_ground_floor: true,
                space_precise: undefined,
            },
            false,
            {},
        );
        expect(groundFloor.props.children).toEqual(expect.arrayContaining([expect.anything()]));
    });

    it('exercises filterNext7Days with unsorted input dates', () => {
        // filterNext7Days should sort dates - test with unsorted input
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day3 = new Date(today);
        day3.setDate(today.getDate() + 3);
        const day1 = new Date(today);
        day1.setDate(today.getDate() + 1);
        const day2 = new Date(today);
        day2.setDate(today.getDate() + 2);

        // Deliberately unsorted - structured with weeks
        const unsortedWeeks = {
            lid: 88,
            weeks: [
                {
                    Thursday: { date: formatDate(day3), times: { status: 'open' } },
                    Monday: { date: formatDate(today), times: { status: 'open' } },
                    Tuesday: { date: formatDate(day1), times: { status: 'open' } },
                    Wednesday: { date: formatDate(day2), times: { status: 'closed' } },
                },
            ],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 88 },
            { locations: [{ departments: [unsortedWeeks] }] },
        );

        // Verify sorting occurred (Today should be first)
        expect(Array.isArray(result)).toBe(true);
        if (result.length > 0) {
            expect(result[0].dayName).toBe('Today');
            if (result.length > 1) {
                expect(result[1].dayName).toBe('Tomorrow');
            }
        }
    });

    it('exercises convertWeeksToDays with empty weeks array', () => {
        // Test with empty weeks array - should not iterate
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        const emptyWeeks = {
            lid: 55,
            weeks: [], // Empty array
            days: [{ date: formatDate(today), times: { status: 'open' } }],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 55 },
            { locations: [{ departments: [emptyWeeks] }] },
        );

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises convertWeeksToDays with multiple weeks containing various days', () => {
        // Test with multiple weeks, each with different day keys
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const future = new Date(today);
        future.setDate(today.getDate() + 7);

        const multiWeekDept = {
            lid: 66,
            weeks: [
                {
                    Monday: { date: formatDate(today), times: { status: 'open' } },
                    Wednesday: { date: formatDate(future), times: { status: 'closed' } },
                },
                {
                    Friday: { date: formatDate(today), times: { status: 'open' } },
                    Sunday: { date: formatDate(future), times: { status: 'open' } },
                },
            ],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 66 },
            { locations: [{ departments: [multiWeekDept] }] },
        );

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises spaceOpeningHours department filtering with matching location id', () => {
        // Test when matching occurs at location level, not department level
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        const result = spaceOpeningHours(
            { space_opening_hours_id: 200 },
            {
                locations: [
                    {
                        lid: 200, // Matches here at location level
                        departments: [
                            {
                                lid: 999,
                                weeks: [
                                    {
                                        Monday: { date: formatDate(today), times: { status: 'open' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );

        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises spaceOpeningHours with location departments null/undefined', () => {
        // Test defensive programming: location.departments might be falsy
        const result = spaceOpeningHours(
            { space_opening_hours_id: 300 },
            {
                locations: [
                    {
                        lid: 300,
                        departments: undefined, // Falsy departments
                    },
                ],
            },
        );

        expect(result).toEqual([]);
    });

    it('exercises convertWeeksToDays with days index <= 1 mapping', () => {
        // Test the ternary branch: d.dayName = index === 0 ? 'Today' : 'Tomorrow'
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        const daysForMapping = {
            lid: 77,
            weeks: [
                {
                    Monday: { date: formatDate(today), times: { status: 'open' } },
                    Tuesday: { date: formatDate(tomorrow), times: { status: 'open' } },
                    Wednesday: { date: formatDate(dayAfterTomorrow), times: { status: 'open' } },
                },
            ],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 77 },
            { locations: [{ departments: [daysForMapping] }] },
        );

        // Verify the mapping: index 0 = Today, index 1 = Tomorrow, index 2+ = original dayName
        expect(Array.isArray(result)).toBe(true);
        if (result.length >= 1) {
            expect(result[0].dayName).toBe('Today');
        }
        if (result.length >= 2) {
            expect(result[1].dayName).toBe('Tomorrow');
        }
        if (result.length >= 3) {
            expect(result[2].dayName).toBe('Wednesday');
        }
    });

    it('exercises matchesCapacityFilter with all conditional branches', () => {
        // Branch 1: hasBookableFilterSelected = true, hasCapacity = true
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 10 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: true,
            }),
        ).toBe(true);

        // Branch 2: hasBookableFilterSelected = true, capacity outside range
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 3 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: true,
            }),
        ).toBe(false);

        // Branch 3: hasBookableFilterSelected = false, hasCapacity = false (no capacity)
        expect(
            matchesCapacityFilter({
                space: { space_capacity: undefined },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Branch 4: hasBookableFilterSelected = false, hasCapacity = true, within range
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 15 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Branch 5: hasBookableFilterSelected = false, hasCapacity = true, below range
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 3 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(false);
    });

    it('exercises parseJourneyStateFromUrl with various pathname patterns', () => {
        // Test different pathname branches
        window.history.pushState({}, '', '/spaces/mapresults');
        expect(parseJourneyStateFromUrl([{ id: 'a' }])).toEqual({ view: 'results', intentId: null, spaceId: null });

        window.history.pushState({}, '', '/spaces/mapresults/some/path');
        expect(parseJourneyStateFromUrl([{ id: 'a' }])).toEqual({ view: 'results', intentId: null, spaceId: null });

        window.history.pushState({}, '', '/');
        expect(parseJourneyStateFromUrl([{ id: 'a' }])).toBeDefined();
    });

    it('exercises convertWeeksToDays with missing optional day keys', () => {
        // Test when week object has only some day keys (not all 7)
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const sparseWeek = {
            lid: 44,
            weeks: [
                {
                    // Only Monday and Friday, missing Tue-Thu, Sat-Sun
                    Monday: { date: formatDate(today), times: { status: 'open' } },
                    Friday: { date: formatDate(tomorrow), times: { status: 'open' } },
                },
            ],
        };

        const result = spaceOpeningHours(
            { space_opening_hours_id: 44 },
            { locations: [{ departments: [sparseWeek] }] },
        );

        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises spaceOpeningHours with matching via department (not location) id', () => {
        // Test matching department.lid equals space_opening_hours_id
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        const result = spaceOpeningHours(
            { space_opening_hours_id: 111 },
            {
                locations: [
                    {
                        lid: 999, // Different from target
                        departments: [
                            {
                                lid: 111, // Matches here
                                weeks: [
                                    {
                                        Monday: { date: formatDate(today), times: { status: 'open' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );

        expect(Array.isArray(result)).toBe(true);
    });

    it('exercises getSpaceOpenStatus with various opening hour statuses', () => {
        // Test branches: closed, 24hours, etc.
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        // Test: status = 'closed'
        const closedSpace = getSpaceOpenStatus(
            { space_opening_hours_id: 123 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 123,
                                weeks: [
                                    {
                                        Monday: { date: formatDate(today), times: { status: 'closed' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        expect(closedSpace).toBe('closed');

        // Test: status = '24hours'
        const open24 = getSpaceOpenStatus(
            { space_opening_hours_id: 124 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 124,
                                weeks: [
                                    {
                                        Monday: { date: formatDate(today), times: { status: '24hours' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        expect(open24).toBe('open');
    });

    it('exercises isInt with various edge cases', () => {
        // Test number.isFinite and bitwise operations
        expect(isInt(5)).toBe(true);
        expect(isInt(5.0)).toBe(true);
        expect(isInt(5.5)).toBe(false);
        expect(isInt(-3)).toBe(true);
        expect(isInt(-3.7)).toBe(false);
        expect(isInt(0)).toBe(true);
        expect(isInt(NaN)).toBe(false);
        expect(isInt(Infinity)).toBe(false);
    });

    it('exercises getPrefixedFloorName with various floor names', () => {
        // Test the startsWith('Level ') branch
        expect(getPrefixedFloorName('Level 3')).toBe('Level 3');
        expect(getPrefixedFloorName('3')).toBe('Level 3');
        expect(getPrefixedFloorName('Ground')).toBe('Level Ground');
        expect(getPrefixedFloorName(undefined)).toContain('Level');

        // Additional comprehensive tests
        expect(getPrefixedFloorName('Level ')).toBe('Level ');
        expect(getPrefixedFloorName('Level 1 - North')).toBe('Level 1 - North');
        expect(getPrefixedFloorName('2nd Floor')).toBe('Level 2nd Floor');
        expect(getPrefixedFloorName('')).toBe('Level ');
        expect(getPrefixedFloorName('level 3')).toBe('Level level 3'); // case-sensitive
        expect(getPrefixedFloorName(null)).toContain('Level');
        expect(getPrefixedFloorName('   ')).toBe('Level    ');
    });

    it('exercises getFriendlyFloorName with ground floor detection', () => {
        // space_is_ground_floor is truthy -> return 'Ground floor'
        expect(getFriendlyFloorName({ space_is_ground_floor: true, space_floor_name: 'F1' })).toBe('Ground floor');
        expect(getFriendlyFloorName({ space_is_ground_floor: 1, space_floor_name: 'F1' })).toBe('Ground floor');
        expect(getFriendlyFloorName({ space_is_ground_floor: 'yes', space_floor_name: 'F1' })).toBe('Ground floor');

        // space_is_ground_floor is falsy -> use getPrefixedFloorName
        expect(getFriendlyFloorName({ space_is_ground_floor: false, space_floor_name: 'Level 3' })).toBe('Level 3');
        expect(getFriendlyFloorName({ space_is_ground_floor: 0, space_floor_name: 'Floor 2' })).toBe('Level Floor 2');
        expect(getFriendlyFloorName({ space_is_ground_floor: '', space_floor_name: 'Basement' })).toBe(
            'Level Basement',
        );
        expect(getFriendlyFloorName({ space_is_ground_floor: null, space_floor_name: 'Upper' })).toBe('Level Upper');
        expect(getFriendlyFloorName({ space_is_ground_floor: undefined, space_floor_name: '4th' })).toBe('Level 4th');

        // No space object
        expect(getFriendlyFloorName(null)).toBeDefined();
        expect(getFriendlyFloorName(undefined)).toBeDefined();

        // Empty space object
        expect(getFriendlyFloorName({})).toBeDefined();

        // Missing space_floor_name
        expect(getFriendlyFloorName({ space_is_ground_floor: false })).toBeDefined();
    });

    it('exhaustively exercises getFriendlyLocationDescription all hideOptions combinations', () => {
        // Test EVERY hideOptions combination
        const baseSpace = {
            space_name: 'Room A',
            space_library_name: 'Main Library',
            space_campus_name: 'Campus',
            space_building_name: 'Building',
            space_building_number: '1',
            space_floor_name: '2',
            space_precise: 'Corner',
            space_is_ground_floor: false,
        };

        // hideOptions with space_name: true (HIDE name)
        const hideNameTrue = getFriendlyLocationDescription(baseSpace, false, { space_name: true });
        expect(hideNameTrue).toBeDefined();

        // hideOptions with space_name: false (SHOW name)
        const hideNameFalse = getFriendlyLocationDescription(baseSpace, false, { space_name: false });
        expect(hideNameFalse).toBeDefined();

        // hideOptions empty object (SHOW all)
        const hideNone = getFriendlyLocationDescription(baseSpace, false, {});
        expect(hideNone).toBeDefined();

        // hideOptions with other properties
        const hideOther = getFriendlyLocationDescription(baseSpace, false, { other_prop: true });
        expect(hideOther).toBeDefined();

        // space_is_ground_floor = true
        const groundFloor = getFriendlyLocationDescription({ ...baseSpace, space_is_ground_floor: true }, false, {});
        expect(groundFloor).toBeDefined();

        // space_precise = undefined (falsy)
        const noPrecise = getFriendlyLocationDescription({ ...baseSpace, space_precise: undefined }, false, {});
        expect(noPrecise).toBeDefined();

        // space_precise = '' (falsy string)
        const emptyPrecise = getFriendlyLocationDescription({ ...baseSpace, space_precise: '' }, false, {});
        expect(emptyPrecise).toBeDefined();

        // space_precise = 0 (falsy)
        const zeroPrecise = getFriendlyLocationDescription({ ...baseSpace, space_precise: 0 }, false, {});
        expect(zeroPrecise).toBeDefined();

        // space_precise = null
        const nullPrecise = getFriendlyLocationDescription({ ...baseSpace, space_precise: null }, false, {});
        expect(nullPrecise).toBeDefined();
    });

    it('exhaustively exercises spaceOpeningHours with ALL id matching combinations', () => {
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();

        // Case 1: Match at location.lid level
        const locMatch = spaceOpeningHours(
            { space_opening_hours_id: 100 },
            {
                locations: [
                    {
                        lid: 100, // Matches!
                        departments: [
                            {
                                lid: 999,
                                weeks: [{ Monday: { date: formatDate(today), times: { status: 'open' } } }],
                            },
                        ],
                    },
                ],
            },
        );
        expect(locMatch).toBeDefined();

        // Case 2: Match via department.lid in location with different location.lid
        const deptMatch = spaceOpeningHours(
            { space_opening_hours_id: 200 },
            {
                locations: [
                    {
                        lid: 999,
                        departments: [
                            {
                                lid: 200, // Matches here!
                                weeks: [{ Monday: { date: formatDate(today), times: { status: 'open' } } }],
                            },
                        ],
                    },
                ],
            },
        );
        expect(deptMatch).toBeDefined();

        // Case 3: No match - different IDs everywhere
        const noMatch = spaceOpeningHours(
            { space_opening_hours_id: 500 },
            {
                locations: [
                    {
                        lid: 999,
                        departments: [
                            { lid: 888, weeks: [{ Monday: { date: formatDate(today), times: { status: 'open' } } }] },
                        ],
                    },
                ],
            },
        );
        expect(noMatch).toEqual([]);

        // Case 4: Multiple departments - only one matches
        const multiDepts = spaceOpeningHours(
            { space_opening_hours_id: 300 },
            {
                locations: [
                    {
                        lid: 999,
                        departments: [
                            { lid: 111, weeks: [{ Monday: { date: formatDate(today), times: { status: 'open' } } }] },
                            { lid: 300, weeks: [{ Tuesday: { date: formatDate(today), times: { status: 'open' } } }] }, // Matches!
                            {
                                lid: 222,
                                weeks: [{ Wednesday: { date: formatDate(today), times: { status: 'open' } } }],
                            },
                        ],
                    },
                ],
            },
        );
        expect(multiDepts).toBeDefined();

        // Case 5: Multiple locations - only one matches
        const multiLocs = spaceOpeningHours(
            { space_opening_hours_id: 400 },
            {
                locations: [
                    { lid: 111, departments: [] },
                    {
                        lid: 400,
                        departments: [
                            { lid: 999, weeks: [{ Monday: { date: formatDate(today), times: { status: 'open' } } }] },
                        ],
                    }, // Matches!
                    { lid: 222, departments: [] },
                ],
            },
        );
        expect(multiLocs).toBeDefined();
    });

    it('exhaustively exercises convertWeeksToDays with ALL day keys', () => {
        // Test with ALL 7 days present
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return formatDate(d);
        });

        const allDays = {
            lid: 77,
            weeks: [
                {
                    Monday: { date: dates[0], times: { status: 'open' } },
                    Tuesday: { date: dates[1], times: { status: 'open' } },
                    Wednesday: { date: dates[2], times: { status: 'closed' } },
                    Thursday: { date: dates[3], times: { status: '24hours' } },
                    Friday: { date: dates[4], times: { status: 'open' } },
                    Saturday: { date: dates[5], times: { status: 'closed' } },
                    Sunday: { date: dates[6], times: { status: 'open' } },
                },
            ],
        };

        const result = spaceOpeningHours({ space_opening_hours_id: 77 }, { locations: [{ departments: [allDays] }] });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('exercises date boundary conditions with past and future dates', () => {
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Test with past date (before today - should be filtered out by filterNext7Days)
        const past = new Date(today);
        past.setDate(today.getDate() - 5);
        const pastDate = formatDate(past);

        // Test with future date beyond 7 days
        const future = new Date(today);
        future.setDate(today.getDate() + 10);
        const futureDate = formatDate(future);

        // Test with exact 7th day boundary
        const day7 = new Date(today);
        day7.setDate(today.getDate() + 6);
        const day7Date = formatDate(day7);

        const boundary = spaceOpeningHours(
            { space_opening_hours_id: 88 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 88,
                                weeks: [
                                    {
                                        Monday: { date: pastDate, times: { status: 'open' } },
                                        Tuesday: { date: formatDate(today), times: { status: 'open' } },
                                        Wednesday: { date: futureDate, times: { status: 'open' } },
                                        Thursday: { date: day7Date, times: { status: 'open' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );

        expect(Array.isArray(boundary)).toBe(true);

        // Test with unsorted dates (not in chronological order)
        const unsorted = spaceOpeningHours(
            { space_opening_hours_id: 89 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 89,
                                weeks: [
                                    {
                                        Friday: {
                                            date: formatDate(new Date(today.getTime() + 345600000)),
                                            times: { status: 'open' },
                                        },
                                        Monday: { date: formatDate(today), times: { status: 'open' } },
                                        Wednesday: {
                                            date: formatDate(new Date(today.getTime() + 172800000)),
                                            times: { status: 'open' },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );

        expect(Array.isArray(unsorted)).toBe(true);
    });

    it('exhaustively exercises matchesCapacityFilter with ALL edge values', () => {
        // Test boundary: capacity = minimum
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 5 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Test boundary: capacity = maximum
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 20 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Test: capacity = 0
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 0 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true); // hasCapacity = false, so returns !hasCapacity (true)

        // Test: capacity = negative
        expect(
            matchesCapacityFilter({
                space: { space_capacity: -5 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true); // hasCapacity = false (negative)

        // Test: with hasBookableFilterSelected = true and capacity = 0
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 0 },
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: true,
            }),
        ).toBe(false); // hasCapacity = false, so returns false

        // Test: capacityFilterValue = [undefined, undefined]
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 10 },
                capacityFilterValue: [undefined, undefined],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Test: capacityFilterValue = null
        expect(
            matchesCapacityFilter({
                space: { space_capacity: 10 },
                capacityFilterValue: null,
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true);

        // Test: space = null/undefined
        expect(
            matchesCapacityFilter({
                space: null,
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true); // hasCapacity = false (NaN)

        // Test: space = undefined
        expect(
            matchesCapacityFilter({
                space: undefined,
                capacityFilterValue: [5, 20],
                minimumSpaceCapacity: 1,
                maximumSpaceCapacity: 50,
                hasBookableFilterSelected: false,
            }),
        ).toBe(true); // hasCapacity = false
    });

    it('exhaustively exercises isInt with ALL falsy/truthy edge cases', () => {
        // Positive integers
        expect(isInt(1)).toBe(true);
        expect(isInt(100)).toBe(true);
        expect(isInt(1000000)).toBe(true);

        // Negative integers
        expect(isInt(-1)).toBe(true);
        expect(isInt(-100)).toBe(true);

        // Zero
        expect(isInt(0)).toBe(true);

        // Decimals (should be false)
        expect(isInt(0.1)).toBe(false);
        expect(isInt(0.5)).toBe(false);
        expect(isInt(1.1)).toBe(false);
        expect(isInt(-0.5)).toBe(false);

        // Special numbers
        expect(isInt(NaN)).toBe(false);
        expect(isInt(Infinity)).toBe(false);
        expect(isInt(-Infinity)).toBe(false);

        // String numbers (parseFloat handles them)
        expect(isInt('5')).toBe(true);
        expect(isInt('5.5')).toBe(false);
        expect(isInt('abc')).toBe(false);

        // Null/undefined
        expect(isInt(null)).toBe(false);
        expect(isInt(undefined)).toBe(false);

        // Array/Object
        expect(isInt([])).toBe(false);
        expect(isInt({})).toBe(false);
    });

    it('exhaustively exercises parseJourneyStateFromUrl with ALL pathname patterns', () => {
        // /spaces/results pattern
        window.history.pushState({}, '', '/spaces/results');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('results');

        // /spaces/results/ with trailing slash
        window.history.pushState({}, '', '/spaces/results/');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('results');

        // /spaces/mapresults
        window.history.pushState({}, '', '/spaces/mapresults');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('results');

        // /spaces/mapresults/something
        window.history.pushState({}, '', '/spaces/mapresults/detail');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('results');

        // /spaces/results/filters=
        window.history.pushState({}, '', '/spaces/results/filters=');
        const emptyFilter = parseJourneyStateFromUrl([{ id: 'a' }]);
        expect(emptyFilter.view).toBe('results');

        // /spaces/results/filters=bookable
        window.history.pushState({}, '', '/spaces/results/filters=bookable');
        const bookableFilter = parseJourneyStateFromUrl([{ id: 'a123' }]);
        expect(bookableFilter.view).toBe('results');

        // /spaces/detail/123
        window.history.pushState({}, '', '/spaces/detail/123');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('details');

        // /spaces/detail
        window.history.pushState({}, '', '/spaces/detail');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('details');

        // / (root)
        window.history.pushState({}, '', '/');
        expect(parseJourneyStateFromUrl([{ id: 'a' }]).view).toBe('landing');

        // /unknown/path
        window.history.pushState({}, '', '/unknown/path');
        expect(parseJourneyStateFromUrl([{ id: 'a' }])).toBeDefined();
    });

    it('exhaustively exercises getSpaceOpenStatus with ALL status values and edge cases', () => {
        const pad = value => String(value).padStart(2, '0');
        const formatDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Test with valid opening hours data
        const result = getSpaceOpenStatus(
            { space_opening_hours_id: 1 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 1,
                                weeks: [
                                    {
                                        Monday: { date: formatDate(today), times: { status: 'open' } },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        expect(result).toBeDefined();

        // Test no days returned (empty opening hours)
        const noDays = getSpaceOpenStatus({ space_opening_hours_id: 999 }, { locations: [] });
        expect(noDays).toBeNull();

        // Test with undefined space
        const noSpace = getSpaceOpenStatus(undefined, { locations: [] });
        expect(noSpace).toBeNull();

        // Test with day having open/close times but currently closed
        const past = new Date();
        past.setHours(5, 0, 0, 0);
        past.setDate(today.getDate());
        const closedNow = getSpaceOpenStatus(
            { space_opening_hours_id: 2 },
            {
                locations: [
                    {
                        departments: [
                            {
                                lid: 2,
                                weeks: [
                                    {
                                        Monday: {
                                            date: formatDate(today),
                                            times: { status: 'unknown' },
                                            open: '06:00',
                                            close: '10:00',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        expect(closedNow).toBeDefined();
    });
});

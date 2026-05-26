import { act, renderHook } from '@testing-library/react';
import { useIncludedLocations, useValidation, actionReducer } from './hooks';

describe('Tests custom hooks', () => {
    describe('useValidation', () => {
        it('validates form values', () => {
            const testStatusEnum = { PASSED: { value: 'PASSED' }, FAILED: { value: 'FAILED' } };
            const { result } = renderHook(({ testStatusEnum }) => useValidation({ testStatusEnum }), {
                initialProps: { testStatusEnum },
            });

            act(() => {
                result.current.validateValues({
                    asset_id_displayed: undefined,
                    room_id: undefined,
                    asset_type_id: undefined,
                    action_date: undefined,
                    inspection_status: undefined,
                    inspection_device_id: undefined,
                    inspection_fail_reason: undefined,
                    inspection_notes: undefined,
                    inspection_date_next: undefined,
                    isRepair: false,
                    repairer_contact_details: undefined,
                    isDiscarded: false,
                    discard_reason: undefined,
                });
            });
            expect(result.current.isValid).toBe(false);

            // valid inspection only
            const validPassingInspection = {
                action_date: '2016-12-05 14:22',
                asset_id_displayed: 'UQL310000',
                asset_type_id: 1,
                inspection_date_next: '2018-12-05 14:22',
                inspection_device_id: 1,
                inspection_fail_reason: undefined,
                inspection_notes: 'notes',
                inspection_status: 'PASSED',
                isDiscarded: false,
                discard_reason: undefined,
                isRepair: false,
                repairer_contact_details: undefined,
                room_id: 1,
            };
            act(() => {
                result.current.validateValues(validPassingInspection);
            });
            expect(result.current.isValid).toBe(true);

            // valid inspection with discard
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    isDiscarded: true,
                    discard_reason: 'details',
                });
            });
            expect(result.current.isValid).toBe(true);

            // invalid repair without inspection
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    inspection_date_next: undefined,
                    inspection_device_id: undefined,
                    inspection_notes: undefined,
                    inspection_status: undefined,
                    isRepair: true,
                    repairer_contact_details: 'details',
                    room_id: -1,
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid discard without inspection
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    discard_reason: 'details',
                    inspection_date_next: undefined,
                    inspection_device_id: undefined,
                    inspection_notes: undefined,
                    inspection_status: undefined,
                    isDiscarded: true,
                    room_id: -1,
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid request without date
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    action_date: undefined, // required
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid request when date is in the future
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    action_date: '2018-12-05 14:22', // required to be current or past date
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid request without asset id
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    asset_id_displayed: undefined, // required
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid request without asset type id
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    asset_type_id: undefined, // required
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection without room id
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    room_id: -1, // required
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection with repair
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    isRepair: true,
                    repairer_contact_details: undefined, // required when isRepair=true
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection with discard
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    discard_reason: undefined, // required when isDiscarded=true
                    isDiscarded: true,
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection with repair and discard when status === PASSED
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    discard_reason: 'details',
                    isDiscarded: true, // mutually exclusive only for FAILED
                    isRepair: true, // --------^
                    repairer_contact_details: 'details',
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection with repair and discard when status FAILED (can only supply one)
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    discard_reason: 'details',
                    inspection_status: 'FAILED',
                    isDiscarded: true, // mutually exclusive for status=FAILED
                    isRepair: true, // --------^
                    repairer_contact_details: 'details',
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid PASS inspection without next inspection date
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    inspection_date_next: undefined, // required when inspection_status = PASSED
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid PASS inspection when next inspection date is in the past
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    inspection_date_next: '2010-12-05 14:22', // required to be in the future
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid PASS inspection without device id
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    inspection_date_next: '2017-12-05 14:22',
                    inspection_device_id: undefined, // required
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid PASS inspection without device id
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    inspection_date_next: '2017-12-05 14:22',
                    inspection_fail_reason: undefined, // required when inspection_status = FAILED
                    inspection_status: 'FAILED',
                });
            });
            expect(result.current.isValid).toBe(false);

            // invalid inspection with repair and PASS
            act(() => {
                result.current.validateValues({
                    ...validPassingInspection,
                    isRepair: true,
                    repairer_contact_details: 'details',
                });
            });
            expect(result.current.isValid).toBe(false);
        });
    });

    describe('actionReducer', () => {
        it('returns expected results', () => {
            expect(actionReducer(undefined, { type: 'add', title: 'add test' })).toEqual({
                title: 'add test',
                isAdd: true,
                row: { asset_type_id: 'auto' },
            });
            expect(actionReducer(undefined, { type: 'clear', title: 'clear test' })).toEqual({
                isAdd: false,
                rows: {},
                row: {},
                title: '',
            });
            try {
                actionReducer(undefined, { type: 'invalid', title: 'invalid test' });
            } catch (e) {
                expect(e).toEqual("Unknown action 'invalid'");
            }
        });
        it('operates correctly', () => {
            // test add action
            const testAction = {
                type: 'add',
                title: 'test title',
            };
            const expectedAction = {
                title: 'test title',
                isAdd: true,
                row: { asset_type_id: 'auto' },
            };
            expect(actionReducer(null, testAction)).toEqual(expectedAction);
            const expectedEmpty = { isAdd: false, rows: {}, row: {}, title: '' };
            testAction.type = 'clear';
            expect(actionReducer(null, testAction)).toEqual(expectedEmpty);
            // test if throw is correct
            testAction.type = 'test';
            expect(() => {
                actionReducer(null, testAction);
            }).toThrow();
        });
    });

    describe('useIncludedLocations', () => {
        it('returns empty arrays when all inputs are undefined', () => {
            const location = { site: -1 };
            const { result } = renderHook(() => useIncludedLocations(location, undefined, undefined, undefined));

            expect(result.current.sites).toEqual([]);
            expect(result.current.buildings).toEqual([]);
            expect(result.current.floors).toEqual([]);
            expect(result.current.rooms).toEqual([]);
        });

        it('returns empty arrays when all inputs are null', () => {
            const location = { site: -1 };
            const { result } = renderHook(() => useIncludedLocations(location, null, null, null));

            expect(result.current.sites).toEqual([]);
            expect(result.current.buildings).toEqual([]);
            expect(result.current.floors).toEqual([]);
            expect(result.current.rooms).toEqual([]);
        });

        it('filters out excluded sites', () => {
            const location = { site: -1 };
            const sites = [
                { site_id: 1, site_name: 'Included Site', site_excluded: false, buildings: [] },
                { site_id: 2, site_name: 'Excluded Site', site_excluded: true, buildings: [] },
                { site_id: 3, site_name: 'Also Included', buildings: [] },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, sites, undefined, undefined));

            expect(result.current.sites).toHaveLength(2);
            expect(result.current.sites.map(s => s.site_id)).toEqual([1, 3]);
        });

        it('returns buildings for the selected site, filtering excluded', () => {
            const location = { site: 1 };
            const sites = [
                {
                    site_id: 1,
                    site_name: 'St Lucia',
                    buildings: [
                        {
                            building_id: 1,
                            building_name: 'Forgan Smith',
                            building_excluded: false,
                            parent_excluded: false,
                        },
                        {
                            building_id: 2,
                            building_name: 'Excluded Bldg',
                            building_excluded: true,
                            parent_excluded: false,
                        },
                        {
                            building_id: 3,
                            building_name: 'Parent Excluded',
                            building_excluded: false,
                            parent_excluded: true,
                        },
                        {
                            building_id: 4,
                            building_name: 'Duhig Tower',
                            building_excluded: false,
                            parent_excluded: false,
                        },
                    ],
                },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, sites, undefined, undefined));

            expect(result.current.buildings).toHaveLength(2);
            expect(result.current.buildings.map(b => b.building_id)).toEqual([1, 4]);
        });

        it('returns empty buildings when selected site is not found', () => {
            const location = { site: 999 };
            const sites = [
                { site_id: 1, site_name: 'St Lucia', buildings: [{ building_id: 1, building_name: 'Forgan Smith' }] },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, sites, undefined, undefined));

            expect(result.current.buildings).toEqual([]);
        });

        it('returns empty buildings when selected site is excluded', () => {
            const location = { site: 1 };
            const sites = [
                {
                    site_id: 1,
                    site_name: 'Excluded Site',
                    site_excluded: true,
                    buildings: [{ building_id: 1, building_name: 'A Building' }],
                },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, sites, undefined, undefined));

            // Site is excluded so it's not in includedSites, so building lookup finds nothing
            expect(result.current.buildings).toEqual([]);
        });

        it('filters out excluded floors', () => {
            const location = { site: -1 };
            const floors = [
                { floor_id: 1, floor_id_displayed: '1', floor_excluded: false },
                { floor_id: 2, floor_id_displayed: '2', floor_excluded: true },
                { floor_id: 3, floor_id_displayed: '3' },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, undefined, floors, undefined));

            expect(result.current.floors).toHaveLength(2);
            expect(result.current.floors.map(f => f.floor_id)).toEqual([1, 3]);
        });

        it('filters out excluded rooms', () => {
            const location = { site: -1 };
            const rooms = [
                { room_id: 1, room_id_displayed: 'W334', room_excluded: false },
                { room_id: 2, room_id_displayed: 'W335', room_excluded: true },
                { room_id: 3, room_id_displayed: 'W341' },
            ];
            const { result } = renderHook(() => useIncludedLocations(location, undefined, undefined, rooms));

            expect(result.current.rooms).toHaveLength(2);
            expect(result.current.rooms.map(r => r.room_id)).toEqual([1, 3]);
        });

        it('maintains referential stability when inputs do not change', () => {
            const location = { site: 1 };
            const sites = [
                { site_id: 1, site_name: 'St Lucia', buildings: [{ building_id: 1, building_name: 'Forgan Smith' }] },
            ];
            const floors = [{ floor_id: 1, floor_id_displayed: '1' }];
            const rooms = [{ room_id: 1, room_id_displayed: 'W334' }];

            const { result, rerender } = renderHook(
                ({ location, sites, floors, rooms }) => useIncludedLocations(location, sites, floors, rooms),
                { initialProps: { location, sites, floors, rooms } },
            );

            const firstResult = result.current;

            // Rerender with the exact same references
            rerender({ location, sites, floors, rooms });

            expect(result.current.sites).toBe(firstResult.sites);
            expect(result.current.buildings).toBe(firstResult.buildings);
            expect(result.current.floors).toBe(firstResult.floors);
            expect(result.current.rooms).toBe(firstResult.rooms);
        });

        it('recalculates buildings when location.site changes', () => {
            const sites = [
                {
                    site_id: 1,
                    site_name: 'St Lucia',
                    buildings: [{ building_id: 1, building_name: 'Forgan Smith' }],
                },
                {
                    site_id: 2,
                    site_name: 'Gatton',
                    buildings: [{ building_id: 8, building_name: 'J.K. Murray Library' }],
                },
            ];

            const { result, rerender } = renderHook(
                ({ location }) => useIncludedLocations(location, sites, undefined, undefined),
                { initialProps: { location: { site: 1 } } },
            );

            expect(result.current.buildings).toHaveLength(1);
            expect(result.current.buildings[0].building_name).toBe('Forgan Smith');

            rerender({ location: { site: 2 } });

            expect(result.current.buildings).toHaveLength(1);
            expect(result.current.buildings[0].building_name).toBe('J.K. Murray Library');
        });

        it('does not recalculate sites when only location.site changes', () => {
            const sites = [
                { site_id: 1, site_name: 'St Lucia', buildings: [] },
                { site_id: 2, site_name: 'Gatton', buildings: [] },
            ];

            const { result, rerender } = renderHook(
                ({ location }) => useIncludedLocations(location, sites, undefined, undefined),
                { initialProps: { location: { site: 1 } } },
            );

            const firstSites = result.current.sites;

            rerender({ location: { site: 2 } });

            // Sites array should be referentially identical since the sites input didn't change
            expect(result.current.sites).toBe(firstSites);
        });
    });
});

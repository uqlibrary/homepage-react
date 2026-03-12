import {
    transformRow,
    emptyActionState,
    actionReducer,
    getAssociatedCollectionKeyBySelectedLocation,
    cleanObjectByLocation,
    transformAddRequest,
    transformUpdateRequest,
} from './utils';

describe('utils', () => {
    describe('transformRow', () => {
        it('should transform excluded fields to display values and checkboxes', () => {
            const row = [
                {
                    site_id: 1,
                    site_excluded: true,
                    building_excluded: false,
                    floor_excluded: true,
                    room_excluded: false,
                },
            ];
            const result = transformRow(row);
            expect(result).toEqual([
                {
                    site_id: 1,
                    site_excluded: 'Yes',
                    site_excluded_cb: true,
                    building_excluded: 'No',
                    building_excluded_cb: false,
                    floor_excluded: 'Yes',
                    floor_excluded_cb: true,
                    room_excluded: 'No',
                    room_excluded_cb: false,
                },
            ]);
        });

        it('should handle parent_excluded for building exclusion', () => {
            const row = [
                { building_excluded: false, parent_excluded: true },
                { building_excluded: true, parent_excluded: false },
            ];
            const result = transformRow(row);
            expect(result[0].building_excluded_cb).toBe(false); // actual value shouldnt change
            expect(result[0].building_excluded).toBe('Yes'); // display value should be yes if either building_excluded or parent_excluded is true
            expect(result[1].building_excluded_cb).toBe(true);
            expect(result[1].building_excluded).toBe('Yes');
        });

        it('should handle all excluded fields as true', () => {
            const row = [
                {
                    site_excluded: true,
                    building_excluded: true,
                    parent_excluded: true,
                    floor_excluded: true,
                    room_excluded: true,
                },
            ];
            const result = transformRow(row);
            expect(result[0].site_excluded_cb).toBe(true);
            expect(result[0].site_excluded).toBe('Yes');
            expect(result[0].building_excluded_cb).toBe(true);
            expect(result[0].building_excluded).toBe('Yes');
            expect(result[0].floor_excluded_cb).toBe(true);
            expect(result[0].floor_excluded).toBe('Yes');
            expect(result[0].room_excluded_cb).toBe(true);
            expect(result[0].room_excluded).toBe('Yes');
        });

        it('should default undefined excluded fields to No/false', () => {
            const row = [{ site_id: 1 }];
            const result = transformRow(row);
            expect(result).toEqual([
                {
                    site_id: 1,
                    site_excluded: 'No',
                    site_excluded_cb: false,
                    building_excluded: 'No',
                    building_excluded_cb: false,
                    floor_excluded: 'No',
                    floor_excluded_cb: false,
                    room_excluded: 'No',
                    room_excluded_cb: false,
                },
            ]);
        });
    });

    describe('emptyActionState', () => {
        it('should have the correct initial values', () => {
            expect(emptyActionState).toEqual({
                isAdd: false,
                isEdit: false,
                isDelete: false,
                title: '',
                row: {},
            });
        });
    });

    describe('actionReducer', () => {
        it('should return the correct state for add action', () => {
            const state = actionReducer(undefined, { type: 'add', selectedLocation: 'room', title: 'Add Room' });
            expect(state).toEqual({
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: { room_id: 'auto' },
                title: 'Add Room',
                props: {},
            });
        });

        it('should return the correct state for edit action', () => {
            const initialState = {
                type: 'edit',
                selectedLocation: 'room',
                title: 'Edit Room',
                row: { room_id: 1 },
                anotherProp: true,
            };
            const state = actionReducer(undefined, initialState);
            expect(state).toEqual({
                isAdd: false,
                isEdit: true,
                isDelete: false,
                title: 'Edit Room',
                row: { room_id: 1 },
                props: { anotherProp: true },
            });
        });

        it('should return the correct state for delete action', () => {
            const initialState = {
                type: 'delete',
                selectedLocation: 'room',
                title: 'Delete Room',
                row: { room_id: 1 },
                anotherProp: true,
            };
            const state = actionReducer(undefined, initialState);
            expect(state).toEqual({
                isAdd: false,
                isEdit: false,
                isDelete: true,
                title: 'Delete Room',
                row: { room_id: 1 },
                props: {
                    anotherProp: true,
                    selectedLocation: 'room',
                },
            });
        });

        it('should return the correct state for clear action', () => {
            const initialState = {
                type: 'clear',
                title: 'Edit Room',
                row: { room_id: 1 },
                props: {},
            };
            const state = actionReducer(undefined, initialState);
            expect(state).toEqual(emptyActionState);
        });

        it('should throw an error for unknown action', () => {
            expect(() => {
                actionReducer(undefined, { type: 'unknown' });
            }).toThrow("Unknown action 'unknown'");
        });
    });

    describe('getAssociatedCollectionKeyBySelectedLocation', () => {
        it('should return the correct previous collection key for next direction', () => {
            const collection = { site: {}, building: {}, floor: {}, room: {} };
            const current = 'building';
            const direction = 'next';
            const key = getAssociatedCollectionKeyBySelectedLocation(collection, current, direction);
            expect(key).toBe('floor');
        });

        it('should return the correct previous collection key for prev direction', () => {
            const collection = { site: {}, building: {}, floor: {}, room: {} };
            const current = 'floor';
            const direction = 'prev';
            const key = getAssociatedCollectionKeyBySelectedLocation(collection, current, direction);
            expect(key).toBe('building');
        });

        it('should return null for next direction when current is the last collection', () => {
            const collection = { site: {}, building: {}, floor: {}, room: {} };
            const current = 'room';
            const direction = 'next';
            const key = getAssociatedCollectionKeyBySelectedLocation(collection, current, direction);
            expect(key).toBe(null);
        });

        it('should return null for prev direction when current is the first collection', () => {
            const collection = { site: {}, building: {}, floor: {}, room: {} };
            const current = 'site';
            const direction = 'prev';
            const key = getAssociatedCollectionKeyBySelectedLocation(collection, current, direction);
            expect(key).toBe(null);
        });

        it('should default to next direction when direction is not provided', () => {
            const collection = { site: {}, building: {}, floor: {}, room: {} };
            const key = getAssociatedCollectionKeyBySelectedLocation(collection, 'building');
            expect(key).toBe('floor');
        });
    });

    describe('cleanObjectByLocation', () => {
        it('should keep only site_excluded_cb for site location', () => {
            const request = {
                name: 'Site 1',
                site_excluded_cb: true,
                site_excluded: 'Yes',
                building_excluded_cb: true,
                building_excluded: 'Yes',
                floor_excluded_cb: false,
                floor_excluded: 'No',
                room_excluded_cb: false,
                room_excluded: 'No',
                parent_excluded: true,
            };
            const result = cleanObjectByLocation(request, 'site');
            expect(result).toEqual({
                name: 'Site 1',
                site_excluded_cb: true,
            });
        });

        it('should keep only building_excluded_cb for building location', () => {
            const request = {
                name: 'Building 1',
                site_excluded_cb: true,
                building_excluded_cb: 'truthy',
                building_excluded: 'Yes',
                floor_excluded_cb: false,
                room_excluded_cb: false,
                parent_excluded: false,
            };
            const result = cleanObjectByLocation(request, 'building');
            expect(result).toEqual({
                name: 'Building 1',
                building_excluded_cb: true,
            });
        });

        it('should keep only floor_excluded_cb for floor location', () => {
            const request = {
                name: 'Floor 1',
                floor_excluded_cb: 1,
                floor_excluded: 'Yes',
            };
            const result = cleanObjectByLocation(request, 'floor');
            expect(result).toEqual({
                name: 'Floor 1',
                floor_excluded_cb: true,
            });
        });

        it('should keep only room_excluded_cb for room location', () => {
            const request = {
                name: 'Room 1',
                room_excluded_cb: undefined,
                room_excluded: 'No',
            };
            const result = cleanObjectByLocation(request, 'room');
            expect(result).toEqual({
                name: 'Room 1',
                room_excluded_cb: false,
            });
        });

        it('should coerce falsy excluded_cb value to false', () => {
            const request = { name: 'Site 1', site_excluded_cb: 0 };
            const result = cleanObjectByLocation(request, 'site');
            expect(result.site_excluded_cb).toBe(false);
        });
    });

    describe('transformAddRequest', () => {
        it('should remove the selectedLocation id field from the request', () => {
            const request = { room_id: 'auto', name: 'Room 1' };
            const selectedLocation = 'room';
            const location = { floor: 2, room: 1 };
            const transformedRequest = transformAddRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                name: 'Room 1',
                room_excluded_cb: false,
                room_floor_id: 2,
            });
        });

        it('should return the request as is if there is no previous key', () => {
            const request = { site_id: 'auto', name: 'Site 1' };
            const selectedLocation = 'site';
            const location = { site: 1 };
            const transformedRequest = transformAddRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                name: 'Site 1',
                site_excluded_cb: false,
            });
        });

        it('should coerce truthy excluded_cb values to booleans', () => {
            const request = {
                room_id: 'auto',
                name: 'Room 1',
                site_excluded_cb: 1,
                building_excluded_cb: 'yes',
                floor_excluded_cb: true,
                room_excluded_cb: 1,
            };
            const selectedLocation = 'room';
            const location = { floor: 2, room: 1 };
            const transformedRequest = transformAddRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                name: 'Room 1',
                room_excluded_cb: true,
                room_floor_id: 2,
            });
        });
    });

    describe('transformUpdateRequest', () => {
        it('should sanitise the request', () => {
            const request = { floor_id: 2, name: 'Floor 2', asset_count: 1, rooms: [] };
            const selectedLocation = 'floor';
            const location = { building: 3, floor: 2, room: 1 };
            const transformedRequest = transformUpdateRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                name: 'Floor 2',
                floor_building_id: 3,
                floor_id: 2,
                floor_excluded_cb: false,
            });
        });

        it('should return the request as is if there is no previous key', () => {
            const request = { site_id: 1, name: 'Site 1' };
            const selectedLocation = 'site';
            const location = { site: 1 };
            const transformedRequest = transformUpdateRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                site_id: 1,
                name: 'Site 1',
                site_excluded_cb: false,
            });
        });

        it('should coerce truthy excluded_cb values to booleans', () => {
            const request = {
                floor_id: 2,
                name: 'Floor 2',
                asset_count: 1,
                rooms: [],
                site_excluded_cb: true,
                building_excluded_cb: 0,
                floor_excluded_cb: 'truthy',
                room_excluded_cb: null,
            };
            const selectedLocation = 'floor';
            const location = { building: 3, floor: 2, room: 1 };
            const transformedRequest = transformUpdateRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({
                name: 'Floor 2',
                floor_building_id: 3,
                floor_id: 2,
                floor_excluded_cb: true,
            });
        });
    });
});

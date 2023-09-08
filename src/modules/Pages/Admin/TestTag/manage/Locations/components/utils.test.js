import {
    emptyActionState,
    actionReducer,
    getAssociatedCollectionKeyBySelectedLocation,
    transformAddRequest,
    transformUpdateRequest,
} from './utils';

describe('utils', () => {
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
    });

    describe('transformAddRequest', () => {
        it('should remove the selectedLocation id field from the request', () => {
            const request = { room_id: 'auto', name: 'Room 1' };
            const selectedLocation = 'room';
            const location = { floor: 2, room: 1 };
            const transformedRequest = transformAddRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({ name: 'Room 1', room_floor_id: 2 });
        });

        it('should return the request as is if there is no previous key', () => {
            const request = { room_id: 'auto', name: 'Room 1' };
            const selectedLocation = 'site';
            const location = { site: 1 };
            const transformedRequest = transformAddRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual(request);
        });
    });

    describe('transformUpdateRequest', () => {
        it('should sanitise the request', () => {
            const request = { floor_id: 2, name: 'Floor 2', asset_count: 1, rooms: [] };
            const selectedLocation = 'floor';
            const location = { building: 3, floor: 2, room: 1 };
            const transformedRequest = transformUpdateRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual({ name: 'Floor 2', floor_building_id: 3, floor_id: 2 });
        });

        it('should return the request as is if there is no previous key', () => {
            const request = { room_id: 1, name: 'Room 1' };
            const selectedLocation = 'site';
            const location = { site: 1 };
            const transformedRequest = transformUpdateRequest({ request, selectedLocation, location });
            expect(transformedRequest).toEqual(request);
        });
    });
});

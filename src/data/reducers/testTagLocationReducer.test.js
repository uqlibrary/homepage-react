import testTagLocationReducer, { initialState } from './testTagLocationReducer';
import * as actions from '../actions/actionTypes';

describe('testTagLocationReducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    describe('floors', () => {
        it('should set onLoad status flags to loading when loading floor data', () => {
            const test = testTagLocationReducer(emptyState, { type: actions.TESTTAG_FLOOR_LIST_LOADING });
            expect(test).toEqual({
                ...emptyState,
                floorList: null,
                floorListLoaded: false,
                floorListLoading: true,
                floorListError: null,
                roomList: null,
                roomListLoaded: false,
                roomListLoading: false,
                roomListError: null,
            });
        });

        it('should set floor values when successfully loaded', () => {
            const test = testTagLocationReducer(emptyState, {
                type: actions.TESTTAG_FLOOR_LIST_LOADED,
                payload: mockTestTagList,
            });
            expect(test).toEqual({
                ...emptyState,

                floorList: mockTestTagList,
                floorListLoading: false,
                floorListLoaded: true,
                floorListError: null,
                roomList: null,
                roomListLoading: false,
                roomListLoaded: false,
                roomListError: null,
            });
        });

        it('should handle a failing floor API call', () => {
            const test = testTagLocationReducer(emptyState, {
                type: actions.TESTTAG_FLOOR_LIST_FAILED,
                payload: 'failed!',
            });
            expect(test).toEqual({
                ...emptyState,
                floorList: null,
                floorListLoading: false,
                floorListLoaded: false,
                floorListError: 'failed!',
                roomList: null,
                roomListLoading: false,
                roomListLoaded: false,
                roomListError: null,
            });
        });

        it('should handle clearing the floors', () => {
            const test = testTagLocationReducer(emptyState, { type: actions.TESTTAG_FLOOR_LIST_CLEAR });
            expect(test).toEqual({
                ...emptyState,
            });
        });
    });

    describe('rooms', () => {
        it('should set onLoad status flags to loading when loading room data', () => {
            const test = testTagLocationReducer(emptyState, { type: actions.TESTTAG_ROOM_LIST_LOADING });
            expect(test).toEqual({
                ...emptyState,
                floorList: null,
                floorListLoading: false,
                floorListLoaded: false,
                floorListError: null,
                roomList: null,
                roomListLoading: true,
                roomListLoaded: false,
                roomListError: null,
            });
        });

        it('should set room values when successfully loaded', () => {
            const test = testTagLocationReducer(emptyState, {
                type: actions.TESTTAG_ROOM_LIST_LOADED,
                payload: mockTestTagList,
            });
            expect(test).toEqual({
                ...emptyState,

                floorList: null,
                floorListLoading: false,
                floorListLoaded: false,
                floorListError: null,
                roomList: mockTestTagList,
                roomListLoading: false,
                roomListLoaded: true,
                roomListError: null,
            });
        });

        it('should handle a failing room API call', () => {
            const test = testTagLocationReducer(emptyState, {
                type: actions.TESTTAG_ROOM_LIST_FAILED,
                payload: 'failed!',
            });
            expect(test).toEqual({
                ...emptyState,
                floorList: null,
                floorListLoading: false,
                floorListLoaded: false,
                floorListError: null,
                roomList: null,
                roomListLoading: false,
                roomListLoaded: false,
                roomListError: 'failed!',
            });
        });

        it('should handle clearing the rooms', () => {
            const test = testTagLocationReducer(emptyState, { type: actions.TESTTAG_ROOM_LIST_CLEAR });
            expect(test).toEqual({
                ...emptyState,
            });
        });
    });
});

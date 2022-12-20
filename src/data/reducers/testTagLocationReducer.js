import * as actions from 'data/actions/actionTypes';

export const initialState = {
    floorList: null,
    floorListLoading: false,
    floorListError: null,
    roomList: null,
    roomListLoading: false,
    roomListError: null,
};

const handlers = {
    [actions.TESTTAG_FLOOR_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        floorListLoading: true,
        floorListError: false,
    }),
    [actions.TESTTAG_FLOOR_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            floorListLoading: false,
            floorListError: false,
            floorList: action.payload,
        };
    },
    [actions.TESTTAG_FLOOR_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        floorListLoading: false,
        floorListError: action.payload,
    }),
    [actions.TESTTAG_FLOOR_LIST_CLEAR]: () => ({
        ...initialState,
    }),
    [actions.TESTTAG_ROOM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        roomListLoading: true,
        roomListError: false,
    }),
    [actions.TESTTAG_ROOM_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            roomListLoading: false,
            roomListError: false,
            roomList: action.payload,
        };
    },
    [actions.TESTTAG_ROOM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        roomListLoading: false,
        roomListError: action.payload,
    }),
    [actions.TESTTAG_ROOM_LIST_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagLocationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

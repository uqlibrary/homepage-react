import * as actions from 'data/actions/actionTypes';

export const initialState = {
    siteList: null,
    siteListLoading: false,
    siteListLoaded: false,
    siteListError: null,
    buildingList: null,
    buildingListLoading: false,
    buildingListLoaded: false,
    buildingListError: null,
    floorList: null,
    floorListLoading: false,
    floorListLoaded: false,
    floorListError: null,
    roomList: null,
    roomListLoading: false,
    roomListLoaded: false,
    roomListError: null,
};

const handlers = {
    [actions.TESTTAG_SITE_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        siteListLoading: true,
        siteListLoaded: false,
        siteListError: null,
    }),
    [actions.TESTTAG_SITE_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        siteListLoading: false,
        siteListLoaded: true,
        siteListError: null,
        siteList: action.payload,
    }),
    [actions.TESTTAG_SITE_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        siteListLoading: false,
        siteListLoaded: false,
        siteListError: action.payload,
    }),
    [actions.TESTTAG_SITE_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        siteListError: null,
    }),
    [actions.TESTTAG_SITE_LIST_CLEAR]: () => ({
        ...initialState,
    }),

    [actions.TESTTAG_BUILDING_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        buildingListLoading: true,
        buildingListLoaded: false,
        buildingListError: null,
    }),
    [actions.TESTTAG_BUILDING_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            buildingListLoading: false,
            buildingListError: null,
            buildingListLoaded: true,
            buildingList: action.payload,
        };
    },
    [actions.TESTTAG_BUILDING_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        buildingListLoading: false,
        buildingListLoaded: false,
        buildingListError: action.payload,
    }),
    [actions.TESTTAG_BUILDING_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        roomListError: null,
    }),
    [actions.TESTTAG_BUILDING_LIST_CLEAR]: state => ({
        ...initialState,
        ...state,
        buildingListLoading: false,
        buildingListLoaded: false,
        buildingListError: null,
        buildingList: null,
    }),

    [actions.TESTTAG_FLOOR_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        floorListLoading: true,
        floorListLoaded: false,
        floorListError: null,
    }),
    [actions.TESTTAG_FLOOR_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            floorListLoading: false,
            floorListLoaded: true,
            floorListError: null,
            floorList: action.payload,
        };
    },
    [actions.TESTTAG_FLOOR_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        floorListLoading: false,
        floorListLoaded: false,
        floorListError: action.payload,
    }),
    [actions.TESTTAG_FLOOR_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        floorListError: null,
    }),
    [actions.TESTTAG_FLOOR_LIST_CLEAR]: state => ({
        ...initialState,
        ...state,

        floorList: null,
        floorListLoading: false,
        floorListLoaded: false,
        floorListError: null,
        roomList: null,
        roomListLoading: false,
        roomListLoaded: false,
        roomListError: null,
    }),

    [actions.TESTTAG_ROOM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        roomListLoading: true,
        roomListLoaded: false,
        roomListError: null,
    }),
    [actions.TESTTAG_ROOM_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            roomListLoading: false,
            roomListLoaded: true,
            roomListError: null,
            roomList: action.payload,
        };
    },
    [actions.TESTTAG_ROOM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        roomListLoading: false,
        roomListLoaded: false,
        roomListError: action.payload,
    }),
    [actions.TESTTAG_ROOM_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        roomListError: null,
    }),
    [actions.TESTTAG_ROOM_LIST_CLEAR]: state => ({
        ...initialState,
        ...state,

        roomList: null,
        roomListLoading: false,
        roomListLoaded: false,
        roomListError: null,
    }),
};

export default function testTagLocationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

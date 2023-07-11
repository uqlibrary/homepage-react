import * as actions from 'data/actions/actionTypes';

export const initialState = {
    assetsList: [],
    assetsListLoading: false,
    assetsListError: null,
    assetsMineList: [],
    assetsMineListLoading: false,
    assetsMineListError: null,
};

const handlers = {
    [actions.TESTTAG_ASSETS_LOADING]: state => ({
        ...initialState,
        ...state,
        assetsListLoading: true,
        assetsListError: false,
    }),
    [actions.TESTTAG_ASSETS_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            assetsListLoading: false,
            assetsListError: false,
            assetsList: action.payload,
        };
    },
    [actions.TESTTAG_ASSETS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetsListLoading: false,
        assetsListError: action.payload,
    }),
    [actions.TESTTAG_ASSETS_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        assetsListError: null,
    }),

    [actions.TESTTAG_ASSETS_CLEAR]: () => ({
        ...initialState,
    }),

    // MINE
    [actions.TESTTAG_ASSETS_MINE_LOADING]: state => ({
        ...initialState,
        ...state,
        assetsMineListLoading: true,
        assetsMineListError: false,
    }),
    [actions.TESTTAG_ASSETS_MINE_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            assetsMineListLoading: false,
            assetsMineListError: false,
            assetsMineList: action.payload,
        };
    },
    [actions.TESTTAG_ASSETS_MINE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetsMineListLoading: false,
        assetsMineListError: action.payload,
    }),
    [actions.TESTTAG_ASSETS_MINE_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        assetsMineListError: null,
    }),
    [actions.TESTTAG_ASSETS_MINE_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagAssetsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

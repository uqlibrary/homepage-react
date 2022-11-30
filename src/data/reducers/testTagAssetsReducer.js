import * as actions from 'data/actions/actionTypes';

export const initialState = {
    assetsList: [],
    assetsListLoading: false,
    assetsListError: null,
};

const handlers = {
    [actions.TESTTAG_ASSETS_LOADING]: state => ({
        ...initialState,
        ...state,
        assetsListLoading: true,
        assetsListError: false,
    }),
    [actions.TESTTAG_ASSETS_LOADED]: (state, action) => {
        console.log('SITE ACTION', action);
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
    [actions.TESTTAG_ASSETS_CLEAR]: () => ({
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

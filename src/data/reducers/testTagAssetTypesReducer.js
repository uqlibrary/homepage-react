import * as actions from 'data/actions/actionTypes';

export const initialState = {
    assetTypesList: [],
    assetTypesListLoading: false,
    assetTypesListError: null,
};

const handlers = {
    [actions.TESTTAG_ASSET_TYPES_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: true,
        assetTypesListError: false,
    }),
    [actions.TESTTAG_ASSET_TYPES_LIST_LOADED]: (state, action) => {
        console.log('PAYLOAD', action.payload);
        return {
            ...initialState,
            ...state,
            assetTypesListLoading: false,
            assetTypesListError: false,
            assetTypesList: action.payload,
        };
    },
    [actions.TESTTAG_ASSET_TYPES_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: action.payload,
    }),
    [actions.TESTTAG_ASSET_TYPES_SAVING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: true,
        assetTypesListError: false,
    }),
};

export default function testTagAssetTypesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

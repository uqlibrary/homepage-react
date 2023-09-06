import * as actions from 'data/actions/actionTypes';

export const initialState = {
    saveAssetTypeSaving: false,
    saveAssetTypeSuccess: null,
    saveAssetTypeError: null,
};

const handlers = {
    [actions.TESTTAG_SAVE_ASSET_TYPE_SAVING]: state => ({
        ...initialState,
        ...state,
        saveAssetTypeSaving: true,
        saveAssetTypeSuccess: null,
        saveAssetTypeError: null,
    }),
    [actions.TESTTAG_SAVE_ASSET_TYPE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        saveAssetTypeSaving: false,
        saveAssetTypeSuccess: action.payload,
        saveAssetTypeError: null,
    }),
    [actions.TESTTAG_SAVE_ASSET_TYPE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        saveAssetTypeSaving: false,
        saveAssetTypeSuccess: null,
        saveAssetTypeError: action.payload,
    }),
    [actions.TESTTAG_SAVE_ASSET_TYPE_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        saveAssetTypeError: null,
    }),
    [actions.TESTTAG_SAVE_ASSET_TYPE_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagSaveAssetTypeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

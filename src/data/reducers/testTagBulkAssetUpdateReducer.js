import * as actions from 'data/actions/actionTypes';

export const initialState = {
    bulkAssetUpdateSaving: false,
    bulkAssetUpdateSuccess: null,
    bulkAssetUpdateError: null,
};

const handlers = {
    [actions.TESTTAG_BULK_ASSET_UPDATE_SAVING]: state => ({
        ...initialState,
        ...state,
        bulkAssetUpdateSaving: true,
        bulkAssetUpdateSuccess: null,
        bulkAssetUpdateError: null,
    }),
    // eslint-disable-next-line no-unused-vars
    [actions.TESTTAG_BULK_ASSET_UPDATE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        bulkAssetUpdateSaving: false,
        bulkAssetUpdateSuccess: action.payload,
        bulkAssetUpdateError: null,
    }),
    [actions.TESTTAG_BULK_ASSET_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bulkAssetUpdateSaving: false,
        bulkAssetUpdateSuccess: null,
        bulkAssetUpdateError: action.payload,
    }),
    [actions.TESTTAG_BULK_ASSET_UPDATE_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagBulkAssetUpdateReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

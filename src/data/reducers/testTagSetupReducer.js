import * as actions from 'data/actions/actionTypes';

export const initialState = {
    testDevices: null,
    testDevicesLoading: false,
    testDevicesError: null,
    assetTypes: null,
    assetTypesLoading: false,
    assetTypesError: null,
};

const handlers = {
    [actions.TESTTAG_TEST_DEVICES_LOADING]: state => ({
        ...initialState,
        ...state,
        testDevicesLoading: true,
        testDevicesError: false,
    }),
    [actions.TESTTAG_TEST_DEVICES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        testDevicesLoading: false,
        testDevicesError: false,
        testDevices: action.payload,
    }),
    [actions.TESTTAG_TEST_DEVICES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        testDevicesLoading: false,
        testDevicesError: action.payload,
    }),
    [actions.TESTTAG_TEST_DEVICES_CLEAR]: () => ({
        ...initialState,
    }),
    [actions.TESTTAG_ASSET_TYPES_LOADING]: state => ({
        ...initialState,
        ...state,
        assetTypesLoading: true,
        assetTypesError: false,
    }),
    [actions.TESTTAG_ASSET_TYPES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        assetTypesLoading: false,
        assetTypesError: false,
        assetTypes: action.payload,
    }),
    [actions.TESTTAG_ASSET_TYPES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetTypesLoading: false,
        assetTypesError: action.payload,
    }),
    [actions.TESTTAG_ASSET_TYPES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagSetupReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

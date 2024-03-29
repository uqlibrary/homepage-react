import * as actions from 'data/actions/actionTypes';

export const initialState = {
    inspectionDevices: [],
    inspectionDevicesLoading: false,
    inspectionDevicesLoaded: false,
    inspectionDevicesError: null,
};

const handlers = {
    [actions.TESTTAG_INSPECTION_DEVICES_LOADING]: state => ({
        ...initialState,
        ...state,
        inspectionDevicesLoading: true,
        inspectionDevicesLoaded: false,
        inspectionDevicesError: null,
    }),
    [actions.TESTTAG_INSPECTION_DEVICES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionDevicesLoading: false,
        inspectionDevicesLoaded: true,
        inspectionDevicesError: false,
        inspectionDevices: action.payload,
    }),
    [actions.TESTTAG_INSPECTION_DEVICES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionDevicesLoading: false,
        inspectionDevicesLoaded: false,
        inspectionDevicesError: action.payload,
    }),
    [actions.TESTTAG_INSPECTION_DEVICES_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        inspectionDevicesError: null,
    }),
    [actions.TESTTAG_INSPECTION_DEVICES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagInspectionDevicesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

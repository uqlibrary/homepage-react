import * as actions from 'data/actions/actionTypes';

export const initialState = {
    inspectionConfig: null,
    inspectionConfigLoading: false,
    inspectionConfigError: null,
};

const handlers = {
    [actions.TESTTAG_INSPECTION_CONFIG_LOADING]: state => ({
        ...initialState,
        ...state,
        inspectionConfigLoading: true,
        inspectionConfigError: false,
    }),
    [actions.TESTTAG_INSPECTION_CONFIG_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionConfigLoading: false,
        inspectionConfigError: false,
        inspectionConfig: action.payload,
    }),
    [actions.TESTTAG_INSPECTION_CONFIG_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionConfigLoading: false,
        inspectionConfigError: action.payload,
    }),
    [actions.TESTTAG_INSPECTION_CONFIG_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagOnLoadInspectionReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

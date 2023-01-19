import * as actions from 'data/actions/actionTypes';

export const initialState = {
    initConfig: null,
    initConfigLoading: false,
    initConfigError: null,
};

const handlers = {
    [actions.TESTTAG_CONFIG_LOADING]: state => ({
        ...initialState,
        ...state,
        initConfigLoading: true,
        initConfigError: false,
    }),
    [actions.TESTTAG_CONFIG_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        initConfigLoading: false,
        initConfigError: false,
        initConfig: action.payload,
    }),
    [actions.TESTTAG_CONFIG_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        initConfigLoading: false,
        initConfigError: action.payload,
    }),
    [actions.TESTTAG_CONFIG_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagOnLoadReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

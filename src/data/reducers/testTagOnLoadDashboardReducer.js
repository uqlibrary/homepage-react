import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dashboardConfig: null,
    dashboardConfigLoading: false,
    dashboardConfigLoaded: false,
    dashboardConfigError: null,
};

const handlers = {
    [actions.TESTTAG_DASHBOARD_CONFIG_LOADING]: state => ({
        ...initialState,
        ...state,
        dashboardConfigLoading: true,
        dashboardConfigLoaded: false,
        dashboardConfigError: false,
    }),
    [actions.TESTTAG_DASHBOARD_CONFIG_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dashboardConfigLoading: false,
        dashboardConfigLoaded: true,
        dashboardConfigError: false,
        dashboardConfig: action.payload,
    }),
    [actions.TESTTAG_DASHBOARD_CONFIG_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dashboardConfigLoading: false,
        dashboardConfigLoaded: false,
        dashboardConfigError: action.payload,
    }),
};

export default function testTagOnLoadDashboardReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

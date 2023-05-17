import * as actions from 'data/actions/actionTypes';

export const initialState = {
    initDashboard: null,
    initDashboardLoading: false,
    initDashboardLoaded: false,
    initDashboardError: null,
};

const handlers = {
    [actions.TESTTAG_DASHBOARD_CONFIG_LOADING]: state => ({
        ...initialState,
        ...state,
        initDashboardLoading: true,
        initDashboardLoaded: false,
        initDashboardError: false,
    }),
    [actions.TESTTAG_DASHBOARD_CONFIG_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        initDashboardLoading: false,
        initDashboardLoaded: true,
        initDashboardError: false,
        initDashboard: action.payload,
    }),
    [actions.TESTTAG_DASHBOARD_CONFIG_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        initDashboardLoading: false,
        initDashboardLoaded: false,
        initDashboardError: action.payload,
    }),
};

export default function testTagOnLoadDashboardReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

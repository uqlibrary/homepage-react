import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorDashboardData: null,
    dlorDashboardLoading: null,
    dlorDashboardError: null,
};

const handlers = {
    [actions.DLOR_DASHBOARD_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorDashboardLoading: true,
        dlorDashboardError: false,
    }),
    [actions.DLOR_DASHBOARD_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorDashboardLoading: false,
        dlorDashboardError: false,
        dlorDashboardData: action.payload,
    }),
    [actions.DLOR_DASHBOARD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorDashboardLoading: false,
        dlorDashboardError: action.payload,
    }),
};

export default function dlorDashboardReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

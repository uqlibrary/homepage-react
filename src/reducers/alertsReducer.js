import * as actions from 'actions/actionTypes';

export const initialState = {
    alert: null,
    alerts: null,
    alertsLoading: false,
    alertsError: null,
};

const handlers = {
    [actions.ALERTS_LOADING]: state => ({
        ...initialState,
        ...state,
        alertsLoading: true,
        alertsError: false,
    }),
    [actions.ALERT_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        alertsLoading: false,
        alertsError: false,
        alert: action.payload,
        alerts: null,
    }),
    [actions.ALERTS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        alertsLoading: false,
        alertsError: false,
        alerts: action.payload,
        alert: null,
    }),
    [actions.ALERTS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        alertsLoading: false,
        alertsError: action.payload,
    }),
    [actions.ALERTS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function alertsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

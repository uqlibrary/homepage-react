import * as actions from 'actions/actionTypes';

export const initialState = {
    alerts: null,
    alertsLoading: null,
    alertsError: null,
};

const handlers = {
    [actions.ALERTS_LOADING]: state => ({
        ...initialState,
        ...state,
        alertsLoading: true,
        alertsError: false,
    }),
    [actions.ALERTS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        alertsLoading: false,
        alertsError: false,
        alerts: action.payload,
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
    console.log(
        'alertsReducer: ',
        action.type,
        ' - state = ',
        state,
        '; action = ',
        action,
        '; handler = ',
        handler(state, action),
    );
    return handler(state, action);
}

import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorSchedule: [],
    dlorScheduleLoading: false,
    dlorScheduleError: false,
};

const handlers = {
    [actions.DLOR_SCHEDULE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorScheduleLoading: true,
        dlorScheduleError: false,
    }),
    [actions.DLOR_SCHEDULE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorScheduleLoading: false,
        dlorScheduleError: false,
        dlorSchedule: action.payload,
    }),
    [actions.DLOR_SCHEDULE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorScheduleLoading: false,
        dlorScheduleError: action.payload,
    }),
};

export default function dlorScheduleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

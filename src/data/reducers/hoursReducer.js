import * as actions from 'data/actions/actionTypes';

export const initialState = {
    libHours: null,
    libHoursLoading: null, // ternary: null = 'not started'; true = 'underway'; false = 'complete'
    libHoursError: null,
};

const handlers = {
    [actions.LIB_HOURS_LOADING]: state => ({
        ...state,
        libHours: null,
        libHoursLoading: true,
        libHoursError: false,
    }),

    [actions.LIB_HOURS_LOADED]: (state, action) => ({
        ...state,
        libHours: action.payload,
        libHoursLoading: false,
        libHoursError: false,
    }),

    [actions.LIB_HOURS_FAILED]: state => ({
        ...state,
        libHours: null,
        libHoursLoading: false,
        libHoursError: true,
    }),
};

export default function hoursReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

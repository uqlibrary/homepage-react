import * as actions from 'data/actions/actionTypes';

export const initialState = {
    weeklyHours: null,
    weeklyHoursLoading: null,
    weeklyHoursError: null,
};

const handlers = {
    [actions.WEEKLYHOURS_LOADING]: state => ({
        ...initialState,
        ...state,
        weeklyHoursLoading: true,
        weeklyHoursError: false,
    }),
    [actions.WEEKLYHOURS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        weeklyHours: action.payload,
    }),
    [actions.WEEKLYHOURS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        weeklyHoursLoading: false,
        weeklyHoursError: action.payload,
    }),
    // [actions.WEEKLYHOURS_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function weeklyHoursReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

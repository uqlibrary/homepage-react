import * as actions from 'data/actions/actionTypes';

export const initialState = {
    account: null,
    author: null,
    accountLoading: null, // ternary: null = 'not started'; true = 'underway'; false = 'complete'
    accountAuthorLoading: null,
    isSessionExpired: null,
};

export const initSavingState = {
    accountAuthorSaving: false,
    accountAuthorError: null,
};

const handlers = {
    [actions.CURRENT_ACCOUNT_LOADING]: () => ({
        ...initialState,
        ...initSavingState,
        accountLoading: true,
    }),

    [actions.CURRENT_ACCOUNT_LOADED]: (state, action) => ({
        ...state,
        accountLoading: false,
        account: action.payload,
    }),

    [actions.CURRENT_ACCOUNT_ANONYMOUS]: () => ({
        ...initialState,
        ...initSavingState,
        account: null,
        accountLoading: false,
        accountAuthorLoading: false,
    }),

    [actions.CURRENT_AUTHOR_FAILED]: state => ({
        ...state,
        accountLoading: false,
        author: null,
        accountAuthorLoading: false,
    }),

    [actions.CURRENT_AUTHOR_LOADED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorLoading: false,
    }),

    [actions.CURRENT_AUTHOR_LOADING]: state => ({
        ...state,
        author: null,
        accountAuthorLoading: true,
    }),

    [actions.CURRENT_AUTHOR_SAVING]: state => ({
        ...state,
        accountAuthorSaving: true,
        accountAuthorError: null,
    }),

    [actions.CURRENT_AUTHOR_SAVE_FAILED]: (state, action) => ({
        ...state,
        accountAuthorSaving: false,
        accountAuthorError: action.payload,
    }),

    [actions.CURRENT_AUTHOR_SAVE_RESET]: state => ({
        ...state,
        ...initSavingState,
    }),

    [actions.CURRENT_AUTHOR_SAVED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorSaving: false,
        accountAuthorError: null,
    }),

    [actions.CURRENT_ACCOUNT_SESSION_EXPIRED]: state => ({
        ...state,
        isSessionExpired: true,
    }),

    [actions.CURRENT_ACCOUNT_SESSION_VALID]: state => ({
        ...state,
        isSessionExpired: false,
    }),

    [actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG]: state => ({
        ...state,
        isSessionExpired: null,
    }),

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

    [actions.VEMCOUNT_LOADING]: state => ({
        ...state,
        vemcount: null,
        vemcountLoading: true,
        vemcountError: false,
    }),

    [actions.VEMCOUNT_LOADED]: (state, action) => ({
        ...state,
        vemcount: action.payload,
        vemcountLoading: false,
        vemcountError: false,
    }),

    [actions.VEMCOUNT_FAILED]: state => ({
        ...state,
        vemcount: null,
        vemcountLoading: false,
        vemcountError: true,
    }),

    // Training
    [actions.TRAINING_LOADING]: state => ({
        ...state,
        trainingEvents: null,
        trainingEventsLoading: true,
        trainingEventsError: false,
    }),

    [actions.TRAINING_LOADED]: (state, action) => ({
        ...state,
        trainingEvents: action.payload,
        trainingEventsLoading: false,
        trainingEventsError: false,
    }),

    [actions.TRAINING_FAILED]: state => ({
        ...state,
        trainingEvents: null,
        trainingEventsLoading: false,
        trainingEventsError: true,
    }),
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

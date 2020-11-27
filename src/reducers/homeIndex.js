import * as actions from 'actions/actionTypes';

export const initialState = {
    spotlights: null,
    spotlightsLoading: null,
    spotlightsError: null,
    printBalance: null,
    printBalanceLoading: null,
    loans: null,
    loansLoading: null,
};

const handlers = {
    [actions.SPOTLIGHTS_LOADING]: state => ({
        ...state,
        spotlightsLoading: true,
    }),

    [actions.SPOTLIGHTS_LOADED]: (state, action) => ({
        ...state,
        spotlights: action.payload,
        spotlightsLoading: false,
    }),

    [actions.SPOTLIGHTS_FAILED]: (state, action) => ({
        ...state,
        spotlightsLoading: false,
        spotlightsError: action.payload,
    }),

    // Print balance
    [actions.PRINT_BALANCE_LOADING]: state => ({
        ...state,
        printBalance: null,
        printBalanceLoading: true,
    }),

    [actions.PRINT_BALANCE_LOADED]: (state, action) => ({
        ...state,
        printBalance: action.payload,
        printBalanceLoading: false,
    }),

    [actions.PRINT_BALANCE_FAILED]: state => ({
        ...state,
        printBalance: null,
        printBalanceLoading: false,
    }),

    // Loans
    [actions.LOANS_LOADING]: state => ({
        ...state,
        loans: null,
        loansLoading: true,
    }),

    [actions.LOANS_LOADED]: (state, action) => ({
        ...state,
        loans: action.payload,
        loansLoading: false,
    }),

    [actions.LOANS_FAILED]: state => ({
        ...state,
        loans: null,
        loansLoading: false,
    }),
};

export default function homeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

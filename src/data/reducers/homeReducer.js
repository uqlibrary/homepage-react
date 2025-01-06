import * as actions from 'data/actions/actionTypes';

export const initialState = {
    printBalance: null,
    printBalanceLoading: null,
    loans: null,
    loansLoading: null,
    possibleRecords: null,
    possibleRecordsLoading: null,
    incompleteNTRO: null,
    incompleteNTROLoading: null,
};

const handlers = {
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

    // Possible publications in eSpace
    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING]: state => ({
        ...state,
        possibleRecords: null,
        possibleRecordsLoading: true,
    }),

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED]: (state, action) => ({
        ...state,
        possibleRecords: action.payload,
        possibleRecordsLoading: false,
    }),

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED]: state => ({
        ...state,
        possibleRecords: null,
        possibleRecordsLoading: false,
    }),

    // Incomplete NTRO publications in eSpace
    [actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADING]: state => ({
        ...state,
        incompleteNTRO: null,
        incompleteNTROLoading: true,
    }),

    [actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADED]: (state, action) => ({
        ...state,
        incompleteNTRO: action.payload,
        incompleteNTROLoading: false,
    }),

    [actions.INCOMPLETE_NTRO_PUBLICATIONS_FAILED]: state => ({
        ...state,
        incompleteNTRO: null,
        incompleteNTROLoading: false,
    }),
};

export default function homeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

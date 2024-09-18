import * as actions from 'data/actions/actionTypes';

export const initialState = {
    possibleRecords: null,
    possibleRecordsLoading: null,
    incompleteNTRO: null,
    incompleteNTROLoading: null,
};

const handlers = {
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
    console.log('homeReducer ', action.type, state, !!action.payload && action.payload);
    return handler(state, action);
}

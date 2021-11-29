import * as actions from 'actions/actionTypes';

export const initialState = {
    spotlights: null,
    spotlightsLoading: null,
    spotlightsError: null,
};

const handlers = {
    [actions.SPOTLIGHTS_LOADING]: state => ({
        ...initialState,
        ...state,
        spotlightsLoading: true,
        spotlightsError: false,
    }),
    [actions.SPOTLIGHTS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightsLoading: false,
        spotlightsError: false,
        spotlights: action.payload,
    }),
    [actions.SPOTLIGHTS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightsLoading: false,
        spotlightsError: action.payload,
    }),
    [actions.SPOTLIGHTS_DELETION_SUCCESS]: (state, action) => ({
        ...initialState,
        // ...state,
        spotlightsLoading: false,
        spotlightsError: false,
        // set of spotlights requested for deletion returned as payload
        spotlights: state.spotlights.filter(s => !action.payload.find(r => r === s.id)),
    }),
    [actions.SPOTLIGHTS_DELETION_FAILED]: action => ({
        ...initialState,
        spotlightsLoading: false,
        spotlightsError: { ...action.payload, errorType: 'deletion' },
    }),
    [actions.SPOTLIGHTS_BATCHUPDATE_UNDERWAY]: state => ({
        ...initialState,
        ...state,
        spotlightsLoading: true,
        spotlightsError: false,
    }),
    [actions.SPOTLIGHTS_BATCHUPDATE_SUCCEEDED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightsLoading: false,
        spotlightsError: false,
        // set of spotlights reweighted returned as payload
        spotlights: state.spotlights.map(s => action.payload.find(r => r === s.id) || s),
    }),
    [actions.SPOTLIGHTS_BATCHUPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightsLoading: false,
        spotlightsError: action.payload,
    }),
    [actions.SPOTLIGHTS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function spotlightsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(
        'spotlightsReducer: ',
        action.type,
        '\n',
        '- state before = ',
        state,
        '\n',
        '- action = ',
        action,
        '\n',
        '- handler (state after) = ',
        handler(state, action),
    );
    return handler(state, action);
}

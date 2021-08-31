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

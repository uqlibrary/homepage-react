import * as actions from 'actions/actionTypes';

export const initialState = {
    currentSpotlights: null,
    currentSpotlightsLoading: null,
    currentSpotlightsError: null,
};

const handlers = {
    [actions.SPOTLIGHTS_CURRENT_LOADING]: state => ({
        ...state,
        currentSpotlightsLoading: true,
    }),

    [actions.SPOTLIGHTS_CURRENT_LOADED]: (state, action) => ({
        ...state,
        currentSpotlights: action.payload,
        currentSpotlightsLoading: false,
    }),

    [actions.SPOTLIGHTS_CURRENT_FAILED]: (state, action) => ({
        ...state,
        currentSpotlightsLoading: false,
        currentSpotlightsError: action.payload,
    }),
};

export default function spotlightsCurrentReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(
        'spotlightsCurrentReducer: ',
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
    console.log(action.payload);
    return handler(state, action);
}

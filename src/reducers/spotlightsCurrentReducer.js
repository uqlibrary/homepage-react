import * as actions from 'actions/actionTypes';

export const initialState = {
    currentSpotlights: null,
    currentSpotlightsLoading: null,
    currentSpotlightsError: null,
};

const handlers = {
    [actions.SPOTLIGHTS_HOMEPAGE_LOADING]: state => ({
        ...state,
        currentSpotlightsLoading: true,
    }),

    [actions.SPOTLIGHTS_HOMEPAGE_LOADED]: (state, action) => ({
        ...state,
        currentSpotlights: action.payload,
        currentSpotlightsLoading: false,
    }),

    [actions.SPOTLIGHTS_HOMEPAGE_FAILED]: (state, action) => ({
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
    return handler(state, action);
}

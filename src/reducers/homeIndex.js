import * as actions from 'actions/actionTypes';

export const initialState = {
    spotlights: null,
    spotlightsLoading: null,
    spotlightsError: null,
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
};

export default function homeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

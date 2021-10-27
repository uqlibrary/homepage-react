import * as actions from 'actions/actionTypes';

export const initialState = {
    spotlightsReweightingStatus: null,
    spotlightsError: null,
};

const handlers = {
    [actions.SPOTLIGHT_REWEIGHTING_UNDERWAY]: state => ({
        ...initialState,
        ...state,
        spotlightsReweightingStatus: 'underway',
        spotlightsError: false,
    }),
    [actions.SPOTLIGHT_REWEIGHTING_SUCCEEDED]: state => ({
        ...initialState,
        ...state,
        spotlightsReweightingStatus: 'complete',
        spotlightsError: false,
    }),
    [actions.SPOTLIGHTS_REWEIGHTING_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightsReweightingStatus: 'complete',
        spotlightsError: action.payload,
    }),
    [actions.SPOTLIGHTS_REWEIGHTING_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function spotlightReweightReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(
        'spotlightReweightReducer: ',
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

import * as actions from 'actions/actionTypes';

export const initialState = {
    spotlight: null,
    spotlightStatus: null,
    spotlightError: null,
};

const handlers = {
    [actions.SPOTLIGHT_LOADING]: state => ({
        ...initialState,
        ...state,
        spotlightStatus: 'loading',
        spotlightError: false,
    }),
    [actions.SPOTLIGHT_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightError: false,
        spotlight: action.payload,
        spotlightStatus: 'loaded',
    }),
    [actions.SPOTLIGHT_SAVING]: state => ({
        ...initialState,
        ...state,
        spotlightStatus: 'saving',
        spotlightError: false,
    }),
    [actions.SPOTLIGHT_SAVED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightError: false,
        spotlight: action.payload,
        spotlightStatus: 'saved',
    }),
    [actions.SPOTLIGHT_CREATED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightError: false,
        spotlight: action.payload,
        spotlightStatus: 'created',
    }),
    [actions.SPOTLIGHT_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightError: false,
        spotlight: action.payload,
        spotlightStatus: 'deleted',
    }),
    [actions.SPOTLIGHT_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spotlightStatus: 'error',
        spotlightError: action.payload,
    }),
    [actions.SPOTLIGHT_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function spotlightReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(
        'spotlightReducer: ',
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

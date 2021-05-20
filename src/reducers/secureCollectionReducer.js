import * as actions from 'actions/actionTypes';

export const initialState = {
    secureCollection: null,
    secureCollectionLoading: false,
    secureCollectionError: null,
};

const handlers = {
    [actions.SECURE_COLLECTION_LOADING]: state => ({
        ...initialState,
        ...state,
        secureCollectionLoading: true,
        secureCollectionError: false,
    }),
    [actions.SECURE_COLLECTION_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionLoading: false,
        secureCollectionError: false,
        secureCollection: action.payload,
    }),
    [actions.SECURE_COLLECTION_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionLoading: false,
        secureCollectionError: action.payload,
    }),
    [actions.SECURE_COLLECTION_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function secureCollectionReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

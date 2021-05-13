import * as actions from 'actions/actionTypes';

export const initialState = {
    secureCollectionCheck: null,
    secureCollectionCheckLoading: false,
    secureCollectionCheckError: null,
};

const handlers = {
    [actions.SECURE_COLLECTION_CHECK_LOADING]: state => ({
        ...initialState,
        ...state,
        secureCollectionCheckLoading: true,
        secureCollectionCheckError: false,
    }),
    [actions.SECURE_COLLECTION_CHECK_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionCheckLoading: false,
        secureCollectionCheckError: false,
        secureCollectionCheck: action.payload,
    }),
    [actions.SECURE_COLLECTION_CHECK_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionCheckLoading: false,
        secureCollectionCheckError: action.payload,
    }),
    [actions.SECURE_COLLECTION_CHECK_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function secureCollectionCheckReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

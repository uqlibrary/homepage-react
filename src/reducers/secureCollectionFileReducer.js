import * as actions from 'actions/actionTypes';

export const initialState = {
    secureCollectionFile: null,
    secureCollectionFileLoading: false,
    secureCollectionFileError: null,
};

const handlers = {
    [actions.SECURE_COLLECTION_FILE_LOADING]: state => ({
        ...initialState,
        ...state,
        secureCollectionFileLoading: true,
        secureCollectionFileError: false,
    }),
    [actions.SECURE_COLLECTION_FILE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionFileLoading: false,
        secureCollectionFileError: false,
        secureCollectionFile: action.payload,
    }),
    [actions.SECURE_COLLECTION_FILE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        secureCollectionFileLoading: false,
        secureCollectionFileError: action.payload,
    }),
    [actions.SECURE_COLLECTION_FILE_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function secureCollectionFileReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

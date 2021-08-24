import * as actions from 'actions/actionTypes';

export const initialState = {
    publicFileUploadResult: null,
    publicFileUploading: false,
    publicFileUploadError: null,
};

const handlers = {
    [actions.PUBLIC_FILE_UPLOADING]: state => ({
        ...initialState,
        ...state,
        publicFileUploading: true,
        publicFileUploadError: false,
    }),
    [actions.PUBLIC_FILE_UPLOADED]: (state, action) => ({
        ...initialState,
        ...state,
        publicFileUploading: false,
        publicFileUploadError: false,
        publicFileUploadResult: action.payload,
    }),
    [actions.PUBLIC_FILE_UPLOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        publicFileUploading: false,
        publicFileUploadResult: action.payload,
        publicFileUploadError: true,
    }),
    [actions.PUBLIC_FILE_UPLOAD_CLEARED]: () => ({
        ...initialState,
    }),
};

export default function publicFileUploadReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('publicFileUploadReducer: ', action.type, ' - state: ', state);
    console.log('publicFileUploadReducer: ', action.type, '; action = ', action);
    console.log('publicFileUploadReducer: ', action.type, '; handler = ', handler(state, action));
    return handler(state, action);
}

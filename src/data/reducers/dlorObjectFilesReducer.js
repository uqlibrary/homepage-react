import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorObjectFileDeleting: false,
    dlorObjectFileDeleted: false,
    dlorObjectFileDeleteError: false,
    dlorObjectFileUploading: false,
    dlorObjectFileUploaded: false,
    dlorObjectFileUploadError: false,
};

const handlers = {
    [actions.DLOR_DELETE_OBJET_FILE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileDeleting: true,
        dlorObjectFileDeleted: false,
        dlorObjectFileDeleteError: false,
    }),
    [actions.DLOR_DELETE_OBJET_FILE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileDeleting: false,
        dlorObjectFileDeleted: true,
        dlorObjectFileDeleteError: false,
    }),
    [actions.DLOR_DELETE_OBJET_FILE_FAILED]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileDeleting: false,
        dlorObjectFileDeleted: false,
        dlorObjectFileDeleteError: true,
    }),
    [actions.DLOR_UPLOAD_OBJET_FILE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileUploading: true,
        dlorObjectFileUploaded: false,
        dlorObjectFileUploadError: false,
    }),
    [actions.DLOR_UPLOAD_OBJET_FILE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileUploading: false,
        dlorObjectFileUploaded: true,
        dlorObjectFileUploadError: false,
    }),
    [actions.DLOR_UPLOAD_OBJET_FILE_FAILED]: state => ({
        ...initialState,
        ...state,
        dlorObjectFileUploading: false,
        dlorObjectFileUploaded: false,
        dlorObjectFileUploadError: true,
    }),
};

export default function dlorObjectFilesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}

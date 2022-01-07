import * as actions from './actionTypes';
import { get, post, destroy } from 'repositories/generic';
import {
    SPOTLIGHT_SAVE_API,
    SPOTLIGHT_CREATE_API,
    SPOTLIGHTS_ALL_API,
    SPOTLIGHT_GET_BY_ID_API,
    UPLOAD_PUBLIC_FILES_API,
    SPOTLIGHT_DELETE_BULK_API,
} from 'repositories/routes';
import { API_URL } from '../config';

export function loadAllSpotlights() {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHTS_CLEAR });
        dispatch({ type: actions.SPOTLIGHTS_LOADING });
        return get(SPOTLIGHTS_ALL_API())
            .then(spotlightsResponse => {
                dispatch({
                    type: actions.SPOTLIGHTS_LOADED,
                    payload: spotlightsResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

function createSpotlight(request, dispatch) {
    /* istanbul ignore next */
    if ('id' in request) {
        // as we are creating a new spotlight there should not be an id field
        delete request.id;
    }
    return post(SPOTLIGHT_CREATE_API(), request)
        .then(data => {
            dispatch({
                type: actions.SPOTLIGHT_CREATED,
                payload: data,
            });
        })
        .catch(error => {
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: error.message,
            });
        });
}

const saveSpotlightChange = (request, dispatch) => {
    /* istanbul ignore next */
    !!request.updated && delete request.updated;
    return post(SPOTLIGHT_SAVE_API({ id: request.id }), request)
        .then(data => {
            dispatch({
                type: actions.SPOTLIGHT_SAVED,
                payload: data,
            });
        })
        .catch(error => {
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: error,
            });
            return Promise.reject(error);
        });
};

export const createSpotlightWithExistingImage = request => {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        return createSpotlight(request, dispatch);
    };
};

export const updateSpotlightWithExistingImage = request => {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_SAVING });
        return saveSpotlightChange(request, dispatch);
    };
};

export const updateSpotlightWithNewImage = (request, spotlightSaveType = 'update') => {
    if (!request.uploadedFile || request.uploadedFile.length === 0) {
        /* istanbul ignore else */
        if (spotlightSaveType === 'create') {
            return createSpotlightWithExistingImage(request);
        } else {
            return updateSpotlightWithExistingImage(request);
        }
    }

    return async dispatch => {
        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        const formData = new FormData();
        request.uploadedFile.map((file, index) => {
            formData.append(`file${index}`, file);
        });
        // do not inspect formData with get, eg not: formData.get('spotlightImage')),
        // it causes webpack not to build, with cryptic errors
        return post(UPLOAD_PUBLIC_FILES_API(), formData)
            .then(response => {
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOADED,
                    payload: response,
                });

                const firstresponse = !!response && response.length > 0 && /* istanbul ignore next */ response.shift();
                const apiProd = 'https://api.library.uq.edu.au/v1/';
                const domain =
                    API_URL === apiProd
                        ? /* istanbul ignore next */ 'app.library.uq.edu.au'
                        : 'app-testing.library.uq.edu.au';
                request.img_url =
                    !!firstresponse &&
                    /* istanbul ignore next */ !!firstresponse.key &&
                    `https://${domain}/file/public/${firstresponse.key}`;

                delete request.uploadedFile;
                if (spotlightSaveType === 'create') {
                    dispatch({ type: actions.SPOTLIGHT_LOADING });
                    return createSpotlight(request, dispatch);
                } else {
                    dispatch({ type: actions.SPOTLIGHT_SAVING });
                    return saveSpotlightChange(request, dispatch);
                }
            })
            .catch(error => {
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOAD_FAILED,
                    payload: error,
                });
            });
    };
};

export const createSpotlightWithNewImage = request => {
    return updateSpotlightWithNewImage(request, 'create');
};

export const deleteSpotlightBatch = request => {
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_SAVING });
        return destroy(SPOTLIGHT_DELETE_BULK_API(), request)
            .then(() => {
                dispatch({
                    type: actions.SPOTLIGHTS_DELETION_SUCCESS,
                    // return the request so we can delete those entry from the display
                    payload: request,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHTS_DELETION_FAILED,
                    payload: error,
                });
            });
    };
};

export function clearSpotlights() {
    return dispatch => {
        dispatch({
            type: actions.SPOTLIGHTS_CLEAR,
        });
    };
}

export function loadASpotlight(spotlightId) {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        return get(SPOTLIGHT_GET_BY_ID_API({ id: spotlightId }))
            .then(data => {
                dispatch({
                    type: actions.SPOTLIGHT_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearASpotlight() {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_CLEAR });
    };
}

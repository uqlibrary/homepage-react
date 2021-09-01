import * as actions from './actionTypes';
import { get, post, destroy } from 'repositories/generic';
import {
    SPOTLIGHT_SAVE_API,
    SPOTLIGHT_CREATE_API,
    SPOTLIGHTS_ALL_API,
    SPOTLIGHT_GET_BY_ID_API,
    SPOTLIGHT_DELETE_API,
    UPLOAD_PUBLIC_FILES_API,
} from 'repositories/routes';
import { API_URL } from '../config';

export function loadAllSpotlights() {
    console.log('action loadAllSpotlights: Loading Spotlights');
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
                console.log('loadAllSpotlights, error = ', error);
                dispatch({
                    type: actions.SPOTLIGHTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

function createSpotlight(request, dispatch) {
    if ('id' in request) {
        // as we are creating a new spotlight there should not be an id field
        delete request.id;
    }
    console.log('createSpotlight: send request: ', request);
    console.log('createSpotlight action, SPOTLIGHT_CREATE_API() = ', SPOTLIGHT_CREATE_API());
    return post(SPOTLIGHT_CREATE_API(), request)
        .then(data => {
            console.log('createSpotlight action, returned data = ', data);
            dispatch({
                type: actions.SPOTLIGHT_SAVED,
                payload: data,
            });
        })
        .catch(error => {
            console.log('createSpotlight action error = ', error);
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: error.message,
            });
        });
}

const saveSpotlightChange = (request, dispatch) => {
    console.log('saveSpotlightChange for request ', request);
    console.log('action saveSpotlightChange action, SPOTLIGHT_SAVE_API() = ', SPOTLIGHT_SAVE_API({ id: request.id }));
    return post(SPOTLIGHT_SAVE_API({ id: request.id }), request)
        .then(data => {
            console.log('saveSpotlightChange action, returned data = ', data);
            dispatch({
                type: actions.SPOTLIGHT_SAVED,
                payload: data,
            });
        })
        .catch(error => {
            console.log('saveSpotlightChange action FAILED, returned: ', error);
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: error,
            });
            return Promise.reject(error);
        });
};

export const saveSpotlightChangeWithoutFile = (request, spotlightSaveType) => {
    console.log('action saveSpotlightChangeWithoutFile, request to save: ', request);
    return dispatch => {
        console.log('actions.SPOTLIGHT_LOADING = ', actions.SPOTLIGHT_LOADING);
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        if (spotlightSaveType === 'create') {
            // possibly this isnt needed? the file should always exist?
            return createSpotlight(request, dispatch);
        } else {
            return saveSpotlightChange(request, dispatch);
        }
    };
};

/*
this is called by both Update and Create to do a fileupload, then the save-the-spotlight action
 */
export const saveSpotlightWithFile = (request, spotlightSaveType) => {
    console.log('action saveSpotlightWithFile, request to save: ', request);

    if (!request.uploadedFile || request.uploadedFile.length === 0) {
        return saveSpotlightChangeWithoutFile(request, spotlightSaveType);
    }

    return async dispatch => {
        console.log('saveSpotlightWithFile: post data: ', request.uploadedFile);

        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        const formData = new FormData();
        request.uploadedFile.map((file, index) => {
            formData.append(`file${index}`, file);
        });
        // do not inspect formData with get, eg not: formData.get('spotlightImage')),
        // it causes webpack not to build, with cryptic errors
        return post(UPLOAD_PUBLIC_FILES_API(), formData)
            .then(response => {
                console.log('uploadPublicFile got response ', response);
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOADED,
                    payload: response,
                });

                const firstresponse = !!response && response.length > 0 && response.shift();
                const apiProd = 'https://api.library.uq.edu.au/v1/';
                const domain = API_URL === apiProd ? 'app.library.uq.edu.au' : 'app-testing.library.uq.edu.au';
                request.img_url =
                    !!firstresponse && !!firstresponse.key && `https://${domain}/file/public/${firstresponse.key}`;

                delete request.uploadedFile;
                console.log('action saveSpotlightWithFile, request to save: ', request);
                dispatch({ type: actions.SPOTLIGHT_LOADING });
                if (spotlightSaveType === 'create') {
                    return createSpotlight(request, dispatch);
                } else {
                    return saveSpotlightChange(request, dispatch);
                }
            })
            .catch(error => {
                console.log('uploadPublicFile error = ', error);
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOAD_FAILED,
                    payload: error,
                });
            });
    };
};

export const deleteSpotlight = spotlightID => {
    console.log('SPOTLIGHT_DELETE_API({ id: spotlightID }) = ', SPOTLIGHT_DELETE_API({ id: spotlightID }));
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });

        try {
            const response = await destroy(SPOTLIGHT_DELETE_API({ id: spotlightID }));
            console.log('deleteSpotlight action, returned response = ', response);
            dispatch({
                type: actions.SPOTLIGHT_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            console.log('deleteSpotlight action error = ', e);
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function clearSpotlights() {
    console.log('action clearSpotlights - refreshing Spotlights');
    return dispatch => {
        dispatch({
            type: actions.SPOTLIGHTS_CLEAR,
        });
    };
}

export function loadASpotlight(spotlightId) {
    console.log('action load an Spotlight for ', spotlightId);
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        console.log('getting ', SPOTLIGHT_GET_BY_ID_API({ id: spotlightId }));
        return get(SPOTLIGHT_GET_BY_ID_API({ id: spotlightId }))
            .then(data => {
                console.log('loadASpotlight action, returned data = ', data);
                dispatch({
                    type: actions.SPOTLIGHT_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadASpotlight action error = ', error);
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

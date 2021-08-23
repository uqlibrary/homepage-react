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

// possibly this isnt needed? the file should always exist?
export const createSpotlightWithoutFile = request => {
    console.log('action createSpotlight, request to save: ', request);
    return dispatch => {
        console.log('createSpotlight action, SPOTLIGHT_CREATE_API() = ', SPOTLIGHT_CREATE_API());
        // console.log('dispatch = ', dispatch);
        console.log('actions.SPOTLIGHT_LOADING = ', actions.SPOTLIGHT_LOADING);
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        return createSpotlight(request, dispatch);
    };
};

export const createSpotlightWithFile = request => {
    console.log('action createSpotlightWithFile, request to save: ', request);

    if (!request.uploadedFile) {
        return createSpotlightWithoutFile(request);
    }

    return async dispatch => {
        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        console.log('createSpotlightWithFile: post data: ', request.uploadedFile);

        const formData = new FormData();
        formData.append('spotlightImage', request.uploadedFile);
        // do not inspect formData with get, eg not: formData.get('spotlightImage')),
        // it causes webpack not to build, with cryptic errors
        return post(UPLOAD_PUBLIC_FILES_API(), [formData], { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                console.log('uploadPublicFile got ', response);
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOADED,
                    payload: response,
                });

                const firstresponse = response.shift();
                request.img_url =
                    !!firstresponse &&
                    !!firstresponse.key &&
                    `https://app.library.uq.edu.au/file/public/${firstresponse.key}.jpg`;

                delete request.uploadedFile;
                console.log('action createSpotlightWithFile, request to save: ', request);
                dispatch({ type: actions.SPOTLIGHT_LOADING });
                return createSpotlight(request, dispatch);
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

export const saveSpotlightChange = request => {
    console.log('saveSpotlightChange for request ', request);
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        console.log(
            'action saveSpotlightChange action, SPOTLIGHT_SAVE_API() = ',
            SPOTLIGHT_SAVE_API({ id: request.id }),
        );
        return post(SPOTLIGHT_SAVE_API({ id: request.id }), request)
            .then(data => {
                console.log('saveSpotlightChange action, returned data = ', data);
                dispatch({
                    type: actions.SPOTLIGHT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('saveSpotlightChange action error returned: ', error);
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error.message,
                });
                console.log('saveSpotlightChange action error FAILED dispatched');
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

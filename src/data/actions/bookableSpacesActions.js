import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    SPACES_ADD_LOCATION_API,
    SPACES_SINGLE_API,
    SPACES_MODIFY_LOCATION_API,
    SPACES_ALL_API,
    SPACES_SITE_API,
    UPLOAD_PUBLIC_FILES_API,
} from 'repositories/routes';
import { API_URL } from 'config';

const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};

export function loadABookableSpacesRoom(spacesUuid) {
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_GET_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_GET_LOADING });
        const url = SPACES_SINGLE_API({ uuid: spacesUuid });
        console.log('loadABookableSpacesRoom call:', url);
        return get(url)
            .then(response => {
                console.log('loadABookableSpacesRoom loaded', response);
                dispatch({
                    type: actions.SPACES_ROOM_GET_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('loadABookableSpacesRoom error', error);
                dispatch({
                    type: actions.SPACES_ROOM_GET_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadAllBookableSpacesRooms() {
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_LIST_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_LIST_LOADING });
        console.log('loadAllBookableSpacesRooms start', SPACES_ALL_API());
        return get(SPACES_ALL_API())
            .then(response => {
                console.log('loadAllBookableSpacesRooms loaded', response);
                dispatch({
                    type: actions.SPACES_ROOM_LIST_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('loadAllBookableSpacesRooms error', error);
                dispatch({
                    type: actions.SPACES_ROOM_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function addBookableSpaceLocation(request, locationType) {
    console.log('addBookableSpaceLocation', locationType, request);
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_ADDING });
        const url = SPACES_ADD_LOCATION_API({ type: locationType });
        return post(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_ADD_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_LOCATION_ADD_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function updateBookableSpaceLocation(request, locationType, _locationId = null) {
    console.log('updateBookableSpace Location', locationType, _locationId, request);
    const locationId = !!_locationId ? _locationId : request[`${locationType}Id`];
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_UPDATING });
        const url = SPACES_MODIFY_LOCATION_API({ type: locationType, id: locationId });
        console.log('updateBookableSpace Location calling', url);
        return put(url, request)
            .then(response => {
                console.log('updateBookableS paceLocation good', response);
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                console.log('updateBookable SpaceLocation bad', error);
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

function updateBookableSpace(request, dispatch) {
    console.log('updateBookable_Space', request);
    const url = SPACES_MODIFY_LOCATION_API({ type: 'space', id: request.spaceId });
    console.log('updateBookable_Space calling', url);
    return put(url, request)
        .then(response => {
            console.log('updateBookable_Space good', response);
            if (response?.status?.toLowerCase() === 'ok') {
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATED,
                    payload: response,
                });
            } else {
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATE_FAILED,
                    payload: response.message,
                });
            }
            return Promise.resolve(response);
        })
        .catch(error => {
            console.log('updateBookable_Space bad', error);
            dispatch({
                type: actions.SPACES_LOCATION_UPDATE_FAILED,
                payload: error.message,
            });
            checkExpireSession(dispatch, error);
            return Promise.reject(error);
        });
}

function addBookableSpace(request, dispatch) {
    console.log('addBookableSpace', request);
    const url = SPACES_ADD_LOCATION_API({ type: 'space' });
    return post(url, request)
        .then(response => {
            if (response?.status?.toLowerCase() === 'ok') {
                dispatch({
                    type: actions.SPACES_LOCATION_ADDED,
                    payload: response,
                });
            } else {
                dispatch({
                    type: actions.SPACES_LOCATION_ADD_FAILED,
                    payload: response.message,
                });
            }
            return Promise.resolve(response);
        })
        .catch(error => {
            dispatch({
                type: actions.SPACES_LOCATION_ADD_FAILED,
                payload: error.message,
            });
            checkExpireSession(dispatch, error);
            return Promise.reject(error);
        });
}

export const createBookableSpaceWithExistingImage = request => {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_ADDING });
        return addBookableSpace(request, dispatch);
    };
};

export const updateBookableSpaceWithExistingImage = request => {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_UPDATING });
        return updateBookableSpace(request, dispatch);
    };
};

export const updateBookableSpaceWithNewImage = (request, spaceSaveType = 'update') => {
    if (!request.uploadedFile || request.uploadedFile.length === 0) {
        /* istanbul ignore else */
        if (spaceSaveType === 'create') {
            return createBookableSpaceWithExistingImage(request);
        } else {
            return updateBookableSpaceWithExistingImage(request);
        }
    }

    return async dispatch => {
        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        const formData = new FormData();
        request.uploadedFile.map((file, index) => {
            formData.append(`file${index}`, file);
        });
        // do not inspect formData with get, eg not: formData.get('space_url')),
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
                    /* istanbul ignore next */ `https://${domain}/file/public/${firstresponse.key}`;

                delete request.uploadedFile;
                if (spaceSaveType === 'create') {
                    dispatch({ type: actions.SPACES_LOCATION_ADDING });
                    return addBookableSpace(request, dispatch);
                } else {
                    dispatch({ type: actions.SPACES_LOCATION_UPDATING });
                    return updateBookableSpace(request, dispatch);
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

export const createBookableSpaceWithNewImage = request => {
    return updateBookableSpaceWithNewImage(request, 'create');
};

export function deleteBookableSpaceLocation({ locationType, locationId }) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_DELETING });
        const url = SPACES_MODIFY_LOCATION_API({ type: locationType, id: locationId });
        return destroy(url)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_LOCATION_DELETE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function loadBookableSpaceCampusChildren() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_LOADING });
        return get(SPACES_SITE_API())
            .then(response => {
                dispatch({
                    type: actions.SPACES_CAMPUS_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_CAMPUS_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function clearBookableSpaceSitesError() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_CLEAR_ERROR });
    };
}

export function clearBookableSpaceSites() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_CLEAR });
    };
}

export function clearBookableSpaceFloors() {
    return dispatch => {
        dispatch({ type: actions.SPACES_FLOOR_LIST_CLEAR });
    };
}
export function clearBookableSpaceFloorsError() {
    return dispatch => {
        dispatch({ type: actions.SPACES_FLOOR_LIST_CLEAR_ERROR });
    };
}

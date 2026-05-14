import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    SPACES_ADD_LOCATION_API,
    SPACES_SINGLE_API,
    SPACES_ADMIN_SINGLE_API,
    SPACES_OUTAGES_API,
    SPACES_OUTAGE_API,
    SPACES_FLOOR_OUTAGES_API,
    SPACES_LIBRARY_OUTAGES_API,
    SPACES_CAMPUS_OUTAGES_API,
    SPACES_MODIFY_LOCATION_API,
    SPACES_ALL_API,
    SPACES_ADMIN_ALL_API,
    SPACES_SITE_API,
    UPLOAD_PUBLIC_FILES_API,
    SPACES_SPACETYPE_CREATE_API,
    SPACES_SPACETYPE_UPDATE_API,
    SPACES_SPACETYPE_DELETE_API,
    SPACES_FAVOURITES_API,
    SPACES_BULK_FACILITIES_API,
} from 'repositories/routes';
import { API_URL } from 'config';

const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};

export function loadABookableSpacesRoom(spacesUuid, { useAdminEndpoint = false } = {}) {
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_GET_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_GET_LOADING });
        const url = useAdminEndpoint
            ? SPACES_ADMIN_SINGLE_API({ uuid: spacesUuid })
            : SPACES_SINGLE_API({ uuid: spacesUuid });
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
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadBookableSpaceOutages(spaceId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_OUTAGE_LIST_LOADING });
        const url = SPACES_OUTAGES_API({ spaceId });
        return get(url)
            .then(response => {
                dispatch({
                    type: actions.SPACES_OUTAGE_LIST_LOADED,
                    payload: Array.isArray(response?.data) ? response.data : response?.data?.space_outages || [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_OUTAGE_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function saveBulkFilterTypes(facilityTypeId, request) {
    return dispatch => {
        dispatch({ type: actions.SPACES_BULK_FACILITIES_SAVING });
        return put(SPACES_BULK_FACILITIES_API({ id: facilityTypeId }), request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_BULK_FACILITIES_SAVED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_BULK_FACILITIES_SAVE_FAILED,
                        payload: response,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_BULK_FACILITIES_SAVE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadAllBookableSpacesRooms({ includeDrafts, includeDeleted, useAdminEndpoint = false } = {}) {
    console.log('loadAllBookableSpacesRooms RELOAD SPACES', { includeDrafts, includeDeleted });
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_LIST_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_LIST_LOADING });
        const request = useAdminEndpoint
            ? SPACES_ADMIN_ALL_API({ includeDrafts, includeDeleted })
            : SPACES_ALL_API({ includeDrafts });
        console.log('loadAllBookableSpacesRooms start', request);
        return get(request)
            .then(response => {
                console.log('loadAllBookableSpacesRooms loaded', response);
                dispatch({
                    type: actions.SPACES_ROOM_LIST_LOADED,
                    payload: response,
                    includeDrafts: includeDrafts === true,
                    includeDeleted: includeDeleted === true,
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
    const requestLocationType = request?.locationType;
    const locationId =
        _locationId ??
        request?.locationId ??
        request?.location_id ??
        request?.[`${locationType}Id`] ??
        request?.[`${locationType}_id`] ??
        request?.[`${requestLocationType}Id`] ??
        request?.[`${requestLocationType}_id`];

    if (!locationId) {
        return dispatch => {
            const message = `Missing location id for type "${locationType}"`;
            console.log('updateBookableSpace Location bad input', message, request);
            dispatch({
                type: actions.SPACES_LOCATION_UPDATE_FAILED,
                payload: message,
            });
            return Promise.reject(new Error(message));
        };
    }

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

export function clearABookableSpace() {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_CLEAR });
    };
}

const BULK_OUTAGE_URL_MAP = {
    floor: ({ scopeId }) => SPACES_FLOOR_OUTAGES_API({ floorId: scopeId }),
    library: ({ scopeId }) => SPACES_LIBRARY_OUTAGES_API({ libraryId: scopeId }),
    campus: ({ scopeId }) => SPACES_CAMPUS_OUTAGES_API({ campusId: scopeId }),
};

export function createBookableBulkOutage(request, scope, scopeId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_OUTAGE_ADDING });
        const urlBuilder = BULK_OUTAGE_URL_MAP[scope];
        const url = urlBuilder({ scopeId });
        return post(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({ type: actions.SPACES_OUTAGE_ADDED, payload: response });
                } else {
                    dispatch({ type: actions.SPACES_OUTAGE_ADD_FAILED, payload: response?.message });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({ type: actions.SPACES_OUTAGE_ADD_FAILED, payload: error.message });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function createBookableSpaceOutage(request) {
    return dispatch => {
        dispatch({ type: actions.SPACES_OUTAGE_ADDING });
        const url = SPACES_OUTAGES_API({ spaceId: request?.space_id });
        return post(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_OUTAGE_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_OUTAGE_ADD_FAILED,
                        payload: response?.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_OUTAGE_ADD_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function updateBookableSpaceOutage(request, outageId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_OUTAGE_UPDATING });
        const url = SPACES_OUTAGE_API({ id: outageId });
        return put(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_OUTAGE_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_OUTAGE_UPDATE_FAILED,
                        payload: response?.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_OUTAGE_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function deleteBookableSpaceOutage(outageId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_OUTAGE_DELETING });
        const url = SPACES_OUTAGE_API({ id: outageId });
        return destroy(url)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_OUTAGE_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_OUTAGE_DELETE_FAILED,
                        payload: response?.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_OUTAGE_DELETE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

function updateBookableSpace(request, dispatch) {
    console.log('updateBookable_Space', request);
    const url = SPACES_MODIFY_LOCATION_API({ type: 'space', id: request.space_id });
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

export const updateBookableSpaceWithNewImage = (request, saveType = 'update') => {
    console.log('updateBookableSpaceWithNewImage', saveType, request);
    if (!request.uploadedFile || request.uploadedFile.length === 0) {
        /* istanbul ignore else */
        if (saveType === 'create') {
            console.log('updateBookableSpaceWithNewImage create, no image');
            return createBookableSpaceWithExistingImage(request);
        } else {
            console.log('updateBookableSpaceWithNewImage update, no image');
            return updateBookableSpaceWithExistingImage(request);
        }
    }

    return async dispatch => {
        console.log('updateBookableSpaceWithNewImage uploading');
        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        const formData = new FormData();
        request.uploadedFile.map((file, index) => {
            formData.append(`file${index}`, file);
        });
        console.log('updateBookableSpaceWithNewImage formData=', formData);
        const url = UPLOAD_PUBLIC_FILES_API();
        console.log('updateBookableSpaceWithNewImage upload to', url);
        // do not inspect formData with get, eg not: formData.get('space_url')),
        // it causes webpack not to build, with cryptic errors
        return post(url, formData)
            .then(response => {
                console.log('updateBookableSpaceWithNewImage success', response);
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
                request.space_photo_url =
                    !!firstresponse &&
                    /* istanbul ignore next */ !!firstresponse.key &&
                    /* istanbul ignore next */ `https://${domain}/file/public/${firstresponse.key}`;

                delete request.uploadedFile;
                if (saveType === 'create') {
                    console.log('updateBookableSpaceWithNewImage add new Space', request);
                    dispatch({ type: actions.SPACES_LOCATION_ADDING });
                    return addBookableSpace(request, dispatch);
                } else {
                    console.log('updateBookableSpaceWithNewImage update Space', request);
                    dispatch({ type: actions.SPACES_LOCATION_UPDATING });
                    return updateBookableSpace(request, dispatch);
                }
            })
            .catch(error => {
                console.log('updateBookableSpaceWithNewImage error', error);
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

export function createBookableSpaceType(request) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_ADDING });
        const url = SPACES_SPACETYPE_CREATE_API();
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

export function updateBookableSpaceType(request, spaceTypeId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_UPDATING });
        const url = SPACES_SPACETYPE_UPDATE_API({ id: spaceTypeId });
        console.log('updateBookableSpaceType calling', url, request);
        return put(url, request)
            .then(response => {
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
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function deleteBookableSpace(spaceUuid) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_DELETING });
        console.log('deleteBookableSpace calling', spaceUuid);
        console.log('deleteBookableSpace url', SPACES_SINGLE_API({ uuid: spaceUuid }));
        const url = SPACES_SINGLE_API({ uuid: spaceUuid });
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

export function deleteBookableSpaceType(spaceTypeId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_DELETING });
        const url = SPACES_SPACETYPE_DELETE_API({ id: spaceTypeId });
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

export function updateSpaceDeletedState(spaceId, isDeleted) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_UPDATING });
        console.log('updateSpaceDeletedState calling', spaceId, isDeleted);
        const url = SPACES_MODIFY_LOCATION_API({ type: 'space', id: spaceId });
        const payload = { space_deleted: isDeleted };
        return put(url, payload)
            .then(response => {
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
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function loadSpacesFavourites() {
    return dispatch => {
        dispatch({ type: actions.SPACES_FAVOURITES_LOADING });
        return get(SPACES_FAVOURITES_API())
            .then(response => {
                dispatch({
                    type: actions.SPACES_FAVOURITES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function addSpaceFavourite(spaceId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_FAVOURITES_LOADING });
        return post(SPACES_FAVOURITES_API(), { space_id: spaceId })
            .then(response => {
                const payload = Array.isArray(response.data) ? response.data : [response.data];
                dispatch({
                    type: actions.SPACES_FAVOURITES_LOADED,
                    payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function removeSpaceFavourite(spaceId) {
    return dispatch => {
        dispatch({ type: actions.SPACES_FAVOURITES_LOADING });
        return destroy(SPACES_FAVOURITES_API(), { space_id: spaceId })
            .then(response => {
                dispatch({
                    type: actions.SPACES_FAVOURITES_LOADED,
                    payload: response.data || [],
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}
